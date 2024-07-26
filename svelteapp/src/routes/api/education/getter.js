/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default _getX;
*/

import { getRecords } from "../pbClient";

const _getEducation = async (authData) => {
    const education = await getRecords({
        authData,
        collection: "education",
        keyOrder: ["specialization", "institution", "period"]
    });
    education.sort((a, b) => {
        return b.period.split(" – ")[1] - a.period.split(" – ")[1];
    });
    return education;
};

export default _getEducation;
