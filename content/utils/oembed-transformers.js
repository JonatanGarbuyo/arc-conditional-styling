/* eslint-disable no-unused-vars */
export function spotifyTransformer(raw, originalUrl, provider) {
	return {
		subtype: provider?.name,
		raw_oembed: {
			...raw,
		},
	};
}

export function youtubeTransformer(raw, originalUrl, provider) {
	const extractId = (url) => {
		try {
			const u = new URL(url);
			if (u.searchParams.get("v")) return u.searchParams.get("v");
			if (url.includes("youtu.be")) return url.split("/").pop();
		} catch (e) {
			return null;
		}
	};

	const id = extractId(originalUrl);

	return {
		subtype: provider?.name,
		raw_oembed: {
			...raw,
			iframe_url: id ? `https://www.youtube.com/embed/${id}` : undefined,
		},
	};
}

export function vimeoTransformer(raw, originalUrl, provider) {
	return {
		subtype: provider?.name,
		raw_oembed: {
			...raw,
		},
	};
}
export function instagramTransformer(raw, originalUrl, provider) {
	return {
		subtype: provider?.name,
		raw_oembed: {
			...raw,
		},
	};
}

export function tiktokTransformer(raw, originalUrl, provider) {
	return {
		subtype: provider?.name,
		raw_oembed: {
			...raw,
		},
	};
}

export function twitterTransformer(raw, originalUrl, provider) {
	return {
		subtype: provider?.name,
		raw_oembed: {
			...raw,
		},
	};
}
