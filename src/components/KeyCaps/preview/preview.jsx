import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import KeysCombination from "../keys-combination/keys-combination";
import THEMES from "../utils/theme-data";
import { FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Preview = ({
  className,
  value,
  themeSelected,
  setThemeSelected,
  wrapperRef,
}) => {
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
        "border-gray-3 shadow-small flex flex-col rounded-xl"
      )}
    >
      <div className=" flex flex-col items-center">
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
          className="absolute top-1/2 right-0 -translate-y-1/2 p-1.5"
          type="button"
          onClick={() => sliderRef?.current?.slickNext()}
          style={{ position: "absolute", right: "-245px" }}
        >
          <FaChevronRight />
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 -rotate-180 p-1.5"
          type="button"
          onClick={() => sliderRef?.current?.slickPrev()}
          style={{ position: "absolute", left: "-250px" }}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

Preview.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array.isRequired,
  themeSelected: PropTypes.string,
  setThemeSelected: PropTypes.func.isRequired,
  wrapperRef: PropTypes.object,
};

Preview.defaultProps = {
  className: null,
  themeSelected: "light",
  wrapperRef: null,
};

export default Preview;
