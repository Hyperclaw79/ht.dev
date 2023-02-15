migrate((db) => {
  const collection = new Collection({
    "id": "1shrz3dat76esvg",
    "created": "2023-02-15 11:03:20.496Z",
    "updated": "2023-02-15 11:03:20.496Z",
    "name": "achievements",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fmardqaf",
        "name": "name",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "lxptyopo",
        "name": "type",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Certificate",
            "Achievement"
          ]
        }
      },
      {
        "system": false,
        "id": "uunngwi0",
        "name": "from",
        "type": "json",
        "required": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "fxnukbox",
        "name": "year",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": "\\d{4}"
        }
      },
      {
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
      },
      {
        "system": false,
        "id": "po6vf5d0",
        "name": "assetZoomable",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("1shrz3dat76esvg");

  return dao.deleteCollection(collection);
})
