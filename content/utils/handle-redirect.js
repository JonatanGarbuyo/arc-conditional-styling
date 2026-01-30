import getProperties from "fusion:properties";
import { ENVIRONMENT } from "fusion:environment";

export const RedirectError = (location) => {
	const err = new Error("Redirect");
	err.statusCode = 302;
	err.location = location;
	return err;
};

const handleRedirect = (response, website, amp) => {
	const content = response.data;
	const redirectUrl =
		content?.related_content?.redirect?.[0]?.redirect_url || content?.redirect_url;

	if (content?.type && (content?.type === "redirect" || content?.type === "story") && redirectUrl) {
		const { websiteDomain } = getProperties(website);

		let baseRedirectUrl = `${websiteDomain}${redirectUrl}`;

		if (ENVIRONMENT === "localhost") {
			baseRedirectUrl = `http://localhost${redirectUrl}?_website=${website}`;
		}

		if (ENVIRONMENT === "sandbox") {
			baseRedirectUrl = `https://palco-encanchacl-sandbox.web.arc-cdn.net${baseRedirectUrl}?_website=${website}`;
		}

		if (amp) {
			baseRedirectUrl += `${baseRedirectUrl.includes("?") ? "&" : "?"}outputType=${amp}`;
		}

		throw RedirectError(baseRedirectUrl);
	}

	return response;
};

export default handleRedirect;
