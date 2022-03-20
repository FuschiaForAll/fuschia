const assert = require("assert");
const parseQuery = require("../src/filter.builder");

// run()

const resolvers = {
  test1(parent) {
    return { test1: !!parent.test1 };
  },
  "nested.a"() {
    return { "nested.a": true };
  },
  "nested.b"(parent) {
    parent["nested.b"] = parent["nested.b"].n * parent["nested.b"].n;
    return parent;
  },
  "nested.date"(parent) {
    return { "nested.date": new Date(parent["nested.date"]) };
  },
  "nested.rename"(parent) {
    const newname = parent["nested.rename"];
    delete parent["nested.rename"];
    return { newname };
  },
};

const fieldNameToFieldId = {
  test1: { id: "1" },
  nested: { id: "2" },
  a: { id: "3" },
  logical: { id: "4" },
  b: { id: "5" },
  c: { id: "6" },
  date: { id: "7" },
  deep: { id: "8" },
  deepkey: { id: "9" },
  superdeep: { id: "10" },
  super: { id: "11" },
  newname: { id: "12" },
  arr: { id: "13" },
};

const args = {
  test1: "something",
  logical: {
    or: [1, 2],
  },
  nested: {
    a: "aaa",
    b: { n: 5 },
    c: "normal",
    date: "2020",
    rename: "my name",
    deep: {
      deepkey: "hidden",
    },
    superdeep: {
      super: {
        deep: "key",
      },
    },
  },
  gt: 5,
  arr: [1, 2, 3],
  or: [{ a: 5 }, { b: true }],
  and: [{ nested: { a: "aaa" } }, { b: true }],
};

describe("Filter Builder", () => {
  const parser = parseQuery(resolvers);
  const filter = parser(args, fieldNameToFieldId);
  it("The filter should equal the shape", () => {
    assert.deepEqual(filter, {
      1: true,
      4: { $or: [1, 2] },
      2.3: true,
      2.5: 25,
      2.6: "normal",
      2.7: new Date("2020"),
      "2.8.9": "hidden",
      "2.10.11.8": "key",
      12: "my name",
      $gt: 5,
      13: [1, 2, 3],
      $or: [{ 3: 5 }, { 5: true }],
      $and: [{ 2.3: true }, { 5: true }],
    });
  });
});
