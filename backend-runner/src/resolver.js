const { MongoClient } = require('mongodb');
var ObjectId = require('mongoose').Types.ObjectId;

class Resolvers {
  constructor() {
    this.connect()
  }

  async connect() {
    const mongoClient = new MongoClient(`${process.env.MONGO_DB_URL}`)
    await mongoClient.connect();
    this.db = mongoClient.db(process.env.PROJECT_ID)
  }

  async genericGetQueryResolver(collectionName, parent, args, context, info) {
    const docs = await this.db.collection(collectionName).find({ _id: new ObjectId(args._id)}).toArray()
    console.log(docs)
    return docs[0]
  }

  async genericListQueryResolver(collectionName, parent, args, context, info) {
    const docs = await this.db.collection(collectionName).find({}).toArray()
    console.log(docs)
    return { nextToken: null, items: docs}
  }
  
  async genericCreateResolver(collectionName, parent, args, context, info) {
    const doc = await this.db.collection(collectionName).insertOne(args)
    return args
  }
  
  async genericDeleteResolver(collectionName, parent, args, context, info) {
    const doc = await this.db.collection(collectionName).findOneAndDelete({ _id: new ObjectId(args._id) })
    return doc.value
  }

  async loginResolver(collectionName, usernameId, passwordId, args) {
    return "true"    
  }
  async logoutResolver(collectionName, usernameId, passwordId, args) {
    return "true"    
  }
  async registerResolver(collectionName, usernameId, passwordId, args) {
    return "true"    
  }
}

exports.resolver = new Resolvers()