import getProperties from "fusion:properties";
import handleFetchError from "../utils/handle-fetch-error";
import RedirectError from "../utils/redirect-error";
import arcFetch from "../utils/arc-fetch";
import { ENVIRONMENT } from "fusion:environment";

const params = [
	{
		displayName: "slug",
		name: "slug",
		type: "text",
	},
];

const fetch = async ({ "slug": slugs = "", "arc-site": website }) => {
	const urlSearch = new URLSearchParams({ slugs });
	const { websiteDomain } = getProperties(website);

	try {
		const { data } = await arcFetch("/tags/v2/slugs/", urlSearch);
		if (data?.Payload?.some((ele) => !!ele)) {
			return data;
		}

		if (ENVIRONMENT === "localhost") {
			const notFoundError = new Error("Not Found");
			notFoundError.statusCode = 404;
			throw notFoundError;
		}

		throw RedirectError("Tag not found", 301, websiteDomain);
	} catch (error) {
		handleFetchError(error, website);
	}
};

export default {
	fetch,
	params,
	schemaName: "ans-feed",
};
