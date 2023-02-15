migrate((db) => {
  const collection = new Collection({
    "id": "mjyvchglw31iy6t",
    "created": "2023-02-15 12:58:51.743Z",
    "updated": "2023-02-15 12:58:51.743Z",
    "name": "socials",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "l0decgdg",
        "name": "name",
        "type": "text",
        "required": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rqk4tghz",
        "name": "url",
        "type": "url",
        "required": true,
        "unique": true,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
        }
      },
      {
        "system": false,
        "id": "svycwz8e",
        "name": "icon",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": "/icons/.+\\..+"
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
  const collection = dao.findCollectionByNameOrId("mjyvchglw31iy6t");

  return dao.deleteCollection(collection);
})
