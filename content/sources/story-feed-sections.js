import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import signImagesInANSObject from "./sign-images-in-ans-object";
import signingServiceApi from "./signing-service-api";
import { sourceIncludeToFeed } from "../schemas/sources-include";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";
import relatedContent from "../utils/related-notes";

export const itemsToArray = (itemString = "") =>
	itemString.split(",").map((item) => item.trim().replace(/"/g, ""));

const params = [
	{
		displayName: "Incluir secciones",
		name: "includeSections",
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
		"feedOffset": from = 0,
		"feedSize": size = 10,
		includeSections,
		"arc-site": website,
		fromMainChain = "false",
	},
	{ cachedCall },
) => {
	if (!includeSections) {
		return Promise.reject(new Error("includeSections parameter is required"));
	}

	const { fetch: resizerFetch } = signingServiceApi;
	const body = {
		query: {
			bool: {
				must: [
					{
						term: {
							"revision.published": "true",
						},
					},
					{
						nested: {
							path: "taxonomy.sections",
							query: {
								bool: {
									must: [
										{
											terms: {
												"taxonomy.sections._id": itemsToArray(includeSections),
											},
										},
										{
											term: {
												"taxonomy.sections._website": website,
											},
										},
									],
								},
							},
						},
					},
				],
			},
		},
	};

	const urlSearch = new URLSearchParams({
		body: JSON.stringify(body),
		from,
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
