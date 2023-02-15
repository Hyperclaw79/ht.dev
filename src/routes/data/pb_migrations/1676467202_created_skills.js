migrate((db) => {
  const collection = new Collection({
    "id": "do8wk6ykm6bm8do",
    "created": "2023-02-15 13:20:02.526Z",
    "updated": "2023-02-15 13:20:02.526Z",
    "name": "skills",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
        "system": false,
        "id": "d2aeu2wl",
        "name": "category",
        "type": "select",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "Technical Skills",
            "Soft Skills"
          ]
        }
      },
      {
        "system": false,
        "id": "eqvh1ryu",
        "name": "confidence",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": 100
        }
      },
      {
        "system": false,
        "id": "i7ktisal",
        "name": "icon",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": "/icons/(soft|technical){1}/.+\\..+"
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
  const collection = dao.findCollectionByNameOrId("do8wk6ykm6bm8do");

  return dao.deleteCollection(collection);
})
