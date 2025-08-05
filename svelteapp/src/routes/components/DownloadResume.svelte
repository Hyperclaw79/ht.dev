<script>
    import { getContext } from "svelte";
    import Jspdf from "jspdf";
    import domtoimage from "dom-to-image-more";
    import { writable } from "svelte/store";

    let hiddenDiv;
    let thumbnailSrc = "";
    let isDownloading = false;
    const fullSkillList = ["Python"].fill(100);
    const { experience, projects, skills, achievements, socials } = Object.fromEntries(getContext("api"));
    const education = writable([]);
    fetch("/api/education").then((res) => res.json()).then((data) => education.set(data));

    const getResumeText = async () => {
        const response = await fetch("/resume.html");
        return await response.text();
    };

    // Helper function to create an element with optional classes and text content
    const createElement = (tag, classNames = [], textContent = "") => {
        const element = document.createElement(tag);
        classNames.forEach((className) => element.classList.add(className));
        if (textContent) element.textContent = textContent;
        return element;
    };

    // Helper function to create and append tasks
    const createTasks = (description, roleTask = false) => {
        const tasksUl = createElement("ul", ["tasks", ...(roleTask ? ["role-tasks"] : [])]);
        description.split("\r\n").forEach((task) => {
            const taskLi = createElement("li", [], task.replace("• ", ""));
            tasksUl.appendChild(taskLi);
        });
        return tasksUl;
    };

    // Helper function to modify the social links
    const modifySocials = (socialRoot, socials) => {
        socials.forEach((social) => {
            const socialAnchor = socialRoot.querySelector(`img[alt="${social.name}"]`)?.closest("span").querySelector("a");
            if (!socialAnchor) return;
            socialAnchor.href = social.href || social.url;
            socialAnchor.text = social.text || social.url;
            socialAnchor.target = "blank";
            socialAnchor.rel = "noopener noreferrer";
        });
    };

    // Helper function to create the experience section
    const createExperience = (expRoot, exp) => {
        expRoot.innerHTML = "";
        exp.forEach((job) => {
            const jobLi = createElement("li", ["company"]);
            jobLi.appendChild(createElement("strong", [], job.name));

            job.children.forEach((role) => {
                jobLi.appendChild(createElement("span", ["role"], role.name));
                jobLi.appendChild(createElement("span", ["period"], job.year));

                if (role.children && role.children.length > 0) {
                    const roleUl = createElement("ul", ["exp_projects"]);
                    role.children.forEach((product) => {
                        const productLi = createElement("li", ["project"]);
                        productLi.appendChild(
                            createElement("strong", [], product.name)
                        );

                        if (product.description) {
                            productLi.appendChild(
                                createTasks(product.description)
                            );
                        }
                        const projectTags = createElement("div", ["project-tags"]);

                        product.skills.forEach((tag) => {
                            projectTags.appendChild(
                                createElement("span", ["project-tag"], tag)
                            );
                            fullSkillList.push(tag);
                        });
                        productLi.appendChild(projectTags);
                        roleUl.appendChild(productLi);
                    });
                    jobLi.appendChild(roleUl);
                }

                if (role.description) {
                    const taskHolder = createElement("div", ["task-holder"]);
                    taskHolder.appendChild(createTasks(role.description, true));
                    const projectTags = createElement("div", ["project-tags"]);
                    role.skills.forEach((tag) => {
                        projectTags.appendChild(
                            createElement("span", ["project-tag"], tag)
                        );
                        fullSkillList.push(tag);
                    });
                    taskHolder.appendChild(projectTags);
                    jobLi.appendChild(taskHolder);
                }
            });
            expRoot.appendChild(jobLi);
        });
    };

    // Helper function to create the projects section
    const createProjects = (projectsRoot, prjs) => {
        projectsRoot.innerHTML = "";
        prjs.forEach((project) => {
            const projectCard = createElement("div", ["project-card"]);

            const projectTitle = createElement("div", ["project-title"]);
            const projectLink = createElement("a", [], project.title);
            projectLink.href = project.htmlUrl || "#";
            projectLink.target = "_blank";
            projectLink.rel = "noopener noreferrer";
            projectTitle.appendChild(projectLink);
            projectCard.appendChild(projectTitle);

            const watcherCount = project.watcherCount || 0;
            const forkCount = project.forkCount || 0;
            const stargazerCount = project.stargazerCount || 0;

            if (watcherCount || forkCount || stargazerCount) {
                const projectMeta = createElement("div", ["project-meta"]);
                const watchers = createElement("span");
                watchers.innerHTML = `<div class="icon"><img src="https://img.icons8.com/material-rounded/24/transparent/visible.png" alt="Watchers"></div> ${watcherCount}`;
                const forks = createElement("span");
                forks.innerHTML = `<div class="icon"><img src="https://img.icons8.com/material-outlined/24/transparent/code-fork.png" alt="Forks"></div> ${forkCount}`;
                const stars = createElement("span");
                stars.innerHTML = `<div class="icon"><img src="https://img.icons8.com/material-rounded/24/transparent/star.png" alt="Stars"></div> ${stargazerCount}`;
                projectMeta.appendChild(watchers);
                projectMeta.appendChild(forks);
                projectMeta.appendChild(stars);
                projectCard.appendChild(projectMeta);
            }

            projectCard.appendChild(
                createElement(
                    "div",
                    ["project-description"],
                    project.description
                )
            );

            const projectTags = createElement("div", ["project-tags"]);
            project.tags.forEach((tag) => {
                projectTags.appendChild(
                    createElement("span", ["project-tag"], tag)
                );
                fullSkillList.push(tag);
            });
            projectCard.appendChild(projectTags);

            projectsRoot.appendChild(projectCard);
        });
    };

    // Helper function to create the skills section
    const createSkills = (skillsRoot, skls) => {
        skillsRoot.innerHTML = "";
        skls.forEach((skill) => {
            const sklSpan = createElement("span", [], skill.name);
            const sklIcon = createElement("img");
            sklIcon.src = skill.icon;
            const sklLi = createElement("li", []);
            sklLi.appendChild(sklIcon);
            sklLi.appendChild(sklSpan);
            skillsRoot.appendChild(sklLi);
        });
    };

    // Helper function to create the education section
    const createEducation = (educationRoot, edu) => {
        educationRoot.innerHTML = "";
        edu.forEach((education) => {
            const educationLi = createElement("li", ["specialization"]);
            educationLi.appendChild(createElement("strong", [], education.specialization));
            educationLi.appendChild(createElement("span", ["institution"], education.institution));
            educationLi.appendChild(createElement("br"));
            educationLi.appendChild(createElement("span", ["period"], education.period));
            educationRoot.appendChild(educationLi);
        });
    };

    // Helper function to create the achievements section
    const createAchievements = (achievementsRoot, achv) => {
        achievementsRoot.innerHTML = "";
        achv.forEach((achievement) => {
            const achievementCard = createElement("div", ["achievement-card"]);
            const img = createElement("img");
            img.src = achievement.from.icon;
            img.alt = achievement.name;
            achievementCard.appendChild(img);

            const achievementInfo = createElement("div", ["achievement-info"]);
            achievementInfo.appendChild(
                createElement("strong", [], achievement.name)
            );
            achievementInfo.appendChild(
                createElement(
                    "span",
                    [],
                    `${achievement.from.name} (${achievement.year})`
                )
            );

            achievementCard.appendChild(achievementInfo);
            achievementsRoot.appendChild(achievementCard);
        });
    };

    const modifyHiddenDiv = (hiddenDiv) => {
        const socialRoot = hiddenDiv.shadowRoot.querySelector(".contact-info");
        modifySocials(socialRoot, $socials || []);

        const expRoot = hiddenDiv.shadowRoot.querySelector(".experience ul");
        createExperience(expRoot, $experience || []);

        const projectsRoot = hiddenDiv.shadowRoot.querySelector(".section.projects .projects");
        createProjects(projectsRoot, $projects || []);

        const techSkillsRoot = hiddenDiv.shadowRoot.querySelector(".technical-skills ul");
        createSkills(
            techSkillsRoot,
            ($skills["Technical Skills"] || []).toSorted(
                (a, b) => (b.confidence * fullSkillList.filter(x => x === b.name).length) - (
                    a.confidence * fullSkillList.filter(x => x === a.name).length
                )
            )
        );

        const softSkillsRoot =
            hiddenDiv.shadowRoot.querySelector(".soft-skills ul");
        createSkills(
            softSkillsRoot,
            ($skills["Soft Skills"] || []).toSorted(
                (a, b) => b.confidence - a.confidence
            )
        );

        const educationRoot = hiddenDiv.shadowRoot.querySelector(".education ul");
        createEducation(educationRoot, $education || []);

        const achievementsRoot = hiddenDiv.shadowRoot.querySelector(
            ".section.achievements .content"
        );
        createAchievements(achievementsRoot, $achievements || []);

        const footer = hiddenDiv.shadowRoot.querySelector(".footer>p");
        footer.textContent = footer.textContent.replace(/\d{4}/, new Date().getFullYear());
    };

    const replaceCssVariables = (shadowRoot) => {
        const themeIdx = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? 0 // "dark"
            : 1; // "light"
        const cssVarText = shadowRoot.querySelector("style").textContent;
        const themeBlock = [...cssVarText.match(/:host\s*\{[^}]+\}/g)][themeIdx];
        const varMap = new Map(
            [...themeBlock.matchAll(/--[^:]+:\s*[^;]+/g)].map((match) =>
                match[0].split(":").map((part) => part.trim())
            )
        );
        const cleanedCss = cssVarText.replace(/var\([^)]+\)/g, (match) => {
            const varName = match.match(/--[^)]+/)[0];
            return varMap.get(varName) || match;
        });
        shadowRoot.querySelector("style").textContent = cleanedCss;
        shadowRoot.querySelectorAll(".icon>img").forEach(
            (img) => {
                img.src = img.src.replace("transparent", varMap.get("--img-color").replace("#", ""));
            }
        );
    };

    const getHiddenDiv = async (htmlContent) => {
        hiddenDiv = document.createElement("div");
        hiddenDiv.classList.add("hidden-div");
        hiddenDiv.style.position = "absolute";
        hiddenDiv.style.left = "-9999px";
        hiddenDiv.style.top = "-9999px";
        // Create a shadow root to encapsulate the styles
        const shadowRoot = hiddenDiv.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = htmlContent;
        document.body.appendChild(hiddenDiv);
        modifyHiddenDiv(hiddenDiv);
        replaceCssVariables(shadowRoot);
        // Wait for the images and fonts to load
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { hiddenDiv, shadowRoot };
    };

    // Function to create a thumbnail from the fetched HTML content
    const createThumbnail = async () => {
        const resumeText = await getResumeText();
        try {
            const { shadowRoot } = await getHiddenDiv(resumeText);

            const canvas = await domtoimage.toCanvas(shadowRoot.host);
            thumbnailSrc = canvas.toDataURL("image/png");
        } catch (error) {
            console.error("Error creating thumbnail:", error);
        }
    };

    // Function to convert HTML to PDF and trigger download
    const downloadPDF = async () => {
        const getPostion = (element, anchor = false, pageNum = 0) => {
            const posObj = anchor ? { url: element.href } : { text: element.textContent };
            if (element.closest(".contact-info")) {
                element = element.parentElement;
            }
            const targetRect = element.getBoundingClientRect();
            const hostRect = element.getRootNode().host.getBoundingClientRect();

            let left = targetRect.left - hostRect.left;
            let top = targetRect.top - hostRect.top;

            if (!anchor) {
                const style = getComputedStyle(element);
                left = left + parseFloat(style.paddingLeft);
                top += parseFloat(style.paddingTop);
                if (pageNum === 0) {
                    // margin top of container: 10mm = 37.795px
                    const additionalTop = element.closest(".company").querySelector(".exp_projects") &&
                        element.closest(".task-holder")
                        ? parseFloat(style.height) / 2
                        : 37.795 / 2;
                    top += additionalTop;
                } else {
                    top += parseFloat(style.height);
                }
            }

            return {
                left,
                top,
                width: targetRect.width,
                height: targetRect.height,
                ...posObj
            };
        };
        const createPage = (elements, pageNum = 0) => {
            const newRoot = hiddenDiv.cloneNode(true);
            const shadowRoot = newRoot.attachShadow({ mode: "open" });
            shadowRoot.appendChild(hiddenDiv.shadowRoot.querySelector("style").cloneNode(true));
            const newContainer = document.createElement("div");
            newContainer.className = "container";
            elements.forEach(element => newContainer.appendChild(element.cloneNode(true)));
            newContainer.style.borderRadius = "0";
            newContainer.style.margin = "0";
            shadowRoot.appendChild(newContainer);
            document.body.appendChild(newRoot);
            const linkPositions = [...shadowRoot.querySelectorAll("a")].map(
                (elem) => getPostion(elem, true)
            );
            const searchables = [
                // Header information
                ...shadowRoot.querySelectorAll(".header h1"),
                ...shadowRoot.querySelectorAll(".header h3"),
                ...shadowRoot.querySelectorAll(".contact-info a"),
                // Section titles
                ...shadowRoot.querySelectorAll(".section-title span"),
                // Experience section
                ...shadowRoot.querySelectorAll(".experience .company > strong"),
                ...shadowRoot.querySelectorAll(".experience .role"),
                ...shadowRoot.querySelectorAll(".experience .period"),
                ...shadowRoot.querySelectorAll(".experience .project > strong"),
                ...shadowRoot.querySelectorAll(".experience .tasks li"),
                ...shadowRoot.querySelectorAll(".experience .project-tag"),
                // Projects section
                ...shadowRoot.querySelectorAll(".project-title a"),
                ...shadowRoot.querySelectorAll(".project-description"),
                ...shadowRoot.querySelectorAll(".project-tag"),
                // Skills section
                ...shadowRoot.querySelectorAll(".skills li>span"),
                // Education section
                ...shadowRoot.querySelectorAll(".education .specialization > strong"),
                ...shadowRoot.querySelectorAll(".education .institution"),
                ...shadowRoot.querySelectorAll(".education .period"),
                // Achievements section
                ...shadowRoot.querySelectorAll(".achievement-info strong"),
                ...shadowRoot.querySelectorAll(".achievement-info span")
            ].map((elem) => getPostion(elem, false, pageNum));
            return { host: shadowRoot.host, linkPositions, searchables };
        };
        const splitPages = async () => {
            const containerNode = hiddenDiv.shadowRoot.querySelector(".container");
            const sections = [...containerNode.children];
            // Extract header and footer
            const header = sections.shift().cloneNode(true);
            const footer = sections.pop().cloneNode(true);
            const firstPage = [header, sections.shift()];
            const lastPage = [sections.pop(), footer];
            lastPage.unshift(sections.pop());
            // Handle the combination of header and first section
            const pages = [firstPage, ...sections.map((sect) => [sect]), lastPage].map(
                (elements, idx) => createPage(elements, idx)
            );
            await new Promise((resolve) => setTimeout(resolve, 500));
            const pageObjects = await Promise.all(pages.map(async (page) => {
                const url = await domtoimage.toPng(page.host);
                page.host.remove();
                const img = new Image();
                img.src = url;
                await img.decode();
                return {
                    url,
                    width: img.width,
                    height: img.height,
                    linkPositions: page.linkPositions,
                    searchables: page.searchables
                };
            }));
            return pageObjects;
        };
        try {
            document.body.style.cursor = "wait";
            isDownloading = true;
            const pageObjects = await splitPages();
            const pdf = new Jspdf("p", "px", [pageObjects[0].width, pageObjects[0].height]);
            pdf.setFontSize(16);
            pdf.setCharSpace(1);
            pageObjects.forEach((page, i) => {
                pdf.addImage(page.url, "PNG", 0, 0, page.width, page.height);
                page.linkPositions.forEach((link) => {
                    pdf.link(link.left, link.top, link.width, link.height, { url: link.url });
                });
                page.searchables.forEach((searchable) => {
                    pdf.text(searchable.text, searchable.left, searchable.top, {
                        renderingMode: "invisible"
                    });
                });
                if (i < pageObjects.length - 1) {
                    const nextHeight = pageObjects[i + 1].height;
                    pdf.addPage([page.width, nextHeight], nextHeight > page.width ? "p" : "l");
                }
            });
            pdf.save("Harshith Thota Resume.pdf");
        } catch (error) {
            console.error("Error creating PDF:", error);
        } finally {
            document.body.style.cursor = "auto";
            isDownloading = false;
        }
    };

    $: if (
        $experience.length &&
        $projects.length &&
        $skills["Technical Skills"]?.length &&
        $skills["Soft Skills"]?.length &&
        $achievements.length &&
        $socials.length
    ) {
        createThumbnail();
    }
