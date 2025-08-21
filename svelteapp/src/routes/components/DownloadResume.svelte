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

    const containerMargin = 35;

    const getResumeText = async () => {
        const response = await fetch("/resume.html");
        return await response.text();
    };

    // Helper function to create an element with optional classes and text content
    const createElement = (tag, {
        classes = [],
        text = "",
        children = [],
        attributes = {}
    } = {}) => {
        const element = document.createElement(tag);
        classes.forEach((className) => element.classList.add(className));
        if (text) element.textContent = text;
        children.forEach((child) => element.appendChild(child));
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    };

    // Helper function to create and append tasks
    const createTasks = (description, roleTask = false) => {
        const tasksUl = createElement(
            "ul",
            {
                classes: ["tasks", ...(roleTask ? ["role-tasks"] : [])],
                children: description.split("\r\n").map((task) => (
                    createElement("li", {
                        children: [createElement("span", { text: task.replace("• ", "") })]
                    })
                ))
            }
        );
        return tasksUl;
    };

    // Helper function to create the project tags
    const createProjectTags = (skills) => {
        const projectTags = createElement("div", {
            classes: ["project-tags"],
            children: skills.map((tag) => (
                createElement("div", {
                    classes: ["project-tag"],
                    children: [createElement("span", { text: tag })]
                })
            ))
        });
        return projectTags;
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
            const jobLi = createElement("li", {
                classes: ["company"],
                children: [createElement("strong", { text: job.name })]
            });

            job.children.forEach((role) => {
                jobLi.appendChild(createElement("span", {
                    classes: ["role"],
                    text: role.name
                }));
                jobLi.appendChild(createElement("span", {
                    classes: ["period"],
                    text: job.year
                }));

                if (role.children && role.children.length > 0) {
                    const roleUl = createElement("ul", {
                        classes: ["exp_projects"],
                        children: role.children.map((product) => {
                            const productLi = createElement("li", {
                                classes: ["project"],
                                children: [
                                    createElement("strong", { text: product.name })
                                ]
                            });

                            if (product.description) {
                                productLi.appendChild(
                                    createTasks(product.description)
                                );
                            }
                            productLi.appendChild(createProjectTags(product.skills));
                            return productLi;
                        })
                    });
                    jobLi.appendChild(roleUl);
                }

                if (role.description) {
                    const taskHolder = createElement("div", {
                        classes: ["task-holder"],
                        children: [
                            createTasks(role.description, true),
                            createProjectTags(role.skills)
                        ]
                    });
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
            const projectCard = createElement("div", {
                classes: ["project-card"],
                children: [
                    createElement("div", {
                        classes: ["project-title"],
                        children: [
                            createElement("a", {
                                text: project.title,
                                classes: [],
                                attributes: {
                                    href: project.htmlUrl || "#",
                                    target: "_blank",
                                    rel: "noopener noreferrer"
                                }
                            })
                        ]
                    })
                ]
            });

            const watcherCount = project.watcherCount || 0;
            const forkCount = project.forkCount || 0;
            const stargazerCount = project.stargazerCount || 0;

            if (watcherCount || forkCount || stargazerCount) {
                projectCard.appendChild(
                    createElement("div", {
                        classes: ["project-meta"],
                        children: [
                            createElement("span", {
                                children: [createElement("div", {
                                    classes: ["icon"],
                                    children: [
                                        createElement("img", {
                                            attributes: {
                                                src: "https://img.icons8.com/material-rounded/24/transparent/visible.png",
                                                alt: "Watchers"
                                            }
                                        }),
                                        createElement("span", {
                                            text: watcherCount.toLocaleString()
                                        })
                                    ]
                                })]
                            }),
                            createElement("span", {
                                children: [createElement("div", {
                                    classes: ["icon"],
                                    children: [
                                        createElement("img", {
                                            attributes: {
                                                src: "https://img.icons8.com/material-outlined/24/transparent/code-fork.png",
                                                alt: "Forks"
                                            }
                                        }),
                                        createElement("span", {
                                            text: forkCount.toLocaleString()
                                        })
                                    ]
                                })]
                            }),
                            createElement("span", {
                                children: [createElement("div", {
                                    classes: ["icon"],
                                    children: [
                                        createElement("img", {
                                            attributes: {
                                                src: "https://img.icons8.com/material-rounded/24/transparent/star.png",
                                                alt: "Stars"
                                            }
                                        }),
                                        createElement("span", {
                                            text: stargazerCount.toLocaleString()
                                        })
                                    ]
                                })]
                            })
                        ]
                    })
                );
            }

            projectCard.appendChild(
                createElement(
                    "div",
                    {
                        text: project.description,
                        classes: ["project-description"]
                    }
                )
            );

            projectCard.appendChild(createProjectTags(project.tags));

            projectsRoot.appendChild(projectCard);
        });
    };

    // Helper function to create the skills section
    const createSkills = (skillsRoot, skls) => {
        skillsRoot.innerHTML = "";
        skls.forEach((skill) => {
            const sklLi = createElement("li", {
                children: [
                    createElement("img", {
                        attributes: {
                            src: skill.icon,
                            alt: skill.name
                        }
                    }),
                    createElement("span", {
                        text: skill.name
                    })
                ]
            });
            skillsRoot.appendChild(sklLi);
        });
    };

    // Helper function to create the education section
    const createEducation = (educationRoot, edu) => {
        educationRoot.innerHTML = "";
        edu.forEach((education) => {
            const educationLi = createElement("li", {
                classes: ["specialization"],
                children: [
                    createElement("strong", {
                        text: education.specialization
                    }),
                    createElement("span", {
                        classes: ["institution"],
                        text: education.institution
                    }),
                    createElement("br"),
                    createElement("span", {
                        classes: ["period"],
                        text: education.period
                    })
                ]
            });
            educationRoot.appendChild(educationLi);
        });
    };

    // Helper function to create the achievements section
    const createAchievements = (achievementsRoot, achv) => {
        achievementsRoot.innerHTML = "";
        achv.forEach((achievement) => {
            const achievementCard = createElement("div", {
                classes: ["achievement-card"],
                children: [
                    createElement("img", {
                        attributes: {
                            src: achievement.from.icon,
                            alt: achievement.name
                        }
                    }),
                    createElement("div", {
                        classes: ["achievement-info"],
                        children: [
                            createElement("strong", {
                                text: achievement.name
                            }),
                            createElement("span", {
                                text: `${achievement.from.name} (${achievement.year})`
                            })
                        ]
                    })
                ]
            });
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

        const footer = hiddenDiv.shadowRoot.querySelector(".footer>span");
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
        hiddenDiv = createElement("div", {
            classes: ["hidden-div"],
            attributes: {
                style: "position: absolute; left: -9999px; top: -9999px;"
            }
        });
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
        const getTextPosition = (element, pageNum = 0) => {
            const hostRect = element.getRootNode().host.getBoundingClientRect();

            // Build a range over the element's text
            const range = document.createRange();
            range.selectNodeContents(element);
            let { left: L, top: T, right: R, bottom: B } = range.getBoundingClientRect();
            range.detach?.();

            let adj = (!element.closest(".project-tags") && !element.closest(".details")) ? containerMargin : containerMargin / 2;
            if (pageNum > 0) {
                adj = containerMargin / 2;
            }
            T += adj;

            const style = getComputedStyle(element);

            return {
                left: L - hostRect.left,
                top: T - hostRect.top,
                width: R - L,
                height: B - T,
                fontSize: parseFloat(style.fontSize) * 1.075,
                text: element.textContent,
                url: element.href || ""
            };
        };

        const createPage = (elements, pageNum = 0) => {
            const newRoot = hiddenDiv.cloneNode(true);
            const shadowRoot = newRoot.attachShadow({ mode: "open" });
            shadowRoot.appendChild(hiddenDiv.shadowRoot.querySelector("style").cloneNode(true));
            const newContainer = createElement("div", {
                classes: ["container"],
                children: elements.map((element) => element.cloneNode(true)),
                attributes: {
                    style: "border-radius: 0; margin: 0;"
                }
            });
            shadowRoot.appendChild(newContainer);
            document.body.appendChild(newRoot);
            const searchables = [
                ...Array.from(shadowRoot.querySelectorAll("*"))
                    .filter(
                        (elem) =>
                            ["style"].indexOf(elem.tagName.toLowerCase()) === -1 &&
                            elem.innerText &&
                            elem.innerText.trim().length > 0 &&
                            elem.childElementCount === 0
                    )
            ].map((elem) => getTextPosition(elem, pageNum));
            return { host: shadowRoot.host, searchables };
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
                    searchables: page.searchables
                };
            }));
            return pageObjects;
        };
        try {
            document.body.style.cursor = "wait";
            isDownloading = true;
            const pageObjects = await splitPages();
            const pdf = new Jspdf("p", "pt", [pageObjects[0].width, pageObjects[0].height]);
            pdf.setFontSize(16);
            pdf.setCharSpace(1);
            pageObjects.forEach((page, i) => {
                pdf.addImage(page.url, "PNG", 0, 0, page.width, page.height);
                page.searchables.forEach((searchable) => {
                    pdf.setFontSize(searchable.fontSize);
                    try {
                        pdf.text(searchable.text, searchable.left, searchable.top, {
                            renderingMode: "invisible",
                            maxWidth: 640
                        });
                        if (searchable.url) {
                            pdf.link(
                                searchable.left,
                                searchable.top,
                                searchable.width,
                                searchable.height,
                                { url: searchable.url }
                            );
                        }
                    } catch (error) {
                        console.error("Error adding text to PDF:", error);
                    }
                    pdf.setFontSize(16); // Reset font size for next text
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
