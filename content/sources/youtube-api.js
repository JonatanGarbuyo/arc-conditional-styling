import axios from "axios";
import { YOUTUBE_API_KEY } from "fusion:environment";
import handleFetchError from "../utils/handle-fetch-error";

const params = [
	{
		displayName: "Playlist ID",
		name: "playlistId",
		type: "text",
	},
	{
		displayName: "Max Results",
		name: "maxResults",
		type: "number",
	},
];

const fetch = async ({ playlistId = "", maxResults = 12 }) => {
	try {
		if (!playlistId) {
			const error = new Error("playlistId is required");
			error.statusCode = 400;
			throw error;
		}

		const params = new URLSearchParams({
			part: "snippet",
			playlistId,
			maxResults: String(maxResults),
			key: YOUTUBE_API_KEY,
		});
		const url = `https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`;

		const response = await axios.get(url, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		const items = response?.data?.items || [];
		const videos = items.map((item) => ({
			title: item?.snippet?.title,
			description: item?.snippet?.description,
			videoId: item?.snippet?.resourceId?.videoId,
			publishedAt: item?.snippet?.publishedAt,
			thumbnail: item?.snippet?.thumbnails?.medium?.url,
		}));

		return {
			videos,
		};
	} catch (error) {
		handleFetchError(error);
	}
};

export default {
	fetch,
	params,
};
