// Handler to fetch data from PocketBase
import PocketBase from "pocketbase";

const pocket = new PocketBase("http://127.0.0.1:8090");
pocket?.autoCancellation(false);

export const getRecords = async ({ authData, collection, sort = "created", skipFields, keyOrder }) => {
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
        return await _fallback(collection);
    }
};

export const _fallback = async (collection) => {
    try {
        const module = await import(`../data/fallbacks/${collection}.js`);
        const fallback = module.default;
        return fallback;
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
