export const processSupplementalStories = (data, supplementalData) => {
	if (!supplementalData) return;

	const { fetchedStories, hasRelatedContent } = supplementalData;

	const storyMap = new Map(fetchedStories.map((story) => [story._id, story]));

	const interstitialElements = data.content_elements.filter(
		(element) => element?.type === "interstitial_link" && element?.additional_properties?.storyId,
	);

	if (interstitialElements.length > 0) {
		interstitialElements.forEach((element) => {
			const storyId = element.additional_properties.storyId;
			const matchedStory = storyMap.get(storyId);
			if (matchedStory) {
				element.data = matchedStory;
			}
		});
	}

	if (hasRelatedContent) {
		const fullRelatedStories = data.related_content.basic
			.map((storyRef) => storyMap.get(storyRef._id))
			.filter(Boolean);

		if (fullRelatedStories.length > 0) {
			data.related_content.basic = fullRelatedStories;

			const relatedContentObj = {
				type: "related_content",
				content: fullRelatedStories,
				_id: `related-content-${data._id}`,
			};

			const index = data.content_elements.findIndex((el) => el.type === "text");
			if (index !== -1) {
				data.content_elements.splice(index, 0, relatedContentObj);
			}
		}
	}
};
