async function initialize(db, project) {
  const collections = await db.listCollections().toArray()
  console.log(collections)
  project.appConfig.apiConfig.models.forEach(model => {
    const collection = collections.find(collection => collection.name === model._id.toString())
    if (!collection) {
      db.createCollection(model._id.toString())
    }
    model.fields.forEach(field => {
      if (field.isUnique) {
        db.collection(model._id.toString()).createIndex(field._id.toString(), { unique: true})
      }
    })
  })
}

exports.initialize = initialize