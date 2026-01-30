const gcd = (a, b) => {
	while (b) {
		let temp = b;
		b = a % b;
		a = temp;
	}
	return a;
};

const calculateAspectRatio = (imageWidth, imageHeight, defaultAspectRatio = "16/9") => {
	if (imageWidth === 0 || imageHeight === 0) return defaultAspectRatio;

	const divisor = gcd(imageWidth, imageHeight);
	const aspectRatioWidth = imageWidth / divisor;
	const aspectRatioHeight = imageHeight / divisor;
	return `${aspectRatioWidth}/${aspectRatioHeight}`;
};

export default calculateAspectRatio;
