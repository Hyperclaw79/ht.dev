import { g as getRecords } from "./pbClient.js";
const _getSkills = async (authData) => {
  const records = await getRecords({ collection: "skills", authData });
  if (records["Technical Skills"]) {
    return records;
  }
  return _categorize(records);
};
const _categorize = (records) => {
  const skills = records.reduce((acc, skill) => {
    const { category, ...rest } = skill;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rest);
    return acc;
  }, {});
  return skills;
};
export {
  _categorize,
  _getSkills as default
};
