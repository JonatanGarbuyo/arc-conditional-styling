import siteServiceNavigationFetch from "../sources/site-service-navigation";

export const fetchParentSection = async (data, website, cachedCall) => {
	const parentSectionId = data?.websites?.[website]?.website_section?.parent_id;

	if (!parentSectionId || parentSectionId === "/") {
		return null;
	}

	const { fetch: siteServiceFetch } = siteServiceNavigationFetch;

	return cachedCall(`parent-section-${parentSectionId.replace("/", "")}`, siteServiceFetch, {
		query: { hierarchy: "default", sectionId: parentSectionId },
		ttl: 604800,
		independent: true,
	});
};
