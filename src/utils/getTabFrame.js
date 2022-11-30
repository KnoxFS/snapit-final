import { DashIcon, SquareIcon, XIcon } from "ui/icons";

const whitelist = ["toon", "silver", "silver_black"];

const frames = {
  hidden: () => "",
  mac_light: (roundness) => (
    <div
      className={`flex items-center w-full px-4 py-[10px] ${roundness} bg-white/80 transition`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-400 rounded-full" />
        <div className="w-3 h-3 bg-yellow-300 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
    </div>
  ),
  mac_dark: (roundness) => (
    <div
      className={`flex items-center w-full px-4 py-[10px] ${roundness} bg-black/40 transition`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-400 rounded-full" />
        <div className="w-3 h-3 bg-yellow-300 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
    </div>
  ),
  windows_light: (roundness) => (
    <div
      className={`flex items-center justify-end w-full px-4 py-[10px] ${roundness} bg-white/80 transition`}
    >
      <div className="flex items-center space-x-4">
        <div>
          <DashIcon className="w-3" />
        </div>
        <div>
          <SquareIcon className="w-3" />
        </div>
        <div>
          <XIcon className="w-3" />
        </div>
      </div>
    </div>
  ),
  windows_dark: (roundness) => (
    <div
      className={`flex items-center justify-end w-full px-4 py-[10px] ${roundness} bg-dark/80 transition`}
    >
      <div className="flex items-center space-x-4">
        <div>
          <DashIcon className="w-3 text-white" />
        </div>
        <div>
          <SquareIcon className="w-3 text-white" />
        </div>
        <div>
          <XIcon className="w-3 text-white" />
        </div>
      </div>
    </div>
  ),

  toon: (roundness) => (
    <div
      className={`w-full h-full absolute top-[5px] left-[5px] ${roundness} bg-dark/80 transition`}
    ></div>
  ),

  silver: (roundness) => (
    <div
      className={`w-[102%] h-[105%] absolute ${roundness} bg-white/50 transition`}
    ></div>
  ),

  silver_black: (roundness) => (
    <div
      className={`w-[102%] h-[105%] absolute ${roundness} bg-dark/50 transition`}
    ></div>
  ),
};

const getTabFrame = (browserBar = "hidden", roundness = "rounded-xl") => {
  // replace roundness (rounded-x) for top with rounded-t-x
  const rounded = roundness.replace("rounded", "rounded-t");

  if (whitelist.includes(browserBar)) return frames[browserBar](roundness);

  return frames[browserBar](rounded);
};

export default getTabFrame;
