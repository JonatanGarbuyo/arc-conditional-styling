import arcFetch from "../utils/arc-fetch";

export const fetchSupplementalStories = async (data, website, cachedCall) => {
	const interstitialElements = data?.content_elements?.filter(
		(element) => element?.type === "interstitial_link" && element?.additional_properties?.storyId,
	);
	const interstitialIds = interstitialElements?.map((el) => el.additional_properties.storyId) || [];

	const relatedContentIds =
		data?.related_content?.basic
			?.filter((story) => story.referent.type === "story")
			.map((story) => story._id) || [];
	const hasRelatedContent = relatedContentIds.length > 0;

	const allIds = [...new Set([...interstitialIds, ...relatedContentIds])];

	if (allIds.length === 0) {
		return null;
	}

	const fetcher = async () => {
		const urlSearch = new URLSearchParams({
			ids: allIds.join(","),
			website: website,
			included_fields: "_id,headlines.basic,promo_items.basic,websites",
		});

		const response = await arcFetch("/content/v4/ids/", urlSearch);

		return {
			fetchedStories: response.data?.content_elements || [],
			hasRelatedContent,
		};
	};

	return cachedCall(`supplemental-stories-${data._id}`, fetcher, {
		ttl: 300,
		independent: true,
	});
};
