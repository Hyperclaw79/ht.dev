// Simple test setup for console mocking and global test utilities
import '@testing-library/jest-dom';

// Mock console methods to prevent test output noise
const originalConsole = global.console;
global.console = {
    ...originalConsole,
    log: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {}
};

// Restore console for debugging if needed
global.restoreConsole = () => {
    global.console = originalConsole;
};

// Mock TagCloud globally for TextSphere component tests
if (typeof global.TagCloud === 'undefined') {
    global.TagCloud = function(selector, tags, options) {
        // Track calls for testing
        if (!global.TagCloud.calls) {
            global.TagCloud.calls = [];
        }
        global.TagCloud.calls.push({ selector, tags, options });
        
        // Create mock DOM elements to simulate TagCloud behavior
        const container = document.querySelector(selector);
        if (container && tags?.length > 0) {
            // Clear existing items
            container.innerHTML = '';
            
            // Create mock tagcloud items
            tags.forEach((tag, index) => {
                const item = document.createElement('span');
                item.className = 'tagcloud--item';
                item.textContent = tag;
                item.style.color = ''; // Will be set by component
                container.appendChild(item);
            });
        }
        
        return {
            destroy: function() {},
            update: function() {}
        };
    };
}