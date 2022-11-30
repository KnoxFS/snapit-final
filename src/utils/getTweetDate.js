export default function getTweetDate(dateToFormat) {
  {
    /* 1:24pm - Nov 17, 2022 format date */
  }
  const time = new Date(dateToFormat).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const date = new Date(dateToFormat).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${time} · ${date}`;
}
