migrate((db) => {
  const collection = new Collection({
    "id": "wdbr18zn9f7ifhb",
    "created": "2023-02-15 16:51:57.868Z",
    "updated": "2023-02-15 16:51:57.868Z",
    "name": "jobs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ixaencco",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "vjyzit2w",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Job"
          ]
        }
      },
      {
        "system": false,
        "id": "gwtq0sjx",
        "name": "year",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
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
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wdbr18zn9f7ifhb");

  return dao.deleteCollection(collection);
})
