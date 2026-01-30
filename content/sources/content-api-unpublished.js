import signImagesInANSObject from "./sign-images-in-ans-object";
import signingServiceApi from "./signing-service-api";
import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";

const params = [
	{
		displayName: "_id",
		name: "_id",
		type: "text",
	},
];

const fetch = async ({ _id, "arc-site": website }, { cachedCall }) => {
	const { fetch: resizerFetch } = signingServiceApi;
	const urlSearch = new URLSearchParams({
		_id,
		published: "false",
		website,
	});

	try {
		const response = await arcFetch("/content/v4/", urlSearch);
		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(response);

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
