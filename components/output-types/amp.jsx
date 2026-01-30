import React from "react";

const AmpOutputType = ({
  children,
  contextPath,
  deployment,
  CssLinks,
  Fusion,
  Libs,
  MetaTags,
}) => (
  <html>
    <head>
      <title>Fusion Article</title>
      <MetaTags />
      <Libs />
      <CssLinks />
      <link
        rel="icon"
        type="image/x-icon"
        href={deployment(`${contextPath}/resources/favicon.ico`)}
      />
    </head>
    <body>
      <div id="fusion-app">{children}</div>
      <Fusion />
    </body>
  </html>
);

AmpOutputType.fallback = false;

export default AmpOutputType;
