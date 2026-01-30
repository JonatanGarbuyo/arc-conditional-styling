import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import arcFetch from "../utils/arc-fetch";
import handleRedirect from "../utils/handle-redirect";
import signImagesInANSObject from "./sign-images-in-ans-object";
import handleFetchError from "../utils/handle-fetch-error";
import { sourceIncludeToContentApi } from "../schemas/sources-include";
import signingServiceApi from "./signing-service-api";
import { processParentSection } from "../utils/process-parent-section";
import { fetchParentSection } from "../utils/fetch-parent-section";
import { fetchSupplementalStories } from "../utils/fetch-supplemental-stories";
import { processSupplementalStories } from "../utils/process-supplemental-stories";
import { fetchLiveBlogLinksData } from "../utils/fetch-liveblog-links";
import { processLiveBlogEntries } from "../utils/process-liveblog-entries";
import {
	fetchMainSection,
	fetchMostRead,
	fetchTagsApi,
} from "../utils/reciruclation-feeds/fetch-recirculation-data";
import { processRecirculationFeeds } from "../utils/reciruclation-feeds/process-recirculation-data";

const transform = (data) => {
	if (data?.subtype === "video") {
		data.video = data.content_elements?.[0] || {};
		data.content_elements?.splice(0, 1);
	}

	return data;
};

const params = [
	{
		displayName: "_id",
		name: "_id",
		type: "text",
	},
	{
		displayName: "website_url",
		name: "website_url",
		type: "text",
	},
	{
		displayName: "amp",
		name: "amp",
		type: "text",
	},
	{
		displayName: "isAdmin",
		name: "isAdmin",
	},
];

const fetch = async (
	{ _id, "arc-site": website, "website_url": websiteUrl, amp, isAdmin = false },
	{ cachedCall },
) => {
	const { fetch: resizerFetch } = signingServiceApi;
	const urlSearch = new URLSearchParams({
		...(_id ? { _id } : {}),
		...(websiteUrl ? { website_url: websiteUrl } : {}),
		...(website ? { website } : {}),
		included_fields: sourceIncludeToContentApi(),
	});

	try {
		const response = await arcFetch("/content/v4/", urlSearch);
		const validatedData = handleRedirect(response, website, amp);
		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(validatedData);

		const promises = [
			fetchParentSection(data, website, cachedCall),
			//related content and interstitial links
			fetchSupplementalStories(data, website, cachedCall),
			fetchLiveBlogLinksData(data, website, cachedCall),
			fetchMostRead(cachedCall),
			fetchTagsApi(data, cachedCall),
			fetchMainSection(data, website, cachedCall),
		];
		const [
			parentSectionResult,
			supplementalStoriesResult,
			liveBlogResult,
			mostReadResult,
			tagsApiResult,
			mainSectionResult,
		] = await Promise.allSettled(promises);

		if (parentSectionResult.status === "fulfilled" && parentSectionResult.value) {
			processParentSection(data, website, parentSectionResult.value);
		}
		if (supplementalStoriesResult.status === "fulfilled" && supplementalStoriesResult.value) {
			//related content and interstitial links
			processSupplementalStories(data, supplementalStoriesResult.value);
		}
		if (liveBlogResult.status === "fulfilled") {
			processLiveBlogEntries(data, website, liveBlogResult.value);
		}
		const fetchedRecirculationResults = {
			mostReadApiResult:
				mostReadResult.status === "fulfilled" ? mostReadResult.value?.content_elements : [],
			storiesFromTagApi:
				tagsApiResult.status === "fulfilled" ? tagsApiResult.value?.content_elements : [],
			storiesFromSectionApi:
				mainSectionResult.status === "fulfilled" ? mainSectionResult.value?.content_elements : [],
		};
		processRecirculationFeeds(data, website, fetchedRecirculationResults);

		return data;
	} catch (error) {
		handleFetchError(error, website, isAdmin);
	}
};

export default {
	fetch,
	params,
	schemaName: "content-api",
	searchable: "story",
	transform,
};
