migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wdbr18zn9f7ifhb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9sryoxkg",
    "name": "children",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "19txjg3m4uu3z3h",
      "cascadeDelete": true,
      "maxSelect": null,
      "displayFields": [
        "name",
        "type",
        "skills",
        "children",
        "description"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wdbr18zn9f7ifhb")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9sryoxkg",
    "name": "children",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "19txjg3m4uu3z3h",
      "cascadeDelete": true,
      "maxSelect": 1,
      "displayFields": [
        "name",
        "type",
        "skills",
        "children",
        "description"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
