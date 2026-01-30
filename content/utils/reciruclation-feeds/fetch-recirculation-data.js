import gaMostReadApi from "../../sources/ga-most-read-api";
import storyFeedTags from "../../sources/story-feed-tags";
import storyFeedQuery from "../../sources/story-feed-query";

const sections = [
	"/enlahora",
	"/en-la-hora",
	"/tiempo-x",
	"/tiempox",
	"/tecno-game",
	"/tribuna-andes",
	"/motor",
	"/prime",
];
// article + 5 posible related stories + 5 posbile most read stories + 4 stories to return
const TAGS_FEED_SIZE = 15;
// article + 5 posible related stories + 5 posbile most read stories + 4 tag stories + 4 stories to return
const MAIN_SECTION_FEED_SIZE = 19;

export const fetchMostRead = async (cachedCall) => {
	return cachedCall("most-read-stories", gaMostReadApi.fetch, {
		ttl: 3600,
		independent: true,
	});
};

export const fetchTagsApi = async (data, cachedCall) => {
	const mainTag = data.taxonomy?.tags?.[0]?.slug || [];
	return cachedCall(`stories-with-main-tag-${data._id}`, storyFeedTags.fetch, {
		query: { tagSlug: mainTag, feedSize: TAGS_FEED_SIZE },
	});
};

export const fetchMainSection = async (data, website, cachedCall) => {
	const mainSectionParent = data.websites?.[website]?.website_section?.parent_id || "";
	const sectionField = "taxonomy.primary_section.parent_id";
	const query = sections.includes(mainSectionParent)
		? `type:story AND ${sectionField}:"${mainSectionParent}"`
		: `type:story AND ${sections.map((sec) => `NOT ${sectionField}:"${sec}"`).join(" AND ")}`;

	return cachedCall(`stories-from-vertical-${data._id}`, storyFeedQuery.fetch, {
		query: { query, feedSize: MAIN_SECTION_FEED_SIZE },
	});
};
