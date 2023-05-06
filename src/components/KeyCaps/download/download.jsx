import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback } from "react";

import Button from "../button/button";
import handleDownload from "../utils/handle-download";
const formats = ["png", "jpg"];

const Download = ({ wrapperRef, className, filename }) => {
  const handleDownloadButton = useCallback(
    async (type) => {
      if (wrapperRef.current === null) {
        return;
      }
      handleDownload({ type, wrapperElement: wrapperRef.current, filename });
    },
    [wrapperRef, filename]
  );
  return (
    <section
      className={classNames(
        "border-gray-3 shadow-small flex flex-col rounded-xl border",
        className
      )}
    >
      <div className="border-gray-3 shadow-small relative rounded-t-xl rounded-b-none border-b bg-white py-[22.5px]">
        <h2 className="text-center text-lg font-medium uppercase leading-none">
          Save As
        </h2>
      </div>
      <div className="flex grow justify-center rounded-t-none rounded-b-xl bg-white py-8">
        <div className="flex h-min space-x-5">
          {formats.map((format) => (
            <Button
              pirsch-event="Image Saved"
              className="uppercase"
              key={format}
              size="lg"
              theme="outline-gray"
              onClick={() => handleDownloadButton(format)}
            >
              {format}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

Download.propTypes = {
  wrapperRef: PropTypes.object,
  className: PropTypes.string,
  filename: PropTypes.string,
};

Download.defaultProps = {
  className: null,
  wrapperRef: null,
  filename: "shortcut",
};

export default Download;
