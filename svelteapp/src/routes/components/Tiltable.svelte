<script>
    const clickCallback = (e) => {
        const { x, y } = e;
        let elems = document.elementsFromPoint(x, y);
        elems = elems.filter(
            elem => !elem.classList.contains("tilting-card-content") &&
                    !elem.classList.contains("mouse-position-tracker") &&
                    !elem.classList.contains("tracker")
        );
        elems.sort((a, b) => {
            if (a.tagName === "BUTTON" || a.tagName === "A" || a.tagName === "INPUT") {
                return -1;
            } else if (b.tagName === "BUTTON" || b.tagName === "A" || b.tagName === "INPUT") {
                return 1;
            } else {
                return 0;
            }
        });
        if (elems.length > 0) {
            /* eslint no-empty: ["error", { allowEmptyCatch: true }] */
            try {
                elems[0].click();
            } catch (e) { }
        }
    };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="tilting-card-content" on:click={clickCallback}>
    <slot />

    <div class="mouse-position-tracker">
        {#each { length: 9 } as _}
            <div class="tracker" />
        {/each}
    </div>
</div>

<style>
    .tilting-card-content {
        --perspective: 1000px;
        --rotateX: 0;
        --rotateY: 0;
        --angle: 5deg;
        position: relative;
        display: inherit;
        transform: perspective(var(--perspective)) rotateX(var(--rotateX))
            rotateY(var(--rotateY));
        transition: transform 350ms ease;
    }

    .mouse-position-tracker {
        position: absolute;
        inset: 0;
    }

    .mouse-position-tracker > div {
        position: absolute;
        width: calc(100% / 3);
        height: calc(100% / 3);
        z-index: 2;
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(1):hover) {
        --rotateX: var(--angle);
        --rotateY: calc(var(--angle) * -1);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(2):hover) {
        --rotateX: var(--angle);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(3):hover) {
        --rotateX: var(--angle);
        --rotateY: var(--angle);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(4):hover) {
        --rotateY: calc(var(--angle) * -1);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(6):hover) {
        --rotateY: var(--angle);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(7):hover) {
        --rotateX: calc(var(--angle) * -1);
        --rotateY: calc(var(--angle) * -1);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(8):hover) {
        --rotateX: calc(var(--angle) * -1);
    }

    .tilting-card-content:has(.mouse-position-tracker
            > div:nth-child(9):hover) {
        --rotateX: calc(var(--angle) * -1);
        --rotateY: var(--angle);
    }

    /* 1st, 4th, 7th */
    .mouse-position-tracker > div:nth-of-type(3n - 2) {
        left: 0;
    }

    /* 2nd, 5th, 8th */
    .mouse-position-tracker > div:nth-of-type(3n - 1) {
        left: calc(100% / 3);
    }

    /* 3rd, 6th, 9th */
    .mouse-position-tracker > div:nth-of-type(3n) {
        right: 0;
    }

    /* 1-3 */
    .mouse-position-tracker > div:nth-child(n + 1):nth-child(-n + 3) {
        top: 0;
    }

    /* 4-6 */
    .mouse-position-tracker > div:nth-child(n + 4):nth-child(-n + 6) {
        top: calc(100% / 3);
    }

    /* 7-9 */
    .mouse-position-tracker > div:nth-child(n + 7):nth-child(-n + 9) {
        bottom: 0;
    }
</style>
