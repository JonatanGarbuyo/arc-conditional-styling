import arcFetch from "./arc-fetch";

export const fetchLiveBlogLinksData = async (data, website, cachedCall) => {
	if (data?.subtype !== "live-blog") {
		return null;
	}

	const contentElements = data?.content_elements || [];
	const canonicalUrlRegex = /^[^<>]*\/\d{4}\/\d{1,2}\/\d{1,2}\/[^<>]*$/;

	const linksInLiveblog = contentElements.filter(
		(element) => element.type === "text" && canonicalUrlRegex.test(element.content),
	);

	if (linksInLiveblog.length === 0) {
		return null;
	}

	const linksToFetch = linksInLiveblog.map((element) => element.content);

	const fetcher = async () => {
		const urlSearch = new URLSearchParams({
			website_urls: linksToFetch.join(","),
			website: website,
			included_fields:
				"headlines.basic, subheadlines.basic, description.basic, promo_items.basic,websites",
		});

		const response = await arcFetch("/content/v4/urls/", urlSearch);
		return response.data;
	};

	return cachedCall(`liveblog-links-${data._id}`, fetcher);
};
