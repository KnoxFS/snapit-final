import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import KeysCombination from "../keys-combination/keys-combination";
import THEMES from "../utils/theme-data";

const Design = ({ className, themeSelected, setSelected, value }) => (
  // <div className="rounded-t-none rounded-b-xl bg-gray-100 pt-8 pb-6">
  <RadioGroup
    className="flex grow justify-center"
    value={themeSelected}
    onChange={setSelected}
  >
    {/* <RadioGroup.Label className="sr-only">Keys Design</RadioGroup.Label> */}
    <div className="flex flex-col space-y-2.5">
      {THEMES.map((theme) => (
        <RadioGroup.Option key={theme} value={theme} className="cursor-pointer">
          {({ checked }) => (
            <>
              <RadioGroup.Label className="sr-only">{theme}</RadioGroup.Label>
              <RadioGroup.Description
                as="div"
                className={classNames(
                  "max-w-[180px] rounded-lg border border-transparent py-3 px-6 transition-all duration-200",
                  checked && "border-dashed border-dark bg-bgKeysDark",
                  !checked && "bg-stone-200"
                )}
              >
                <KeysCombination theme={theme} value={value} size="md" />
              </RadioGroup.Description>
            </>
          )}
        </RadioGroup.Option>
      ))}
    </div>
  </RadioGroup>
  // </div>
);

Design.propTypes = {
  className: PropTypes.string,
  themeSelected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  value: PropTypes.array.isRequired,
};

Design.defaultProps = {
  className: null,
};
export default Design;
