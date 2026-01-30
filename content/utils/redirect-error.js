const RedirectError = (message = "Redirect", code = 301, location) => {
	const err = new Error(message);
	err.statusCode = code;
	err.location = location;
	return err;
};

export default RedirectError;
