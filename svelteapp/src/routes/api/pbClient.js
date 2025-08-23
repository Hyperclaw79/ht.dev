// Handler to fetch data from PocketBase
import PocketBase from "pocketbase";
import constructUrl from "../../utils";

let pocket;

export const getRecords = async ({ authData, collection, sort = "created", skipFields, keyOrder }) => {
    if (!pocket) {
        const module = await import("$env/dynamic/private");
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
        if (!records) { return []; }
        return records.map((record) => _cleanRecord({ record, dirtyFields: skipFields, keyOrder }));
    } catch (err) {
        // Only log fallback messages if not in test mode
        if (process.env.TEST_MODE !== 'true') {
            console.warn(
                `Error fetching remote records for collection: ${collection.toUpperCase()}.` +
                "\nSwitching to Fallback mode."
            );
        }
        return await _fallback(collection);
    }
};

export const _fallback = async (collection) => {
    try {
        const module = await import(`./fallbacks/${collection}.js`);
        return module.default;
    } catch (err) {
        return [];
    }
};

export const _cleanRecord = ({
    record, dirtyFields = [
        "collectionId", "id", "created",
        "updated", "collectionName", "expand"
    ], keyOrder
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
