import { useFusionContext } from "fusion:context";
import { useContent } from "fusion:content";

export const useNavigationData = (customFields) => {
	const { requestUri } = useFusionContext();
	const { navigationConfig = {}, isAutomatic = false } = customFields;

	const primarySection = requestUri?.split("/")[1];

	const sections = {
		"encancha": "mx-encancha",
		"enlahora": "mx-enlahora",
		"en-la-hora": "enlahora-new",
		"tiempo-x": "tiempo-x-new",
		"tiempox": "mx-tiempox",
		"tecno-game": "mx-encancha",
		"tribuna-andes": "mx-tribunaandes",
		"motor": "mx-encancha",
		"prime": "mx-prime",
	};

	const sectionKey = primarySection in sections ? primarySection : "encancha";

	const content = useContent({
		source: isAutomatic
			? "site-service-navigation"
			: navigationConfig.contentService
				? navigationConfig.contentService
				: null,
		query: isAutomatic
			? { hierarchy: sections[sectionKey] }
			: {
					...navigationConfig.contentConfigValues,
				},
	});

	return content?.children || [];
};
