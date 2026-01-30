import formatInternalPath from "./format-internal-path";

describe("formatInternalPath Utility", () => {
	describe("for valid internal paths (starting with '/')", () => {
		it("adds a trailing slash to paths without one", () => {
			expect(formatInternalPath("/an-internal-route")).toBe("/an-internal-route/");
		});

		it("does NOT add an extra slash to paths that already have one", () => {
			expect(formatInternalPath("/another-route/")).toBe("/another-route/");
		});

		it("adds the trailing slash before any query parameters", () => {
			expect(formatInternalPath("/search?query=test")).toBe("/search/?query=test");
		});

		it("adds the trailing slash before query parameters and a hash", () => {
			expect(formatInternalPath("/path?query=abc#section-1")).toBe("/path/?query=abc#section-1");
		});

		it("does NOT add a trailing slash to the root path '/'", () => {
			expect(formatInternalPath("/")).toBe("/");
		});

		it("does NOT add a trailing slash to internal paths that point to a file", () => {
			expect(formatInternalPath("/assets/image.jpg")).toBe("/assets/image.jpg");
		});

		it("removes double slashes from internal paths", () => {
			expect(formatInternalPath("/internal//path")).toBe("/internal/path/");
		});

		it("removes multiple slashes and reduces them to one", () => {
			expect(formatInternalPath("/a///b//c")).toBe("/a/b/c/");
			expect(formatInternalPath("/a///b/////c")).toBe("/a/b/c/");
		});
	});

	describe("for other valid strings (unmodified)", () => {
		it("does NOT modify absolute URLs", () => {
			expect(formatInternalPath("https://www.google.com")).toBe("https://www.google.com");
		});

		it("does NOT modify protocol-relative URLs", () => {
			expect(formatInternalPath("//example.com/path")).toBe("//example.com/path");
		});

		it("does NOT modify relative paths that do not start with '/'", () => {
			expect(formatInternalPath("a-relative-path")).toBe("a-relative-path");
		});

		it("does NOT modify URLs without a protocol", () => {
			expect(formatInternalPath("www.google.com")).toBe("www.google.com");
		});

		it("does NOT modify special protocols like mailto:, tel:, or #anchors", () => {
			expect(formatInternalPath("mailto:test@example.com")).toBe("mailto:test@example.com");
			expect(formatInternalPath("tel:+123456789")).toBe("tel:+123456789");
			expect(formatInternalPath("#section-id")).toBe("#section-id");
		});
	});

	describe("for invalid or empty inputs", () => {
		it("returns null for empty strings", () => {
			expect(formatInternalPath("")).toBeNull();
		});

		it("returns null for null or undefined inputs", () => {
			expect(formatInternalPath(null)).toBeNull();
			expect(formatInternalPath(undefined)).toBeNull();
		});

		it("returns null for non-string inputs", () => {
			expect(formatInternalPath(123)).toBeNull();
			expect(formatInternalPath({})).toBeNull();
			expect(formatInternalPath([])).toBeNull();
		});

		it("returns null when no argument is passed", () => {
			expect(formatInternalPath()).toBeNull();
		});
	});
});
