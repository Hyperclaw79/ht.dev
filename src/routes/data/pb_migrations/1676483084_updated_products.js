migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("r6vqx2ymvm7uilf")

  // remove
  collection.schema.removeField("hmpvoava")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xuyuqwmn",
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
  const collection = dao.findCollectionByNameOrId("r6vqx2ymvm7uilf")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hmpvoava",
    "name": "description",
    "type": "editor",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("xuyuqwmn")

  return dao.saveCollection(collection)
})
