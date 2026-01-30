const filterAndSliceStories = (stories, idsToExclude, urlsToExclude, size, website) => {
	const filtered = stories.filter(
		(story) =>
			!idsToExclude.has(story._id) && !urlsToExclude.has(story.websites?.[website]?.website_url),
	);
	return filtered.slice(0, size);
};

export default filterAndSliceStories;
