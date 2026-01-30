import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import { sourceIncludeToFeed } from "../schemas/sources-include";
import arcFetch from "../utils/arc-fetch";
import signImagesInANSObject from "./sign-images-in-ans-object";
import handleFetchError from "../utils/handle-fetch-error";
import signingServiceApi from "./signing-service-api";
import relatedContent from "../utils/related-notes";

const params = [
	{
		displayName: "website_urls",
		name: "website_urls",
		type: "text",
	},
	{
		name: "fromComponent",
		type: "text",
		default: "",
	},
	{
		displayName: "sys--",
		name: "fromMainChain",
		type: "text",
		default: "false",
	},
];

const fetch = async (
	{ "arc-site": website, "website_urls": websiteUrls, fromComponent = "", fromMainChain = "false" },
	{ cachedCall },
) => {
	const { fetch: resizerFetch } = signingServiceApi;
	const urlSearch = new URLSearchParams({
		...(websiteUrls ? { website_urls: websiteUrls } : {}),
		...(website ? { website } : {}),
		included_fields: sourceIncludeToFeed(website, fromComponent),
	});

	try {
		const response = await arcFetch("/content/v4/urls/", urlSearch);
		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(response);

		if (fromMainChain) {
			await relatedContent(data?.content_elements[0], website, cachedCall);
		}

		return data;
	} catch (error) {
		handleFetchError(error);
	}
};

export default {
	fetch,
	params,
	schemaName: "content-api-urls",
	searchable: "story",
};
