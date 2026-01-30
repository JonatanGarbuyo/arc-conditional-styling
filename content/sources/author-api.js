import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import signImagesInANSObject from "./sign-images-in-ans-object";
import arcFetch from "../utils/arc-fetch.js";
import handleFetchError from "../utils/handle-fetch-error.js";
import signingServiceApi from "./signing-service-api.js";

const params = [
	{
		displayName: "slug",
		name: "slug",
		type: "text",
	},
];

const processAuthorV2Response = (response) => {
	if (!response?.data?.authors?.length > 0) {
		const error = new Error("Not found");
		error.statusCode = 404;
		throw error;
	}

	const author = response?.data?.authors?.[0];
	let image = {};

	if (author?.image) {
		image = {
			promo_items: {
				basic: {
					type: "image",
					url: author.image,
					_id: author.image,
				},
			},
		};
	}

	return {
		...response,
		data: {
			...author,
			...image,
		},
	};
};

const processAuthorV1Response = (response) => {
	if (!response?.data?.image) return response;

	return {
		...response,
		data: {
			...response.data,
			promo_items: {
				basic: {
					type: "image",
					url: response.data?.image,
					_id: response.data?.image,
				},
			},
		},
	};
};

const fetch = async ({ slug, "arc-site": website }, { cachedCall }) => {
	const { fetch: resizerFetch } = signingServiceApi;
	const urlSearchV2 = new URLSearchParams({ slug });

	try {
		const v2Response = await arcFetch("/author/v2/author-service", urlSearchV2);
		const processedV2 = processAuthorV2Response(v2Response);
		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(processedV2);
		return data;
	} catch {
		console.log("Author not found in author v2 author-service");

		try {
			const urlSearchV1 = new URLSearchParams({ _id: slug });
			const v1Response = await arcFetch("/author/v1/author-service", urlSearchV1);
			const processedV1 = processAuthorV1Response(v1Response);
			const { data } = await signImagesInANSObject(
				cachedCall,
				resizerFetch,
				RESIZER_TOKEN_VERSION,
			)(processedV1);
			return data;
		} catch (error) {
			handleFetchError(error, website);
		}
	}
};

export default {
	fetch,
	params,
};
