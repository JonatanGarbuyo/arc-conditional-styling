import React, { useEffect } from "react";
import PropTypes from "@arc-fusion/prop-types";
import Static from "fusion:static";
import { useContent, useEditableContent } from "fusion:content";

const Card = (props) => {
  const { customFields } = props;

  // useEffect(() => {
  //   console.log("log desde el effect");
  // });

  return (
    <Static id={customFields?.name || "User"} htmlOnly persistent>
      <div className="hello_text">
        Hello
        {customFields?.name || "User"}!
      </div>
    </Static>
  );
};

// Card.static = true;
Card.label = "test card";
Card.propTypes = {
  // id: PropTypes.string,
  customFields: PropTypes.shape({
    name: PropTypes.string.tag({
      label: "Name",
      description: "What is your name?",
    }),
  }),
};

export default Card;
