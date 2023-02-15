migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1shrz3dat76esvg")

  // remove
  collection.schema.removeField("nnszz6gx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "onqwwrkl",
    "name": "image",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "/images/.+\\..+"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1shrz3dat76esvg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nnszz6gx",
    "name": "image",
    "type": "url",
    "required": true,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // remove
  collection.schema.removeField("onqwwrkl")

  return dao.saveCollection(collection)
})
