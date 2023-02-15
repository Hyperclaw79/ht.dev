/*
    This is a info getter file and should have the following structure:
    _getX() -> returns a list of X.
    export default _getX;
*/

import { getRecords } from "../pbClient";

const _getSocials = async (authData) => {
    const socials = await getRecords({ collection: "socials", authData });
    return socials;
};

export default _getSocials;
