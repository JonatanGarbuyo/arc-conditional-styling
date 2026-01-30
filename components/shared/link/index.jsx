import React from "react";
import PropTypes from "prop-types";
import { useFusionContext } from "fusion:context";
import formatInternalPath from "../../utils/format-internal-path";

function determineVisuallyHiddenText(supplementalText, opensInNewTab) {
	if (supplementalText) {
		return supplementalText;
	}

	if (opensInNewTab) {
		return "abre en nueva pestaña";
	}

	return "";
}

const Link = ({
	assistiveHidden = false,
	children = null,
	className = "link",
	href = "#",
	openInNewTab: openInNewTabProp = null,
	supplementalText = "",
	...rest
}) => {
	const { siteProperties, arcSite } = useFusionContext();
	const { websiteDomain } = siteProperties;

	const formattedHref = formatInternalPath(href);

	const cleanHref = formattedHref?.replace(/^\/|\/$/g, "").trim();
	const cleanArcSite = arcSite?.replace(/^\/|\/$/g, "").trim();

	if (cleanHref === cleanArcSite) {
		return children;
	}

	const finalHref = formattedHref === null ? "/" : formattedHref;

	const opensInNewTab =
		(href.startsWith("http") && !href.startsWith(websiteDomain) && openInNewTabProp !== false) ||
		openInNewTabProp === true;

	const visuallyHiddenText = determineVisuallyHiddenText(supplementalText, opensInNewTab);

	return (
		// eslint-disable-next-line react/forbid-elements
		<a
			{...rest}
			className={className}
			href={finalHref}
			aria-hidden={assistiveHidden ? "true" : undefined}
			tabIndex={assistiveHidden ? "-1" : undefined}
			rel={opensInNewTab ? "noopener noreferrer" : undefined}
			target={opensInNewTab ? "_blank" : "_self"}
		>
			{children}
			{visuallyHiddenText ? <span className="visually-hidden">{visuallyHiddenText}</span> : null}
		</a>
	);
};

Link.propTypes = {
	/** Class name(s) that get appended to default class name of the component */
	className: PropTypes.string,
	/** Remove the link from the accessibility tree with aria-hidden, tabindex=-1 */
	assistiveHidden: PropTypes.bool,
	/** The text, images or any node that will be displayed within the link */
	children: PropTypes.node.isRequired,
	/** The destination of the link */
	href: PropTypes.string.isRequired,
	/** Opt to open the link in a new tab */
	openInNewTab: PropTypes.bool,
	/**
   Text to make the link's purpose more clear to screen readers
   indicating a new tab in English by default if external link or opting into a new tab
  */
	supplementalText: PropTypes.string,
};

export default Link;
