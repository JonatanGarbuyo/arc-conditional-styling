import arcFetch from "./arc-fetch";

const relatedContent = async (data, website, cachedCall) => {
	if (!data || !data._id || !website) {
		return;
	}

	try {
		const fetchRelatedContent = async () => {
			const urlSearch = new URLSearchParams({
				_id: data._id,
				website,
				included_fields: "_id,headlines.basic,websites",
			});

			const response = await arcFetch("/content/v4/related-content/stories", urlSearch);
			const filteredStories = (response?.data?.basic || []).filter(
				(story) => story.websites && story.websites[website],
			);

			return filteredStories;
		};

		const relatedStories = await cachedCall(
			`related-content-fetch-${data._id}`,
			fetchRelatedContent,
			{
				ttl: 300,
				independent: true,
			},
		);
		if (!data.related_content) {
			data.related_content = {};
		}
		data.related_content.basic = relatedStories;
	} catch (error) {
		console.error("Error al obtener el contenido relacionado:", error);
	}
};

export default relatedContent;
