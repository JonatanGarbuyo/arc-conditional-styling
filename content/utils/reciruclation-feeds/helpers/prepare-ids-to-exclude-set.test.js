/* eslint-disable quotes */

import prepareIdsExclusionSet from "./prepare-ids-to-exclude-set";

const createStory = (id, url = `/story-path/${id}`) => ({
	_id: `id-${id}`,
	websites: { "test-site": { website_url: url } },
	website_url: `https://example.com${url}`,
});

const mockBaseData = {
	_id: "main-story-id",
	related_content: {
		basic: [createStory(1), createStory(2)],
	},
};

describe("prepareIdsExclusionSet", () => {
	it("should return a Set containing the main story ID and related content IDs", () => {
		const ids = prepareIdsExclusionSet(mockBaseData);
		expect(ids).toBeInstanceOf(Set);
		expect(ids.size).toBe(3);
		expect(ids.has("main-story-id")).toBe(true);
		expect(ids.has("id-1")).toBe(true);
		expect(ids.has("id-2")).toBe(true);
	});

	it("should handle cases with no related content", () => {
		const dataWithoutRelated = { ...mockBaseData, related_content: { basic: [] } };
		const ids = prepareIdsExclusionSet(dataWithoutRelated);
		expect(ids.size).toBe(1);
		expect(ids.has("main-story-id")).toBe(true);
	});
});
