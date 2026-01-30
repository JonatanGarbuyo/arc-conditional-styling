import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import signImagesInANSObject from "./sign-images-in-ans-object";
import signingServiceApi from "./signing-service-api";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";
import relatedContent from "../utils/related-notes";

const params = [
	{
		displayName: "_id",
		name: "_id",
		type: "text",
	},
	{
		displayName: "content_alias",
		name: "content_alias",
		type: "text",
	},
	{
		displayName: "from",
		name: "from",
		type: "text",
	},
	{
		displayName: "getNext",
		name: "getNext",
		type: "text",
	},
	{
		displayName: "size",
		name: "size",
		type: "text",
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
		_id,
		"arc-site": website,
		"content_alias": contentAlias,
		from,
		getNext = "false",
		size,
		fromMainChain = "false",
	},
	{ cachedCall },
) => {
	try {
		// Max collection size is 20
		// See: https://redirector.arcpublishing.com/alc/docs/swagger/?url=./arc-products/content-api.json
		const { fetch: resizerFetch } = signingServiceApi;
		const constrainedSize = size > 20 ? 20 : size;
		const urlSearch = new URLSearchParams({
			...(_id ? { _id } : { content_alias: contentAlias }),
			...(from ? { from } : {}),
			published: true,
			...(website ? { website } : {}),
			...(size ? { size: constrainedSize } : {}),
		});

		const initialResponse = await arcFetch("/content/v4/collections", urlSearch);
		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(initialResponse);

		if (fromMainChain) {
			await relatedContent(data?.content_elements[0], website, cachedCall);
		}

		if (getNext === "false") {
			return data;
		}

		urlSearch.set("from", (parseInt(from, 10) || 0) + parseInt(constrainedSize, 10));
		const nextResponse = await arcFetch("/content/v4/collections", urlSearch);
		const { data: next } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(nextResponse);

		if (fromMainChain) {
			await relatedContent(data?.content_elements[0], website, cachedCall);
		}

		return {
			...data,
			...(data?.content_elements || next?.content_elements
				? {
						content_elements: [
							...(data?.content_elements || []),
							...(next?.content_elements || []),
						],
					}
				: {}),
		};
	} catch (error) {
		return handleFetchError(error);
	}
};

export default {
	fetch,
	params,
	schemaName: "ans-feed",
	searchable: "collection",
};
