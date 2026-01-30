import getProperties from "fusion:properties";
import { ENVIRONMENT } from "fusion:environment";
import RedirectError from "./redirect-error";

const handleFetchError = (error, site, isAdmin = false) => {
	if (error?.statusCode === 404 || error.response?.status === 404) {
		if (isAdmin || ENVIRONMENT === "localhost") {
			const notFoundError = new Error("Not Found");
			notFoundError.statusCode = 404;
			throw notFoundError;
		}
		const { websiteDomain } = getProperties(site);
		throw RedirectError("Redirect to home", 301, `${websiteDomain}`);
	} else if (
		error?.statusCode === 301 ||
		error.response?.status === 301 ||
		error?.statusCode === 302 ||
		error.response?.status === 302
	) {
		throw error;
	} else if (error?.response) {
		throw new Error(
			`The response from the server was an error with the status code ${error?.response?.status}.`,
		);
	} else if (error?.request) {
		throw new Error("The request to the server failed with no response.");
	} else {
		throw new Error("An error occured creating the request.");
	}
};

export default handleFetchError;
