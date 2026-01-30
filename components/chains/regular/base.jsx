import React from "react";
import PropTypes from "@arc-fusion/prop-types";
import ChainContext from "../../context/chain";
import useChainContent from "../../hooks/use-chain-content";

const CadenaRegular = ({
  id: uniqueID,
  children,
  customFields,
  childProps = [],
}) => {
  const {
    feedInclude,
    feedOffset,
    selectContentSource,
    selectContentType,
    hideChain,
    hideBottomBorder,
  } = customFields;

  if (hideChain) return null;

  const content = useChainContent(
    childProps,
    selectContentType,
    selectContentSource,
    feedOffset,
    feedInclude
  );

  const storyCardsMedia = "regular-chain-story-card";
  const storyCardsAspect = "56 / 37";

  return (
    <ChainContext.Provider
      value={{
        content,
        sourceMode: selectContentType,
        media: storyCardsMedia,
        aspect: storyCardsAspect,
      }}
    >
      <div
        className={`regular-chain${
          hideBottomBorder ? "" : " regular-chain--bottom-border"
        }`}
      >
        {children?.map((child, index) => (
          <div key={`${uniqueID}_${index}`} className="regular-chain__child">
            {child}
          </div>
        ))}
      </div>
    </ChainContext.Provider>
  );
};

CadenaRegular.label = "Cadena regular";
CadenaRegular.icon = "layers";
CadenaRegular.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  childProps: PropTypes.array,
  customFields: PropTypes.shape({
    hideChain: PropTypes.bool.tag({
      defaultValue: false,
      description: "Show or hide complete chain",
      label: "Ocultar cadena",
    }),
    hideBottomBorder: PropTypes.bool.tag({
      defaultValue: true,
      label: "Ocultar borde inferior",
    }),
    selectContentType: PropTypes.select(["Manual", "API"]).tag({
      defaultValue: "API",
      label: "Mostrar información de contenido",
      group: "Configuración de contenido",
    }),
    selectContentSource: PropTypes.select([
      "story-feed-query",
      "story-feed-sections",
      "story-feed-tags",
      "story-feed-author",
      "content-api-collections",
    ]).tag({
      label: "Seleccionar fuente de contenido",
      group: "Configuración de contenido",
    }),
    feedInclude: PropTypes.string.tag({
      defaultValue: "",
      label: "Incluir",
      group: "Configuración de contenido",
    }),
    feedOffset: PropTypes.number.tag({
      defaultValue: 0,
      label: "Salto de resultados (offset)",
      group: "Configuración de contenido",
    }),
  }),
};

export default CadenaRegular;
