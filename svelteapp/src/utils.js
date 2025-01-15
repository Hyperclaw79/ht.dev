const constructUrl = (host, port, path) => {
    const rawUrl = host.startsWith("http") ? host : `http://${host}`;
    const redirectUrl = path ? new URL(path, rawUrl) : new URL(rawUrl);
    if (port) {
        redirectUrl.port = port;
    }
    return redirectUrl;
};

export const extractEndYear = (job) => {
    let endYear, rest;
    if (!job.year.includes(" – ")) {
        endYear = "Present";
    } else {
        // eslint-disable-next-line no-unused-vars
        [endYear, ...rest] = job.year.split(" – ").reverse();
    }
    if (endYear === "Present") {
        const dt = new Date();
        endYear = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
    }
    endYear = new Date(endYear);
    return endYear;
};

export const getRoles = (job) => {
    const roles = [];
    const _getRoles = (job) => {
        if (job.type === "Role") {
            roles.push(job);
        } else if (job.children) {
            job.children.forEach((child) => _getRoles(child));
        }
    };
    _getRoles(job);
    return roles;
};

export const isIntern = (role) => {
    return role.name.toLowerCase().includes("intern");
};

export const firstExpJob = (experience) => {
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

export default constructUrl;
