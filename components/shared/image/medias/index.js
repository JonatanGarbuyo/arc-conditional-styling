import encanchacl from "./encanchacl";
import encanchamx from "./encanchamx";
import tiempox from "./tiempox";
import latfan from "./latfan";

const medias = {
	encanchacl: {
		...encanchacl,
	},
	encanchamx: {
		...encanchamx,
	},
	tiempox: {
		...tiempox,
	},
	latfan: {
		...latfan,
	},
};

const getMediasBySite = (arcSite = "") => {
	if (!arcSite) return false;

	return medias?.[arcSite] || false;
};

export default getMediasBySite;
