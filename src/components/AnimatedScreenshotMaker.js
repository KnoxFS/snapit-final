import { useRef, useState } from "react";
import ReactTilt from "react-parallax-tilt";
import URLScreenshot from "./tools/URLScreenshot";
import toast from "react-hot-toast";
import domtoimage from "dom-to-image";
import { SaveIcon } from "ui/icons";
import Size from "./tools/Size";
import { cssGradientsDirections } from "constants/gradients";

const defaultOptions = {
  aspectRatio: "aspect-auto",
  theme: "from-indigo-400 via-blue-400 to-purple-600",
  bgDirection: "bg-gradient-to-br",
  wallpaper: "",
  watermark: true,
  customTheme: {
    colorStart: "#d2fefd",
    colorEnd: "#f3b4e1",
  },
  shadow: "drop-shadow-none",
  position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",

  roundedWrapper: "rounded-2xl",

  size: 85,

  // text
  text: {
    heading: "Made with Snapit.gg",
    subheading: "The best screenshot maker",
    show: false,
    color: "dark",
    size: "text-2xl",
    position: "top",
    align: "text-center",
  },
};

const AnimatedScreenshotMaker = ({ proMode }) => {
  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);

  const [image, setImage] = useState(null);
  const [blob, setBlob] = useState({ src: null, w: 0, h: 0 });
  const wrapperRef = useRef(null);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const saveImage = () => {
    const wrapperElement = wrapperRef.current;

    if (!blob.src) {
      toast.error("No image to Save");
      return;
    }

    domtoimage.toBlob(wrapperElement).then(() => {
      const link = document.createElement("a");
      link.download = `snapit-${new Date().toISOString()}.gif`;
      link.href = blob.src;
      setImage(link.href);
      link.click();
    });
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    setSize({ [e.target.name]: e.target.value });
  };

  const { width, height } = size;
  const renderPreview = () => (
    <article className="bg-[#2B2C2F] h-full p-8 rounded-md flex justify-center">
      {/* wrapper */}
      <div
        ref={wrapperRef}
        style={
          options?.customTheme
            ? {
                background: `linear-gradient(${
                  cssGradientsDirections[options.bgDirection]
                }, ${options?.customTheme?.colorStart || "transparent"}, ${
                  options?.customTheme?.colorEnd || "transparent"
                })`,
              }
            : {}
        }
        // className={`w-full relative overflow-hidden transition-all flex px-4 py-8 flex-col justify-center items-center`}
        className={` ${options.bgDirection} ${options.theme} ${
          options.roundedWrapper
        } flex p-4 ${
          options.text.position === "top" ? "flex-col" : "flex-col-reverse"
        } h-[600px] w-full relative overflow-hidden transition-all`}
      >
        {/* Text */}
        <div className=" bg-gradient-to-br from-indigo-400 via-blue-300 to-purple-300 rounded-2xl flex p-4 flex-col h-[600px] w-full relative overflow-hidden transition-all">
          <ReactTilt
            tiltAngleXManual={manualTiltAngleX}
            tiltAngleYManual={manualTiltAngleY}
            tiltMaxAngleY={30}
            tiltMaxAngleX={30}
            reset={false}
            className="flex justify-center items-center  h-[100%] mx-2 "
          >
            <div
              style={{
                transform: `scale(${options.size / 100})`,
              }}
            >
              <img
                src={blob.src}
                className="w-full h-full rounded-2xl  pointer-events-none select-none"
              />
            </div>
          </ReactTilt>
        </div>
      </div>
    </article>
  );

  const renderOptions = () => (
    <article className="bg-[#2B2C2F] rounded-md p-4 overflow-y-auto overflow-x-hidden max-h-[680px] custom-scrollbar">
      <div className="space-y-4 h-full flex flex-col">
        <h3 className="text-center text-gray-500 w-full">Device Options</h3>
        <div>
          <input
            type="number"
            name="width"
            onChange={handleChange}
            className="w-full p-3 text-center text-sm bg-[#212121] rounded-md border border-[#2B2C2F] text-white outline-none"
            placeholder="Enter Width"
          />
          <input
            type="number"
            name="height"
            onChange={handleChange}
            className="w-full p-3 mt-4 text-center text-sm bg-[#212121] rounded-md border border-[#2B2C2F] text-white outline-none"
            placeholder="Enter Height"
          />

          <URLScreenshot
            proMode={proMode}
            blob={blob}
            setBlob={setBlob}
            animate={true}
            target="desktop"
            animatedWidth={width}
            animatedHeight={height}
          />
        </div>

        {/* <Size
          options={options}
          setOptions={setOptions}
          label="Size"
          max="100"
          min="50"
        /> */}

        <div className="flex flex-row justify-between !mt-auto">
          <button
            className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white"
            title="Use Ctrl/Cmd + S to save the image"
            onClick={saveImage}
          >
            <span className="w-6 h-5 mr-2">{SaveIcon}</span>
            Save
          </button>
          <div className="px-1"></div>
        </div>
      </div>
    </article>
  );

  return (
    <section className="w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-[1fr,300px] gap-10">
      {renderPreview()} {renderOptions()}
    </section>
  );
};

export default AnimatedScreenshotMaker;
