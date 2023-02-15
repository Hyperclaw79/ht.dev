migrate((db) => {
  const collection = new Collection({
    "id": "2ac5wwm7xlrrrl3",
    "created": "2023-02-15 11:18:44.430Z",
    "updated": "2023-02-15 11:18:44.430Z",
    "name": "users",
    "type": "auth",
    "system": false,
    "schema": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "allowEmailAuth": false,
      "allowOAuth2Auth": false,
      "allowUsernameAuth": true,
      "exceptEmailDomains": [],
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": [],
      "requireEmail": false
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("2ac5wwm7xlrrrl3");

  return dao.deleteCollection(collection);
})
