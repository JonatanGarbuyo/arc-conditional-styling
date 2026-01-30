const unescapeHtml = (unsafe) => {
	if (typeof unsafe === "undefined" || !unsafe) return null;

	return (
		unsafe
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			// eslint-disable-next-line quotes
			.replace(/&quot;/g, '"')
			.replace(/&#039;/g, "'")
	);
};

export default unescapeHtml;
