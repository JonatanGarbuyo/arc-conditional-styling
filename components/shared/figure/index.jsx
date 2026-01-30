import React from "react";
import PropTypes from "prop-types";

const MediaItem = ({
	caption,
	children,
	className = "base-media-item",
	credit,
	title,
	...rest
}) => (
	<figure {...rest} className={className}>
		{children}
		{title || caption || credit ? (
			<figcaption className={`${className}__figcaption`}>
				{title ? (
					<span
						dangerouslySetInnerHTML={{ __html: `${title} ` }}
						className={`${className}__title`}
					/>
				) : null}
				{caption ? (
					<span
						dangerouslySetInnerHTML={{ __html: `${caption} ` }}
						className={`${className}__caption`}
					/>
				) : null}
				{credit ? (
					<span
						dangerouslySetInnerHTML={{ __html: `${credit} ` }}
						className={`${className}__credit`}
					/>
				) : null}
			</figcaption>
		) : null}
	</figure>
);

MediaItem.propTypes = {
	/** Class name(s) that get appended to default class name of the component */
	className: PropTypes.string,
	/** Title is the first area in the component, if present */
	title: PropTypes.node,
	/** Caption is the second area in the component, if present */
	caption: PropTypes.node,
	/** Credit is the third area in the component, if present */
	credit: PropTypes.node,
	/** The image, video, audio component or any node that will be displayed within the component */
	children: PropTypes.node,
};

export default MediaItem;
