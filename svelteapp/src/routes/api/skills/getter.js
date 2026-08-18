/*
    Skills getter.
    By default it returns the raw PocketBase records.
    Pass { aggregate: "category" } to receive an API-owned category aggregation.
*/
import { getRecords } from "../pbClient";

export const aggregateByCategory = (records = []) => {
    const categories = new Map();

    for (const skill of records) {
        const category = skill?.category;
        if (!category) { continue; }

        const categoryOrder = Number(skill.categoryOrder || 0);
        if (!categories.has(category)) {
            categories.set(category, {
                name: category,
                order: categoryOrder,
                skills: []
            });
        }

        const { category: _category, categoryOrder: _categoryOrder, ...rest } = skill;
        categories.get(category).skills.push(rest);
    }

    const aggregated = [...categories.values()]
        .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
        .map((category) => ({
            ...category,
            skills: category.skills
                .sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name))
        }));

    return {
        totalSkills: aggregated.reduce((total, category) => total + category.skills.length, 0),
        categories: aggregated
    };
};

const _getSkills = async (authData, { aggregate } = {}) => {
    const records = await getRecords({
        collection: "skills",
        authData,
        sort: "categoryOrder,order"
    });

    if (!Array.isArray(records)) { return records; }
    return aggregate === "category" ? aggregateByCategory(records) : records;
};

export default _getSkills;
