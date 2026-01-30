import axios from "axios";
import { RESIZER_TOKEN_VERSION, ENVIRONMENT, API_MOST_READ_SECRET_KEY } from "fusion:environment";
import signingServiceApiFetch from "./signing-service-api";
import signImagesInANSObject from "./sign-images-in-ans-object";

const params = [
	{
		displayName: "section",
		name: "section",
		type: "text",
	},
];

const fetch = async ({ "arc-site": website, section = "default" }, { cachedCall }) => {
	const { fetch: resizerFetch } = signingServiceApiFetch;
	const isProd = ENVIRONMENT === "palco" || ENVIRONMENT === "palco-staging";

	const sanatizedSection = section.replace(/^\/|\/$/g, "").replace(/\//g, "--");
	try {
		const url = `https://us-central1-live-blog-project.cloudfunctions.net/getMostSeenArticles/${website}/${sanatizedSection}/${API_MOST_READ_SECRET_KEY ? `?secret=${API_MOST_READ_SECRET_KEY}` : ""}`;
		const res = await axios.get(url);

		const resArray = res.data || [];

		const promoItemObject = ({ itemBasic = {} }) => {
			if (Object.keys(itemBasic).length === 0) {
				return {};
			}
			return {
				basic: {
					...itemBasic,
					_id: itemBasic.url || "",
					envSandbox: true,
				},
			};
		};

		if (!isProd) {
			const mappedData = resArray.map((item = {}) => {
				const itemBasic = item?.promo_items?.basic || {};
				return {
					...item,
					promo_items: promoItemObject({ itemBasic }),
				};
			});
			const response = {
				data: {
					content_elements: mappedData,
				},
			};
			const { data } = await signImagesInANSObject(
				cachedCall,
				resizerFetch,
				RESIZER_TOKEN_VERSION,
			)(response);

			return data;
		}

		const response = {
			data: {
				content_elements: resArray,
			},
		};

		const { data } = await signImagesInANSObject(
			cachedCall,
			resizerFetch,
			RESIZER_TOKEN_VERSION,
		)(response);

		return data;
	} catch (error) {
		console.error("Error in Content Source:", error.message);
		return { error: true, message: error.message };
	}
};

export default {
	fetch,
	params,
	ttl: 3600, // 1 hour
};
