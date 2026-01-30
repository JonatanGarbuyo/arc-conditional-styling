/* eslint-disable quotes */

import filterAndSliceStories from "./filter-and-slice-stories";

const createStory = (id, url = `/story-path/${id}`) => ({
	_id: `id-${id}`,
	websites: { "test-site": { website_url: url } },
	website_url: `https://example.com${url}`,
});

describe("filterAndSliceStories", () => {
	const stories = [createStory(1), createStory(2), createStory(3), createStory(4), createStory(5)];
	const website = "test-site";

	it("should filter stories based on idsToExclude", () => {
		const idsToExclude = new Set(["id-1", "id-3"]);
		const result = filterAndSliceStories(stories, idsToExclude, new Set(), 5, website);
		expect(result.length).toBe(3);
		expect(result.map((s) => s._id)).toEqual(["id-2", "id-4", "id-5"]);
	});

	it("should filter stories based on urlsToExclude", () => {
		const urlsToExclude = new Set(["/story-path/2", "/story-path/4"]);
		const result = filterAndSliceStories(stories, new Set(), urlsToExclude, 5, website);
		expect(result.length).toBe(3);
		expect(result.map((s) => s._id)).toEqual(["id-1", "id-3", "id-5"]);
	});

	it("should slice the result to the specified size", () => {
		const result = filterAndSliceStories(stories, new Set(), new Set(), 2, website);
		expect(result.length).toBe(2);
		expect(result.map((s) => s._id)).toEqual(["id-1", "id-2"]);
	});
});
