/**
 * @jest-environment jsdom
 */

import { jest } from "@jest/globals";
import { execute } from "./commandHandler.js";

describe("Execute", () => {
    let inputs;
    let data;
    let commandsCache;

    beforeEach(() => {
        inputs = [];
        data = { user: "root@HT.Dev", cwd: "~/Desktop" };
        commandsCache = [];
        jest.spyOn(document, "querySelector").mockReturnValue({ click: jest.fn() });
        jest.spyOn(document, "querySelectorAll").mockReturnValue([
            { id: "test1" },
            { id: "test2" }
        ]);
    });

    const runCommonTest = (result) => {
        expect(result[result.length - 1]).toMatchObject({ command: "", uuid: expect.any(Number), isLastInput: true });
    };

    it("start command", () => {
        const cmd = "start";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Starting...", uuid: expect.any(Number) });
        expect(result[1]).toMatchObject({ progress: true, uuid: expect.any(Number) });
        expect(result[2]).toMatchObject({
            action: expect.any(Function),
            uuid: expect.any(Number),
            timeout: 2000
        });
        runCommonTest(result);
    });

    it("clear command", () => {
        const cmd = "clear";
        const result = execute(inputs, cmd, data, commandsCache);
        runCommonTest(result);
    });

    it("ls command", () => {
        const cmd = "ls";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: [".", "..", "test1", "test2"], uuid: expect.any(Number) });
        runCommonTest(result);
    });

    it("help command", () => {
        const cmd = "help";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "You can check out these commands:", uuid: expect.any(Number) });
        expect(result[1]).toMatchObject({ output: ["start", "clear", "ls", "help", "chdir", "pwd", "echo"], uuid: expect.any(Number) });
        runCommonTest(result);
    });

    it("chdir command with no argument", () => {
        const cmd = "chdir";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Please specify a directory.", uuid: expect.any(Number), error: true });
        runCommonTest(result);
    });

    it("chdir command with argument", () => {
        const cmd = "chdir it";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(data.cwd).toEqual("it");
        runCommonTest(result);
    });

    it("pwd command", () => {
        const cmd = "pwd";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "~/Desktop", uuid: expect.any(Number) });
        runCommonTest(result);
    });

    it("echo command with no argument", () => {
        const cmd = "echo";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "", uuid: expect.any(Number) });
        runCommonTest(result);
    });

    it("echo command with argument", () => {
        const cmd = "echo it";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "it", uuid: expect.any(Number) });
        runCommonTest(result);
    });
});
