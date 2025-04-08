import React from "react";

interface HtmlPageProps {
  base: string;
  children: any;
}

export const HtmlPage: React.FunctionComponent<HtmlPageProps> = (props) => {
  return (
	<html lang="en">
	  <head>
		<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
		<meta charSet="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Slack</title>
		<link rel="stylesheet" href={`${props.base}style.css`} />
	  </head>
	  <body>{props.children}</body>
	</html>
  );
};
