import getProperties from "fusion:properties";
import prepareIdsExclusionSet from "./helpers/prepare-ids-to-exclude-set";
import processMostReadStories from "./helpers/process-most-read-stories";
import filterAndSliceStories from "./helpers/filter-and-slice-stories";

export const processRecirculationFeeds = (data, website, fetchedResults) => {
	if (!fetchedResults) return;

	const { mostReadApiResult, storiesFromTagApi, storiesFromSectionApi } = fetchedResults;

	const RECIRCULATION_FEED_SIZE = 4;
	const MOST_READ_SIZE = 5;
	const { websiteDomain } = getProperties(website);
	const articleUrl = data.websites?.[website]?.website_url || "";
	const idsToExclude = prepareIdsExclusionSet(data);

	const { most_read, urlsToExclude } = processMostReadStories(
		mostReadApiResult,
		articleUrl,
		websiteDomain,
		MOST_READ_SIZE,
	);

	const stories_with_main_tag = filterAndSliceStories(
		storiesFromTagApi,
		idsToExclude,
		urlsToExclude,
		RECIRCULATION_FEED_SIZE,
		website,
	);

	for (const story of stories_with_main_tag) {
		idsToExclude.add(story._id);
	}

	const stories_from_main_section = filterAndSliceStories(
		storiesFromSectionApi,
		idsToExclude,
		urlsToExclude,
		RECIRCULATION_FEED_SIZE,
		website,
	);

	data.recirculation_feeds = {
		most_read,
		stories_with_main_tag,
		stories_from_main_section,
	};
};
