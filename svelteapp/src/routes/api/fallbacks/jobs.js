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
                        description: "• Led the end-to-end onboarding of a strategic index into a previously unsupported market, architecting calendar-resolution and special-weekend logic and building the first in-house Index Data Pipeline library for non-standard calendars; enabled $10B+ potential AUM inflow and established a reusable foundation for future index onboardings.\r\n" +
                            "• Own the Index Data Server end-to-end as its SME for a critical service used across multiple business teams. Re-architected its caching strategy from eager full-table refreshes to a prewarmed in-memory cache with on-demand historical loading and asynchronous background refreshes, cutting startup time by more than 10× and materially improving API responsiveness and throughput.\r\n" +
                            "• Refactored the Quality Check system to exclude dead/unsubscribed indices from position validation and introduced cross-client validation logic, eliminating thousands of false-positive exceptions and substantially improving dashboard accuracy.\r\n" +
                            "• Built and deployed an automated vendor-data acquisition workflow on BlackRock’s internal ingestion framework, replacing manual SFTP retrieval with REST API-based acquisition and reducing manual effort for business-analysis stakeholders.\r\n" +
                            "• Mentor junior and newly onboarded engineers through technical guidance, code reviews, and design discussions, helping accelerate ramp-up while maintaining engineering standards.\r\n" +
                            "• Improved delivery planning by proposing a revised story structure that separated development work from external-team testing, improving visibility into testing bottlenecks and planning accuracy; subsequently took on PI-planning responsibilities to break features into well-scoped, estimable engineering stories.",
                        skills: [
                            "Python", "Azure ADO", "Aqua Data Studio", "Aladdin", "Other Proprietary Internal Tools"
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
                year: "2021-04 – 2023-08",
                children: [
                    {
                        name: "Propello",
                        caption: "Cloud based Retail Application",
                        type: "Product",
                        description: "• Worked across multiple modules of Propello, a multi-tenant ERP SaaS application, developing custom backend endpoints using Django REST Framework and collaborating with frontend engineers to deliver production-ready features.\r\n" +
                            "• Contributed to technical design discussions around maintainability, extensibility, and future product requirements.",
                        skills: [
                            "Python", "Django", "PyTest", "Pylint",
                            "Pep8", "Git", "Jenkins", "Jira"
                        ]
                    },
                    {
                        name: "Epicor Payment Application",
                        caption: "End to End Payment Application",
                        type: "Product",
                        description: "• Developed test-driven, multithreaded APIs and resolved defects across the Epicor Payment Application.\r\n" +
                            "• Worked extensively on EPA’s integration with Ingenico Pinpads, including fixing a critical date-adjustment defect that could hard-brick certain pinpad models.\r\n" +
                            "• Developed application orchestration workflows using the State Action Model (SAM) pattern.\r\n" +
                            "• Diagnosed and investigated application issues through Kibana log analysis.\r\n" +
                            "• Owned a major Epic for EPPS as its SME, leading extensive refactoring of the cloud-hosted Django application and contributing to adoption by 10 new clients.",
                        skills: [
                            "Python", "PyTest", "Pylint", "Pep8",
                            "Git", "Jenkins", "Kibana", "Jira"
                        ]
                    },
                    {
                        name: "AWS Authentication PoC",
                        type: "Product",
                        description: "• Built a proof of concept to expose selected Propello backend functionality as external REST APIs, enabling customers to integrate Propello into their own workflows.\r\n" +
                            "• Implemented OAuth2 authentication using AWS Cognito and a custom Lambda authorizer, and authored Swagger schemas for the exposed endpoints.",
                        skills: [
                            "Python", "AWS Cognito", "AWS Lambda", "Swagger"
                        ]
                    }
                ]
            },
            {
                name: "Data Science Intern",
                type: "Role",
                year: "2020-12 – 2021-03",
                description: "• Collected, cleaned, wrangled, analyzed, and visualized marketing data as part of an ETL pipeline using Python, SQL, pandas, and Tableau.\r\n" +
                    "• Contributed to the company website during its brand-refresh project, working across the ASP.NET MVC and Javascript-based web stack.",
                skills: [
                    "Python", "SQL", "Pandas", "Tableau", "Asp .NET MVC", "C#",
                    "HTML5", "CSS3", "Bootstrap", "JavaScript", "jQuery", "EPiServer",
                    "Jira", "Git"
                ],
                children: []
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
                description: "• Established core in-house software capabilities for the newly formed department as its only software engineer, building systems from scratch that helped enable independent satellite monitoring and control without routine reliance on external organizations.\r\n" +
                    "• Independently developed a suite of Python tools to process AIS telemetry packets received from satellites, enabling accurate vessel tracking and real-time anomaly detection.\r\n" +
                    "• Built validation tooling to verify the correctness and completeness of captured packet data before downstream processing.\r\n" +
                    "• Developed a TCP/IP interface between an administrative control system and the ground station, enabling configuration and command exchange.\r\n" +
                    "• Led the migration from a simplified test system to the production Cortex ground station, studying complex technical documentation and collaborating with domain experts across defense organizations to correctly decode telemetry encryption and encoding protocols.\r\n" +
                    "• Mentored three interns on regex-based parsing techniques for AIS telemetry packet formats.\r\n" +
                    "• Received recognition from senior DRDO scientists for being instrumental in establishing the department’s in-house satellite software capability, as well as for system reliability and rapid delivery.",
                skills: [
                    "Python", "Regular Expression", "Networking - Socket connection",
                    "TCP/IP", "Serial connections", "TKinter", "Pandas", "Numpy",
                    "Matplotlib"
                ],
                children: []
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
                description: "• Built Electon, a voting-based social application, as part of Hasura’s Product Development Fellowship.\r\n" +
                    "• Led and coordinated a team of 10, acting as the primary liaison between the team and its mentor.\r\n" +
                    "• Identified 19 bugs in Hasura’s infrastructure and assisted with their resolution.",
                skills: [
                    "Git", "Hasura Framework", "Python", "Django", "Flask",
                    "ReactJS", "Docker", "Kubernetes", "HTML", "CSS"
                ],
                children: []
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
                description: "• Built automated sensory systems on embedded 8052 microcontrollers and performed final code optimizations.\r\n" +
                    "• Guided a fellow intern in understanding and improving their code.",
                skills: [
                    "Embedded C", "8052 Microcontroller"
                ],
                children: []
            }
        ]
    }
];

export default experience;
