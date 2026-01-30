import { useContent } from "fusion:content";

const useChainContent = (
	childProps,
	selectContentType,
	selectContentSource,
	feedOffset,
	feedInclude,
	fromMainChain,
) => {
	const storyCardsInfo = childProps
		?.map((child, i) => ({
			type: child.type,
			index: i,
			websiteURL: child?.customFields?.websiteURL,
		}))
		?.filter(
			(child) =>
				(child.type?.includes("story-card") &&
					selectContentType === "Manual" &&
					child.websiteURL?.trim() !== "") ||
				(child.type?.includes("story-card") && selectContentType === "API"),
		);

	const feedSize = storyCardsInfo?.length;
	const websitesUrls =
		selectContentType === "Manual"
			? storyCardsInfo?.map((story) => story?.websiteURL)?.filter(Boolean)
			: null;

	const source =
		selectContentType === "Manual"
			? websitesUrls.length
				? "content-api-urls"
				: null
			: selectContentSource;

	const content = useContent({
		source: source,
		query: {
			feedOffset,
			feedSize,
			includeSections: feedInclude,
			tagSlug: feedInclude,
			query: feedInclude,
			authorSlug: feedInclude,
			website_urls: websitesUrls?.join(),
			from: feedOffset,
			size: feedSize,
			getNext: true,
			content_alias: feedInclude,
			fromMainChain,
		},
	});

	const updatedContentElements =
		content?.content_elements?.reduce((acc, element, index) => {
			const key = childProps?.[storyCardsInfo?.[index]?.index]?.id;
			if (key) acc[key] = element;
			return acc;
		}, {}) ?? {};

	return updatedContentElements;
};

export default useChainContent;
