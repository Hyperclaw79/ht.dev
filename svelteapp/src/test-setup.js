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