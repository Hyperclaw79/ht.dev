/**
 * Jest setup file for proper mocking and test environment configuration
 */

// Setup Jest DOM
import '@testing-library/jest-dom';

// Store original console for potential restoration
const originalConsole = global.console;

// Mock console methods to prevent output during tests  
global.console = {
    ...originalConsole,
    log: () => {},
    error: () => {},
    warn: () => {},
    info: () => {},
    debug: () => {},
};

// Restore console for debugging if needed
global.restoreConsole = () => {
    global.console = originalConsole;
};

// Mock IntersectionObserver - Now checking if jest is available
if (typeof jest !== 'undefined') {
    // Use proper Jest mocking when available
    global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        callback,
        options
    }));
} else {
    // Fallback for when jest is not available in setup
    global.IntersectionObserver = function(callback, options) {
        return {
            observe: function() {},
            unobserve: function() {},
            disconnect: function() {},
            callback,
            options
        };
    };
}

// Mock AudioContext
const mockAudioContext = function() {
    return {
        createOscillator: function() {
            return {
                connect: function() {},
                start: function() {},
                stop: function() {},
                frequency: { setTargetAtTime: function() {} }
            };
        },
        createGain: function() {
            return {
                connect: function() {},
                gain: { setTargetAtTime: function() {} }
            };
        },
        destination: {}
    };
};

global.AudioContext = mockAudioContext;
global.webkitAudioContext = mockAudioContext;

// Only set up window/DOM mocks if we're in a browser environment
if (typeof window !== 'undefined') {
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = function() {
        return {
            width: 120,
            height: 120,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            x: 0,
            y: 0,
            toJSON: function() {}
        };
    };

    // Mock requestAnimationFrame
    global.requestAnimationFrame = function(cb) { 
        return setTimeout(cb, 0); 
    };
    global.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: function(query) {
            return {
                matches: false,
                media: query,
                onchange: null,
                addListener: function() {},
                removeListener: function() {},
                addEventListener: function() {},
                removeEventListener: function() {},
                dispatchEvent: function() {},
            };
        },
    });
}