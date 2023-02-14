/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default result of _getX();
*/

const _getExperience = async () => {
    // TODO: Implement a Database.
    const experience = await import("../../data/experienceMetadata.js");
    return experience.default;
};

export default (await _getExperience());
