/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default result of _getX();
*/

const _getProjects = async () => {
    // TODO: Implement a Database.
    const proj = await import("../../data/projectMetadata.js");
    const projects = proj.default;
    return projects;
};

export default (await _getProjects());
