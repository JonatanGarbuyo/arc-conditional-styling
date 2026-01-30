import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";

const params = [];

const fetch = ({ "arc-site": website }) => {
	const urlSearch = new URLSearchParams({
		content_alias: "alert-bar",
		from: 0,
		published: true,
		size: 1,
		...(website ? { website } : {}),
	});

	return arcFetch("/content/v4/collections", urlSearch)
		.then(({ data }) => ({
			...data,
			content_elements: data.content_elements.filter((element) => !element.referent),
		}))
		.catch(handleFetchError);
};

export default {
	fetch,
	params,
	ttl: 120,
};
