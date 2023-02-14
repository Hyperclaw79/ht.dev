/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default result of _getX();
*/

const _getSocials = async () => {
    // TODO: Implement a Database.
    const socials = await import("../../data/socialMetadata.js");
    return socials.default;
};

export default (await _getSocials());
