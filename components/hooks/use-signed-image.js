import { useContent } from "fusion:content";
import { RESIZER_TOKEN_VERSION } from "fusion:environment";

import extractResizableID from "../utils/extract-resizable-id";

export default function useSignedImage(props) {
	let { url, id, auth } = props;
	const logoResizedImage = id && auth && auth !== "{}" && url?.includes(id);

	let resizedAuth = useContent(
		logoResizedImage || !url
			? {}
			: {
					source: "signing-service-api",
					query: { id: extractResizableID(url) },
				},
	);

	if (auth && !resizedAuth) {
		resizedAuth = JSON.parse(auth);
	}

	if (resizedAuth?.hash && !resizedAuth[RESIZER_TOKEN_VERSION]) {
		resizedAuth[RESIZER_TOKEN_VERSION] = resizedAuth.hash;
	}

	const promoItem = {
		_id: extractResizableID(url),
		url: url,
		auth: resizedAuth,
	};

	return {
		promoItem,
	};
}
