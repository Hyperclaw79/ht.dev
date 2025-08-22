/**
 * @jest-environment node
 */
import constructUrl, { extractEndYear, getRoles, isIntern, firstExpJob } from "src/utils";

describe("constructUrl", () => {
    const testCases = [
        {
            host: "example.com",
            port: null,
            expectedUrl: new URL("http://example.com/")
        },
        {
            host: "example.com",
            port: 3000,
            expectedUrl: new URL("http://example.com:3000/")
        },
        {
            host: "https://example.com",
            port: null,
            expectedUrl: new URL("https://example.com/")
        },
        {
            host: "https://example.com",
            port: 3000,
            expectedUrl: new URL("https://example.com:3000/")
        },
        {
            host: "https://example.com",
            port: 3000,
            path: "test",
            expectedUrl: new URL("https://example.com:3000/test")
        }
    ];

    it.each(testCases)("should return a URL object with the correct path%s when given host %s", ({ host, port, path, expectedUrl }) => {
        const result = constructUrl(host, port, path);
        expect(result).toEqual(expectedUrl);
    });
});

describe("extractEndYear", () => {
    it("should return the correct end year if job year includes ' – '", () => {
        const job = { year: "2019 – 2022" };
        const result = extractEndYear(job);
        expect(result).toEqual(new Date("2022"));
    });

    it("should return the current year and month if no end date is provided", () => {
        const job = { year: "2019" };
        const result = extractEndYear(job);
        const dt = new Date();
        const expectedDate = new Date(`${dt.getFullYear()}-${dt.getMonth() + 1}`);
        expect(result).toEqual(expectedDate);
    });
});

describe("getRoles", () => {
    it("should return an array of roles from the job object", () => {
        const job = {
            name: "Company Name",
            type: "Job",
            year: "YYYY-MM – YYYY-MM",
            children: [
                {
                    name: "Software Engineer",
                    type: "Role",
                    children: [
                        {
                            name: "Product Name",
                            caption: "Product Caption",
                            type: "Product",
                            description: "Product Description",
                            skills: ["Skill1", "Skill2"]
                        }
                    ]
                },
                {
                    name: "Data Science Intern",
                    type: "Role",
                    description: "Role Description",
                    skills: ["Skill1", "Skill2"]
                }
            ]
        };
        const result = getRoles(job);
        console.log(result);
        expect(result).toEqual(job.children);
    });
});

describe("isIntern", () => {
    it("should return true if the role name includes 'intern'", () => {
        const role = {
            year: "2020 – 2021",
            type: "Role",
            name: "Data Science Intern"
        };
        const result = isIntern(role);
        expect(result).toBe(true);
    });
});

describe("firstExpJob", () => {
    it("should return the first job without any intern roles", () => {
        const experience = [
            {
                year: "2018 – 2020",
                type: "Role",
                name: "Software Engineer"
            },
            {
                year: "2020 – 2021",
                type: "Role",
                name: "Data Science Intern"
            }
        ];
        const result = firstExpJob(experience);
        expect(result.name).toEqual("Software Engineer");
    });
});
