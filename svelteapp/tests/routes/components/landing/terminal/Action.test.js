/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/svelte';
import Action from 'src/routes/components/landing/terminal/Action.svelte';

describe('Action component', () => {
    it('renders without crashing', () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: false 
            } 
        });
        expect(container).toBeTruthy();
    });

    it('executes action immediately when timeout is 0', async () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: false 
            } 
        });
        
        // Action should be called immediately
        expect(actionCalled).toBe(true);
    });

    it('executes action immediately when timeout is 0 regardless of noProgress', async () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: true 
            } 
        });
        
        // Action should be called immediately even when noProgress is true
        expect(actionCalled).toBe(true);
    });

    it('schedules action with setTimeout when timeout > 0 and noProgress is true', async () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 100, // Short timeout for testing
                noProgress: true 
            } 
        });
        
        // Action should not be called immediately
        expect(actionCalled).toBe(false);
        
        // Wait for action to be called
        await waitFor(() => {
            expect(actionCalled).toBe(true);
        }, { timeout: 500 });
    });

    it('renders AsciiProgress when timeout > 0 and noProgress is false', () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000,
                noProgress: false 
            } 
        });
        
        // Should render something (the AsciiProgress component)
        expect(container.firstChild).toBeTruthy();
    });

    it('does not render AsciiProgress when noProgress is true', () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000,
                noProgress: true 
            } 
        });
        
        // Should not contain AsciiProgress component
        expect(container.querySelector('.progress')).toBeNull();
        expect(container.innerHTML.trim()).toBe('');
    });

    it('does not render AsciiProgress when timeout is 0', () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: false 
            } 
        });
        
        // Should not contain AsciiProgress component since timeout is 0
        expect(container.querySelector('.progress')).toBeNull();
        expect(container.innerHTML.trim()).toBe('');
    });

    it('handles default noProgress prop (false)', () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000
            } 
        });
        
        expect(container).toBeTruthy();
        // With default noProgress (false) and timeout > 0, should render AsciiProgress
        expect(container.firstChild).toBeTruthy();
    });

    it('handles default timeout prop (0)', () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction
            } 
        });
        
        // With default timeout (0), action should be called immediately
        expect(actionCalled).toBe(true);
    });

    it('handles different timeout values', async () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 150,
                noProgress: true
            } 
        });
        
        expect(actionCalled).toBe(false);
        
        // Wait for action to be called
        await waitFor(() => {
            expect(actionCalled).toBe(true);
        }, { timeout: 500 });
    });

    it('handles negative timeout as greater than 0', async () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: -100,
                noProgress: false
            } 
        });
        
        // Negative timeout should be treated as > 0, so AsciiProgress should render
        expect(container.firstChild).toBeTruthy();
    });

    it('properly executes different action functions', () => {
        let action1Called = false;
        let action2Called = false;
        
        const mockAction1 = () => {
            action1Called = true;
        };
        const mockAction2 = () => {
            action2Called = true;
        };
        
        // Test first action
        const { unmount } = render(Action, { 
            props: { 
                action: mockAction1,
                timeout: 0
            } 
        });
        
        expect(action1Called).toBe(true);
        expect(action2Called).toBe(false);
        
        unmount();
        
        // Test second action
        render(Action, { 
            props: { 
                action: mockAction2,
                timeout: 0
            } 
        });
        
        expect(action1Called).toBe(true);
        expect(action2Called).toBe(true);
    });

    it('handles action that throws error', () => {
        const mockAction = () => {
            throw new Error('Test error');
        };
        
        // Should not crash when action throws
        expect(() => {
            render(Action, { 
                props: { 
                    action: mockAction,
                    timeout: 0
                } 
            });
        }).not.toThrow();
    });

    it('handles zero timeout edge case', () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: true
            } 
        });
        
        expect(actionCalled).toBe(true);
    });

    it('handles missing action prop gracefully', () => {
        // Should not crash when action is undefined
        expect(() => {
            render(Action, { 
                props: { 
                    timeout: 0
                } 
            });
        }).not.toThrow();
    });

    it('handles long timeout values', () => {
        const mockAction = () => {};
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 10000,
                noProgress: false
            } 
        });
        
        // Should render AsciiProgress for long timeouts
        expect(container.firstChild).toBeTruthy();
    });

    it('handles timeout with progress bar callback integration', async () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        const { container } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 200, // Short timeout for testing
                noProgress: false
            } 
        });
        
        // Should have rendered AsciiProgress
        expect(container.querySelector('.progress')).toBeTruthy();
        
        // Wait for timeout and callback
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(actionCalled).toBe(true);
    });

    it('handles sync action execution', () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 0,
                noProgress: false
            } 
        });
        
        // Action should be called immediately
        expect(actionCalled).toBe(true);
    });

    it('handles async action execution with noProgress', async () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 50,
                noProgress: true
            } 
        });
        
        // Action should not be called immediately
        expect(actionCalled).toBe(false);
        
        // Wait for timeout
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(actionCalled).toBe(true);
    });

    it('does not execute action if timeout is greater than 0 and noProgress is false', () => {
        let actionCalled = false;
        const mockAction = () => {
            actionCalled = true;
        };
        
        render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000,
                noProgress: false
            } 
        });
        
        // Action should not be called immediately (waiting for progress bar)
        expect(actionCalled).toBe(false);
    });

    it('handles function type checking properly', () => {
        const nonFunction = "not a function";
        
        expect(() => {
            render(Action, { 
                props: { 
                    action: nonFunction,
                    timeout: 0,
                    noProgress: false
                } 
            });
        }).not.toThrow();
    });

    it('handles null action prop', () => {
        expect(() => {
            render(Action, { 
                props: { 
                    action: null,
                    timeout: 0,
                    noProgress: false
                } 
            });
        }).not.toThrow();
    });

    it('handles undefined action prop during setTimeout', () => {
        expect(() => {
            render(Action, { 
                props: { 
                    action: undefined,
                    timeout: 100,
                    noProgress: true
                } 
            });
        }).not.toThrow();
    });

    it('handles component lifecycle correctly', () => {
        const mockAction = () => {};
        
        const { unmount } = render(Action, { 
            props: { 
                action: mockAction,
                timeout: 1000,
                noProgress: false
            } 
        });
        
        // Should not throw when unmounting
        expect(() => unmount()).not.toThrow();
    });
});