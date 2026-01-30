import { RESIZER_TOKEN_VERSION, RESIZER_URL } from "fusion:environment";
import getMediasBySite from "./medias/index";
import getProperties from "fusion:properties";
import extractResizableID from "../../utils/extract-resizable-id";
import { generateSlugFromText } from "../../utils/string-formaters";

/**
 * Calculates the height from a given width and aspect ratio.
 * @param {number} width - The width of the preset.
 * @param {number} aspectRatio - The aspect ratio to calculate.
 * @returns {number} Returns the calculated height or null if aspect ratio is not provided.
 */
const calculateHeightFromAspectRatio = (width, aspectRatio) =>
	aspectRatio
		? Math.round(
				width / aspectRatio.split("/").reduce((numerator, denominator) => numerator / denominator),
			)
		: width;

/**
 * Extracts the image ID from the image data object.
 * @param {Object} imageDataObject - The image data object.
 * @param {string} imageDataObject._id - The ID of the image.
 * @param {string} imageDataObject.url - The URL of the image.
 * @returns {string} Returns the image ID with his format eg: jpg, jpge, png.
 */
const getImageId = ({ _id, url }) => {
	return url.split("/").pop().split(".").length > 1 ? `${_id}.${url.split(".").pop()}` : _id;
};

/**
 * Extracts the focal point coordinates from the image data object.
 * If both focal point and composer focal point are available, the composer focal point takes precedence.
 * If no focal point information is available, defaults to coordinates (0, 0).
 *
 * @param {Object} imageDataObject - The image data object containing focal point information.
 * @param {Object} [imageDataObject.focal_point] - The standard focal point of the image.
 * @param {Object} [imageDataObject.additional_properties] - Additional properties containing possible focal point information.
 * @param {Object} [imageDataObject.additional_properties.focal_point] - The focal point details within additional properties.
 * @param {Array<number>} [imageDataObject.additional_properties.focal_point.max] - The focal point coordinates in the composer.
 * @returns {Object} An object containing the focal point coordinates and a flag indicating if coordinates are present.
 * @returns {boolean} return.hasCoords - Indicates whether any focal point coordinates were found.
 * @returns {number} return.x - The x-coordinate of the focal point.
 * @returns {number} return.y - The y-coordinate of the focal point.
 */
const getFocalPoint = (imageDataObject) => {
	const hasFocalPoint = Boolean(
		imageDataObject?.focal_point &&
			imageDataObject?.focal_point?.x &&
			imageDataObject?.focal_point?.y,
	);
	const hasComposerFocalPoint = Boolean(imageDataObject?.additional_properties?.focal_point?.max);

	let focalPoint = hasFocalPoint
		? [imageDataObject.focal_point.x, imageDataObject.focal_point.y]
		: [0, 0];

	if (hasComposerFocalPoint) {
		focalPoint = imageDataObject.additional_properties.focal_point.max;
	}

	return {
		hasCoords: hasFocalPoint || hasComposerFocalPoint,
		x: focalPoint[0],
		y: focalPoint[1],
	};
};

/**
 * Generates URLs for resized images based on presets.
 * @param {Object} presetSize - The preset size for the image.
 * @param {number} [presetSize.width] - The width of the preset.
 * @param {number} [presetSize.height] - The height of the preset.
 * @param {Object} imageDataObject - The image data object.
 * @param {string} imageDataObject._id - The ID of the image.
 * @param {string} imageDataObject.url - The URL of the image.
 * @param {Object} imageDataObject.auth - The authentication details for the image.
 * @param {Object} [imageDataObject.focal_point] - The focal give an exact focus with coordinates.
 * @param {boolean} imageDataObject.smart - The smart give an autofocus.
 * @param {number} [blur=0] - The blur value for the image.
 * @param {number} [quality=70] - The quality value for the image.
 * @returns {string} Returns the generated image URL.
 */
