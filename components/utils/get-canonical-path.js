const getCanonicalPath = (fusionContext) => {
	const { requestUri, siteProperties = {}, globalContent, arcSite } = fusionContext;
	const { websiteDomain, structuredData = {} } = siteProperties;
	const { searchPathPrefix = "" } = structuredData;
	const isArticle = globalContent?.type === "story";
	const articleUrl = globalContent?.websites?.[arcSite]?.website_url || "";
	const requestPath = new URL(requestUri, websiteDomain).pathname;
	const isHomepage = requestPath === "/homepage" || requestPath === "/homepage/";
	const isSearchPage = searchPathPrefix
		? requestPath.startsWith(searchPathPrefix) || requestPath.split("/")[1] === searchPathPrefix
		: false;

	if (isHomepage || isSearchPage) {
		return "/";
	}

	if (isArticle) {
		return articleUrl;
	}

	return requestPath;
};

export default getCanonicalPath;
