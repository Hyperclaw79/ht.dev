migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19txjg3m4uu3z3h")

  // remove
  collection.schema.removeField("hdsakfnm")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n74mkp7q",
    "name": "description",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19txjg3m4uu3z3h")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hdsakfnm",
    "name": "description",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("n74mkp7q")

  return dao.saveCollection(collection)
})
