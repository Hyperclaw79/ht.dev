const experience = [
    {
        name: "Miratech",
        type: "Job",
        year: "2023-09 – Present",
        children: [
            {
                name: "Senior Software Engineer",
                type: "Role",
                children: [
                    {
                        name: "BlackRock (Client)",
                        type: "Product",
                        description: `
                        • Automated a data acquisition pipeline and exposed the service as an API, facilitating the onboarding of a new Vendor.
                        • Significantly refactored a Quality Check module to prevent thousands of false positives in the exceptions dashboard.
                        `,
                        skills: [
                            "Python", "Azure ADO", "Aqua Data Studio", "Aladdiin", "Other Proprietary Internal Tools"
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Epicor Software Corporation, Bangalore",
        type: "Job",
        year: "2020-12 – 2023-08",
        children: [
            {
                name: "Product Developer",
                type: "Role",
                children: [
                    {
                        name: "Propello",
                        caption: "Cloud based Retail Application",
                        type: "Product",
                        description: `
                        • Worked on multiple modules throughout the application.
                        • Developed custom endpoints using Django Rest framework.
                        • Collaborated with Front-end developers to create production-ready modules.
                        • Proactively discussed enhancements and future-proof solutions.
                        `,
                        skills: [
                            "Python", "Django", "PyTest", "Pylint",
                            "Pep8", "Git", "Jenkins", "Jira"
                        ]
                    },
                    {
                        name: "Epicor Payment Application",
                        caption: "End to End Payment Application",
                        type: "Product",
                        description: `
                        • Coded test-driven multithreaded APIs and fixed multiple bugs.
                        • Worked extensively on EPA integration with Ingenico Pinpads.
                        • Performed Log Analysis on Kibana.
                        • Developed multiple workflows using the SAM principle.
                        • Fixed a critical bug which could’ve bricked multiple Pinpads.
                        `,
                        skills: [
                            "Python", "PyTest", "Pylint", "Pep8",
                            "Git", "Jenkins", "Kibana", "Jira"
                        ]
                    },
                    {
                        name: "AWS Authentication PoC",
                        type: "Product",
                        description: `
                        • Worked on a PoC to expose Backend functionality of Propello as a Rest API.
                        • Handson experience with AWS Cognito and Custom Lambda Authorizer for Oauth2 authentication.
                        • Written Swagger schema for necessary endpoints.
                        `,
                        skills: [
                            "Python", "AWS Cognito", "AWS Lambda"
                        ]
                    }
                ]
            },
            {
                name: "Data Science Intern",
                type: "Role",
                description: `
                • Collection, cleaning, wrangling, analysis and visualization of Marketing Data as part of ETL pipeline.
                • Actively participated and improved the company’s website experience during the brand refresh project.
                `,
                skills: [
                    "Python", "SQL", "Pandas", "Tableau", "Asp .NET MVC", "C#",
                    "HTML5", "CSS3", "Bootstrap", "JavaScript", "jQuery", "EPiServer",
                    "Jira", "Git"
                ]
            }
        ]
    },
    {
        name: "Directorate of Special Projects, DRDO",
        type: "Job",
        year: "2019-01 – 2020-11",
        children: [
            {
                name: "Python Developer and Research Assistant",
                type: "Role",
                description: `
                • Developed data processing software for AIS packets for satellite tracking of ships.
                • Created scripts to test the reliability of captured packet files.
                • Created TCP/IP Interface for Ground Station Communication with Defense Satellites.
                • Researched networking concepts to migrate from Test System – OBC to Cortex – OBC connection chain.
                • Created error reporting script for packet discrepancies, relational patterns, etc. for real-time GPS data from AIS 
                Payload.
                • Mentored 3 interns on regex parsing of AIS packets.
                `,
                skills: [
                    "Python", "Regular Expression", "Networking - Socket connection",
                    "TCP/IP", "Serial connections", "TKinter", "Pandas", "Numpy",
                    "Matplotlib"
                ]
            }
        ]
    },
    {
        name: "Hasura Technologies Pvt. Ltd., Bangalore",
        type: "Job",
        year: "2017-12 – 2018-02",
        children: [
            {
                name: "Frontend Developer (Intern)",
                type: "Role",
                description: `
                • Implemented a voting based social media application, election under Hasura's Product Development Fellowship.
                • Lead and managed a team of 10 with regular coordination and planning.
                • Acted as a liaison between the team and the mentor.
                • Found 19 bugs in the company's infrastructure and assisted in fixing them
                `,
                skills: [
                    "Git", "Hasura Framework", "Python", "Django", "Flask",
                    "ReactJS", "Docker", "Kubernetes", "HTML", "CSS"
                ]
            }
        ]
    },
    {
        name: "Tata Power Strategic Engineering Division, Bangalore",
        type: "Job",
        year: "2015-11 – 2015-12",
        children: [
            {
                name: "Microchip Programming Intern",
                type: "Role",
                description: `
                • Creation of Automated Sensory Systems on Embedded 8052 Microcontrollers.
                • Guided fellow intern to learn and improve his code.
                • Made final optimizations in the created code.
                `,
                skills: [
                    "Embedded C", "8052 Microcontroller"
                ]
            }
        ]
    }
];

export default experience;
