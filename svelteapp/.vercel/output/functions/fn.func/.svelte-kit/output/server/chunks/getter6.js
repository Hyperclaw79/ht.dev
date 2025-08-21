import { g as getRecords } from "./pbClient.js";
const _getSocials = async (authData) => {
  const socials = await getRecords({ collection: "socials", authData });
  return socials;
};
export {
  _getSocials as default
};
