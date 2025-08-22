/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals";
import { render } from "@testing-library/svelte";

const AdminPage = await import("src/routes/admin/+page.svelte");

describe("Admin Page Component", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render the admin page with heading", () => {
        const { getByText } = render(AdminPage.default);
        
        expect(getByText("Admin Console")).toBeInTheDocument();
    });

    it("should render the container with correct classes", () => {
        const { container } = render(AdminPage.default);
        
        const containerDiv = container.querySelector(".container");
        expect(containerDiv).toBeInTheDocument();
    });

    it("should render the heading with correct classes", () => {
        const { container } = render(AdminPage.default);
        
        const heading = container.querySelector(".heading");
        expect(heading).toBeInTheDocument();
        expect(heading.textContent).toBe("Admin Console");
    });

    it("should have proper DOM structure", () => {
        const { container } = render(AdminPage.default);
        
        // Check the main structure
        const heading = container.querySelector("h1.heading");
        const containerDiv = container.querySelector("div.container");
        
        expect(heading).toBeInTheDocument();
        expect(containerDiv).toBeInTheDocument();
        
        // Verify the heading comes before the container
        expect(heading.nextElementSibling).toBe(containerDiv);
    });

    it("should render without crashing", () => {
        expect(() => {
            render(AdminPage.default);
        }).not.toThrow();
    });

    it("should apply correct CSS classes", () => {
        const { container } = render(AdminPage.default);
        
        const heading = container.querySelector("h1");
        const containerDiv = container.querySelector("div");
        
        expect(heading).toHaveClass("heading");
        expect(containerDiv).toHaveClass("container");
    });

    it("should have correct heading text", () => {
        const { container } = render(AdminPage.default);
        
        const heading = container.querySelector("h1.heading");
        expect(heading.textContent.trim()).toBe("Admin Console");
    });

    it("should contain container divs", () => {
        const { container } = render(AdminPage.default);
        
        const containers = container.querySelectorAll(".container");
        expect(containers.length).toBeGreaterThanOrEqual(1);
    });

    it("should contain LoginForm component within container", () => {
        const { container } = render(AdminPage.default);
        
        const containerDiv = container.querySelector(".container");
        // The LoginForm component should be rendered inside the container
        expect(containerDiv.children.length).toBeGreaterThan(0);
    });
});