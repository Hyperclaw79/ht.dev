/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default _getX;
*/

import { getRecords } from "../pbClient";
import { extractEndYear } from "../../../utils";

const _getExperience = async (authData) => {
    const experience = await getRecords({
        authData,
        collection: "jobs",
        keyOrder: ["name", "caption", "description", "type", "year", "skills", "children"]
    });
    experience.sort((a, b) => {
        const endYearA = extractEndYear(a);
        const endYearB = extractEndYear(b);
        return endYearB - endYearA;
    });
    return experience;
};

export default _getExperience;
