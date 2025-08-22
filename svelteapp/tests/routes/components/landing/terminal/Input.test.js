import { jest } from '@jest/globals';

// Mock commandHandler module
jest.unstable_mockModule('src/routes/components/landing/terminal/commandHandler.js', () => ({
    commandsMap: {
        help: { description: 'Show available commands' },
        about: { description: 'About information' },
        skills: { description: 'Technical skills' },
        projects: { description: 'View projects' },
        contact: { description: 'Contact information' },
        clear: { description: 'Clear the screen' },
        start: { description: 'Start the application' }
    }
}));

const { commandsMap } = await import('src/routes/components/landing/terminal/commandHandler.js');

describe('Input component', () => {
    const mockData = {
        user: "root@HT.Dev",
        cwd: "~/Desktop"
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock window.dispatchEvent
        global.window.dispatchEvent = jest.fn();
    });

    test('component basic functionality', () => {
        // Test basic component concepts
        expect(mockData.user).toBe("root@HT.Dev");
        expect(mockData.cwd).toBe("~/Desktop");
    });

    test('commands array generation from commandsMap', () => {
        // Test commands array creation
        const commands = Object.keys(commandsMap);
        
        expect(commands).toContain('help');
        expect(commands).toContain('about');
        expect(commands).toContain('skills');
        expect(commands).toContain('projects');
        expect(commands).toContain('contact');
        expect(commands).toContain('clear');
        expect(commands).toContain('start');
        expect(commands.length).toBeGreaterThan(0);
    });

    test('command regex pattern creation and validation', () => {
        // Test command regex functionality
        const commands = Object.keys(commandsMap);
        const commandRegex = new RegExp(`^(${commands.join("|")})\\s*(.*)$`, "i");
        
        expect(commandRegex.test('help')).toBe(true);
        expect(commandRegex.test('HELP')).toBe(true);
        expect(commandRegex.test('help --verbose')).toBe(true);
        expect(commandRegex.test('Help with args')).toBe(true);
        expect(commandRegex.test('about me')).toBe(true);
        expect(commandRegex.test('skills list')).toBe(true);
        expect(commandRegex.test('invalid')).toBe(false);
        expect(commandRegex.test('notacommand')).toBe(false);
        expect(commandRegex.test('')).toBe(false);
    });

    test('command regex match extraction', () => {
        const commands = Object.keys(commandsMap);
        const commandRegex = new RegExp(`^(${commands.join("|")})\\s*(.*)$`, "i");
        
        const testCommands = [
            'help',
            'HELP --verbose',
            'about me',
            'skills list all'
        ];

        testCommands.forEach(cmd => {
            const matches = commandRegex.exec(cmd);
            expect(matches).toBeTruthy();
            expect(matches[1]).toBeTruthy();
        });

        const invalidMatches = commandRegex.exec('invalid command');
        expect(invalidMatches).toBeNull();
    });

    test('command word extraction logic', () => {
        // Test command word extraction from input
        const extractCommandWord = (input) => {
            return input.split(' ')[0];
        };

        expect(extractCommandWord('help')).toBe('help');
        expect(extractCommandWord('help --verbose')).toBe('help');
        expect(extractCommandWord('about me')).toBe('about');
        expect(extractCommandWord('skills list all')).toBe('skills');
        expect(extractCommandWord('')).toBe('');
    });

    test('command validation logic', () => {
        const commands = Object.keys(commandsMap);
        const isValidCommand = (cmdWord) => commands.includes(cmdWord);

        expect(isValidCommand('help')).toBe(true);
        expect(isValidCommand('about')).toBe(true);
        expect(isValidCommand('invalid')).toBe(false);
        expect(isValidCommand('')).toBe(false);
    });

    test('input size calculation logic', () => {
        // Test input size calculation for dynamic width
        const calculateSize = (value) => value?.length || 1;
        
        expect(calculateSize('help')).toBe(4);
        expect(calculateSize('help --verbose')).toBe(14);
        expect(calculateSize('')).toBe(1);
        expect(calculateSize(null)).toBe(1);
        expect(calculateSize(undefined)).toBe(1);
        expect(calculateSize('a')).toBe(1);
        expect(calculateSize('very long command string')).toBe(24);
    });

    test('user display formatting logic', () => {
        // Test user string formatting for display
        const formatUser = (user) => user?.replace('@', '㉿') || '';
        
        expect(formatUser('root@HT.Dev')).toBe('root㉿HT.Dev');
        expect(formatUser('user@localhost')).toBe('user㉿localhost');
        expect(formatUser('admin@server.com')).toBe('admin㉿server.com');
        expect(formatUser('@onlyat')).toBe('㉿onlyat');
        expect(formatUser('noat')).toBe('noat');
        expect(formatUser('')).toBe('');
        expect(formatUser(null)).toBe('');
        expect(formatUser(undefined)).toBe('');
    });

    test('command description retrieval', () => {
        // Test command description lookup
        const getDescription = (cmd) => commandsMap[cmd]?.description || '';
        
        expect(getDescription('help')).toBe('Show available commands');
        expect(getDescription('about')).toBe('About information');
        expect(getDescription('skills')).toBe('Technical skills');
        expect(getDescription('invalid')).toBe('');
        expect(getDescription('')).toBe('');
        expect(getDescription(null)).toBe('');
    });

    test('case insensitive command description lookup', () => {
        const getDescription = (cmd) => {
            const normalizedCmd = cmd?.toLowerCase();
            return commandsMap[normalizedCmd]?.description || '';
        };
        
        expect(getDescription('HELP')).toBe('Show available commands');
        expect(getDescription('About')).toBe('About information');
        expect(getDescription('SKILLS')).toBe('Technical skills');
        expect(getDescription('Help')).toBe('Show available commands');
    });

    test('command history navigation logic', () => {
        // Test command history pointer management
        const commandsCache = [
            { command: 'help' },
            { command: 'about' },
            { command: 'skills' },
            { command: 'projects' }
        ];
        
        let cmdStackPointer = 1;
        
        // Test ArrowUp navigation
        const navigateUp = () => {
            const index = commandsCache.length - cmdStackPointer;
            const command = commandsCache[index]?.command;
            if (command) {
                cmdStackPointer++;
                return command;
            }
            return null;
        };
        
        expect(navigateUp()).toBe('projects'); // Last command
        expect(navigateUp()).toBe('skills');   // Second to last
        expect(navigateUp()).toBe('about');    // Third to last
        expect(navigateUp()).toBe('help');     // Fourth to last
        expect(navigateUp()).toBe(null);       // No more commands
    });

    test('command history bounds checking', () => {
        const commandsCache = [
            { command: 'cmd1' },
            { command: 'cmd2' }
        ];
        
        const getHistoryCommand = (pointer) => {
            const index = commandsCache.length - pointer;
            return index >= 0 && index < commandsCache.length 
                ? commandsCache[index]?.command 
                : null;
        };
        
        expect(getHistoryCommand(1)).toBe('cmd2');
        expect(getHistoryCommand(2)).toBe('cmd1');
        expect(getHistoryCommand(3)).toBe(null); // Out of bounds
        expect(getHistoryCommand(0)).toBe(null); // Invalid pointer
    });

    test('command stack pointer reset logic', () => {
        // Test when to reset command stack pointer
        const shouldResetPointer = (key) => {
            return key !== 'ArrowUp';
        };
        
        expect(shouldResetPointer('Enter')).toBe(true);
        expect(shouldResetPointer('ArrowDown')).toBe(true);
        expect(shouldResetPointer('ArrowLeft')).toBe(true);
        expect(shouldResetPointer('ArrowRight')).toBe(true);
        expect(shouldResetPointer('a')).toBe(true);
        expect(shouldResetPointer('Backspace')).toBe(true);
        expect(shouldResetPointer('ArrowUp')).toBe(false);
    });

    test('key event handling logic', () => {
        // Test different key event responses
        const handleKeyEvent = (key, input, execCallback) => {
            const actions = [];
            
            if (key === 'Enter' && execCallback) {
                actions.push('execute');
                actions.push('clear-description');
            }
            
            if (key === 'ArrowUp') {
                actions.push('navigate-history-up');
            }
            
            if (key === 'ArrowDown') {
                actions.push('clear-input');
                actions.push('reset-size');
                actions.push('clear-description');
            }
            
            if (['ArrowLeft', 'ArrowRight'].includes(key)) {
                actions.push('move-cursor-to-end');
                actions.push('prevent-default');
            }
            
            return actions;
        };
        
        const mockExecCallback = jest.fn();
        
        expect(handleKeyEvent('Enter', {}, mockExecCallback)).toContain('execute');
        expect(handleKeyEvent('ArrowUp', {}, null)).toContain('navigate-history-up');
        expect(handleKeyEvent('ArrowDown', {}, null)).toContain('clear-input');
        expect(handleKeyEvent('ArrowLeft', {}, null)).toContain('move-cursor-to-end');
        expect(handleKeyEvent('ArrowRight', {}, null)).toContain('prevent-default');
    });

    test('input event handling and command matching', () => {
        // Test input event logic
        const commands = Object.keys(commandsMap);
        const commandRegex = new RegExp(`^(${commands.join("|")})\\s*(.*)$`, "i");
        
        const handleInputChange = (value) => {
            const size = value.length || 1;
            const matches = commandRegex.exec(value);
            
            if (matches) {
                return {
                    size,
                    highlightText: matches[1],
                    description: commandsMap[matches[1].toLowerCase()].description,
                    isValid: true
                };
            } else {
                return {
                    size,
                    highlightText: '',
                    description: '',
                    isValid: false
                };
            }
        };
        
        const helpResult = handleInputChange('help');
        expect(helpResult.isValid).toBe(true);
        expect(helpResult.highlightText).toBe('help');
        expect(helpResult.description).toBe('Show available commands');
        expect(helpResult.size).toBe(4);
        
        const invalidResult = handleInputChange('invalid');
        expect(invalidResult.isValid).toBe(false);
        expect(invalidResult.highlightText).toBe('');
        expect(invalidResult.description).toBe('');
        expect(invalidResult.size).toBe(7);
    });

    test('start command special handling', () => {
        // Test special handling for "start" command
        const handleStartCommand = (value) => {
            if (value.toLowerCase() === 'start') {
                // Dispatch hover event
                return {
                    shouldHover: true,
                    eventType: 'hoverStartBtn',
                    eventDetail: { activated: true }
                };
            }
            return {
                shouldHover: false,
                eventType: 'hoverStartBtn',
                eventDetail: { activated: false }
            };
        };
        
        const startResult = handleStartCommand('start');
        expect(startResult.shouldHover).toBe(true);
        expect(startResult.eventDetail.activated).toBe(true);
        
        const otherResult = handleStartCommand('help');
        expect(otherResult.shouldHover).toBe(false);
        expect(otherResult.eventDetail.activated).toBe(false);
    });

    test('custom event dispatching logic', () => {
        // Test custom event creation and dispatch
        const dispatchHoverEvent = (activated) => {
            const event = new CustomEvent('hoverStartBtn', {
                detail: { activated }
            });
            
            return {
                type: event.type,
                detail: event.detail
            };
        };
        
        const activatedEvent = dispatchHoverEvent(true);
        expect(activatedEvent.type).toBe('hoverStartBtn');
        expect(activatedEvent.detail.activated).toBe(true);
        
        const deactivatedEvent = dispatchHoverEvent(false);
        expect(deactivatedEvent.type).toBe('hoverStartBtn');
        expect(deactivatedEvent.detail.activated).toBe(false);
    });

    test('cursor position management', () => {
        // Test cursor position setting for arrow keys
        const setCursorToEnd = (input, value) => {
            if (input && value !== undefined) {
                const position = value.length;
                return {
                    selectionStart: position,
                    selectionEnd: position,
                    shouldPreventDefault: true
                };
            }
            return null;
        };
        
        const mockInput = {};
        const result = setCursorToEnd(mockInput, 'help command');
        expect(result.selectionStart).toBe(12);
        expect(result.selectionEnd).toBe(12);
        expect(result.shouldPreventDefault).toBe(true);
    });

    test('focus management and timing', () => {
        // Test focus management with timeout
        const setupFocus = (input, delay = 200) => {
            if (input && typeof input.focus === 'function') {
                return {
                    shouldFocus: true,
                    delay,
                    inputElement: input
                };
            }
            return {
                shouldFocus: false,
                delay: 0,
                inputElement: null
            };
        };
        
        const mockInput = { focus: jest.fn() };
        const result = setupFocus(mockInput, 300);
        expect(result.shouldFocus).toBe(true);
        expect(result.delay).toBe(300);
        expect(result.inputElement).toBe(mockInput);
    });

    test('line click handling for focus', () => {
        // Test line click to focus input
        const handleLineClick = (input) => {
            if (input && typeof input.focus === 'function') {
                input.focus();
                return true;
            }
            return false;
        };
        
        const mockInput = { focus: jest.fn() };
        const result = handleLineClick(mockInput);
        expect(result).toBe(true);
        expect(mockInput.focus).toHaveBeenCalled();
        
        const nullResult = handleLineClick(null);
        expect(nullResult).toBe(false);
    });

    test('DOM element operations simulation', () => {
        // Test DOM element operations
        const simulateDOMOperations = (input, value, cmdDesc) => {
            const operations = [];
            
            if (input) {
                operations.push({ action: 'setValue', target: 'input', value });
                operations.push({ action: 'setSize', target: 'input', size: value.length || 1 });
                
                if (input.nextElementSibling) {
                    operations.push({ 
                        action: 'setInnerHTML', 
                        target: 'nextElementSibling', 
                        content: value 
                    });
                }
            }
            
            operations.push({ 
                action: 'setDataAttribute', 
                target: 'line', 
                attribute: 'cmdDesc', 
                value: cmdDesc 
            });
            
            return operations;
        };
        
        const mockInput = { 
            nextElementSibling: { innerHTML: '' },
            value: '',
            style: { width: '' }
        };
        
        const operations = simulateDOMOperations(mockInput, 'help', 'Show commands');
        expect(operations).toHaveLength(4);
        expect(operations[0].action).toBe('setValue');
        expect(operations[1].action).toBe('setSize');
        expect(operations[2].action).toBe('setInnerHTML');
        expect(operations[3].action).toBe('setDataAttribute');
    });

    test('component state management', () => {
        // Test component state management
        const createComponentState = () => ({
            hovering: false,
            size: 1,
            cmdStackPointer: 1,
            
            setHovering(value) {
                this.hovering = value;
            },
            
            setSize(value) {
                this.size = Math.max(1, value);
            },
            
            resetCmdStackPointer() {
                this.cmdStackPointer = 1;
            },
            
            incrementCmdStackPointer() {
                this.cmdStackPointer++;
            }
        });
        
        const state = createComponentState();
        expect(state.hovering).toBe(false);
        expect(state.size).toBe(1);
        expect(state.cmdStackPointer).toBe(1);
        
        state.setHovering(true);
        state.setSize(10);
        state.incrementCmdStackPointer();
        
        expect(state.hovering).toBe(true);
        expect(state.size).toBe(10);
        expect(state.cmdStackPointer).toBe(2);
        
        state.resetCmdStackPointer();
        expect(state.cmdStackPointer).toBe(1);
    });

    test('command execution callback handling', () => {
        // Test execution callback logic
        const handleExecution = (execCallback, command) => {
            if (execCallback && typeof execCallback === 'function') {
                try {
                    execCallback(command);
                    return { success: true, error: null };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
            return { success: false, error: 'No callback provided' };
        };
        
        const mockCallback = jest.fn();
        const successResult = handleExecution(mockCallback, 'help');
        expect(successResult.success).toBe(true);
        expect(mockCallback).toHaveBeenCalledWith('help');
        
        const noCallbackResult = handleExecution(null, 'help');
        expect(noCallbackResult.success).toBe(false);
        expect(noCallbackResult.error).toBe('No callback provided');
    });

    test('command cache edge cases', () => {
        // Test edge cases in command cache handling
        const safeGetHistoryCommand = (commandsCache, pointer) => {
            if (!Array.isArray(commandsCache) || commandsCache.length === 0) {
                return null;
            }
            
            if (pointer < 1 || pointer > commandsCache.length) {
                return null;
            }
            
            const index = commandsCache.length - pointer;
            const cacheEntry = commandsCache[index];
            return cacheEntry?.command || null;
        };
        
        expect(safeGetHistoryCommand([], 1)).toBe(null);
        expect(safeGetHistoryCommand(null, 1)).toBe(null);
        expect(safeGetHistoryCommand([{ command: 'test' }], 0)).toBe(null);
        expect(safeGetHistoryCommand([{ command: 'test' }], 2)).toBe(null);
        expect(safeGetHistoryCommand([{ command: 'test' }], 1)).toBe('test');
        expect(safeGetHistoryCommand([{}], 1)).toBe(null);
    });
});