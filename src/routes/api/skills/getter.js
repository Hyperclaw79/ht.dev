/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default result of _getX();
*/

const _getSkills = async () => {
    // TODO: Implement a Database.
    const skills = await import("../../data/skillsMetadata.js");
    return skills.default;
};

export default (await _getSkills());
