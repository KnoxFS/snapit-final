import { useState, useEffect } from "react";

const Size = ({ options, setOptions, label, max, min }) => {
  // save initial value
  const [initialValue, setInitialValue] = useState(options.size);

  useEffect(() => {
    setInitialValue(options.size);
  }, []);

  return (
    <div className="col-span-2 mb-4">
      <header className="flex items-center justify-between">
        <h3 className="text-sm text-gray-400">
          {label || "Size"}{" "}
          <sup className="bg-[#212121] py-0.5 px-1 rounded-md">
            {options.size}
          </sup>{" "}
        </h3>

        <button
          className="bg-[#212121] py-1 px-2 rounded-md text-xs text-gray-400 hover:bg-opacity-80 transition"
          onClick={() => {
            setOptions((prev) => ({
              ...prev,
              size: initialValue,
            }));
          }}
        >
          Reset
        </button>
      </header>

      {/* range slider */}

      <input
        type="range"
        min={min || "50"}
        max={max || "120"}
        step="1"
        value={options.size}
        onChange={(e) =>
          setOptions({
            ...options,
            size: parseInt(e.target.value),
          })
        }
        className="w-full accent-green-400 appearance-none h-1.5 rounded-sm bg-[#212121] cursor-grab"
      />
    </div>
  );
};

export default Size;
