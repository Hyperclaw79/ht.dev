migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("do8wk6ykm6bm8do")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bszadhey",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z\\d\\s]+$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("do8wk6ykm6bm8do")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bszadhey",
    "name": "name",
    "type": "text",
    "required": true,
    "unique": true,
    "options": {
      "min": null,
      "max": null,
      "pattern": "^[a-zA-Z\\s]+$"
    }
  }))

  return dao.saveCollection(collection)
})
