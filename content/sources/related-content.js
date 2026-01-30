import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import { sourceIncludeToFeed } from "../schemas/sources-include";
import arcFetch from "../utils/arc-fetch";
import signImagesInANSObject from "./sign-images-in-ans-object";
import handleFetchError from "../utils/handle-fetch-error";
import signingServiceApi from "./signing-service-api";

const params = [
	{
		displayName: "_id",
		name: "_id",
		type: "text",
	},
	{
		displayName: "(empty) | stories | galleries | videos",
		name: "type",
		type: "text",
		default: "",
	},
];

const fetch = async ({ _id, "arc-site": site, type, website }, { cachedCall }) => {
	if (!_id || !site) {
		return Promise.reject(new Error("_id parameter is required"));
	}
	const { fetch: resizerFetch } = signingServiceApi;

	let typeRealted = type ? `/${type}` : "";

	const urlSearch = new URLSearchParams({
		_id,
		website: site,
		included_fields: sourceIncludeToFeed(website),
	});

	try {
		const response = await arcFetch(`/content/v4/related-content${typeRealted}`, urlSearch);
		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(response);

		const { basic, ...remainingData } = data;

		return {
			...remainingData,
			content_elements: basic,
		};
	} catch (error) {
		handleFetchError(error);
	}
};

export default {
	fetch,
	params,
};
