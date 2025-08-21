import { g as getRecords } from "./pbClient.js";
const _getEducation = async (authData) => {
  const education = await getRecords({
    authData,
    collection: "education",
    keyOrder: ["specialization", "institution", "period"]
  });
  education.sort((a, b) => {
    return b.period.split(" – ")[1] - a.period.split(" – ")[1];
  });
  return education;
};
export {
  _getEducation as default
};
