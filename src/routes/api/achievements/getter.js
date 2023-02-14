/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default result of _getX();
*/

const _getAchievements = async () => {
    // TODO: Implement a Database.
    const achievements = await import("../../data/achievementMetadata.js");
    return achievements.default;
};

export default (await _getAchievements());
