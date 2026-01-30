/**
 * Formats an internal URL path (starts with '/') by ensuring it has a trailing
 * slash (unless it's a file) and collapsing any consecutive slashes into one.
 * Returns null for invalid inputs (null, undefined, non-string, empty string).
 * Returns all other strings unmodified.
 *
 * @param {any} href The input to process.
 * @returns {string|null} The formatted path, the original string, or null.
 */
const formatInternalPath = (href) => {
	// 1. Handle invalid inputs: null, undefined, non-string, or empty string.
	if (!href || typeof href !== "string") {
		return null;
	}

	// 2. Check if it's an internal path. It must start with exactly one '/'.
	// If not, return the original string.
	if (!href.startsWith("/") || href.startsWith("//")) {
		return href;
	}

	// 3. Separate the pathname from the search query and hash.
	let pathname = href;
	let searchAndHash = "";

	const hashIndex = pathname.indexOf("#");
	if (hashIndex !== -1) {
		searchAndHash = pathname.substring(hashIndex);
		pathname = pathname.substring(0, hashIndex);
	}

	const searchIndex = pathname.indexOf("?");
	if (searchIndex !== -1) {
		searchAndHash = pathname.substring(searchIndex) + searchAndHash;
		pathname = pathname.substring(0, searchIndex);
	}

	// 4. Collapse multiple consecutive slashes into a single one.
	pathname = pathname.replace(/\/+/g, "/");

	// 5. Add a trailing slash if it's not the root path and doesn't point to a file.
	const hasFileExtension = /\.[^/]+$/.test(pathname);
	if (pathname !== "/" && !pathname.endsWith("/") && !hasFileExtension) {
		pathname += "/";
	}

	// 6. Reconstruct the href and return the formatted string.
	return `${pathname}${searchAndHash}`;
};

export default formatInternalPath;
