export default function getSectionColor(arcSite, requestUri) {
	const section = requestUri?.split("/")?.[1] || "";

	const sectionColors = {
		"tiempo-x": "#327d7e",
		"tiempox": "#327d7e",
		"tecno-game": "#639",
		"motor": "#FF0000",
		"prime": "#294C01",
	};

	for (const key in sectionColors) {
		if (section.includes(key) || arcSite === key) {
			return sectionColors[key];
		}
	}

	return "#D10000";
}
