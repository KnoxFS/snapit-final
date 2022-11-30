const getImageRadius = (padding = "p-0", position) => {
  if (padding == "p-0") {
    return "";
  }

  switch (position) {
    case "pl-0 pt-0":
      return "rounded-l-none rounded-tr-none";
    case "pt-0 pr-0":
      return "rounded-r-none rounded-tl-none";
    case "pb-0 pl-0":
      return "rounded-l-none rounded-br-none";
    case "pb-0 pr-0":
      return "rounded-r-none rounded-bl-none";
    default:
      return "";
  }
};

export default getImageRadius;
