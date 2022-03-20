// INSPIRATION: https://github.com/jfcieslak/graphql-mongo-query/blob/master/src/index.ts

const primitives = [
  "string",
  "number",
  "boolean",
  "bigint",
  "undefined",
  "null",
  "symbol",
];

const graphqlToMongoKeywords = {
  and: "$and",
  or: "$or",
  ne: "$ne",
  eq: "$eq",
  le: "$lte",
  lt: "$lt",
  ge: "$gte",
  gt: "$gt",
};

function isOperator(key, keywords) {
  return Object.keys(keywords).includes(key);
}

function isComputable(key, resolvers) {
  return Object.keys(resolvers).includes(key);
}

function isPrimitive(val) {
  return primitives.includes(typeof val);
}

function isNested(value, keywords, resolvers) {
  if (typeof value !== "object") return false;
  for (const key in value) {
    if (
      !isOperator(key, keywords) &&
      !isPrimitive(value[key]) &&
      !isComputable(key, resolvers)
    ) {
      return true;
    }
  }
  return false;
}

function computedValue(parent, resolvers) {
  for (const valueKey in resolvers) {
    if (parent[valueKey] !== undefined) {
      return resolvers[valueKey](parent);
    }
  }
}

function argType(keywords, resolvers, key, val) {
  if (isOperator(key, keywords)) return "OPERATOR";
  else if (isComputable(key, resolvers)) return "COMPUTED";
  else if (isPrimitive(val)) return "PRIMITIVE";
  else if (Array.isArray(val)) return "ARRAY";
  else if (isNested(val, keywords, resolvers)) return "NESTED";
  else if (typeof val === "object") return "FLAT";
  return null;
}

function parseNested(resolvers, key, val, lastResult = {}) {
  if (isComputable(key, resolvers)) {
    return buildFilters(val, resolvers, key);
  }
  let result = lastResult;

  for (const k in val) {
    let isFinal = false;
    if (isComputable(k, resolvers)) {
      result = {
        ...result,
        ...buildFilters(val[k], resolvers, k),
      };
      return result;
    }

    if (isOperator(k, graphqlToMongoKeywords)) {
      result = {
        ...result,
        [key]: buildFilters(val, resolvers, key),
      };
      return result;
    }

    const subkey = `${key}.${k}`;
    const subval = val[k];

    if (isComputable(subkey, resolvers)) {
      result = {
        ...result,
        ...buildFilters(subval, resolvers, subkey),
      };
      isFinal = true;
    } else if (isPrimitive(subval)) {
      result[subkey] = buildFilters(subval, resolvers, null);
      isFinal = true;
    } else {
      for (const sk in subval) {
        const t = argType(graphqlToMongoKeywords, resolvers, sk, subval);
        if (t !== "NESTED" && t !== "FLAT") {
          result[subkey] = buildFilters(subval, resolvers, null);
          isFinal = true;
          break;
        }
      }
    }
    if (!isFinal) parseNested(resolvers, subkey, subval, result);
  }
  return result;
}

function buildFilters(args, resolvers, parentKey) {
  if (isComputable(parentKey, resolvers)) {
    return computedValue({ [parentKey]: args }, resolvers);
  }

  if (!parentKey && isPrimitive(args)) {
    return args;
  }

  let filters;

  for (const key in args) {
    if (!filters) {
      filters = {};
    }
    const val = args[key];
    const t = argType(graphqlToMongoKeywords, resolvers, key, val);

    if (isComputable(key, resolvers)) {
      const computed = buildFilters(val, resolvers, key);
      filters = {
        ...filters,
        ...computed,
      };
    } else if (t === "OPERATOR") {
      const keyword = graphqlToMongoKeywords[key];
      if (Array.isArray(val)) {
        filters[keyword] = val.map((v) => buildFilters(v, resolvers, null));
      } else {
        filters[keyword] = buildFilters(val, resolvers, null);
      }
    } else if (t === "NESTED" || t === "FLAT") {
      filters = {
        ...filters,
        ...parseNested(resolvers, key, val),
      };
    } else if (t === "ARRAY") {
      filters[key] = val.map((v) => buildFilters(v, resolvers, null));
    } else {
      filters[key] = buildFilters(val, resolvers, null);
    }
  }

  return filters;
}

function remapFilter(filter, fieldNameToFieldId) {
  if (isPrimitive(filter)) return filter;
  return Object.keys(filter).reduce((acc, key) => {
    if (Array.isArray(filter[key])) {
      acc[fieldNameToFieldId[key]?.id || key] = filter[key].map((v) =>
        remapFilter(v, fieldNameToFieldId)
      );
    } else if (key.includes(".")) {
      const newKey = key
        .split(".")
        .map((part) => fieldNameToFieldId[part].id)
        .join(".");
      acc[newKey] = filter[key];
    } else {
      acc[fieldNameToFieldId[key]?.id || key] = filter[key];
    }
    return acc;
  }, {});
}

module.exports = (resolvers = {}) => {
  return (args, fieldNameToFieldId) => {
    const filter = buildFilters(args, resolvers, null);
    const remapped = remapFilter(filter, fieldNameToFieldId);
    return remapped;
  };
};
