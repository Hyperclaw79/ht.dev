/**
 * @jest-environment jsdom
 */

import { jest } from "@jest/globals";
import { execute, commandsMap } from "src/routes/components/landing/terminal/commandHandler.js";

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

    it("admin command", () => {
        const cmd = "admin";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({
            action: expect.any(Function),
            uuid: expect.any(Number)
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
        expect(result[1]).toMatchObject({
            output: Object.keys(commandsMap),
            uuid: expect.any(Number)
        });
        expect(result[2]).toMatchObject({
            output: "Type 'help <command>' to get more information about a command.",
            uuid: expect.any(Number)
        });
        runCommonTest(result);
    });

    it("help command with invalid argument", () => {
        const cmd = "help it";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Command not found: it", uuid: expect.any(Number) });
        runCommonTest(result);
    });

    it("help command with valid argument", () => {
        const cmd = "help help";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Displays a list of available commands.", uuid: expect.any(Number) });
        expect(result[1]).toMatchObject({
            output: "If a command is specified, it displays the description of the command.",
            uuid: expect.any(Number)
        });
        runCommonTest(result);
    });

    it("cd command with no argument", () => {
        const cmd = "cd";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Please specify a directory.", uuid: expect.any(Number), error: true });
        expect(data.cwd).toEqual("~/Desktop");
        runCommonTest(result);
    });

    it("su command with argument", () => {
        const cmd = "su it";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(data.user).toEqual("it@HT.Dev");
        runCommonTest(result);
    });

    it("su command with no argument", () => {
        const cmd = "su";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Please specify a user.", uuid: expect.any(Number), error: true });
        expect(data.user).toEqual("root@HT.Dev");
        runCommonTest(result);
    });

    it("cd command with argument", () => {
        const cmd = "cd it";
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

    it("typoed command", () => {
        const cmd = "stars";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Command not found: stars", uuid: expect.any(Number), error: true });
        expect(result[1]).toMatchObject({ output: "Did you mean: start?", uuid: expect.any(Number) });
        runCommonTest(result);
    });

    it("invalid command", () => {
        const cmd = "qwertyuioop";
        const result = execute(inputs, cmd, data, commandsCache);
        expect(result[0]).toMatchObject({ output: "Command not found: qwertyuioop", uuid: expect.any(Number), error: true });
        expect(result.length).toBe(2);
        runCommonTest(result);
    });
});
