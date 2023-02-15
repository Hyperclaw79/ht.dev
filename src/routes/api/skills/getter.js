/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default _getX;
*/
import { getRecords } from "../pbClient";

const _getSkills = async (authData) => {
    const records = await getRecords({ collection: "skills", authData });
    if (records["Technical Skills"]) { return records; }
    return _categorize(records);
};

export const _categorize = (records) => {
    const skills = records.reduce((acc, skill) => {
        const { category, ...rest } = skill;
        if (!acc[category]) { acc[category] = []; }
        acc[category].push(rest);
        return acc;
    }, {});
    return skills;
};

export default _getSkills;
