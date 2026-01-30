/* eslint-disable quotes */

import processMostReadStories from "./process-most-read-stories";

const createStory = (id, url = `/story-path/${id}`) => ({
	_id: `id-${id}`,
	websites: { "test-site": { website_url: url } },
	website_url: `https://example.com${url}`,
});

describe("processMostReadStories", () => {
	const websiteDomain = "https://example.com";
	const MOST_READ_SIZE = 5;

	it("should remove the current article and return the first 5 remaining", () => {
		const articleUrl = "/story-path/2";
		const rawStories = [
			createStory(1),
			createStory(2, articleUrl),
			createStory(3),
			createStory(4),
			createStory(5),
			createStory(6),
		];

		const result = processMostReadStories(rawStories, articleUrl, websiteDomain, MOST_READ_SIZE);

		expect(result.most_read.find((s) => s._id === "id-2")).toBeUndefined();
		expect(result.most_read.length).toBe(5);
		expect(result.most_read.map((s) => s._id)).toEqual(["id-1", "id-3", "id-4", "id-5", "id-6"]);
	});

	it("should correctly populate the urlsToExclude Set", () => {
		const articleUrl = "/some-other-story";
		const rawStories = [createStory(1), createStory(2), createStory(3)];

		const result = processMostReadStories(rawStories, articleUrl, websiteDomain, MOST_READ_SIZE);

		expect(result.urlsToExclude).toBeInstanceOf(Set);
		expect(result.urlsToExclude.size).toBe(3);
		expect(result.urlsToExclude.has("/story-path/1")).toBe(true);
	});

	it("should return an empty array and empty Set if rawStories is empty", () => {
		const result = processMostReadStories([], "/any-url", websiteDomain, MOST_READ_SIZE);

		expect(result.most_read).toEqual([]);
		expect(result.urlsToExclude.size).toBe(0);
	});
});
