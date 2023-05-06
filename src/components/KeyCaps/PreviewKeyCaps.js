import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useRef, useEffect } from "react";
import Slider from "react-slick";

import KeysCombination from "components/KeyCaps/Key-Combination";
import THEMES from "components/KeyCaps/utils/theme-data";

import Configurator from "./preview/configurator";
import ChevronRight from "./images/chevron-right.inline.svg";
// import MoonSvg from './images/moon.inline.svg';
// import SunSvg from './images/sun.inline.svg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// const modes = [
//   { icon: SunSvg, mode: 'light', value: true },
//   { icon: MoonSvg, mode: 'dark', value: false },
// ];

const PreviewKeyCaps = ({
  className,
  value,
  themeSelected,
  setThemeSelected,
  wrapperRef,
}) => {
  // const [toggledMode, setToggledMode] = useState(false);
  const sliderRef = useRef();

  const sliderConfig = {
    infinite: true,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (indexOfCurrentSlide) => {
      setThemeSelected(THEMES[indexOfCurrentSlide]);
    },
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(THEMES.indexOf(themeSelected));
    }
  }, [sliderRef, themeSelected]);

  return (
    <section
      className={classNames(
        className,
        "flex flex-col rounded-xl border border-gray-3 shadow-small"
      )}
    >
      <div className="relative rounded-t-xl rounded-b-none border-b border-gray-3 bg-white py-[22.5px] shadow-small">
        <h2 className="text-center text-lg font-medium uppercase leading-none">
          Preview
        </h2>

        {/* <Switch
          className="absolute top-1/2 right-3 flex -translate-y-1/2 rounded-lg bg-gray-1 py-1.5 px-2"
          checked={toggledMode}
          onChange={setToggledMode}
        >
          <span className="sr-only">Enable dark mode</span>
          {modes.map(({ icon: Icon, mode, value }) => (
            <span
              className={classNames(
                'inline-block rounded-md py-1.5 px-2 transition-all duration-150',
                toggledMode === value ? 'bg-enabled-mode' : ''
              )}
              key={mode}
            >
              <Icon />
            </span>
          ))}
        </Switch> */}
      </div>
      <div className="relative flex flex-col items-center bg-white">
        <Slider className="w-full py-20" ref={sliderRef} {...sliderConfig}>
          {THEMES.map((themeId) => (
            <div className="!flex justify-center" key={themeId}>
              <KeysCombination
                wrapperRef={wrapperRef}
                themeSelected={themeSelected}
                value={value}
                theme={themeId}
                size="lg"
              />
            </div>
          ))}
        </Slider>
        <button
          className="absolute top-1/2 right-8 -translate-y-1/2 p-1.5"
          type="button"
          onClick={() => sliderRef?.current?.slickNext()}
        >
          <ChevronRight />
        </button>
        <button
          className="absolute top-1/2 left-8 -translate-y-1/2 -rotate-180 p-1.5"
          type="button"
          onClick={() => sliderRef?.current?.slickPrev()}
        >
          <ChevronRight />
        </button>
      </div>
      <Configurator className="rounded-b-xl border-t border-gray-200 bg-white py-10 px-6" />
    </section>
  );
};

PreviewKeyCaps.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array.isRequired,
  themeSelected: PropTypes.string,
  setThemeSelected: PropTypes.func.isRequired,
  wrapperRef: PropTypes.object,
};

PreviewKeyCaps.defaultProps = {
  className: null,
  themeSelected: "light",
  wrapperRef: null,
};

export default PreviewKeyCaps;
