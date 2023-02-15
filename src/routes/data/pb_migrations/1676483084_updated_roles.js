migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19txjg3m4uu3z3h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzxw0amw",
    "name": "children",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "r6vqx2ymvm7uilf",
      "cascadeDelete": true,
      "maxSelect": null,
      "displayFields": [
        "name",
        "type",
        "caption",
        "skills"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("19txjg3m4uu3z3h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dzxw0amw",
    "name": "children",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "r6vqx2ymvm7uilf",
      "cascadeDelete": true,
      "maxSelect": null,
      "displayFields": [
        "name",
        "type",
        "caption",
        "description",
        "skills"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
