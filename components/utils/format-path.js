const formatPath = (path) => {
	const pattern = /^\/.*[^/]$/;
	if (pattern.test(path)) return `${path}/`;

	return path;
};

export default formatPath;