const generateImageUrl = (presetSize, imageDataObject, blur, quality, arcSite) => {
	const isPhotoCenterImage = /images\.arcpublishing\.com/.test(imageDataObject.url);
	const isSandbox = imageDataObject?.envSandbox === true;
	const validateUrl = isSandbox
		? imageDataObject.url.includes("images.arcpublishing.com/sandbox")
		: imageDataObject.url.includes("images.arcpublishing.com");
	const imagePath = validateUrl
		? getImageId(imageDataObject)
		: encodeURIComponent(imageDataObject.url);

	const subtitle = imageDataObject?.subtitle;
	const subtitleSlug = subtitle ? `${generateSlugFromText(subtitle)}-` : "";

	const { width, height } = presetSize;
	const focalPoint = getFocalPoint(imageDataObject);

	const params = new URLSearchParams({
		auth: imageDataObject?.auth?.[RESIZER_TOKEN_VERSION],
		...(focalPoint.hasCoords
			? { focal: `${focalPoint.x},${focalPoint.y}` }
			: { smart: imageDataObject.smart ?? true }),
		...(width ? { width } : {}),
		...(height ? { height } : {}),
		...(blur ? { blur } : {}),
		quality,
	}).toString();

	// return `${RESIZER_URL?.[arcSite]}/${imagePath}?${params}`;
	return isPhotoCenterImage && !isSandbox
		? `${RESIZER_URL?.[arcSite]}/${subtitleSlug}${imagePath}?${params}`
		: `${RESIZER_URL?.[arcSite]}/${imagePath}?${params}`;
};

/**
 * Retrieves resized image URLs for different presets.
 * @param {Object} imageDataObject - The image data object.
 * @param {string} imageDataObject._id - The ID of the image.
 * @param {string} imageDataObject.url - The URL of the image.
 * @param {Object} imageDataObject.auth - The authentication details for the image.
 * @param {string} imageDataObject.media - Media provides a precise collection of elements.
 * @param {string} arcSite - Precise the basepath for structure of URL.
 * @param {number} [blur=0] - The blur value for the image.
 * @param {number} [quality=70] - The quality value for the image.
 * @returns {Object} Returns an object containing the resized image URLs.
 */
const getResizedImageUrls = (imageDataObject, blur = 0, quality = 70) => {
	const { arcSite, isAmp } = imageDataObject;
	if (!imageDataObject?.url || !imageDataObject?.auth) {
		const {
			fallbackImageSAND,
			fallbackImagePROD,
			fallbackAuthSAND,
			fallbackAuthPROD,
			fallbackImageFocalPoint,
		} = getProperties(arcSite);
		const fallbackImage = RESIZER_URL[arcSite]?.includes("-sandbox")
			? fallbackImageSAND
			: fallbackImagePROD;
		const fallbackAuth = RESIZER_URL[arcSite]?.includes("-sandbox")
			? fallbackAuthSAND
			: fallbackAuthPROD;

		imageDataObject.url = fallbackImage;
		imageDataObject._id = extractResizableID(fallbackImage);
		imageDataObject.focal_point = fallbackImageFocalPoint;
		imageDataObject.auth = { [RESIZER_TOKEN_VERSION]: fallbackAuth };
	}
	// If the original size is required
	if (imageDataObject?.media === "auto") {
		const src = generateImageUrl({}, imageDataObject, blur, quality, arcSite);
		return [{ src, query: "80" }];
	}

	const mediaFinded =
		getMediasBySite(arcSite)?.[imageDataObject?.media] || getMediasBySite(arcSite)?.[""];

	const mediaFindedKeys = isAmp
		? Object.keys(mediaFinded)
				.filter((key) => Number(key) <= 768)
				.reduce((acc, key) => {
					const width = mediaFinded[key].width || mediaFinded[key];

					if (!acc.some((k) => k?.[1] === width)) {
						acc.push([key, width]);
					}

					return acc;
				}, [])
				.map((e) => e[0])
		: Object.keys(mediaFinded);

	const resizedUrls = mediaFindedKeys.map((media) => {
		// If has inner object it will get priority (custom aspect in a specific breakpoint)
		const width = mediaFinded[media].width || mediaFinded[media];
		const aspectRatio = mediaFinded[media].aspectRatio || imageDataObject.aspect;

		return {
			src: generateImageUrl(
				{
					width,
					height: calculateHeightFromAspectRatio(width, aspectRatio),
				},
				imageDataObject,
				blur,
				quality,
				arcSite,
			),
			query: media,
			pixelW: mediaFinded[media].width || mediaFinded[media],
		};
	});
	return resizedUrls.sort((a, b) => Number(a.query) - Number(b.query));
};

export { calculateHeightFromAspectRatio, generateImageUrl, getResizedImageUrls };
