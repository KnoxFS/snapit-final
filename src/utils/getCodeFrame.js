import { DashIcon, SquareIcon, XIcon } from "ui/icons";

const lightThemes = [
  "BB Edit",
  "Duotone Light",
  "Eclipse",
  "Github Light",
  "XCode Light",
];

const frames = {
  hidden: () => "",
  mac: (light) => (
    <div className="flex items-center space-x-2 [&>*]:w-3 [&>*]:h-3 [&>*]:rounded-full">
      <div className="bg-red-500"></div>
      <div className="bg-orange-400"></div>
      <div className="bg-green-500"></div>
    </div>
  ),
  windows: (light) => (
    <div className={`flex items-center space-x-4 [&>*]:w-3 [&>*]:h-3 ${light ? "text-[#11111]" : "text-white"}`}>
      <div>
        <DashIcon />
      </div>
      <div>
        <SquareIcon />
      </div>
      <div>
        <XIcon />
      </div>
    </div>
  ),
};

const getCodeFrame = (browserBar = "hidden", theme) => {
  // if light pass theme
  if (lightThemes.includes(theme)) return frames[browserBar](true);

  return frames[browserBar](false);
};

export default getCodeFrame;
