import { toPng, toJpeg } from "html-to-image";

const handleDownload = ({ type, filename, wrapperElement }) => {
  switch (type) {
    case "jpg":
      toJpeg(wrapperElement, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        quality: 1,
        pixelRatio: 2,
      }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${filename}.jpg`;
        link.href = dataUrl;
        link.click();
      });
      break;
    case "png":
      toPng(wrapperElement, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2,
      }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      });
      break;
    default:
      throw new Error("Bad download format");
  }
};

export default handleDownload;
