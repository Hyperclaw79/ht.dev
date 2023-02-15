migrate((db) => {
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19txjg3m4uu3z3h")

  // remove
  collection.schema.removeField("hdsakfnm")

  return dao.saveCollection(collection)
})
