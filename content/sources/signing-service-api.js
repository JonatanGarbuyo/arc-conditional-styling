import { SIGNING_SERVICE_DEFAULT_APP, RESIZER_TOKEN_VERSION } from "fusion:environment";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";

const params = {
	id: "text",
	service: "text",
	serviceVersion: "text",
};

const fetch = async ({
	id,
	service = SIGNING_SERVICE_DEFAULT_APP,
	serviceVersion = RESIZER_TOKEN_VERSION,
}) => {
	const urlSearch = new URLSearchParams({
		value: id,
	});

	try {
		const { data } = await arcFetch(
			`/signing-service/v2/sign/${service}/${serviceVersion}`,
			urlSearch,
		);

		return data;
	} catch (error) {
		handleFetchError(error);
	}
};

export default {
	fetch,
	params,
	http: false,
	ttl: 31536000,
};
