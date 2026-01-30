export const processParentSection = (data, website, parentSectionData) => {
	if (!parentSectionData) return;

	const section = data.websites?.[website]?.website_section;
	if (!section) return;

	if (parentSectionData.name) {
		section.parent_name = parentSectionData.name;
	}
};
