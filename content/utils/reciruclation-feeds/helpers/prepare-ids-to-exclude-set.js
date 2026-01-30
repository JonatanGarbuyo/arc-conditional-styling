const prepareIdsExclusionSet = (data) => {
	const idsToExclude = new Set();
	idsToExclude.add(data._id);
	const relatedContent = data.related_content?.basic || [];
	for (const item of relatedContent) {
		if (item._id) idsToExclude.add(item._id);
	}
	return idsToExclude;
};

export default prepareIdsExclusionSet;
