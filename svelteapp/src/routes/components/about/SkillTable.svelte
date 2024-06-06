<script>
    import { getContext } from "svelte";
    import TextSphere from "../TextSphere.svelte";

    export let show;
    let tags;

    const { experience, projects } = Object.fromEntries(getContext("api"));
    
    function getSkills (exprnc, proj = []) {
        let skills = [];
        exprnc.forEach((exp) => {
            if (exp.skills) {
                const nonInternalSkills = exp.skills.filter(
                    (skill) => !["internal", "proprietary", "private"].some(
                        keyword => skill.toLowerCase().includes(keyword)
                    )
                );
                skills = [...skills, ...nonInternalSkills];
            }
            if (exp.children) {
                skills = [...skills, ...getSkills(exp.children)];
            }
        });
        proj.forEach((prj) => {
            skills = [...skills, ...(prj.tags || [])];
        });
        return skills;
    }
    $: if ($experience.length > 0 && $projects.length > 0) {
        tags = [...new Set(getSkills($experience, $projects))];
    }
</script>

<div class="container">
    <div class="category skills" class:invisible={!show}>
        <div class="header">
            <span>Skills</span>
        </div>
        <div class="section" class:shown={show}>
            <TextSphere tags={tags} />
        </div>
    </div>
    <div class="category interests" class:slid={show} class:invisible={!show}>
        <div class="header">
            <span>Interests</span>
        </div>
        <div class="section" class:shown={show}>
            <div class="row">
                <div class="cell">Cybersecurity</div>
            </div>
            <div class="row">
                <div class="cell">Artificial Intelligence</div>
            </div>
            <div class="row">
                <div class="cell">Data Science</div>
            </div>
            <div class="row">
                <div class="cell">Automation Systems</div>
            </div>
        </div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 75vw;
        height: 100%;
        margin: 0 auto;
        font-family: monospace;
        text-align: center;
        transition: all 1s ease-in-out;
    }
    
    .header {
        background-color: #1a1a1a;
        color: #ddd;
        padding: 8px;
        border: 1px solid #ddd;
    }
    
    .section {
        overflow: hidden;
        max-height: 0;
        border: 1px solid #ddd;
        transition: max-height 1s cubic-bezier(0, 1, 0, 1);
    }

    .interests {
        box-shadow: 0px -2px 4px 2px #000000;
        transform: translateY(-100%);
        transition: transform 2s ease-in-out;
    }

    .invisible {
        opacity: 0;
        transition: all 1s ease-in-out;
    }

    .slid {
        transform: none;
    }
    
    .section.shown {
        max-height: 1000px;
        transition: max-height 1s ease-in-out;
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        background-color: #ddd;
        color: #000;
    }

    .cell {
        border: 1px solid #000;
        padding: 0.5em;
        flex: 1 1 0;
    }
    
    .row:nth-child(even) {
        background-color: #000;
        color: #ddd;
    }
    
    .row:nth-child(even) .cell {
        border: 1px solid #ddd;
    }
</style>
