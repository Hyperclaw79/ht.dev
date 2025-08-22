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

// Mock window.matchMedia (only if window exists - for browser tests)
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: function(query) {
            return {
                matches: false,
                media: query,
                onchange: null,
                addListener: function() {}, // deprecated
                removeListener: function() {}, // deprecated
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() {},
            };
        },
    });
}

// Mock HTMLCanvasElement to prevent jsPDF issues (only if available)
if (typeof global !== 'undefined' && global.HTMLCanvasElement) {
    global.HTMLCanvasElement.prototype.getContext = () => ({
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: new Array(4) }),
        putImageData: () => {},
        createImageData: () => ({ data: new Array(4) }),
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {}
    });
}

// Mock TagCloud globally for TextSphere component tests (only if global object exists)
if (typeof global !== 'undefined') {
    global.TagCloud = function(selector, tags, options) {
        // Reset calls array if this is first call in a test
        if (!global.TagCloud.calls) {
            global.TagCloud.calls = [];
        }
        global.TagCloud.calls.push({ selector, tags, options });
        
        // Create mock DOM elements to simulate TagCloud behavior (only in DOM environments)
        if (typeof document !== 'undefined') {
            const container = document.querySelector(selector);
            if (container && tags?.length > 0 && typeof container.appendChild === 'function') {
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
        }
        
        return {
            destroy: function() {},
            update: function() {}
        };
    };

    // Add reset function for tests
    global.TagCloud.resetCalls = function() {
        global.TagCloud.calls = [];
    };
}