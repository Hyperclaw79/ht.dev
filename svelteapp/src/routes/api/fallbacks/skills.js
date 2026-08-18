const groups = [
    ["Languages", 10, [
        ["Python", 10, "/icons/technical/python.webp"], ["SQL", 20], ["TypeScript", 30],
        ["JavaScript", 40, "/icons/technical/javascript.png"], ["C#", 50], ["Embedded C", 60]
    ]],
    ["Backend", 20, [
        ["Django", 10], ["Django REST Framework (DRF)", 20], ["FastAPI", 30], ["Flask", 40],
        ["aiohttp", 50], ["REST APIs", 60, "/icons/technical/rest.png"], ["OAuth 2.0", 70],
        ["Swagger / OpenAPI", 80]
    ]],
    ["Data", 30, [
        ["PostgreSQL", 10], ["SQLite", 20], ["Redis", 30], ["RabbitMQ", 40],
        ["MongoDB", 50], ["pandas", 60], ["NumPy", 70], ["SQLAlchemy", 80]
    ]],
    ["Infra", 40, [
        ["Docker", 10], ["Docker Compose", 20], ["Kubernetes", 30],
        ["Amazon Web Services (AWS)", 40], ["Google Kubernetes Engine (GKE)", 50]
    ]],
    ["DevOps", 50, [
        ["Git", 10, "/icons/technical/git.png"], ["Forgejo", 20], ["GitHub Actions", 30],
        ["Jenkins", 40], ["Azure DevOps", 50], ["CI/CD", 60]
    ]],
    ["Networking", 60, [
        ["DNS", 10], ["Reverse Proxy", 20], ["Cloudflare DNS", 30],
        ["TLS / Certificate Management", 40], ["TCP/IP", 50]
    ]],
    ["Systems", 70, [
        ["asyncio", 10], ["Multithreading", 20], ["Socket Programming", 30],
        ["Serial Communication", 40], ["Telemetry Processing", 50]
    ]],
    ["Frontend", 80, [
        ["React", 10, "/icons/technical/reactjs.png"], ["SvelteKit", 20],
        ["HTML5", 30, "/icons/technical/html5.png"], ["CSS3", 40, "/icons/technical/css3.png"],
        ["Bootstrap", 50], ["jQuery", 60], ["VS Code API", 70]
    ]],
    ["AI / ML", 90, [
        ["OpenAI APIs", 10], ["LLM Integration", 20], ["PyTorch", 30],
        ["Computer Vision", 40], ["Model Context Protocol (MCP)", 50]
    ]]
];

const skills = groups.flatMap(([category, categoryOrder, entries]) =>
    entries.map(([name, order, icon = ""]) => ({
        category,
        categoryOrder,
        name,
        order,
        icon
    }))
);

export default skills;
