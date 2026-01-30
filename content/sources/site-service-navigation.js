import getProperties from "fusion:properties";
import arcFetch from "../utils/arc-fetch";
import handleFetchError from "../utils/handle-fetch-error";
import RedirectError from "../utils/redirect-error";

const params = [
	{
		description: "Especifica qué jerarquía de navegación utilizar.",
		displayName: "Seleccionar una jerarquía",
		name: "hierarchy",
		type: "text",
	},
	{
		description:
			"Si se especifica, devuelve el subárbol de navegación que desciende de la sección indicada.",
		displayName: "Identificador de la sección",
		name: "sectionId",
		type: "text",
	},
];

const fetch = async ({ hierarchy, sectionId, "arc-site": website }) => {
	const { websiteDomain } = getProperties(website);

	// Url con "encanchacl" al final están entrando a este source. Por ej: http://localhost/temas/tenis/encanchacl
	const temasRegex = /^\/temas\//;
	const isTagUrl = sectionId && !!sectionId.match(temasRegex);
	const encanchaRegex = /\/encanchacl\/?$/;
	const includesEncancha = sectionId && !!sectionId.match(encanchaRegex);
	if (includesEncancha) {
		const modifiedWebsiteUrl = sectionId.replace(encanchaRegex, "/");

		throw RedirectError(`${websiteDomain}${modifiedWebsiteUrl}`);
	}
	if (isTagUrl) {
		throw RedirectError(`${websiteDomain}${sectionId}/`);
	}

	const urlSearch = new URLSearchParams({
		...(hierarchy ? { hierarchy } : {}),
		...(sectionId ? { _id: sectionId } : {}),
	});

	try {
		const { data } = await arcFetch(`/site/v3/navigation/${website}`, urlSearch);

		if (sectionId && sectionId !== data._id) {
			const error = new Error("Not found");
			error.statusCode = 404;
			throw error;
		}

		const parentId = data?.parent?.default;

		if (parentId && parentId !== "/") {
			try {
				const parentUrlSearch = new URLSearchParams({
					hierarchy: "default",
					_id: parentId,
				});
				const { data: parentData } = await arcFetch(
					`/site/v3/navigation/${website}`,
					parentUrlSearch,
				);

				if (parentData?.name) {
					if (!data.parent) data.parent = {};
					data.parent.name = parentData.name;
				}
			} catch (parentError) {
				console.warn(
					`No se pudo obtener la sección padre '${parentId}' para '${data._id}'. Error: ${parentError.message}`,
				);
			}
		}

		return data;
	} catch (error) {
		handleFetchError(error, website);
	}
};

export default {
	fetch,
	params,
	schemaName: "site-service",
};
