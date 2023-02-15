migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3ov0xtuvzrt3aii")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ijp04pfd",
    "name": "alias",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-z]+$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3ov0xtuvzrt3aii")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ijp04pfd",
    "name": "alias",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
