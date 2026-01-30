import React, { useState } from "react";
import PropTypes from "prop-types";
import { calculateHeightFromAspectRatio, getResizedImageUrls } from "./resizer";
import { useFusionContext } from "fusion:context";
import getProperties from "fusion:properties";

const Image = (props) => {
	const { aspect = "", alt = "", lazyLoading = true, promoItem = {}, onLoad = () => {} } = props;
	const { arcSite, outputType } = useFusionContext();
	const isAmp = outputType === "amp";
	const { fallbackImagePROD } = getProperties(arcSite);
	const [hasError, setHasError] = useState(false);

	if (hasError) {
		return (
			<picture className="global-picture">
				<img
					src={fallbackImagePROD}
					alt={alt}
					className="global-image global-image-error"
					{...(aspect && { style: { aspectRatio: aspect } })}
				/>
			</picture>
		);
	}

	const resizedUrls =
		getResizedImageUrls({
			...promoItem,
			...props,
			arcSite,
		}) || [];

	const defaultURLResized = resizedUrls?.at(-1).src;

	const srcSet = resizedUrls.map((item) => `${item.src} ${item.pixelW}w`).join(", ");

	const sizesString = resizedUrls
		.sort((a, b) => Number(b.query) - Number(a.query))
		.map((item) => {
			if (item.query === "0") return `${item.pixelW}px`;
			return `(min-width: ${item.query}px) ${item.pixelW}px`;
		})
		.join(", ");

	if (isAmp) {
		const aspectHeight = calculateHeightFromAspectRatio(100, aspect);

		return (
			<amp-img
				alt={alt}
				class="global-image"
				data-amp-auto-lightbox-disable
				data-hero
				height={aspectHeight}
				layout="responsive"
				src={defaultURLResized}
				srcset={srcSet}
				width="100"
				style={{
					aspectRatio: aspect,
				}}
			>
				{/* Logo por defecto fallback (onError) */}
				<amp-img
					alt={alt}
					class="global-image global-image-error"
					data-amp-auto-lightbox-disable
					data-hero
					fallback=""
					height="100"
					layout="responsive"
					src={fallbackImagePROD}
					width="56.25"
				/>
			</amp-img>
		);
	}

	return (
		<img
			alt={alt}
			className="global-image"
			decoding="async"
			sizes={sizesString}
			src={defaultURLResized}
			srcSet={srcSet}
			style={{
				aspectRatio: aspect,
			}}
			// eslint-disable-next-line react/no-unknown-property
			fetchpriority={lazyLoading ? "low" : "high"}
			loading={lazyLoading ? "lazy" : "eager"}
			onError={() => {
				setHasError(true);
			}}
			onLoad={onLoad}
		/>
	);
};

Image.propTypes = {
	aspect: PropTypes.string,
	alt: PropTypes.string,
	lazyLoading: PropTypes.bool,
	media: PropTypes.string,
	onLoad: PropTypes.func,
	promoItem: PropTypes.object,
	smart: PropTypes.bool,
	isAmp: PropTypes.bool,
};

export default Image;
