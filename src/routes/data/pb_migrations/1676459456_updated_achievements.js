migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1shrz3dat76esvg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "po6vf5d0",
    "name": "assetZoomable",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1shrz3dat76esvg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "po6vf5d0",
    "name": "assetZoomable",
    "type": "bool",
    "required": true,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
