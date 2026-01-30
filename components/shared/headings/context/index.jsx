import React from "react";
import PropTypes from "prop-types";
import LevelContext from "./level";

const HeadingContext = ({ children }) => (
	<LevelContext.Consumer>
		{(level) => <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>}
	</LevelContext.Consumer>
);

HeadingContext.propTypes = {
	/** The text, images or any node that will be displayed within the component */
	children: PropTypes.node.isRequired,
};

export default HeadingContext;
