import React from "react";
import PropTypes from "prop-types";
import { useContent, useEditableContent } from "fusion:content";
import { useFusionContext } from "fusion:context";
import Static from "fusion:static";
import { RESIZER_TOKEN_VERSION } from "fusion:environment";

import ChainContext from "../../../context/chain";
import extractResizableID from "../../../utils/extract-resizable-id";
import { CreateStory } from "../../../utils/create-story";
import formatPath from "../../../utils/format-path";

import Image from "../../../shared/image";
import Conditional from "../../../shared/conditional";
import Link from "../../../shared/link";
import YoutubeVideo from "../../../shared/youtube";
import { useFormattedStoryDate } from "../../../hooks/use-formatted-story-date";

const StoryCard = ({ customFields = {}, contentOverride }) => {
  const { searchableField } = useEditableContent();
  const { arcSite, isAdmin, outputType, id, siteProperties } =
    useFusionContext();
  const authorPathPrefix = siteProperties?.structuredData?.authorPathPrefix;
  const authorPropForLink = siteProperties?.structuredData?.authorPropForLink;

  const chainContext = React.useContext(ChainContext);
  const {
    content: chainContent = [],
    sourceMode: chainSourceMode = "",
    media,
    aspect,
    hideRelatedStories: hideRelatedStoriesFromContext,
  } = chainContext || {};

  const contentFromChain = chainContent[id] || null;

  const isFirstStory = id === Object.keys(chainContent)[0];
  const hideRelatedStories = isFirstStory
    ? hideRelatedStoriesFromContext
    : true;

  let {
    autoPlayActive,
    byLineOverride,
    descriptionOverride,
    headlineOverride,
    hideByline,
    hideDate,
    hideDescription,
    hideHeadline,
    hideImage,
    hideOverline,
    hideStoryCard,
    imageMedia = null,
    imageOverrideAuth,
    imageOverrideId,
    imageOverrideURL = "",
    imageRatio,
    lazyLoadingOverride = true,
    linkOverrideURL,
    listContentConfig,
    overlineOverride,
    overlineOverrideURL,
    replateWithAuthorImg,
    websiteURL,
    youtubeId,
  } = customFields;

  if (hideStoryCard) return null;

  const resizedImage =
    imageOverrideId &&
    imageOverrideAuth &&
    imageOverrideAuth !== "{}" &&
    imageOverrideURL?.includes(imageOverrideId);

  let resizedAuth = useContent(
    resizedImage || !imageOverrideURL
      ? {}
      : {
          source: "signing-service-api",
          query: { id: extractResizableID(imageOverrideURL) },
        }
  );

  if (imageOverrideAuth && !resizedAuth) {
    resizedAuth = JSON.parse(imageOverrideAuth);
  }

  if (resizedAuth?.hash && !resizedAuth[RESIZER_TOKEN_VERSION]) {
    resizedAuth[RESIZER_TOKEN_VERSION] = resizedAuth.hash;
  }

  const websiteURLContent =
    useContent({
      source:
        (!chainSourceMode || (chainSourceMode === "Manual" && isAdmin)) &&
        websiteURL &&
        arcSite
          ? "content-api"
          : null,
      query: {
        website_url: websiteURL ?? "",
      },
    }) || {};

  const contentServiceContent =
    useContent({
      source:
        chainSourceMode === "Manual" &&
        !websiteURL &&
        listContentConfig?.contentService
          ? listContentConfig?.contentService
          : null,
      query: { ...listContentConfig?.contentConfigValues },
    }) || {};

  const getContent = () => {
    // if used as child by another component
    if (contentOverride) {
      return contentOverride;
    }

    // if the story card is outside a chain (!chainSourceMode) and has websiteURL
    if (
      (!chainSourceMode || (chainSourceMode === "Manual" && isAdmin)) &&
      websiteURL &&
      arcSite
    ) {
      return websiteURLContent;
    }

    // For the story card to work with a feed source, it needs to be in manual mode and have a source configured
    if (
      chainSourceMode === "Manual" &&
      !websiteURL &&
      listContentConfig?.contentService
    ) {
      return contentServiceContent?.content_elements?.[0] ?? {};
    }

    // normally content needs to come from chain
    if (contentFromChain) {
      return contentFromChain;
    }

    return null;
  };

  const content = getContent() || {};

  if (!content && (!content?.headlines || !headlineOverride) && !isAdmin)
    return null;

  const authorImg = content?.credits?.by?.[0]?.image;

  content.arcSite = arcSite;

  const story = new CreateStory(content)
    .setBylineName(byLineOverride)
    .setDescription(descriptionOverride)
    .setHeadline(headlineOverride)
    .setImageUrl(imageOverrideURL, resizedAuth)
    .setLinkUrl(linkOverrideURL)
    .setOverline(overlineOverride)
    .setOverlineUrl(overlineOverrideURL);

  const imageProps = {
    aspect: imageRatio || aspect,
    headline: story.headline,
    alt: story.headline,
    isAmp: outputType === "amp",
    media: imageMedia || media,
    promoItem: replateWithAuthorImg ? authorImg : story.promoItem,
    lazyLoading: lazyLoadingOverride,
  };
  const displayDate = useFormattedStoryDate(
    story.date,
    contentOverride?.date_format ?? "%d/%m/%Y - %H:%Mhs"
  );

  const authorValue = story.byline?.[authorPropForLink];
  const authorUrl =
    authorPathPrefix && authorValue
      ? `/${authorPathPrefix}/${authorValue}/`
      : null;

  const isVideo = content?.subtype === "video";

  return (
    <Static id={id} htmlOnly persistent>
      <div className="story-card">
        {isAdmin && (
          <div
            data-searchable-field="story"
            style={{ display: "none" }}
            {...searchableField({ websiteURL: "website_url" }, "story")}
          />
        )}
        {!hideImage &&
          (youtubeId ? (
            <div className="story-card__image">
              <YoutubeVideo
                videoId={youtubeId}
                autoPlayActive={autoPlayActive}
              />
            </div>
          ) : (
            <div className="story-card__image">
              {isAdmin && (
                <div
                  data-searchable-field="image"
                  style={{ display: "none" }}
                  {...searchableField({
                    imageOverrideURL: "url",
                    imageOverrideId: "_id",
                    imageOverrideAuth: "auth",
                  })}
                />
              )}
              <Conditional
                className="story-card__image-anchor"
                condition={story.linkUrl}
                component={Link}
                href={story.linkUrl}
                aria-label={story.headline}
              >
                <Image {...imageProps} />
              </Conditional>
            </div>
          ))}
        {!hideDescription && (
          <span className="story-card__description">
            <Conditional
              condition={story.linkUrl}
              component={Link}
              href={story.linkUrl}
              aria-label={story.deck}
            >
              {story.deck}
            </Conditional>
          </span>
        )}
        {!hideOverline && (
          <div className="story-card__overline ">
            <Conditional
              condition={story.overlineUrl}
              component={Link}
              href={formatPath(story.overlineUrl)}
              aria-label={story.overline}
            >
              {story.overline}
            </Conditional>
          </div>
        )}
        {!hideHeadline && (
          <h2 className="story-card__headline">
            <Conditional
              condition={story.linkUrl}
              component={Link}
              href={story.linkUrl}
              aria-label={story.headline}
            >
              {story.headline}
            </Conditional>
          </h2>
        )}
        {!hideByline && story.byline && (
          <div className="story-card__byline">
            <Conditional
              condition={authorUrl}
              component={Link}
              href={authorUrl}
              aria-label={story.byline?.name}
            >
              <span>{story.byline?.name}</span>
            </Conditional>
          </div>
        )}
        {!hideDate && (
          <div className="story-card__date">
            <time dateTime={story.date} className="date-container">
              {displayDate}
            </time>
          </div>
        )}

        {!hideRelatedStories && story?.related_content?.basic?.length > 0 && (
          <ul className="story-card__related-stories">
            {story?.related_content?.basic?.map((relatedStory, index) => {
              const headline = relatedStory?.headlines?.basic || null;
              const url =
                relatedStory?.websites?.[arcSite]?.website_url || null;
              return (
                <li key={`${id}related-story${index}`}>
                  <Link href={url}>{headline}</Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Static>
  );
};

StoryCard.label = "Tarjeta de historia";
StoryCard.icon = "design-tool-magic-wand";
// StoryCard.static = true;
StoryCard.propTypes = {
  contentOverride: PropTypes.object,
  customFields: PropTypes.shape({
    hideStoryCard: PropTypes.bool.tag({
      defaultValue: false,
      label: "Ocultar tarjeta de historia",
    }),
    websiteURL: PropTypes.string.tag({
      defaultValue: "",
      description: "Selección rápida de una historia desde el buscador",
      label: "URL del la historia",
      searchable: "story",
      group: "Configurar contenido",
    }),
    listContentConfig: PropTypes.contentConfig("ans-feed").tag({
      label: "Seleccionar origen del contenido",
      group: "Configurar contenido",
    }),
    hideImage: PropTypes.bool.tag({
      label: "Ocultar imagen",
      defaultValue: false,
      group: "Configurar diseño",
    }),
    hideOverline: PropTypes.bool.tag({
      label: "Ocultar sobrelinea",
      defaultValue: true,
      group: "Configurar diseño",
    }),
    hideDate: PropTypes.bool.tag({
      label: "Ocultar fecha",
      defaultValue: false,
      group: "Configurar diseño",
    }),
    hideHeadline: PropTypes.bool.tag({
      label: "Ocultar encabezado",
      defaultValue: false,
      group: "Configurar diseño",
    }),
    hideDescription: PropTypes.bool.tag({
      label: "Ocultar descripción",
      defaultValue: true,
      group: "Configurar diseño",
    }),
    hideByline: PropTypes.bool.tag({
      label: "Ocultar autor",
      defaultValue: true,
      group: "Configurar diseño",
    }),
    lazyLoadingOverride: PropTypes.bool.tag({
      description: "Cambiar la prioridad con que se carga una imagen",
      label: "Habilitar carga diferida",
      group: "Sobreescribir contenido",
      hidden: true,
    }),
    autoPlayActive: PropTypes.bool.tag({
      description: "Habilita la reproducción automática de video",
      label: "Activar reproducción automática",
      group: "Sobreescribir contenido",
      defaultValue: false,
    }),
    youtubeId: PropTypes.string.tag({
      description:
        "Reemplaza la imagen por un video de Youtube con el id proporcionado, o con un video de rudo/mediastream con una url valida",
      label: "Id/URL de video",
      group: "Sobreescribir contenido",
    }),
    imageOverrideURL: PropTypes.string.tag({
      label: "Sobreescribir URL de la imagen",
      searchable: "image",
      group: "Sobreescribir contenido",
    }),
    overlineOverride: PropTypes.string.tag({
      label: "Sobreescribir sobrelinea",
      group: "Sobreescribir contenido",
    }),
    overlineOverrideURL: PropTypes.string.tag({
      label: "Sobreescribir URL de sobrelinea",
      group: "Sobreescribir contenido",
    }),
    headlineOverride: PropTypes.string.tag({
      label: "Sobreescribir encabezado",
      group: "Sobreescribir contenido",
    }),
    descriptionOverride: PropTypes.string.tag({
      label: "Sobreescribir descripción",
      group: "Sobreescribir contenido",
    }),
    byLineOverride: PropTypes.string.tag({
      label: "Sobreescribir autor",
      group: "Sobreescribir contenido",
    }),
    linkOverrideURL: PropTypes.string.tag({
      description: "Cambia el enlace de la historia hacia otra",
      label: "Sobreescribir enlace de la historia",
      group: "Sobreescribir contenido",
    }),
  }),
};

export default StoryCard;
