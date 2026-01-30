const processMostReadStories = (rawStories, articleUrl, websiteDomain, MOST_READ_SIZE) => {
	const urlsToExclude = new Set();
	let most_read = [...rawStories];

	if (most_read.length > 0) {
		const fullArticleUrl = new URL(articleUrl, websiteDomain).href;
		const currentIndex = most_read.findIndex((story) => story.website_url === fullArticleUrl);
		if (currentIndex > -1) most_read.splice(currentIndex, 1);

		most_read = most_read.slice(0, MOST_READ_SIZE);

		for (const story of most_read) {
			if (story.website_url) {
				let relativeUrl = story.website_url.replace(websiteDomain, "");
				if (!relativeUrl.startsWith("/")) relativeUrl = `/${relativeUrl}`;
				urlsToExclude.add(relativeUrl);
			}
		}
	}
	return { most_read, urlsToExclude };
};

export default processMostReadStories;
