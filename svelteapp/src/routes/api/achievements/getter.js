/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default _getX;
*/

import { getRecords } from "../pbClient";

const _getAchievements = async (authData) => {
    const achievements = await getRecords({ collection: "achievements", authData });
    return achievements;
};

export default _getAchievements;
