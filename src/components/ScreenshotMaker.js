import { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";
import classnames from "classnames";

import { useHotkeys } from "react-hotkeys-hook";
import {
  ResetIcon,
  SaveIcon,
  ClipboardIcon,
  ColorPickerIcon,
  BackgroundIcon,
  UploadIcon,
  TwitterIcon,
  InstagramIcon,
  GitHubIcon,
  LinkedInIcon,
} from "ui/icons";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
  PhotoIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { Disclosure, RadioGroup, Tab } from "@headlessui/react";

import ReactTilt from "react-parallax-tilt";

// utils
import getTabFrame from "utils/getTabFrame";
import getImageRadius from "utils/getImageRadius";
import bufferToBase64 from "utils/bufferToBase64";
import cropImage from "utils/cropImage";

import updateStats from "utils/updateStats";

import useAuth from "hooks/useAuth";

import useWindowSize from "hooks/useWindowSize";

import Confetti from "react-confetti";
import { supabase } from "lib/supabase";

// Tools
import AspectRatio from "./tools/AspectRatio";
import BrowserFrame from "./tools/BrowserFrame";
import EditText from "./tools/EditText";
import Padding from "./tools/Padding";
import Shadow from "./tools/Shadow";
import Roundness from "./tools/Roundness";
import Tilt from "./tools/Tilt";
import ScreenshotPosition from "./tools/ScreenshotPosition";
import CustomWatermark from "./tools/CustomWatermark";
import Noise from "./tools/Noise";
import SnapitWatermark from "./tools/SnapitWatermark";

import CropModal from "components/CropModal";

import {
  cssGradientsDirections,
  gradientDirections,
  wallpapers,
} from "constants/gradients";

const isValidHexColor = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

const whitelist = ["toon", "silver", "silver_black", "hidden"];

const defaultOptions = {
  aspectRatio: "aspect-auto !scale-100",
  theme: "from-green-300 via-yellow-200 to-green-200",
  bgDirection: "bg-gradient-to-br",
  background: "",
  customTheme: {
    colorStart: "#d2fefd",
    colorEnd: "#f3b4e1",
  },
  padding: "p-10",
  rounded: "rounded-2xl",
  roundedWrapper: "rounded-2xl",
  shadow: "drop-shadow-xl",
  noise: false,
  browserBar: "mac_dark",
  position: "",
  watermark: true,
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

  // custom watermark
  customWatermark: {
    text: "",
    link: "yourwebsite.com",
    twitter: "",
    linkedin: "",
    youtube: "",
    instagram: "",
    github: "",

    show: false,
    color: "bg-gray-500/20 text-dark",
    position: "bottom-5",
  },
};

export default function ScreenshotMaker({ proMode }) {
  const { user, getUser, setShowBuyPro } = useAuth();

  const wrapperRef = useRef();

  const [blob, setBlob] = useState({ src: null, w: 0, h: 0 });
  const [bgPicker, setBGPicker] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    watermark: !proMode,
  });

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [fetchingWebsite, setFetchingWebsite] = useState(false);

  const [[manualTiltAngleX, manualTiltAngleY], setManualTiltAngle] = useState([
    0, 0,
  ]);

  const [optionsOpen, setOptionsOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState("");

  // crop
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState();

  const [completedCrop, setCompletedCrop] = useState();

  const { width, height } = useWindowSize();

  // shortcuts
  useHotkeys(
    "ctrl+shift+c",
    (e) => {
      e.preventDefault();
      copyImage();
    },
    [blob.src]
  );

  useHotkeys(
    "ctrl+shift+s",
    (e) => {
      e.preventDefault();
      saveImage();
    },
    [blob.src]
  );

  useHotkeys(
    "ctrl+shift+v",
    (e) => {
      onPaste(e);
    },
    [blob.src]
  );

  const onTiltMove = (stick) => {
    setManualTiltAngle([stick.y ? stick.y / 2 : 0, stick.x ? stick.x / 2 : 0]);
  };

  const handleCropImage = () => {
    setShowCropModal(true);
  };

  const saveCrop = (crop) => {
    const image = new Image();
    image.src = blob.src;

    image.onload = async () => {
      // assign scaled width and height to image object
      image.width = blob.w;
      image.height = blob.h;

      const res = await cropImage(image, crop);
      const url = URL.createObjectURL(res);

      setBlob({ src: url, w: image.naturalWidth, h: image.naturalHeight });
      setCrop(null);
      setShowCropModal(false);
    };
  };

  // snapshot for copy image to clipboard
  const snapshotCreator = () => {
    return new Promise((resolve, reject) => {
      try {
        const scale = window.devicePixelRatio;
        const element = wrapperRef.current; // You can use element's ID or Class here
        domtoimage
          .toBlob(element, {
            height: element.offsetHeight * scale,
            width: element.offsetWidth * scale,
            style: {
              transform: "scale(" + scale + ")",
              transformOrigin: "top left",
              width: element.offsetWidth + "px",
              height: element.offsetHeight + "px",
            },
          })
          .then((blob) => {
            resolve(blob);
          });
      } catch (e) {
        reject(e);
      }
    });
  };

  // export image
  const saveImage = async () => {
    if (!blob?.src) {
      toast.error("Nothing to save, make sure to add a screenshot first!");
      return;
    }
    let savingToast = toast.loading("Exporting image...");
    const scale = window.devicePixelRatio;
    domtoimage
      .toPng(wrapperRef.current, {
        height: wrapperRef.current.offsetHeight * scale,
        width: wrapperRef.current.offsetWidth * scale,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
          width: wrapperRef.current.offsetWidth + "px",
          height: wrapperRef.current.offsetHeight + "px",
        },
      })
      .then(async (data) => {
        domtoimage
          .toPng(wrapperRef.current, {
            height: wrapperRef.current.offsetHeight * scale,
            width: wrapperRef.current.offsetWidth * scale,
            style: {
              transform: "scale(" + scale + ")",
              transformOrigin: "top left",
              width: wrapperRef.current.offsetWidth + "px",
              height: wrapperRef.current.offsetHeight + "px",
            },
          })
          .then(async (data) => {
            var a = document.createElement("A");
            a.href = data;
            a.download = `snapit-${new Date().toISOString()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success("Image exported!", { id: savingToast });

            if (window.pirsch) {
              pirsch("🎉 Screenshot saved");
            }

            setShowConfetti(true);

            if (user) {
              // update stats
              updateStats(user.id, "Screenshot_Saved");
            }

            setTimeout(() => {
              setShowConfetti(false);
            }, 2000);
          });
      });
  };

  // copy image to clipboard
  const copyImage = () => {
    if (!blob?.src) {
      toast.error("Nothing to copy, make sure to add a screenshot first!");
      return;
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator?.userAgent
    );
    const isNotFirefox = navigator.userAgent.indexOf("Firefox") < 0;

    if (isSafari) {
      navigator.clipboard
        .write([
          new ClipboardItem({
            "image/png": new Promise(async (resolve, reject) => {
              try {
                await snapshotCreator();
                const blob = await snapshotCreator();
                resolve(new Blob([blob], { type: "image/png" }));
              } catch (err) {
                reject(err);
              }
            }),
          }),
        ])
        .then(() => {
          // Success
          toast.success("Image copied to clipboard");

          if (window.pirsch) {
            pirsch("🙌 Screenshot copied");
          }

          if (user) {
            // update stats
            updateStats(user.id, "Screenshot_Copied");
          }
        })
        .catch((err) =>
          // Error
          toast.success(err)
        );
    } else if (isNotFirefox) {
      navigator?.permissions
        ?.query({ name: "clipboard-write" })
        .then(async (result) => {
          if (result.state === "granted") {
            const type = "image/png";
            await snapshotCreator();
            const blob = await snapshotCreator();
            let data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard
              .write(data)
              .then(() => {
                // Success
                toast.success("Image copied to clipboard");

                if (window.pirsch) {
                  pirsch("🙌 Screenshot copied");
                }

                if (user) {
                  // update stats
                  updateStats(user.id, "Screenshot_Copied");
                }
              })
              .catch((err) => {
                // Error
                console.error("Error:", err);
              });
          }
        });
    } else {
      alert("Firefox does not support this functionality");
    }
  };

  // save options as preset
  const savePreset = async () => {
    if (!presetName) {
      toast.error("Please enter a name for your preset");
      return;
    }

    const toastId = toast.loading("Saving preset...");
    // get current presets from db
    const { data } = await supabase
      .from("users")
      .select("presets")
      .eq("user_id", user.id)
      .single();

    const preset = {
      options,
      tilt: [manualTiltAngleX, manualTiltAngleY],
      name: presetName,
    };

    const { error } = await supabase
      .from("users")
      .update({
        presets: {
          ...data.presets,
          screenshots: [...data.presets.screenshots, preset],
        },
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message, {
        id: toastId,
      });
    }

    toast.success("Preset saved!", {
      id: toastId,
    });

    // cleanup
    setPresetName("");
    setShowPresetModal(false);

    // refresh data
    await getUser();
  };

  const handleSavePreset = async () => {
    if (showPresetModal) {
      await savePreset();
    } else {
      setShowPresetModal(true);
    }
  };

  const setPreset = (options) => {
    // set preset options
    setOptions(options);

    // set options tab
    setActiveTabIndex(0);

    toast.success("Preset loaded!");
  };

  const handleDeletePreset = async (presetName) => {
    const toastId = toast.loading("Deleting preset...");

    // get current presets from db
    const { data } = await supabase
      .from("users")
      .select("presets")
      .eq("user_id", user.id)
      .single();

    const filteredPresets = data.presets.screenshots.filter(
      (p) => p.name !== presetName
    );

    const { error } = await supabase
      .from("users")
      .update({ presets: { ...data.presets, screenshots: filteredPresets } })
      .eq("user_id", user.id);

    if (error) {
      toast.error(error.message, {
        id: toastId,
      });
    }

    toast.success("Preset deleted!", {
      id: toastId,
    });

    // refresh data
    await getUser();
  };

  const setDemoImage = () => {
    setBlob({
      src: "/demo.png",
      w: 1920,
      h: 1080,
    });
  };

  const onPaste = async (event) => {
    var items =
      (event?.clipboardData || event?.originalEvent?.clipboardData)?.items ||
      event?.target?.files ||
      event?.dataTransfer?.files;
    var index = 0;
    for (index in items) {
      var item = items[index];
      if (item.kind === "file" || item?.type?.includes("image")) {
        var blob = item?.kind ? item.getAsFile() : item;
        var reader = new FileReader();
        reader.onload = function (event) {
          setBlob({ ...blob, src: event.target.result });
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const getWebsiteScreenshot = async () => {
    if (!proMode) {
      toast.error("This feature is only available in pro mode");
      return;
    }

    // valid url with http or https
    if (!websiteUrl.match(/^(http|https):\/\//)) {
      toast.error("Please enter a valid url (https://example.com).");
      return;
    }

    if (websiteUrl.length > 0) {
      let toastId = toast.loading("Getting website screenshot...");
      setFetchingWebsite(true);

      const res = await fetch(
        `/api/getScreenshot?url=${encodeURIComponent(websiteUrl)}`
      );
      const { image, error } = await res.json();

      if (error) {
        toast.error(error, { id: toastId });
        setFetchingWebsite(false);

        return;
      }

      const finalImage = bufferToBase64(image.data);

      setBlob({ ...blob, src: `data:image/png;base64,${finalImage}` });

      toast.success("Website screenshot loaded!", { id: toastId });
      setFetchingWebsite(false);

      if (window.pirsch) {
        pirsch("🙌 Screenshot gotten from URL");
      }

      return;
    }

    toast.error("No url provided.");
    return;
  };

  const resetCanvas = () => {
    setBlob({ src: null, width: 0, height: 0 });
    setOptions(defaultOptions);

    setManualTiltAngle([0, 0]);
    setWebsiteUrl("");
  };

  const pickBackground = () => {
    return (
      <>
        {bgPicker ? (
          <div
            className="fixed inset-0 w-full h-full bg-transparent"
            onClick={() => setBGPicker(false)}
          />
        ) : (
          ""
        )}
        <div
          className={classnames(
            "absolute w-auto max-w-[400px] z-10 top-[calc(100%)] left-[-30px] bg-white/80 backdrop-blur shadow-lg py-4 px-5 rounded-xl flex shadow-gray-500/50 dark:shadow-black/80 border border-gray-400 flex-col dark:border-gray-800 dark:bg-black/80 duration-200",
            {
              "opacity-0 pointer-events-none scale-[0.9]": !bgPicker,
            },
            {
              "opacity-100 pointer-events-auto scale-[1]": bgPicker,
            }
          )}
        >
          <div
            className="absolute top-[5%] right-[5%] opacity-50 cursor-pointer hover:opacity-100 z-10"
            onClick={() => setBGPicker(false)}
          >
            ✕
          </div>
          <div className="relative mb-3">
            {/* Pick Start Color */}
            <div className="mb-1">Pick first color</div>
            <div className="flex items-center">
              <div className="relative group">
                <input
                  id="startColorPicker"
                  type="color"
                  className="absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 cursor-pointer"
                  value={options.customTheme.colorStart || "#222"}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customTheme: {
                        ...options.customTheme,
                        colorStart: e.target.value,
                      },
                    })
                  }
                />
                <label
                  style={{
                    backgroundColor: options?.customTheme?.colorStart || "#222",
                  }}
                  htmlFor="startColorPicker"
                  className="left-0 flex items-center justify-center w-12 h-12 rounded-full pointer-events-none text-white/50 group-hover:scale-[1.1] duration-100"
                >
                  <span className="font-mono text-xs text-white/80 drop-shadow">
                    Pick
                  </span>
                </label>
              </div>
              <span className="px-4 opacity-50">/</span>
              <input
                placeholder="Enter hex value"
                type="text"
                value={options.customTheme.colorStart || "#000000"}
                className="px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:outline-none focus:border-black"
                onChange={(e) => {
                  let startColorToast;
                  setOptions({
                    ...options,
                    customTheme: {
                      ...options.customTheme,
                      colorStart: e.target.value,
                    },
                  });
                  if (e.target.value.match(isValidHexColor)) {
                    toast.dismiss(startColorToast);
                    toast.success("First color applied", {
                      id: startColorToast,
                    });
                  } else {
                    toast.dismiss(startColorToast);
                    toast.error("Invalid Hex color", { id: startColorToast });
                  }
                }}
              />
            </div>
          </div>

          {/* Pick End Color */}
          <div>
            <div className="mb-1">Pick second color</div>
            <div className="flex items-center">
              <div className="relative group">
                <input
                  id="startColorPicker"
                  type="color"
                  className="absolute top-0 left-0 w-12 h-12 rounded-full opacity-0 cursor-pointer"
                  value={options.customTheme.colorEnd || "#222"}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customTheme: {
                        ...options.customTheme,
                        colorEnd: e.target.value,
                      },
                    })
                  }
                />
                <label
                  style={{
                    backgroundColor: options?.customTheme?.colorEnd || "#222",
                  }}
                  htmlFor="startColorPicker"
                  className="left-0 flex items-center justify-center w-12  h-12 rounded-full pointer-events-none text-white/50 group-hover:scale-[1.1] duration-100"
                >
                  <span className="font-mono text-xs text-white/80 drop-shadow">
                    Pick
                  </span>
                </label>
              </div>
              <span className="px-4 opacity-50">/</span>
              <input
                placeholder="Enter hex value"
                type="text"
                value={options.customTheme.colorEnd || "#000000"}
                className="px-2 py-1 font-mono text-base text-black border-2 border-gray-500 rounded-lg focus:outline-none focus:border-black"
                onChange={(e) => {
                  let endColorToast;
                  setOptions({
                    ...options,
                    customTheme: {
                      ...options.customTheme,
                      colorEnd: e.target.value,
                    },
                  });
                  if (e.target.value.match(isValidHexColor)) {
                    toast.dismiss(endColorToast);
                    toast.success("Second color applied", {
                      id: endColorToast,
                    });
                  } else {
                    toast.dismiss(endColorToast);
                    toast.error("Invalid Hex color", { id: endColorToast });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderOptions = () => {
    return (
      <Tab.Group
        as="div"
        className="relative"
        selectedIndex={activeTabIndex}
        onChange={setActiveTabIndex}
      >
        {/* Minimize button */}
        <div
          className="hidden md:block absolute top-1/2 -right-9 py-6 px-1 -translate-x-1/2 cursor-pointer rounded-r-2xl bg-[#2B2C2F]"
          onClick={() => setOptionsOpen(false)}
        >
          <ChevronLeftIcon className="w-4 h-4 text-white" />
        </div>

        {/* tabs */}

        <Tab.List className="absolute w-52 -rotate-90 top-1/2 -left-[115px] px-6 py-1 cursor-pointer rounded-t-xl bg-[#2B2C2F] text-white text-sm flex flex-row-reverse justify-between">
          <Tab
            as="button"
            className="ui-selected:bg-green-500 px-2 rounded-md outline-none"
          >
            Options
          </Tab>
          <Tab
            as="button"
            className="ui-selected:bg-green-500 px-2 rounded-md outline-none"
          >
            Presets
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* options */}
          <Tab.Panel>
            <div className="p-6 lg:p-8 rounded-md bg-[#2B2C2F] w-full relative mt-10 lg:mt-0 h-auto md:max-h-[550px] overflow-y-scroll custom-scrollbar">
              {/* Pro plan tooltip */}
              {!proMode && (
                <div className="bg-green-400 p-4 rounded-md text-white flex flex-col md:flex-row text-center md:text-left items-center justify-between mb-4">
                  <p className="w-[60%] text-xs">
                    Premium features are avaiable in PRO Account
                  </p>

                  <button
                    onClick={() => setShowBuyPro(true)}
                    className="bg-[#232323] w-max p-2 rounded-md text-xs mt-4 md:mt-0"
                  >
                    Get Snapit Pro
                  </button>
                </div>
              )}

              <div className="relative flex flex-row flex-wrap items-start justify-start space-y-5 lg:items-start lg:flex-col">
                <h3 className="text-center text-gray-500 w-full">
                  Screenshot Options
                </h3>

                {/* Aspect Ratio */}
                <AspectRatio options={options} setOptions={setOptions} />

                {/* Browser frame */}
                <BrowserFrame
                  options={options}
                  setOptions={setOptions}
                  whitelist={whitelist}
                />

                {/* Padding */}
                <Padding options={options} setOptions={setOptions} />

                {/* Shadow */}
                <Shadow options={options} setOptions={setOptions} />

                {/* Roundness */}
                <Roundness
                  options={options}
                  setOptions={setOptions}
                  target="screenshot"
                />

                {/* Screenshot tilt */}
                <Tilt
                  proMode={proMode}
                  onTiltMove={onTiltMove}
                  setManualTiltAngle={setManualTiltAngle}
                />

                {/* canvas opts */}

                <h3 className="text-center text-gray-500 w-full">
                  Canvas Options
                </h3>

                {/* Background */}
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full">
                        <div className="relative flex items-center justify-between pb-2 text-sm text-gray-400 w-full">
                          <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                              <BackgroundIcon className="h-6 w-6 text-[#A0A0A0]" />

                              <h3 className="text-sm text-gray-400">
                                Background
                              </h3>
                            </div>

                            <div className="relative">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBGPicker(!bgPicker);
                                }}
                                className="flex items-center px-2 ml-2 rounded-lg cursor-pointer bg-green-400 text-white"
                              >
                                <span className="w-3 h-3 mr-1">
                                  {ColorPickerIcon}
                                </span>
                                Pick
                              </div>
                            </div>
                            {pickBackground()}
                          </div>
                          <ChevronRightIcon
                            className={`${
                              open ? "rotate-90 transform" : ""
                            } h-5 w-5 text-gray-500`}
                          />
                        </div>
                      </Disclosure.Button>

                      <Disclosure.Panel className="w-full overflow-x-scroll scrollbar-none">
                        <div>
                          <div className="grid flex-wrap grid-cols-6 mt-1 gap-x-4 gap-y-2">
                            {[
                              "bg-gradient-to-br from-pink-300 via-orange-200 to-red-300",
                              "bg-gradient-to-br from-green-300 via-yellow-200 to-green-200",
                              "bg-gradient-to-br from-green-200 via-blue-100 to-blue-300",
                              "bg-gradient-to-br from-indigo-300 via-blue-400 to-purple-500",
                              "bg-gradient-to-br from-red-300 via-orange-300 to-yellow-200",
                              "bg-gradient-to-br from-pink-300 via-pink-400 to-red-400",
                              "bg-gradient-to-br from-slate-400 via-gray-500 to-gray-700",
                              "bg-gradient-to-br from-orange-300 via-orange-400 to-red-400",
                              "bg-gradient-to-br from-teal-300 to-cyan-400",
                              "bg-gradient-to-br from-red-300 to-purple-600",
                              "bg-white",
                              "bg-black",
                            ].map((theme) => (
                              <div
                                key={theme}
                                className={`cursor-pointer shadow dark:shadow-black/20 shadow-gray-500/20 w-8 h-8 rounded-full ${theme}`}
                                onClick={() => {
                                  setOptions({
                                    ...options,
                                    theme: theme,
                                    customTheme: false,
                                    background: "",
                                  });
                                }}
                              />
                            ))}
                          </div>

                          <div className="grid flex-wrap grid-cols-6 mt-2 gap-x-4 gap-y-2">
                            {wallpapers.map((wallpaper) => (
                              <div
                                key={wallpaper.name}
                                className="cursor-pointer shadow dark:shadow-black/20 shadow-gray-500/20 w-8 h-8 rounded-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${wallpaper.src})`,
                                }}
                                onClick={() => {
                                  setOptions({
                                    ...options,
                                    background: wallpaper.src,
                                    customTheme: false,
                                  });
                                }}
                              />
                            ))}
                          </div>

                          {/* gradient direction */}
                          <RadioGroup
                            className="flex items-center space-x-2 mt-4"
                            value={options.bgDirection}
                            onChange={(value) =>
                              setOptions({
                                ...options,
                                bgDirection: value,
                              })
                            }
                          >
                            {gradientDirections.map((gd) => (
                              <RadioGroup.Option
                                key={gd}
                                value={gd.value}
                                className="border p-1 rounded-md ui-checked:border-green-400 cursor-pointer"
                              >
                                <span>{gd.icon}</span>
                              </RadioGroup.Option>
                            ))}
                          </RadioGroup>
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                {/* Edit Text */}
                <EditText options={options} setOptions={setOptions} />

                {/* Roundness */}
                <Roundness
                  options={options}
                  setOptions={setOptions}
                  target="wrapper"
                />

                {/* Position */}
                <ScreenshotPosition options={options} setOptions={setOptions} />

                {/* Custom watermark */}
                <CustomWatermark options={options} setOptions={setOptions} />

                {/* Noise */}
                <Noise options={options} setOptions={setOptions} />

                {/* Snapit Watermark */}
                <SnapitWatermark
                  options={options}
                  setOptions={setOptions}
                  proMode={proMode}
                />

                {/* Reset */}
                <div
                  onClick={resetCanvas}
                  className="flex items-center justify-center w-full mx-auto text-green-400 cursor-pointer !mt-8"
                >
                  <span className="w-4 h-4 mr-1">{ResetIcon}</span>
                  Reset
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* presets */}
          <Tab.Panel>
            <div className="p-8 rounded-md bg-[#2B2C2F] w-full min-h-[550px] overflow-y-scroll custom-scrollbar">
              {!proMode && (
                <div className="text-center text-gray-400">
                  <h3>
                    Save time applying customizations with Presets. You can save
                    your customizations and apply them later with just
                    one-click.
                  </h3>

                  <button
                    onClick={() => setShowBuyPro(true)}
                    className="bg-green-400 text-white w-full p-2 rounded-md mt-6"
                  >
                    Get Snapit Pro
                  </button>
                </div>
              )}

              {proMode && (
                <article className="space-y-4">
                  <h3 className="text-center text-gray-500 w-full">Presets</h3>

                  {user?.presets?.screenshots?.length === 0 && (
                    <div className="text-center text-gray-400 mt-6">
                      <h3>
                        You don't have any presets yet. Create one by clicking
                        the "Save as Preset" button.
                      </h3>
                    </div>
                  )}

                  {user?.presets?.screenshots?.map((preset, i) => (
                    <div className="flex items-center space-x-2" key={i}>
                      <button
                        key={preset.id}
                        className="flex items-center justify-between w-full p-2 rounded-md bg-dark/40 hover:bg-dark/80 transition"
                        onClick={() => setPreset(preset.options)}
                      >
                        <p className="text-sm text-gray-400">{preset.name}</p>
                      </button>

                      <button
                        onClick={async () =>
                          await handleDeletePreset(preset.name)
                        }
                      >
                        <TrashIcon className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </article>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    );
  };

  const optionsPlaceholder = () => {
    return (
      <div className="w-6 h-full min-h-[550px] bg-[#2B2C2F] rounded-md relative">
        {/* Minimize button */}
        <div
          className="absolute top-1/2 -right-9 py-6 px-1 -translate-x-1/2 cursor-pointer rounded-r-2xl bg-[#2B2C2F]"
          onClick={() => setOptionsOpen(true)}
        >
          <ChevronLeftIcon className="w-4 h-4 text-white rotate-180" />
        </div>
      </div>
    );
  };

  return (
    <div
      id="screenshots"
      className="relative w-full my-32 min-h-screen md:min-h-[95vh] bg-[#232323] p-4 md:p-10 rounded-md "
      onPaste={onPaste}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      onDragLeave={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onPaste(e);
      }}
    >
      <Confetti
        className="oveflow-hidden !w-full !fixed !inset-0 !z-50"
        width={width}
        height={height}
        numberOfPieces={showConfetti ? 200 : 0}
        onConfettiComplete={(confetti) => {
          confetti.reset();
          setShowConfetti(false);
        }}
        recycle={false}
      />

      {/* Handle buttons */}
      <div className="md:flex items-center justify-end w-full space-y-4 md:space-y-0 [&>*]:w-full md:[&>*]:w-max md:space-x-6 mb-6">
        {!proMode && (
          <p className="md:absolute mb-6 md:mb-0 left-12 text-gray-500 text-sm text-center">
            Features with ⚡ are only available for pro version.
          </p>
        )}

        {showPresetModal && user?.isPro && (
          <input
            type="text"
            placeholder="Preset's name"
            className="py-2 px-4 rounded-md bg-[#212121] outline-none ring-1 ring-transparent focus:ring-green-400 text-white"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
        )}

        {user && user.isPro && (
          <button
            className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white"
            onClick={handleSavePreset}
          >
            <span className="w-6 h-6 mr-2">{SaveIcon}</span>
            Create Preset
          </button>
        )}

        {blob?.src && (
          <label className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white cursor-pointer">
            <span className="w-6 h-6 mr-2">
              <PhotoIcon />
            </span>
            Replace Image
            <input
              type="file"
              className="hidden"
              onChange={onPaste}
              accept="image/png,image/jpg,image/jpeg"
            />
          </label>
        )}

        {!blob?.src && (
          <button
            className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white"
            onClick={setDemoImage}
          >
            <span className="w-6 h-6 mr-2">
              <PhotoIcon />
            </span>
            Try demo image
          </button>
        )}

        {blob?.src && (
          <button
            className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white"
            onClick={handleCropImage}
          >
            <span className="w-6 h-6 mr-2">
              <StopIcon />
            </span>
            Crop
          </button>
        )}

        <button
          className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white"
          title="Use Ctrl/Cmd + S to save the image"
          onClick={saveImage}
        >
          <span className="w-6 h-6 mr-2">{SaveIcon}</span>
          Save
        </button>

        <button
          className="flex items-center justify-center px-4 py-2 text-base bg-green-400 rounded-md text-white"
          onClick={copyImage}
          title="Use Ctrl/Cmd + C to copy the image"
        >
          <span className="w-6 h-6 mr-2">{ClipboardIcon}</span>
          Copy
        </button>
      </div>

      <div
        className={`relative grid grid-cols-1 ${
          optionsOpen ? "md:grid-cols-[360px,1fr]" : "md:grid-cols-[50px,1fr]"
        } gap-10 w-full mx-auto`}
      >
        {optionsOpen ? (
          <div className="w-full row-start-2 md:row-span-1">
            {renderOptions()}
          </div>
        ) : (
          <div className="w-full row-start-2 md:row-span-1">
            {optionsPlaceholder()}
          </div>
        )}

        <div className="flex items-center w-full">
          {/* Crop Modal */}
          {showCropModal && (
            <CropModal
              open={showCropModal}
              setOpen={setShowCropModal}
              crop={crop}
              setCrop={setCrop}
              saveCrop={saveCrop}
              completedCrop={completedCrop}
              setCompletedCrop={setCompletedCrop}
              blob={blob}
              setBlob={setBlob}
            />
          )}

          <div
            className={`overflow-hidden duration-200 ease-in-out relative my-5 w-full flex justify-center items-center`}
          >
            <div
              ref={(el) => (wrapperRef.current = el)}
              style={
                options.customTheme
                  ? {
                      background: `linear-gradient(${
                        cssGradientsDirections[options.bgDirection]
                      }, ${
                        options?.customTheme?.colorStart || "transparent"
                      }, ${options?.customTheme?.colorEnd || "transparent"})`,
                    }
                  : {
                      background: options.background
                        ? `url(${options.background})`
                        : "",
                    }
              }
              className={classnames(
                `transition-all duration-200 relative ease-in-out overflow-hidden bg-cover ${
                  options.aspectRatio === "aspect-appstore !scale-75"
                    ? "w-[5in] h-[7.0in]"
                    : "w-full"
                }`,
                options?.padding,
                options?.position,
                options?.roundedWrapper,
                { [options?.theme]: !options.customTheme },

                options?.bgDirection
              )}
            >
              {/* noise */}
              {options?.noise ? (
                <div
                  style={{ backgroundImage: `url("/noise.svg")` }}
                  className={`absolute inset-0 w-full h-full bg-repeat opacity-[0.25] ${
                    options?.rounded
                  } ${options.browserBar !== "hidden" ? "rounded-t-none" : ""}`}
                />
              ) : (
                ""
              )}

              {blob?.src ? (
                <div
                  className={`h-full flex ${
                    options.text.position === "top"
                      ? "flex-col"
                      : "flex-col-reverse"
                  }  justify-center items-center`}
                >
                  {/* Text */}

                  {options?.text.show && (
                    <div
                      className={`w-full ${options.text.align} ${
                        options.text.position === "top" ? "mb-6" : "mt-6"
                      } ${
                        options.text.color === "dark"
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      <p className="font-bold text-3xl mb-2 break-word whitespace-pre-wrap">
                        {options.text.heading}
                      </p>
                      <p className="break-word whitespace-pre-wrap">
                        {options.text.subheading}
                      </p>
                    </div>
                  )}

                  <ReactTilt
                    tiltAngleXManual={manualTiltAngleX}
                    tiltAngleYManual={manualTiltAngleY}
                    tiltMaxAngleY={30}
                    tiltMaxAngleX={30}
                    reset={false}
                    className={`relative`}
                  >
                    <div
                      className={`flex flex-col justify-center items-center ${options.aspectRatio} transition`}
                    >
                      {getTabFrame(options?.browserBar, options?.rounded)}
                      <img
                        src={blob?.src}
                        className={`relative z-10 transition-all duration-200 ease-in-out select-none max-w-full bg-cover ${
                          options?.rounded
                        } ${options.shadow} ${getImageRadius(
                          options?.padding,
                          options?.position
                        )} ${
                          whitelist.includes(options?.browserBar)
                            ? ""
                            : "rounded-t-none"
                        }`}
                      />
                    </div>
                  </ReactTilt>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full min-h-[50vh]">
                  <div className="bg-[#212121] rounded-md border-4 border-[#2B2C2F] shadow-md">
                    <label
                      className="flex flex-col items-center justify-center text-sm md:text-lg opacity-30 select-none max-w-[550px] rounded-2xl p-10 text-center text-white cursor-pointer hover:opacity-50 duration-300"
                      htmlFor="imagesUpload"
                    >
                      <input
                        className="hidden"
                        id="imagesUpload"
                        type="file"
                        onChange={onPaste}
                      />
                      <span className="border-2 px-3 py-4 rounded-full mb-4 shadow-lg bg-[#282828]">
                        <UploadIcon className="text-white" />
                      </span>
                      <p>Upload Screenshot</p>
                    </label>

                    {/* website url request */}
                    <div className="bg-[#2B2C2F] p-6 rounded-t-md mt-4 text-center text-gray-500">
                      <p className="text-2xl">or</p>
                      <h4>Add screenshot from website/link</h4>

                      <input
                        type="text"
                        placeholder="Enter url, e.g (https://stripe.com)"
                        className="w-full p-2 text-center text-sm md:text-base bg-[#212121] my-4 rounded-md border border-[#2B2C2F]"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            getWebsiteScreenshot();
                          }
                        }}
                      />

                      <button
                        className="w-full bg-green-400 text-white rounded-md p-2 disabled:opacity-80 text-sm md:text-base"
                        disabled={fetchingWebsite}
                        onClick={getWebsiteScreenshot}
                      >
                        Capture website screenshot
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* custom watermark */}
              {options?.customWatermark.show && blob?.src && (
                <div
                  className={`absolute ${options.customWatermark.position} z-50 left-1/2 -translate-x-1/2 ${options.customWatermark.color} py-1 px-2 text-xs rounded-md flex items-center space-x-2`}
                >
                  {options?.customWatermark.text && (
                    <p>{options.customWatermark?.text}</p>
                  )}

                  {/* link */}
                  {options?.customWatermark?.link && (
                    <p className="flex items-center">
                      <LinkIcon className="w-3 h-3 mr-1" />
                      {options?.customWatermark?.link}
                    </p>
                  )}

                  {options.customWatermark.twitter && (
                    <p className="flex items-center">
                      <TwitterIcon className="w-3 h-3 mr-1" />
                      {options.customWatermark?.twitter}
                    </p>
                  )}

                  {/* instagram */}
                  {options.customWatermark.instagram && (
                    <p className="flex items-center">
                      <InstagramIcon className="w-3 h-3 mr-1" />
                      {options.customWatermark?.instagram}
                    </p>
                  )}

                  {/* github */}
                  {options.customWatermark.github && (
                    <p className="flex items-center">
                      <GitHubIcon className="w-3 h-3 mr-1" />
                      {options.customWatermark?.github}
                    </p>
                  )}

                  {/* linkedin */}
                  {options.customWatermark.linkedin && (
                    <p className="flex items-center">
                      <LinkedInIcon className="w-3 h-3 mr-1" />
                      {options.customWatermark?.linkedin}
                    </p>
                  )}
                </div>
              )}

              {/* watermark */}
              {options?.watermark && blob?.src && (
                <div className="bg-green-500 text-white absolute bottom-0 right-12 p-1 px-2 select-none text-xs rounded-t-md">
                  Made with snapit.gg
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
