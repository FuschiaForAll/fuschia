const { MongoClient } = require("mongodb");
var ObjectId = require("mongoose").Types.ObjectId;
const argon2 = require("argon2");
const { ApolloError } = require("apollo-server");
const jwt = require("jsonwebtoken");

class Resolvers {
  constructor() {
    this.connect();
  }

  async connect() {
    const mongoClient = new MongoClient(`${process.env.MONGO_DB_URL}`);
    await mongoClient.connect();
    this.db = mongoClient.db(process.env.PROJECT_ID);
  }

  namesToIds(collectionName, obj) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[global.tableAndFieldNameMap[collectionName].fields[key].id] =
        obj[key];
      return acc;
    }, {});
  }

  idsToNames(collectionId, objArray) {
    return objArray.map((doc) =>
      Object.keys(doc).reduce((acc, key) => {
        if (key === "_id") {
          acc._id = doc._id;
        } else {
          acc[global.tableAndFieldIdMap[collectionId].fields[key].name] =
            doc[key];
        }
        return acc;
      }, {})
    );
  }

  getModelName(collectionId) {
    return global.tableAndFieldIdMap[collectionId].name;
  }

  async genericGetQueryResolver(collectionName, parent, args, context, info) {
    const docs = await this.db
      .collection(collectionName)
      .find({ _id: new ObjectId(args._id) })
      .toArray();
    return docs[0];
  }

  async genericListQueryResolver(
    collectionId,
    collectionName,
    parent,
    args,
    context,
    info
  ) {
    const docs = await this.db.collection(collectionId).find(global.filterParser(args.filter, global.tableAndFieldNameMap[collectionName].fields) || {}).limit(args.limit || 0).toArray();
    return { nextToken: null, items: this.idsToNames(collectionId, docs) };
  }

  async genericCreateResolver(
    collectionId,
    collectionName,
    parent,
    args,
    context,
    info
  ) {
    const remappedEntry = this.namesToIds(collectionName, args);
    const doc = await this.db.collection(collectionId).insertOne(remappedEntry);
    return { _id: doc.insertedId, ...args };
  }

  async genericDeleteResolver(collectionName, parent, args, context, info) {
    const doc = await this.db
      .collection(collectionName)
      .findOneAndDelete({ _id: new ObjectId(args._id) });
    return doc.value;
  }

  async loginResolver(
    tableId,
    usernameFieldId,
    passwordFieldId,
    usernameCaseSensitive,
    args,
    parent,
    context,
    info
  ) {
    context.res.clearCookie("token");
    if (usernameCaseSensitive) {
      throw new ApolloError("Not Implemented");
    }
    const doc = await this.db
      .collection(tableId)
      .find({ [usernameFieldId]: args.username })
      .toArray();
    if (doc.length > 0) {
      const record = doc[0];
      const username = record[usernameFieldId];
      const password = record[passwordFieldId];
      if (await argon2.verify(password, args.password)) {
        const token = jwt.sign(
          { username, id: record._id },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
        context.res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return jwt.sign(
          { websocket: true, username, id: record._id.toString() },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );
      }
    }
    return null;
  }
  async logoutResolver(
    collectionName,
    usernameFieldId,
    passwordFieldId,
    args,
    parent,
    context,
    info
  ) {
    return "true";
  }
  async registerResolver(collectionId, usernameId, passwordId, args) {
    try {
      const doc = await this.db.collection(collectionId).insertOne({
        [usernameId]: args.username,
        [passwordId]: await argon2.hash(args.password),
      });
      context.res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return jwt.sign(
        {
          websocket: true,
          username: args.username,
          id: doc.insertedId.toString(),
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    } catch {}
    return null;
  }
}

exports.resolver = new Resolvers();
