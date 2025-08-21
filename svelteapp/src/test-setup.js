/**
 * Jest setup file for proper mocking and test environment configuration
 */

// Setup Jest DOM
import '@testing-library/jest-dom';

// Mock IntersectionObserver - Note: jest is not available here, so we use simple functions
const mockIntersectionObserver = function(callback, options) {
    return {
        observe: function() {},
        unobserve: function() {},
        disconnect: function() {},
        callback: callback,
        options: options
    };
};
global.IntersectionObserver = mockIntersectionObserver;

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
    // Mock window dimensions and other browser APIs
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
}