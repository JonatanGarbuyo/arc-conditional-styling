const formatURLPath = (path) => {
	if (!path || typeof path !== "string") return "";

	const hasDomain = /^(https?:\/\/|\/\/)/.test(path);

	try {
		let url;
		if (hasDomain) {
			url = new URL(path);
		} else {
			url = new URL(path.startsWith("/") ? path : `/${path}`, "http://example.com");
		}

		let formattedPath = url.pathname;

		if (formattedPath.length > 1 && !formattedPath.endsWith("/")) {
			formattedPath += "/";
		}

		if (url.search) {
			formattedPath += url.search;
		}

		if (hasDomain) {
			url.pathname = formattedPath.split("?")[0];
			return url.toString();
		} else {
			return formattedPath;
		}
	} catch (e) {
		console.error(`Failed to format URL path: ${path}`, e);
		const [basePath, queryString] = path.split("?");
		let formatted = basePath;
		if (!formatted.startsWith("/")) {
			formatted = `/${formatted}`;
		}
		if (formatted.length > 1 && !formatted.endsWith("/")) {
			formatted += "/";
		}
		if (queryString) {
			formatted += `?${queryString}`;
		}
		return formatted;
	}
};

export default formatURLPath;
