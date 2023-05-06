import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { MacIcon } from "ui/icons";
const MacSymbolShow = ({ enabled, setEnabled, settings, setSetting }) => {
  return (
    <div className="grid w-full grid-cols-[180px,2em,1fr]">
      <div className="flex items-center space-x-2">
        <MacIcon />

        <h3 className="text-sm text-white">Mac Symbols</h3>
      </div>

      {/* tip */}
      <div className="relative">
        <QuestionMarkCircleIcon className="h-6 w-6 cursor-pointer text-white [&~div]:hover:block" />
        <div className="absolute top-full left-1/2 z-50 hidden w-44 -translate-x-1/2 transform rounded-md bg-dark/40 p-2 text-center shadow-md backdrop-blur-sm hover:block">
          <p className="text-sm text-white">Simulates the edit in Symbols.</p>
        </div>
      </div>

      <label className="relative mr-5 inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={enabled}
          readOnly
        />
        <div
          onClick={() => {
            setEnabled(!enabled);
            setSetting({ macChars: !settings.macChars });
          }}
          className="peer h-6 w-11 rounded-full bg-bgToggle  after:absolute  after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-bgOnToggle peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300"
        ></div>
      </label>
    </div>
  );
};

export default MacSymbolShow;
