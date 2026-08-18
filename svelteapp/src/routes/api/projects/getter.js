/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default _getX;
*/
import { getRecords } from "../pbClient";

const _getProjects = async (authData) => {
    const projects = await getRecords({ collection: "projects", authData, sort: "-updated,-isOnGithub" });
    return projects.filter((project) => project.hidden !== true);
};

export default _getProjects;
