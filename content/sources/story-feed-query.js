import { RESIZER_TOKEN_VERSION } from "fusion:environment";
import signImagesInANSObject from "./sign-images-in-ans-object";
import signingServiceApi from "./signing-service-api";
import { sourceIncludeToFeed } from "../schemas/sources-include";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";
import relatedContent from "../utils/related-notes";

const params = [
	{
		displayName: "Consulta (query)",
		name: "query",
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
		displayName: "Incluir secciones",
		name: "sectionsInclude",
		type: "text",
	},
	{
		displayName: "Excluir secciones",
		name: "sectionsExclude",
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
		query = "*",
		feedSize = 8,
		"feedOffset": from = 0,
		"arc-site": website,
		sectionsInclude = "",
		sectionsExclude = "",
		fromMainChain = "false",
	},
	{ cachedCall },
) => {
	const { fetch: resizerFetch } = signingServiceApi;

	const queryInclude =
		sectionsInclude.length > 0
			? sectionsInclude
					.split(",")
					.map((item) => ` taxonomy.primary_section._id:"${item.trim()}"`)
					.join(" AND")
			: "";

	const queryExclude =
		sectionsExclude.length > 0
			? sectionsExclude
					.split(",")
					.map((item) => ` taxonomy.primary_section._id:"${item.trim()}"`)
					.join(" AND NOT")
			: "";

	const q = `${query}${queryInclude ? ` AND ${queryInclude}` : ""}${queryExclude ? ` AND NOT ${queryExclude}` : ""}`;

	const urlSearch = new URLSearchParams({
		q,
		from,
		size: feedSize,
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
