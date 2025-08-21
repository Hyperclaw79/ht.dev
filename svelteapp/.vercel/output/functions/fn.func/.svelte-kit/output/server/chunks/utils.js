const constructUrl = (host, port, path) => {
  const rawUrl = host.startsWith("http") ? host : `http://${host}`;
  const redirectUrl = path ? new URL(path, rawUrl) : new URL(rawUrl);
  if (port) {
    redirectUrl.port = port;
  }
  return redirectUrl;
};
const extractEndYear = (job) => {
  let endYear, rest;
  if (!job.year.includes(" – ")) {
    endYear = "Present";
  } else {
    [endYear, ...rest] = job.year.split(" – ").reverse();
  }
  if (endYear === "Present") {
    const dt = /* @__PURE__ */ new Date();
    endYear = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
  }
  endYear = new Date(endYear);
  return endYear;
};
const getRoles = (job) => {
  const roles = [];
  const _getRoles = (job2) => {
    if (job2.type === "Role") {
      roles.push(job2);
    } else if (job2.children) {
      job2.children.forEach((child) => _getRoles(child));
    }
  };
  _getRoles(job);
  return roles;
};
const isIntern = (role) => {
  return role.name.toLowerCase().includes("intern");
};
const firstExpJob = (experience) => {
  const exp = [...experience];
  exp.sort((a, b) => {
    const endYearA = extractEndYear(a);
    const endYearB = extractEndYear(b);
    return endYearA - endYearB;
  });
  const firstJob = exp.find((job) => {
    const roles = getRoles(job);
    return !roles.some(isIntern);
  });
  return firstJob;
};
export {
  constructUrl as c,
  extractEndYear as e,
  firstExpJob as f
};
