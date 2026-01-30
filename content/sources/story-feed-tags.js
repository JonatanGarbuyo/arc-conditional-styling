import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import signImagesInANSObject from "./sign-images-in-ans-object";
import signingServiceApi from "./signing-service-api";
import { sourceIncludeToFeed } from "../schemas/sources-include";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";
import relatedContent from "../utils/related-notes";

const params = [
	{
		displayName: "Slug de la etiqueta",
		name: "tagSlug",
		type: "text",
	},
	{
		displayName: "Cantidad",
		name: "feedSize",
		type: "number",
	},
	{
		displayName: "Salto de resultados (offset)",
		name: "feedOffset",
		type: "number",
	},
	{
		displayName: "sys--",
		name: "fromMainChain",
		type: "text",
		default: "false",
	},
];

const fetch = async (
	{
		"feedSize": size = 10,
		"feedOffset": from = 0,
		tagSlug,
		"arc-site": website,
		fromMainChain = "false",
	},
	{ cachedCall },
) => {
	if (!tagSlug) {
		return Promise.reject(new Error("tagSlug parameter is required"));
	}

	const { fetch: resizerFetch } = signingServiceApi;

	const urlSearch = new URLSearchParams({
		from,
		q: `taxonomy.tags.slug:${tagSlug}`,
		size,
		sort: "first_publish_date:desc",
		website,
		_sourceInclude: sourceIncludeToFeed(website),
	});

	try {
		const response = await arcFetch("/content/v4/search/published", urlSearch);
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
	schemaName: "ans-feed",
};
