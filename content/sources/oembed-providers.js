import {
	instagramTransformer,
	spotifyTransformer,
	tiktokTransformer,
	twitterTransformer,
	vimeoTransformer,
	youtubeTransformer,
} from "../utils/oembed-transformers";

const PROVIDERS = [
	{
		name: "spotify",
		match: (url) => url.includes("open.spotify.com"),
		endpoint: (url) => `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
		providerBase: "https://open.spotify.com/oembed?url=",
		transform: spotifyTransformer,
	},
	{
		name: "youtube",
		match: (url) => url.includes("youtube.com") || url.includes("youtu.be"),
		endpoint: (url) =>
			`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json&maxwidth=624&maxheight=351`,
		providerBase: "https://www.youtube.com/oembed?maxwidth=624&maxheight=351&url=",
		transform: youtubeTransformer,
	},
	{
		name: "vimeo",
		match: (url) => url.includes("vimeo.com"),
		endpoint: (url) => `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
		providerBase: "https://vimeo.com/api/oembed.json?url=",
		transform: vimeoTransformer,
	},
	{
		name: "instagram",
		match: (url) => url.includes("instagram.com"),
		endpoint: (url) =>
			`https://graph.facebook.com/v11.0/instagram_oembed?url=${encodeURIComponent(url)}&omitscript=true`,
		providerBase: "https://graph.facebook.com/v11.0/instagram_oembed?url=",
		transform: instagramTransformer,
	},
	{
		name: "tiktok",
		match: (url) => url.includes("tiktok.com"),
		endpoint: (url) => `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
		providerBase: "https://www.tiktok.com/oembed?url=",
		transform: tiktokTransformer,
	},
	{
		name: "twitter",
		match: (url) => url.includes("twitter.com") || url.includes("x.com"),
		endpoint: (url) => `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
		providerBase: "https://publish.twitter.com/oembed?url=",
		transform: twitterTransformer,
	},
];

const resolve = (query) => {
	if (!query.url) throw new Error("Missing url param for oembed");

	const provider = PROVIDERS.find((p) => p.match(query.url));

	if (!provider) throw new Error(`Unsupported provider for URL: ${query.url}`);

	return provider.endpoint(query.url);
};

const transform = (raw, query) => {
	const provider = PROVIDERS.find((p) => p.match(query.url));

	if (!provider) return raw;

	return provider.transform(raw, query.url, provider);
};

export default {
	resolve,
	transform,
	params: { url: "text" },
};
