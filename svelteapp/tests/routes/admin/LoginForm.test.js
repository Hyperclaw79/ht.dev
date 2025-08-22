/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import { render, fireEvent, waitFor } from "@testing-library/svelte";

// Mock fetch globally
global.fetch = jest.fn();

const LoginForm = await import("src/routes/admin/LoginForm.svelte");

describe("LoginForm Component", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        fetch.mockClear();
        
        // Mock location.assign
        delete window.location;
        window.location = { assign: jest.fn() };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the login form with all elements", () => {
        const { getByPlaceholderText, getByText, getByRole } = render(LoginForm.default);
        
        expect(getByText("Please Login to Continue")).toBeInTheDocument();
        expect(getByPlaceholderText("Username")).toBeInTheDocument();
        expect(getByPlaceholderText("Password")).toBeInTheDocument();
        expect(getByRole("button", { name: "LOGIN" })).toBeInTheDocument();
    });

    it("should have correct form structure", () => {
        const { container } = render(LoginForm.default);
        
        const form = container.querySelector("form.login-form");
        const heading = container.querySelector("h2.heading");
        const usernameInput = container.querySelector("input[name='username']");
        const passwordInput = container.querySelector("input[name='password']");
        const errorElement = container.querySelector("p.error");
        const submitButton = container.querySelector("button[type='submit']");
        
        expect(form).toBeInTheDocument();
        expect(heading).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(errorElement).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    it("should show error message when authentication fails", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        const { getByPlaceholderText, getByRole, container } = render(LoginForm.default);
        
        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        await fireEvent.input(usernameInput, { target: { value: "wronguser" } });
        await fireEvent.input(passwordInput, { target: { value: "wrongpass" } });
        await fireEvent.click(submitButton);

        await waitFor(() => {
            const errorElement = container.querySelector("p.error.show");
            expect(errorElement).toBeInTheDocument();
            expect(errorElement.textContent).toBe("Invalid Credentials");
        });
    });

    it("should redirect on successful authentication", async () => {
        const mockRedirectUrl = "https://example.com/dashboard";
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ redirectUrl: mockRedirectUrl })
        });

        const { getByPlaceholderText, getByRole } = render(LoginForm.default);
        
        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        await fireEvent.input(usernameInput, { target: { value: "admin" } });
        await fireEvent.input(passwordInput, { target: { value: "password" } });
        await fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.assign).toHaveBeenCalledWith(mockRedirectUrl);
        });
    });

    it("should send correct data to API", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ redirectUrl: "https://example.com" })
        });

        const { getByPlaceholderText, getByRole } = render(LoginForm.default);
        
        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        await fireEvent.input(usernameInput, { target: { value: "testuser" } });
        await fireEvent.input(passwordInput, { target: { value: "testpass" } });
        await fireEvent.click(submitButton);

        expect(fetch).toHaveBeenCalledWith("/api/admin", {
            method: "POST",
            body: JSON.stringify({ username: "testuser", password: "testpass" }),
            headers: { "Content-Type": "application/json" }
        });
    });

    it("should convert username to lowercase", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ redirectUrl: "https://example.com" })
        });

        const { getByPlaceholderText, getByRole } = render(LoginForm.default);
        
        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        await fireEvent.input(usernameInput, { target: { value: "TESTUSER" } });
        await fireEvent.input(passwordInput, { target: { value: "testpass" } });
        await fireEvent.click(submitButton);

        expect(fetch).toHaveBeenCalledWith("/api/admin", {
            method: "POST",
            body: JSON.stringify({ username: "testuser", password: "testpass" }),
            headers: { "Content-Type": "application/json" }
        });
    });

    it("should handle form submission", async () => {
        const { container, getByPlaceholderText, getByRole } = render(LoginForm.default);
        
        const form = container.querySelector("form");
        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        expect(form).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        
        // Test that form elements are functional
        await fireEvent.input(usernameInput, { target: { value: "test" } });
        await fireEvent.input(passwordInput, { target: { value: "test" } });
        
        expect(usernameInput.value).toBe("test");
        expect(passwordInput.value).toBe("test");
    });

    it("should clear error state on new authentication attempt", async () => {
        const { getByPlaceholderText, getByRole, container } = render(LoginForm.default);
        
        // First, trigger an error
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        await fireEvent.input(usernameInput, { target: { value: "wrong" } });
        await fireEvent.input(passwordInput, { target: { value: "wrong" } });
        await fireEvent.click(submitButton);

        await waitFor(() => {
            expect(container.querySelector("p.error.show")).toBeInTheDocument();
        });

        // Now trigger a successful authentication
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ redirectUrl: "https://example.com" })
        });

        await fireEvent.input(usernameInput, { target: { value: "correct" } });
        await fireEvent.input(passwordInput, { target: { value: "correct" } });
        await fireEvent.click(submitButton);

        // Error should be cleared
        await waitFor(() => {
            expect(container.querySelector("p.error.show")).not.toBeInTheDocument();
        });
    });

    it("should handle basic functionality without errors", async () => {
        // Mock successful response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ redirectUrl: "https://example.com" })
        });

        const { getByPlaceholderText, getByRole } = render(LoginForm.default);
        
        const usernameInput = getByPlaceholderText("Username");
        const passwordInput = getByPlaceholderText("Password");
        const submitButton = getByRole("button", { name: "LOGIN" });
        
        // Test basic interactions
        await fireEvent.input(usernameInput, { target: { value: "user" } });
        await fireEvent.input(passwordInput, { target: { value: "pass" } });
        
        expect(usernameInput.value).toBe("user");
        expect(passwordInput.value).toBe("pass");
        
        // Test that clicking submit doesn't crash
        await fireEvent.click(submitButton);
        
        // Just verify the fetch was called
        expect(fetch).toHaveBeenCalled();
    });

    it("should have correct input types", () => {
        const { container } = render(LoginForm.default);
        
        const usernameInput = container.querySelector("input[name='username']");
        const passwordInput = container.querySelector("input[name='password']");
        
        expect(usernameInput.type).toBe("text");
        expect(passwordInput.type).toBe("password");
    });

    it("should have correct heading with data-short-text attribute", () => {
        const { container } = render(LoginForm.default);
        
        const heading = container.querySelector("h2.heading");
        expect(heading.getAttribute("data-short-text")).toBe("Login");
        expect(heading.textContent).toBe("Please Login to Continue");
    });

    it("should have proper CSS classes applied", () => {
        const { container } = render(LoginForm.default);
        
        expect(container.querySelector(".container")).toBeInTheDocument();
        expect(container.querySelector(".login-form")).toBeInTheDocument();
        expect(container.querySelector(".heading")).toBeInTheDocument();
        expect(container.querySelector(".error")).toBeInTheDocument();
    });

    it("should render without crashing", () => {
        expect(() => {
            render(LoginForm.default);
        }).not.toThrow();
    });

    it("should handle empty form submission", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });

        const { getByRole, container } = render(LoginForm.default);
        
        const submitButton = getByRole("button", { name: "LOGIN" });
        await fireEvent.click(submitButton);

        expect(fetch).toHaveBeenCalledWith("/api/admin", {
            method: "POST",
            body: JSON.stringify({ username: "", password: "" }),
            headers: { "Content-Type": "application/json" }
        });
    });

    it("should have proper error element structure", () => {
        const { container } = render(LoginForm.default);
        
        const errorElement = container.querySelector("p.error");
        expect(errorElement).toBeInTheDocument();
        expect(errorElement.textContent).toBe("Invalid Credentials");
        
        // Error should not have 'show' class initially
        expect(errorElement).not.toHaveClass("show");
    });
});