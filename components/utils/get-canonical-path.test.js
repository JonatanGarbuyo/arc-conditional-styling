/* eslint-disable quotes */

import getCanonicalPath from "./get-canonical-path";

const baseContext = {
	siteProperties: {
		websiteDomain: "https://www.dominio.com",
		structuredData: {
			searchPathPrefix: "buscar",
		},
	},
};

describe("getCanonicalPath", () => {
	describe("Default Behavior", () => {
		it("should return the pathname for a standard page", () => {
			const context = {
				...baseContext,
				requestUri: "/seccion/noticias/una-noticia/",
			};
			expect(getCanonicalPath(context)).toBe("/seccion/noticias/una-noticia/");
		});

		it("should strip query parameters from the URI", () => {
			const context = {
				...baseContext,
				requestUri: "/seccion/noticias/una-noticia/?id=123",
			};
			expect(getCanonicalPath(context)).toBe("/seccion/noticias/una-noticia/");
		});
	});

	describe("Special Cases", () => {
		it('should return "/" for the homepage', () => {
			const context = {
				...baseContext,
				requestUri: "/homepage",
			};
			expect(getCanonicalPath(context)).toBe("/");
		});

		describe("Search Pages", () => {
			it('should return "/" when the first path segment matches searchPathPrefix', () => {
				const context = {
					...baseContext,
					requestUri: "/buscar/resultados/",
				};
				expect(getCanonicalPath(context)).toBe("/");
			});

			it('should return "/" when the URI starts with the searchPathPrefix', () => {
				const context = {
					...baseContext,
					siteProperties: {
						...baseContext.siteProperties,
						structuredData: { searchPathPrefix: "/buscar-avanzado" },
					},
					requestUri: "/buscar-avanzado/resultados/",
				};
				expect(getCanonicalPath(context)).toBe("/");
			});
		});
	});

	describe("Safety and Edge Cases", () => {
		it("should NOT identify a page as search if the prefix appears mid-path", () => {
			const context = {
				...baseContext,
				requestUri: "/noticias/se-canso-de-buscar/articulo/",
			};
			expect(getCanonicalPath(context)).toBe("/noticias/se-canso-de-buscar/articulo/");
		});

		it("should NOT identify a page as search if searchPathPrefix is empty", () => {
			const context = {
				...baseContext,
				siteProperties: {
					...baseContext.siteProperties,
					structuredData: {
						searchPathPrefix: "",
					},
				},
				requestUri: "/buscar/esto-no-es-busqueda/",
			};
			expect(getCanonicalPath(context)).toBe("/buscar/esto-no-es-busqueda/");
		});

		it('should not treat "/homepage/subpath" as the homepage', () => {
			const context = {
				...baseContext,
				requestUri: "/homepage/subpath/",
			};
			expect(getCanonicalPath(context)).toBe("/homepage/subpath/");
		});
	});
});
