import PocketBase from "pocketbase";
import { c as constructUrl } from "./utils.js";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
let pocket;
const getRecords = async ({ authData, collection, sort = "created", skipFields, keyOrder }) => {
  if (!pocket) {
    const module = await import("./private.js").then((n) => n._);
    const { env } = module;
    const dbUrl = constructUrl(env.DB_HOST, env.DB_PORT);
    console.log(`Connecting to PocketBase at ${dbUrl}...`);
    pocket = new PocketBase(dbUrl.toString());
    pocket?.autoCancellation(false);
  }
  try {
    if (!pocket.authStore.token) {
      await pocket.admins.authWithPassword(authData.email, authData.password);
    }
    const records = await pocket.collection(collection).getFullList(100, {
      sort,
      expand: "children,children.children"
    });
    if (!records) {
      return [];
    }
    return records.map((record) => _cleanRecord({ record, dirtyFields: skipFields, keyOrder }));
  } catch (err) {
    console.warn(
      `Error fetching remote records for collection: ${collection.toUpperCase()}.
Switching to Fallback mode.`
    );
    return await _fallback(collection);
  }
};
const _fallback = async (collection) => {
  try {
    const module = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./fallbacks/achievements.js": () => import("./achievements.js"), "./fallbacks/education.js": () => import("./education.js"), "./fallbacks/jobs.js": () => import("./jobs.js"), "./fallbacks/projects.js": () => import("./projects.js"), "./fallbacks/skills.js": () => import("./skills.js"), "./fallbacks/socials.js": () => import("./socials.js") }), `./fallbacks/${collection}.js`);
    return module.default;
  } catch (err) {
    return [];
  }
};
const _cleanRecord = ({
  record,
  dirtyFields = [
    "collectionId",
    "id",
    "created",
    "updated",
    "collectionName",
    "expand"
  ],
  keyOrder
}) => {
  const newRecord = { ...record };
  if (Object.keys(newRecord.expand || {}).length > 0) {
    newRecord.children = newRecord.expand?.children;
  }
  dirtyFields.forEach((field) => {
    delete newRecord[field];
  });
  if (newRecord.children) {
    newRecord.children = newRecord.children.map((child) => _cleanRecord({ record: child, dirtyFields, keyOrder }));
  }
  if (keyOrder) {
    const orderedRecord = {};
    keyOrder.forEach((key) => {
      if (newRecord[key]) {
        orderedRecord[key] = newRecord[key];
      }
    });
    return orderedRecord;
  }
  return newRecord;
};
export {
  getRecords as g
};
