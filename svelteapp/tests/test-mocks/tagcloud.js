// Mock TagCloud module for testing
const TagCloud = function (selector, tags, options) {
    // Reset calls array if this is first call in a test
    if (!TagCloud.calls) {
        TagCloud.calls = [];
    }
    TagCloud.calls.push({ selector, tags, options });

    // Create mock DOM elements to simulate TagCloud behavior
    if (typeof selector === "string") {
        const container = document.querySelector(selector);
        if (container && tags?.length > 0 && typeof container.appendChild === "function") {
            // Clear existing items
            container.innerHTML = "";

            // Create the tagcloud div that would normally be created by TagCloud library
            const tagcloudDiv = document.createElement("div");
            tagcloudDiv.className = "tagcloud";

            // Create mock tagcloud items
            tags.forEach((tag, index) => {
                const item = document.createElement("span");
                item.className = "tagcloud--item";
                item.textContent = tag;
                item.style.color = ""; // Will be set by component
                tagcloudDiv.appendChild(item);
            });

            container.appendChild(tagcloudDiv);
        }
    }

    return {
        destroy: function () {},
        update: function () {}
    };
};

// Add reset function for tests
TagCloud.resetCalls = function () {
    TagCloud.calls = [];
};

export default TagCloud;
