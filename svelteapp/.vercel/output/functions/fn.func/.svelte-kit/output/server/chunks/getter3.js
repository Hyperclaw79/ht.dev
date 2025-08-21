import { g as getRecords } from "./pbClient.js";
import { e as extractEndYear } from "./utils.js";
const _getExperience = async (authData) => {
  const experience = await getRecords({
    authData,
    collection: "jobs",
    keyOrder: ["name", "caption", "description", "type", "year", "skills", "children"]
  });
  experience.sort((a, b) => {
    const endYearA = extractEndYear(a);
    const endYearB = extractEndYear(b);
    return endYearB - endYearA;
  });
  return experience;
};
export {
  _getExperience as default
};
