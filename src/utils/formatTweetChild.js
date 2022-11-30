export default function formatTweetChild(child) {
  switch (typeof child) {
    case "string":
      return `${child}`;

    case "object":
      let text = "";

      if (child.tag === "p")
        text += `<p>${child.nodes?.map((node) => formatTweetChild(node)).join("")}</p>`;

      
      if (child.tag === "div")
        text += `<div>${child.nodes?.map((node) => formatTweetChild(node)).join("")}</div>`;

      if (child.tag === "img") {
        // if emoji
        if (child.props.dataType === "emoji-for-text")
          text += `<span>${child.props.alt}</span>`;
        else
          text += `<img src="${child.props.src}" alt="${child.props.alt}" />`;
      }

      if (child.tag === "br") text += `<div class="separator"></div>`;

      if (child.tag === "a") {
        text += `<a href="${child.props.href}" target="_blank" rel="noreferrer">${child.nodes[0]}</a>`;
      }

      return text;

    default:
      break;
  }
}
