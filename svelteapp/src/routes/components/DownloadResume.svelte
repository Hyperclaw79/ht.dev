<script>
    import { getContext } from "svelte";
    import Jspdf from "jspdf";
    import domtoimage from "dom-to-image-more";
    import { writable } from "svelte/store";

    let hiddenDiv;
    let thumbnailSrc = "";
    let isDownloading = false;
    const { experience, projects, skills, achievements, socials } = Object.fromEntries(getContext("api"));
    const education = writable([]);
    fetch("/api/education").then((res) => res.json()).then((data) => education.set(data));

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
        const tasks = description
            .split(/\r?\n/)
            .map((task) => task.trim())
            .filter(Boolean);
        const tasksUl = createElement(
            "ul",
            {
                classes: ["tasks", ...(roleTask ? ["role-tasks"] : [])],
                children: tasks.map((task) => (
                    createElement("li", {
                        children: [createElement("span", { text: task.replace(/^•\s*/, "") })]
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

    // Helper function to create the recent projects section
    const createProjects = (projectsRoot, prjs) => {
        projectsRoot.innerHTML = "";
        prjs
            .filter((project) => (project.resumeOrder || 0) > 0)
            .toSorted((a, b) => (a.resumeOrder || 0) - (b.resumeOrder || 0))
            .forEach((project) => {
                const titleChildren = [];
                if (project.htmlUrl) {
                    titleChildren.push(createElement("a", {
                        text: project.title,
                        attributes: {
                            href: project.htmlUrl,
                            target: "_blank",
                            rel: "noopener noreferrer"
                        }
                    }));
                } else {
                    titleChildren.push(createElement("span", { text: project.title }));
                }

                if (project.status) {
                    titleChildren.push(createElement("span", {
                        text: project.status,
                        classes: ["project-status"]
                    }));
                }

                const projectCard = createElement("div", {
                    classes: ["project-card"],
                    children: [
                        createElement("div", {
                            classes: ["project-title"],
                            children: titleChildren
                        }),
                        createElement("div", {
                            text: project.resumeDescription || project.description,
                            classes: ["project-description"]
                        })
                    ]
                });

                projectsRoot.appendChild(projectCard);
            });
    };

    // Helper function to create the grouped skills matrix
    const createSkills = (skillsRoot, skillPayload) => {
        skillsRoot.innerHTML = "";
        (skillPayload?.categories || []).forEach((category) => {
            const categorySkills = category.skills || [];
            if (!categorySkills.length) { return; }

            const group = createElement("section", {
                classes: ["skill-group"],
                children: [
                    createElement("div", {
                        classes: ["skill-group-title"],
                        text: category.name
                    }),
                    createElement("div", {
                        classes: ["skill-list"],
                        children: [...categorySkills]
                            .toSorted((a, b) => (a.order || 0) - (b.order || 0))
                            .map((skill) => createElement("span", {
                                classes: ["skill-item"],
                                text: skill.name
                            }))
                    })
                ]
            });
            skillsRoot.appendChild(group);
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

        const techSkillsRoot = hiddenDiv.shadowRoot.querySelector(".technical-skills .skills-matrix");
        createSkills(techSkillsRoot, $skills);

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
        const getTextPositions = (element) => {
            const hostRect = element.getRootNode().host.getBoundingClientRect();

            const range = document.createRange();
            range.selectNodeContents(element);
            const elementRect = range.getBoundingClientRect();
            const lineRects = Array.from(range.getClientRects())
                .filter((rect) => rect.width > 0 && rect.height > 0)
                .reduce((lines, rect) => {
                    const line = lines.find((candidate) =>
                        Math.abs(candidate.top - rect.top) < 0.5
                    );
                    if (line) {
                        line.left = Math.min(line.left, rect.left);
                        line.right = Math.max(line.right, rect.right);
                        line.bottom = Math.max(line.bottom, rect.bottom);
                    } else {
                        lines.push({
                            left: rect.left,
                            top: rect.top,
                            right: rect.right,
                            bottom: rect.bottom
                        });
                    }
                    return lines;
                }, []);
            range.detach?.();

            const style = getComputedStyle(element);
            const fontSize = parseFloat(style.fontSize) * 1.075;
            const isBold = style.fontWeight === "bold" || parseInt(style.fontWeight, 10) >= 600;
            const isItalic = ["italic", "oblique"].includes(style.fontStyle);
            const pdfFontStyle = isBold && isItalic
                ? "bolditalic"
                : isBold
                    ? "bold"
                    : isItalic
                        ? "italic"
                        : "normal";
            const pdfFontFamily = /monospace/i.test(style.fontFamily)
                ? "courier"
                : "helvetica";
            const url = element.href || "";
            const normalizeText = (text) => text.replace(/\s+/g, " ").trim();
            const elementText = normalizeText(element.textContent);

            const pdfDescentRatio = pdfFontFamily === "courier" ? 0.194 : 0.207;
            // dom-to-image renders the inline span inside a padded project tag
            // about one text-line step above its live browser Range rectangle.
            // Other elements (including the flex-based skills/status pills) do
            // not exhibit this foreignObject baseline shift.
            const projectTag = element.closest(".project-tag");
            // A role-level tag row that follows project-level experience is
            // laid out one extra 10px step higher inside dom-to-image's SVG
            // foreignObject (the Epicor/Data Science row is the current case).
            // Calibrate that structural variant independently instead of
            // forcing every tag and ordinary text element onto one baseline.
            const followsProjectExperience = projectTag &&
                element.closest(".task-holder") &&
                element.closest(".company")?.querySelector(".exp_projects");
            const rasterBaselineAdjustment = projectTag
                ? -fontSize * (followsProjectExperience ? 1.5 : 0.72)
                : 0;
            const createPosition = (rect, text, separatorAfter = true) => ({
                left: rect.left - hostRect.left,
                // jsPDF positions text by its baseline, while the browser range
                // gives us the full rendered line box. Centre the PDF font box
                // inside that measured line box instead of treating its bottom
                // edge as the baseline (which shifts selections vertically).
                top: rect.top - hostRect.top +
                    ((rect.bottom - rect.top) - fontSize) / 2 +
                    fontSize * (1 - pdfDescentRatio) +
                    rasterBaselineAdjustment,
                linkTop: rect.top - hostRect.top,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top,
                fontSize,
                pdfFontFamily,
                pdfFontStyle,
                text,
                separatorAfter,
                semanticSeparator: element.matches(".skill-item") ||
                    Boolean(element.closest(".project-tag")),
                url
            });

            // Preserve the proven one-object-per-leaf behavior when the browser
            // renders the leaf on one visual line. Only wrapped leaves need the
            // more granular browser-line measurement below.
            if (lineRects.length <= 1) {
                return elementText
                    ? [createPosition(elementRect, elementText)]
                    : [];
            }

            const characters = [];
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let textNode;
            let sourceText = "";

            while ((textNode = walker.nextNode())) {
                const text = textNode.textContent || "";
                const nodeStart = sourceText.length;
                sourceText += text;

                for (let offset = 0; offset < text.length;) {
                    const character = String.fromCodePoint(text.codePointAt(offset));
                    const endOffset = offset + character.length;
                    const characterRange = document.createRange();
                    characterRange.setStart(textNode, offset);
                    characterRange.setEnd(textNode, endOffset);
                    const rect = characterRange.getBoundingClientRect();
                    characterRange.detach?.();

                    let lineIndex = -1;
                    if (rect.height > 0) {
                        lineIndex = lineRects.reduce((closest, line, index) => (
                            Math.abs(line.top - rect.top) < Math.abs(lineRects[closest].top - rect.top)
                                ? index
                                : closest
                        ), 0);
                    }

                    characters.push({
                        character,
                        sourceStart: nodeStart + offset,
                        sourceEnd: nodeStart + endOffset,
                        lineIndex
                    });
                    offset = endOffset;
                }
            }

            const fragments = lineRects.map((rect, lineIndex) => {
                const lineCharacters = characters.filter((character) =>
                    character.lineIndex === lineIndex
                );
                const firstCharacter = lineCharacters.find((character) =>
                    /\S/.test(character.character)
                );
                const lastCharacter = [...lineCharacters].reverse().find((character) =>
                    /\S/.test(character.character)
                );

                if (!firstCharacter || !lastCharacter) {
                    return null;
                }

                return {
                    ...createPosition(
                        rect,
                        normalizeText(lineCharacters.map(({ character }) => character).join(""))
                    ),
                    sourceStart: firstCharacter.sourceStart,
                    sourceEnd: lastCharacter.sourceEnd
                };
            }).filter(Boolean);

            return fragments.map((fragment, index) => {
                const nextFragment = fragments[index + 1];
                const separatorAfter = !nextFragment || /\s/.test(
                    sourceText.slice(fragment.sourceEnd, nextFragment.sourceStart)
                );

                const position = { ...fragment };
                delete position.sourceStart;
                delete position.sourceEnd;
                return { ...position, separatorAfter };
            });
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
            return { host: shadowRoot.host, shadowRoot };
        };

        const measurePageSearchables = ({ host, shadowRoot }) => {
            const searchables = [
                ...Array.from(shadowRoot.querySelectorAll("*"))
                    .filter(
                        (elem) =>
                            ["style"].indexOf(elem.tagName.toLowerCase()) === -1 &&
                            elem.innerText &&
                            elem.innerText.trim().length > 0 &&
                            elem.childElementCount === 0
                    )
            ].flatMap((elem) => getTextPositions(elem));
            const positionedSearchables = searchables.map((searchable, index) => {
                const next = searchables[index + 1];
                const nextIsOnSameLine = next &&
                    Math.abs(searchable.linkTop - next.linkTop) < 0.5;
                const horizontalGap = next
                    ? next.left - (searchable.left + searchable.width)
                    : Infinity;
                const nextIsInline = Boolean(nextIsOnSameLine &&
                    horizontalGap >= -0.5 &&
                    horizontalGap <= Math.max(6, searchable.fontSize * 0.5));
                return {
                    ...searchable,
                    // Semantic chips/cells keep an ATS separator even when CSS
                    // margins put them beyond the generic inline-gap threshold.
                    // Other elements only join genuinely adjacent inline text;
                    // a shared Y coordinate alone is not enough for columns.
                    separatorAfter: searchable.separatorAfter &&
                        (searchable.semanticSeparator || nextIsInline)
                };
            });
            return { host, shadowRoot, searchables: positionedSearchables };
        };

        const splitPages = async () => {
            const containerNode = hiddenDiv.shadowRoot.querySelector(".container");
            const header = containerNode.querySelector(".header").cloneNode(true);
            const experience = containerNode.querySelector(".experience").cloneNode(true);
            const projects = containerNode.querySelector(".projects").cloneNode(true);
            const skills = containerNode.querySelector(".skills").cloneNode(true);
            const education = containerNode.querySelector(".education").cloneNode(true);
            const achievements = containerNode.querySelector(".achievements").cloneNode(true);
            const footer = containerNode.querySelector(".footer").cloneNode(true);

            const pages = [
                [header, experience],
                [projects, skills],
                [education, achievements, footer]
            ].map((elements, idx) => createPage(elements, idx));
            // The raster and searchable text must be measured from the exact same
            // settled layout. Cloned icons can change header/section geometry
            // after insertion, which previously left later text boxes displaced.
            await Promise.all(pages.flatMap(({ shadowRoot }) =>
                Array.from(shadowRoot.querySelectorAll("img")).map(async (img) => {
                    try {
                        await img.decode?.();
                    } catch (error) {
                        // A failed decorative icon must not block PDF generation.
                    }
                })
            ));
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }
            await new Promise((resolve) => requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            ));
            const measuredPages = pages.map(measurePageSearchables);
            const pageObjects = await Promise.all(measuredPages.map(async (page) => {
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
            pdf.setCharSpace(0);
            pageObjects.forEach((page, i) => {
                pdf.addImage(page.url, "PNG", 0, 0, page.width, page.height);
                page.searchables.forEach((searchable) => {
                    pdf.setFont(searchable.pdfFontFamily, searchable.pdfFontStyle);
                    pdf.setFontSize(searchable.fontSize);
                    try {
                        const searchableText = searchable.separatorAfter
                            ? `${searchable.text} `
                            : searchable.text;
                        // Include the separator in the width calculation. It is
                        // part of the PDF text item, so excluding it made Chrome's
                        // selection highlight overrun every measured browser rect.
                        const naturalWidth = pdf.getTextWidth(searchableText);
                        const horizontalScale = naturalWidth > 0
                            ? searchable.width / naturalWidth
                            : 1;

                        pdf.text(searchableText, searchable.left, searchable.top, {
                            renderingMode: "invisible",
                            horizontalScale
                        });
                        if (searchable.url) {
                            pdf.link(
                                searchable.left,
                                searchable.linkTop,
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
        $projects.some((project) => (project.resumeOrder || 0) > 0) &&
        $skills?.categories?.some((category) => category.skills?.length) &&
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
            role="button"
            tabindex="0"
            aria-label="Download resume as PDF"
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
