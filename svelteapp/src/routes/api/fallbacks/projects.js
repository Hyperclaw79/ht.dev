const metadata = [
    {
        name: "Hyperlab",
        title: "Hyperlab",
        alias: "hyperlab",
        description: "A self-hosted personal engineering platform spanning application hosting, service orchestration, CI/CD, local networking, DNS, identity, observability, documentation, backups, automation, and custom software.",
        resumeDescription: "Self-hosted engineering platform spanning service orchestration, CI/CD, local networking, DNS, reverse proxying, observability, identity, documentation, automation, and custom software.",
        resumeOrder: 1,
        status: "",
        imageUrl: "/images/hyperlab_cover.png",
        tags: ["Docker", "Docker Compose", "Kubernetes", "Forgejo", "GitHub Actions", "DNS", "Cloudflare"],
        isOnGithub: false,
        hidden: false
    },
    {
        name: "DigiCloneMCP",
        title: "DigiCloneMCP",
        alias: "digiclonemcp",
        description: "A work-in-progress, local-first MCP system for building a user-owned digital persona from personal sources through durable ingestion, enrichment, persistence, and generation pipelines.",
        resumeDescription: "Local-first personal data platform for ingesting, enriching, storing, searching, and interacting with private user data through AI clients.",
        resumeOrder: 2,
        status: "WIP",
        imageUrl: "/images/digiclonemcp_cover.png",
        tags: ["Python", "FastMCP", "PostgreSQL", "Docker", "Kubernetes", "Helm", "Vault"],
        isOnGithub: false,
        hidden: false
    },
    {
        name: "PokeBall-SelfBot-Poketwo-Autocatcher",
        title: "Pokeball Selfbot",
        resumeDescription: "",
        resumeOrder: 0,
        status: "",
        alias: "pokeball",
        description: "This specific selfbot was designed to automatically catch pokemon spawned on Discord by Poketwo bot. It also offers other utility functions to automate features like trading, releasing, id search, etc. Currently the autocatcher is powered by AI making it possible to autocatch pokemons on multiple bots like PokeTwo, PokeRealm, etc.",
        imageUrl: "/images/pokeball.png",
        tags: [
            "Python", "discord.py", "Asyncio", "Pytorch", "Deep CNN",
            "Imagehash", "Pillow", "JSON", "REST API", "Git", "SQLite"
        ],
        isOnGithub: true,
        hidden: false
    },
    {
        name: "HULK-v3",
        title: "HULK v3",
        resumeDescription: "",
        resumeOrder: 0,
        status: "",
        alias: "hulk",
        description: "Asynchronous HTTP Botnet for Distributed Denial of Service (DDoS)",
        imageUrl: "/images/Hulk.gif",
        tags: [
            "Python", "Aiohttp", "Asyncio", "REST API",
            "Electron", "NextJS", "Named Pipes", "Socket", "Git",
            "Github Actions", "CI/CD"
        ],
        isOnGithub: true,
        hidden: false
    },
    {
        name: "PokeGambler",
        title: "PokéGambler",
        resumeDescription: "",
        resumeOrder: 0,
        status: "",
        alias: "pokegambler",
        description: "The PokeGambler Discord Bot uses pokemon themed playing cards for a fun gambling match.\\nIt has a dedicated currency, profile system and other minigames.\\nEarned pokechips can be cross-traded.",
        imageUrl: "/images/pokegambler.png",
        tags: [
            "Python", "Aiohttp", "Asyncio", "Discord.py",
            "Google K8s Engine", "Github Actions", "PIL",
            "Git", "MongoDB", "Dataclasses", "NextJS",
            "REST API", "CI/CD"
        ],
        isOnGithub: true,
        hidden: false
    },
    {
        name: "vssticky",
        title: "VSSticky",
        resumeDescription: "Developer-focused VS Code extension for attaching persistent notes directly to source files without leaving the editor.",
        resumeOrder: 4,
        status: "",
        alias: "vssticky",
        description: "Attach sticky notes on your files, from inside VS Code.",
        imageUrl: "/images/vssticky.gif",
        tags: [
            "TypeScript", "VS Code API", "Git", "Github Actions"
        ],
        isOnGithub: true,
        hidden: false
    },
    {
        name: "Electon",
        title: "Electon",
        resumeDescription: "",
        resumeOrder: 0,
        status: "",
        alias: "electon",
        description: "A voting based social networking app made during HPDF. A simple and clean interface which lets users compete is competitions and vote on it. Has support for content ranging from text to audio.",
        imageUrl: "",
        tags: [
            "Python", "Django", "Flask", "Git", "ReactJS", "Javascript", "HTML5",
            "CSS3", "Docker", "Kubernetes", "Hasura CLI", "SQLAlchemy",
            "gunicorn", "REST API", "JSON"
        ],
        isOnGithub: false,
        hidden: true
    },
    {
        name: "StocksALot",
        title: "StocksALot",
        alias: "stocksalot",
        description: "StocksALot is a cutting edge PoC for Stock Market Analysis employing OpenAI's GPT LLMs for insight inference.",
        resumeDescription: "Asynchronous stock-analysis platform combining backend services, persistence, messaging, containerized deployment, and LLM-assisted workflows.",
        resumeOrder: 3,
        status: "",
        imageUrl: "/images/stocksalot_preview.gif",
        tags: ["Python", "Typescript", "Fastapi", "Aiohttp", "Asyncio", "Sveltekit", "Postgresql", "Docker", "Kubernetes", "Redis", "Rabbitmq", "Openai"],
        isOnGithub: true,
        hidden: false
    }
];

export default metadata;
