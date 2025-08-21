import { g as getRecords } from "./pbClient.js";
const _getAchievements = async (authData) => {
  const achievements = await getRecords({ collection: "achievements", authData });
  return achievements;
};
export {
  _getAchievements as default
};
