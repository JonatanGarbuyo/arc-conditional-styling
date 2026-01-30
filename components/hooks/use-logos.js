import { useMemo } from "react";
import { useFusionContext } from "fusion:context";
import { logosConfig } from "../utils/logos-config";

const useLogos = ({ variant = "default" } = {}) => {
	const { pagebuilderURL, contextPath } = useFusionContext();

	const logos = useMemo(() => {
		return Object.entries(logosConfig).reduce((acc, [key, config]) => {
			const variantConfig = config.variants[variant] || config.variants.default;

			if (variantConfig) {
				acc[key] = {
					...config,
					path: variantConfig.path,
					src: pagebuilderURL(`${contextPath}${variantConfig.path}`),
				};
			}
			return acc;
		}, {});
	}, [pagebuilderURL, contextPath, variant]);

	return logos;
};

export default useLogos;