</script>

<div class="download-content">
    <h2>Download My Resume</h2>
    <p>Get a copy of my dynamically generated resume.</p>
    <div class="content">
        <div class="resume-preview" class:disabled={isDownloading}
            on:click={thumbnailSrc && !isDownloading && downloadPDF}
            on:keydown={thumbnailSrc && !isDownloading && downloadPDF}
        >
            {#if thumbnailSrc}
                <img src={thumbnailSrc} alt="Resume Preview" />
            {:else}
                <div class="loader"></div>
            {/if}
        </div>
        <button
            class="btn-download"
            on:click={thumbnailSrc && !isDownloading && downloadPDF}
            disabled={!thumbnailSrc || isDownloading}
        >
            {#if !isDownloading}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                >
                    <path d="M5 20h14v-2H5v2zm7-18v10h3l-4 4-4-4h3V2z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            {:else}
                <div class="loader"></div>
            {/if}
            <span>Download</span>
        </button>
    </div>
</div>

<style>
    .download-content {
        width: 30vw;
        margin: 0 auto;
        background: var(--theme-bg);
        padding: 0.5em 0;
        border-radius: 10px;
        --base-font-size: 2vw;
    }

    h2 {
        font-size: var(--base-font-size);
        margin-bottom: 20px;
    }

    p {
        font-size: calc(var(--base-font-size) * 0.8);
        margin-bottom: 30px;
    }

    .resume-preview {
        width: 25vw;
        height: 25vw;
        margin: auto;
        margin-bottom: 30px;
        border-radius: 10px;
        overflow: hidden;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
    }

    .resume-preview:not(.loader) {
        cursor: pointer;
    }

    .resume-preview.disabled {
        cursor: not-allowed;
        filter: grayscale(1);
    }

    .resume-preview .loader {
        height: 25vw;
        background: transparent;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            background: transparent;
        }
        50% {
            background: #272727;
        }
    }

    .resume-preview img {
        max-width: 100%;
        height: auto;
        position: relative;
    }

    .resume-preview::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        border: 2px solid #ffffff;
        pointer-events: none;
    }

    .btn-download {
        display: flex;
        margin: auto;
        padding: 10px 20px;
        align-items: center;
        font-size: calc(var(--base-font-size) * 0.8);
        color: #fff;
        background-color: #04879e;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s ease;
        cursor: pointer;
    }

    .btn-download svg {
        margin-right: 10px;
        vertical-align: middle;
        fill: white; /* Ensure the icon color is white */
    }

    .btn-download:hover {
        background-color: #0b85cc;
    }

    .btn-download:active {
        background-color: #04879e;
    }

    .btn-download:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .btn-download:disabled:hover,
    .btn-download:disabled:active {
        background-color: #ccc;
    }

    .btn-download .loader {
        height: 20px;
        width: 20px;
        margin-right: 10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media screen and (max-width: 1200px) {
        .download-content {
            width: 80vw;
            --base-font-size: 4vw;
        }

        .resume-preview {
            width: 50vw;
            height: 50vw;
        }
    }
</style>
