<script>
    import { getContext } from "svelte";

    const { skills } = Object.fromEntries(getContext("api"));
    export let inview = false;

    let activeIndex = 1;
    let overview = false;
    let searchQuery = "";
    let searchInput;

    $: categories = Array.isArray($skills?.categories)
        ? $skills.categories
        : [];
    $: totalSkills =
        Number($skills?.totalSkills) ||
        categories.reduce(
            (total, category) => total + (category.skills?.length || 0),
            0
        );
    $: if (categories.length && activeIndex >= categories.length) {
        activeIndex = 0;
    }
    $: activeCategory = categories[activeIndex] || categories[0];
    $: query = searchQuery.trim().toLowerCase();
    $: searchResults = query
        ? categories.flatMap((category, categoryIndex) =>
            (category.skills || [])
                .filter(
                    (skill) =>
                        skill.name.toLowerCase().includes(query) ||
                          category.name.toLowerCase().includes(query)
                )
                .map((skill) => ({ skill, category, categoryIndex }))
        )
        : [];
    $: mode = query ? "search" : overview ? "overview" : "category";

    const selectCategory = (index) => {
        activeIndex = index;
        overview = false;
        searchQuery = "";
    };

    const showOverview = () => {
        overview = true;
        searchQuery = "";
    };

    const handleKeydown = (event) => {
        if (event.key === "/" && document.activeElement !== searchInput) {
            event.preventDefault();
            searchInput?.focus();
        }
        if (event.key === "Escape") {
            searchQuery = "";
            overview = false;
            searchInput?.blur();
        }
    };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if categories.length}
    <div class="container">
        <header class="hero">
            <h1 class="font-effect-anaglyph">SKILLS</h1>
            <div class="hero-meta">
                <div class="count-badge">
                    <strong>{totalSkills}</strong> skills ·
                    <strong>{categories.length}</strong> categories
                </div>
                <label class="search">
                    <input
                        bind:this={searchInput}
                        bind:value={searchQuery}
                        autocomplete="off"
                        placeholder="filter skills..."
                        aria-label="Filter skills"
                    />
                    <kbd>/</kbd>
                </label>
            </div>
        </header>

        <section class="skills-shell" class:inview>
            <aside class="rail" aria-label="Skill categories">
                <div class="rail-label">Category index</div>
                {#each categories as category, index}
                    <button
                        type="button"
                        class="category"
                        class:active={mode === "category" &&
                            index === activeIndex}
                        aria-pressed={mode === "category" &&
                            index === activeIndex}
                        on:click={() => selectCategory(index)}
                    >
                        <span class="idx"
                            >{String(index + 1).padStart(2, "0")}</span
                        >
                        <span class="name group-title">{category.name}</span>
                        <span class="num"
                            >{String(category.skills?.length || 0).padStart(
                                2,
                                "0"
                            )}</span
                        >
                    </button>
                {/each}
                <button
                    type="button"
                    class="overview-btn"
                    class:active={mode === "overview"}
                    on:click={showOverview}
                >
                    Overview / all categories
                </button>
            </aside>

            <section class="stage">
                <div class="stage-head">
                    <div>
                        {#if mode === "search"}
                            <div class="eyebrow">SEARCH / LIVE</div>
                            <h2 class="stage-title">
                                {searchResults.length} Match{searchResults.length ===
                                1
                                    ? ""
                                    : "es"}
                            </h2>
                        {:else if mode === "overview"}
                            <div class="eyebrow">INDEX / ALL</div>
                            <h2 class="stage-title">Skill Map</h2>
                        {:else}
                            <div class="eyebrow">
                                CATEGORY / {String(activeIndex + 1).padStart(
                                    2,
                                    "0"
                                )}
                            </div>
                            <h2 class="stage-title">{activeCategory?.name}</h2>
                        {/if}
                    </div>

                    <p class="stage-copy">
                        {#if mode === "search"}
                            Filtering across <b
                                >all {categories.length} categories</b
                            >
                            for “{searchQuery}”.
                        {:else if mode === "overview"}
                            <b>{totalSkills} skills</b> across {categories.length}
                            engineering categories. Choose a panel to drill in.
                        {:else}
                            <b>{activeCategory?.skills?.length || 0} skills</b> in
                            the selected category. Click another category or type
                            to filter across everything.
                        {/if}
                    </p>
                </div>

                {#if mode === "overview"}
                    <div class="overview-grid">
                        {#each categories as category, index}
                            <button
                                type="button"
                                class="overview-card"
                                on:click={() => selectCategory(index)}
                            >
                                <h3>
                                    <span
                                        >{String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}</span
                                    >{category.name}
                                </h3>
                                <p>
                                    {(category.skills || [])
                                        .slice(0, 3)
                                        .map((skill) => skill.name)
                                        .join(" · ")}{category.skills?.length >
                                    3
                                            ? " · …"
                                            : ""}
                                </p>
                                <div class="overview-count">
                                    {category.skills?.length || 0} skills →
                                </div>
                            </button>
                        {/each}
                    </div>
                {:else}
                    <div class="skill-grid">
                        {#if mode === "search"}
                            {#each searchResults as result, index}
                                <button
                                    type="button"
                                    class="skill-card skill"
                                    style={`--delay:${index * 35}ms`}
                                    on:click={() =>
                                        selectCategory(result.categoryIndex)}
                                >
                                    <span class="skill-no"
                                        >{result.category.name.toUpperCase()}</span
                                    >
                                    <span class="skill-name"
                                        >{result.skill.name}</span
                                    >
                                    <i class="dot"></i>
                                </button>
                            {:else}
                                <div class="empty">
                                    No skills matched that filter.
                                </div>
                            {/each}
                        {:else if activeCategory}
                            {#each activeCategory.skills || [] as skill, index}
                                <article
                                    class="skill-card skill"
                                    style={`--delay:${index * 42}ms`}
                                >
                                    <span class="skill-no"
                                        >{String(index + 1).padStart(
                                            2,
                                            "0"
                                        )}</span
                                    >
                                    <span class="skill-name">{skill.name}</span>
                                    <i class="dot"></i>
                                </article>
                            {/each}
                        {/if}
                    </div>
                {/if}

                <div class="hint">
                    click a category · hover a skill · press / to search
                </div>
            </section>
        </section>
    </div>
{/if}

<style>
    .container {
        width: min(86vw, 1240px);
        margin: 0 auto;
        padding-bottom: 2rem;
        color: #f4f4f4;
    }
    .hero {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 2rem;
        margin-bottom: 1.4rem;
    }
    .hero h1 {
        margin-bottom: 0;
    }
    .hero-meta {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding-bottom: 0.35rem;
    }
    .count-badge {
        display: flex;
        align-items: baseline;
        gap: 0.42rem;
        color: #8f8f8f;
        font:
            700 0.72rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        white-space: nowrap;
    }
    .count-badge strong {
        color: #f4f4f4;
        font-size: 1.15rem;
        letter-spacing: 0;
    }
    .search {
        width: 250px;
        position: relative;
    }
    .search input {
        width: 100%;
        padding: 0.68rem 2.35rem 0.68rem 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        outline: none;
        background: #151515;
        color: #f4f4f4;
        font:
            600 0.75rem/1.2 "M PLUS 1 Code",
            monospace;
        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
    }
    .search input:focus {
        border-color: var(--theme-primary);
        background: #191414;
        box-shadow: 0 0 0 3px
            color-mix(in srgb, var(--theme-primary) 10%, transparent);
    }
    .search kbd {
        position: absolute;
        right: 0.55rem;
        top: 0.5rem;
        padding: 0.2rem 0.38rem;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 3px;
        color: #8f8f8f;
        background: #202020;
        font:
            700 0.62rem/1 "M PLUS 1 Code",
            monospace;
    }
    .skills-shell {
        position: relative;
        display: grid;
        grid-template-columns: 252px 1fr;
        min-height: 690px;
        border: 1px solid color-mix(in srgb, var(--theme-primary) 62%, #333);
        border-radius: 8px;
        overflow: hidden;
        background: linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.018),
                transparent 48%
            ),
            #171717;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.34);
        opacity: 0;
        transform: translateY(1.25rem);
        transition:
            opacity 350ms ease,
            transform 350ms ease;
        user-select: none;
    }
    .skills-shell.inview {
        opacity: 1;
        transform: none;
    }
    .skills-shell::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(
            110deg,
            transparent 0 63%,
            color-mix(in srgb, var(--theme-primary) 3%, transparent) 63% 65%,
            transparent 65% 100%
        );
    }
    .rail {
        position: relative;
        z-index: 2;
        padding: 1.25rem 0;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        background: #131313;
    }
    .rail-label {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        margin: 0 1.1rem 0.9rem;
        color: #7c7c7c;
        font:
            800 0.62rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.16em;
        text-transform: uppercase;
    }
    .rail-label::before {
        content: "";
        width: 24px;
        height: 2px;
        background: var(--theme-primary);
    }
    .category {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: 30px 1fr auto;
        align-items: center;
        gap: 0.6rem;
        min-height: 53px;
        padding: 0 1.1rem;
        border: 0;
        border-left: 3px solid transparent;
        background: transparent;
        color: #b8b8b8;
        cursor: pointer;
        text-align: left;
        transition:
            background 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease;
    }
    .category + .category {
        border-top: 1px solid rgba(255, 255, 255, 0.035);
    }
    .category:hover {
        color: #fff;
        background: color-mix(in srgb, var(--theme-primary) 7%, transparent);
        transform: translateX(3px);
    }
    .category.active {
        color: #fff;
        border-left-color: var(--theme-primary);
        background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--theme-primary) 24%, transparent),
            color-mix(in srgb, var(--theme-primary) 6%, transparent) 75%,
            transparent
        );
    }
    .idx,
    .num {
        color: #5f5f5f;
        font:
            800 0.62rem/1 "M PLUS 1 Code",
            monospace;
    }
    .category.active .idx {
        color: var(--theme-primary);
    }
    .category.active .num {
        color: #d7d7d7;
    }
    .num {
        min-width: 26px;
        text-align: right;
    }
    .name {
        color: inherit;
        font:
            800 0.75rem/1.1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.07em;
        text-transform: uppercase;
    }
    .overview-btn {
        margin: 1.1rem 1.1rem 0;
        width: calc(100% - 2.2rem);
        padding: 0.65rem 0.75rem;
        border-radius: 4px;
        border: 1px solid
            color-mix(in srgb, var(--theme-primary) 42%, transparent);
        background: color-mix(in srgb, var(--theme-primary) 6%, transparent);
        color: #bdbdbd;
        cursor: pointer;
        font:
            800 0.62rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        transition: 0.2s ease;
    }
    .overview-btn:hover,
    .overview-btn.active {
        color: white;
        border-color: var(--theme-primary);
        background: color-mix(in srgb, var(--theme-primary) 15%, transparent);
    }
    .stage {
        position: relative;
        z-index: 1;
        min-width: 0;
        padding: 2rem 2.1rem 2.2rem;
        overflow: hidden;
        background: #171717;
    }
    .stage::before {
        content: "";
        position: absolute;
        width: 420px;
        height: 420px;
        right: -170px;
        top: -180px;
        border: 1px solid
            color-mix(in srgb, var(--theme-primary) 15%, transparent);
        border-radius: 50%;
        box-shadow:
            0 0 0 44px
                color-mix(in srgb, var(--theme-primary) 2.5%, transparent),
            0 0 0 88px color-mix(in srgb, var(--theme-primary) 2%, transparent);
        pointer-events: none;
    }
    .stage-head {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 1.8rem;
        min-height: 98px;
        margin-bottom: 1.6rem;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .eyebrow {
        color: var(--theme-primary);
        font:
            800 0.68rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        margin-bottom: 0.65rem;
    }
    .stage-title {
        margin: 0;
        color: #fff;
        font-size: clamp(1.55rem, 2.2vw, 2.2rem);
        line-height: 1;
        letter-spacing: -0.03em;
        font-weight: 900;
        text-transform: uppercase;
    }
    .stage-copy {
        max-width: 330px;
        margin: 0 0 2px;
        color: #858585;
        font:
            600 0.75rem/1.55 "M PLUS 1 Code",
            monospace;
        text-align: right;
    }
    .stage-copy b {
        color: #ddd;
    }
    .skill-grid {
        position: relative;
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-auto-rows: 82px;
        gap: 12px;
    }
    .skill-card {
        --delay: 0ms;
        position: relative;
        min-width: 0;
        grid-column: span 4;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.9rem 0.95rem 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.085);
        border-radius: 5px;
        overflow: hidden;
        background: linear-gradient(
                155deg,
                rgba(255, 255, 255, 0.032),
                transparent 58%
            ),
            #1d1d1d;
        color: inherit;
        text-align: left;
        cursor: default;
        opacity: 0;
        transform: translateY(8px) scale(0.985);
        animation: enter 0.36s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        animation-delay: var(--delay);
        transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
    }
    button.skill-card {
        cursor: pointer;
    }
    .skill-card::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background: var(--theme-primary);
        transition: width 0.18s ease;
    }
    .skill-card::after {
        content: "";
        position: absolute;
        left: -30%;
        top: 0;
        width: 20%;
        height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            var(--theme-primary),
            transparent
        );
        opacity: 0;
    }
    .skill-card:hover {
        transform: translateY(-4px);
        border-color: color-mix(in srgb, var(--theme-primary) 68%, white);
        background: linear-gradient(
                155deg,
                color-mix(in srgb, var(--theme-primary) 12%, transparent),
                transparent 58%
            ),
            #202020;
        box-shadow:
            0 12px 24px rgba(0, 0, 0, 0.26),
            0 0 22px color-mix(in srgb, var(--theme-primary) 6%, transparent);
    }
    .skill-card:hover::before {
        width: 5px;
    }
    .skill-card:hover::after {
        opacity: 1;
        animation: scan 1.3s linear infinite;
    }
    .skill-no {
        color: #666;
        font:
            800 0.56rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.12em;
    }
    .skill-name {
        max-width: 96%;
        color: #dedede;
        font:
            800 0.92rem/1.16 "M PLUS 1 Code",
            monospace;
        letter-spacing: -0.02em;
    }
    .skill-card:hover .skill-name {
        color: #fff;
    }
    .dot {
        position: absolute;
        width: 4px;
        height: 4px;
        right: 10px;
        top: 10px;
        border-radius: 50%;
        background: #474747;
        box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.02);
    }
    .skill-card:hover .dot {
        background: var(--theme-primary);
        box-shadow: 0 0 10px
            color-mix(in srgb, var(--theme-primary) 55%, transparent);
    }
    .overview-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
    }
    .overview-card {
        min-height: 126px;
        padding: 0.95rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 5px;
        background: #1b1b1b;
        color: inherit;
        cursor: pointer;
        text-align: left;
        transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
    }
    .overview-card:hover {
        transform: translateY(-4px);
        border-color: color-mix(in srgb, var(--theme-primary) 68%, white);
        background: linear-gradient(
            150deg,
            color-mix(in srgb, var(--theme-primary) 10%, transparent),
            #1b1b1b 58%
        );
    }
    .overview-card h3 {
        margin: 0 0 0.75rem;
        color: #fff;
        font:
            900 0.8rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .overview-card h3 span {
        color: var(--theme-primary);
        margin-right: 0.5rem;
    }
    .overview-card p {
        margin: 0;
        color: #7f7f7f;
        font:
            600 0.68rem/1.55 "M PLUS 1 Code",
            monospace;
    }
    .overview-count {
        margin-top: 0.9rem;
        color: #c9c9c9;
        font:
            800 0.62rem/1 "M PLUS 1 Code",
            monospace;
    }
    .empty {
        grid-column: 1 / -1;
        padding: 3.75rem 1.25rem;
        color: #777;
        text-align: center;
        font:
            700 0.75rem/1.5 "M PLUS 1 Code",
            monospace;
    }
    .hint {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.8rem;
        color: #555;
        font:
            700 0.56rem/1 "M PLUS 1 Code",
            monospace;
        letter-spacing: 0.11em;
        text-transform: uppercase;
    }
    @keyframes enter {
        to {
            opacity: 1;
            transform: none;
        }
    }
    @keyframes scan {
        from {
            left: -30%;
        }
        to {
            left: 118%;
        }
    }
    @media screen and (max-width: 900px) {
        .container {
            width: 94vw;
        }
        .hero {
            align-items: flex-start;
            flex-direction: column;
        }
        .hero-meta {
            width: 100%;
            justify-content: space-between;
        }
        .skills-shell {
            grid-template-columns: 1fr;
        }
        .rail {
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-wrap: wrap;
            padding: 0.5rem;
        }
        .rail-label {
            display: none;
        }
        .category {
            width: auto;
            min-height: 40px;
            grid-template-columns: auto;
            padding: 0 0.65rem;
            border-left: 0;
            border-bottom: 2px solid transparent;
        }
        .category .idx,
        .category .num {
            display: none;
        }
        .category.active {
            border-bottom-color: var(--theme-primary);
        }
        .overview-btn {
            width: auto;
            margin: 0;
        }
        .stage {
            padding: 1.5rem 1.1rem 1.75rem;
        }
        .stage-head {
            align-items: flex-start;
            flex-direction: column;
        }
        .stage-copy {
            text-align: left;
        }
        .skill-card {
            grid-column: span 6;
        }
        .overview-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    @media screen and (max-width: 560px) {
        .hero-meta {
            align-items: stretch;
            flex-direction: column;
        }
        .search {
            width: 100%;
        }
        .count-badge {
            justify-content: center;
        }
        .skill-card {
            grid-column: 1 / -1;
        }
        .overview-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
