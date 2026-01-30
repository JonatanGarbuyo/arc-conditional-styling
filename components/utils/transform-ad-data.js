export default function transformAdData(adData) {
	const manualAdPath = adData.path;

	const maxDimension = adData.dimensions.reduce((max, dim) => {
		return parseInt(dim.height) > parseInt(max.height) ? dim : max;
	});
	const manualAdClass = `${maxDimension.width}x${maxDimension.height}`;

	const dimensionsArray = adData.dimensions.map((dim) => [
		parseInt(dim.width),
		parseInt(dim.height),
	]);

	let manualDimensionsArray = [[], [], []];
	if (adData.deviceType === "desktop") {
		manualDimensionsArray[0] = dimensionsArray;
	} else if (adData.deviceType === "mobile") {
		manualDimensionsArray[1] = dimensionsArray;
		manualDimensionsArray[2] = dimensionsArray;
	}

	return {
		manualAdPath,
		manualAdClass,
		manualDimensionsArray,
	};
}
