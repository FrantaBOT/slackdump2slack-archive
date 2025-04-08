import React from "react";

import { Message } from "../interfaces";

interface FilesProps {
  message: Message;
}

export const Files: React.FunctionComponent<FilesProps> = (props) => {
  const { message } = props;
  const { files } = message;

  if (!files || files.length === 0) return null;

  const fileElements = files.map((file) => {
	const { thumb_1024, thumb_720, thumb_480, thumb_pdf } = file as any;
	const thumb = thumb_1024 || thumb_720 || thumb_480 || thumb_pdf;

	let src = `files/${file.id}-${file.name}`;
	let href = src;

	if (file.mimetype?.startsWith("image")) {
	  return (
		<a key={file.id} href={href} target="_blank">
		  <img className="file" src={src} />
		</a>
	  );
	}

	if (file.mimetype?.startsWith("video")) {
	  return <video key={file.id} controls src={src} />;
	}

	if (file.mimetype?.startsWith("audio")) {
	  return <audio key={file.id} controls src={src} />;
	}

	if (!file.mimetype?.startsWith("image") && thumb) {
	  href = file.url_private || href;
	  src = src.replace(`.${file.filetype}`, ".png");

	  return (
		<a key={file.id} href={href} target="_blank">
		  <img className="file" src={src} />
		</a>
	  );
	}

	return (
	  <a key={file.id} href={href} target="_blank">
		{file.name}
	  </a>
	);
  });

  return <div className="files">{...fileElements}</div>;
};
