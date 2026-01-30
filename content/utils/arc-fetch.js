import axios from "axios";
import { ARC_ACCESS_TOKEN, CONTENT_BASE } from "fusion:environment";

const arcFetch = (rute, urlSearch = "") => {
	return axios({
		url: `${CONTENT_BASE}${rute}?${urlSearch.toString()}`,
		headers: {
			"content-type": "application/json",
			"Authorization": `Bearer ${ARC_ACCESS_TOKEN}`,
		},
		method: "GET",
	});
};

export default arcFetch;
