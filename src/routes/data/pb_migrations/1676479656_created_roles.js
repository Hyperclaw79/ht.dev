migrate((db) => {
  const collection = new Collection({
    "id": "19txjg3m4uu3z3h",
    "created": "2023-02-15 16:47:36.821Z",
    "updated": "2023-02-15 16:47:36.821Z",
    "name": "roles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "aab5g3bx",
        "name": "name",
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
        "id": "daqerl4u",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Role"
          ]
        }
      },
      {
        "system": false,
        "id": "fnmv6ptu",
        "name": "skills",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
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
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("19txjg3m4uu3z3h");

  return dao.deleteCollection(collection);
})
