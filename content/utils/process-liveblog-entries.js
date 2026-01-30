export const processLiveBlogEntries = (data, website, fetchResponse) => {
	if (data?.subtype !== "live-blog") return;

	const contentElements = data?.content_elements || [];
	if (contentElements.length === 0) return;

	const fetchedStories = fetchResponse?.content_elements;
	if (fetchedStories && fetchedStories.length > 0) {
		const storyMap = new Map(
			fetchedStories.map((story) => [story.websites?.[website]?.website_url, story]),
		);

		contentElements.forEach((element) => {
			if (element.type === "text" && storyMap.has(element.content)) {
				element.subtype = "linked_article";
				element.linked_content = storyMap.get(element.content);
			}
		});
	}

	const firstLiveBlogIndex = contentElements.findIndex(
		(item) => item.subtype === "Viñeta de tiempo",
	);

	if (firstLiveBlogIndex === -1) return;

	const contentElementsBeforeLiveBlog = contentElements.slice(0, firstLiveBlogIndex);

	const liveBlogEntriesArr = contentElements.slice(firstLiveBlogIndex).reduce((acc, item) => {
		if (item.subtype === "Viñeta de tiempo") {
			acc.push({
				...item,
				type: "liveblog-entry",
				content_elements: [],
			});
		} else if (acc.length > 0) {
			acc[acc.length - 1].content_elements.push(item);
		}
		return acc;
	}, []);

	contentElements.length = 0;
	contentElements.push(...contentElementsBeforeLiveBlog, ...liveBlogEntriesArr);
};
