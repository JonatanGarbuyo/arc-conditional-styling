import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import signImagesInANSObject from "./sign-images-in-ans-object";
import signingServiceApi from "./signing-service-api";
import { sourceIncludeToFeed } from "../schemas/sources-include";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";
import relatedContent from "../utils/related-notes";

const params = [
	{
		displayName: "Slug del autor",
		name: "authorSlug",
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
		authorSlug,
		"feedOffset": from = 0,
		"feedSize": size = 8,
		"arc-site": website,
		fromMainChain = "false",
	},
	{ cachedCall },
) => {
	const { fetch: resizerFetch } = signingServiceApi;

	const urlSearch = new URLSearchParams({
		from,
		q: `credits.by._id:"${authorSlug}"`,
		sort: "first_publish_date:desc",
		size,
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
