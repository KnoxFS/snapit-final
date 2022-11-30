import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "hooks/useAuth";
import domtoimage from "dom-to-image";

import { SaveIcon, ClipboardIcon } from "ui/icons";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import updateStats from "utils/updateStats";

const layouts = {
  card: (options) => (
    <div
      className={`w-full h-full grid grid-rows-[70%,1fr] ${
        options.image ? "max-h-[500px]" : "min-h-[500px]"
      }`}
    >
      <div className="h-full">
        {options.image && (
          <img
            src={options.image.url}
            alt="preview"
            className="object-cover h-full w-full rounded-t-md"
          />
        )}
      </div>

      <footer className="bg-[#1C201E] w-full py-4 px-6 flex flex-col md:flex-row md:items-end justify-between rounded-b-md">
        <div className="w-full">
          <h2 className="text-xl md:text-3xl text-white font-bold">
            {options.title}
          </h2>
          <p className="text-gray-400 mt-2 md:w-[70%]">{options.description}</p>

          {/* author */}
          {options.author && (
            <div className="flex items-center mt-4">
              <UserCircleIcon className="h-6 w-6 text-gray-400" />
              <p className="text-gray-400 ml-2">{options.author}</p>
            </div>
          )}
        </div>

        {/* Watermark */}
        {options.watermark && (
          <div className="bg-green-400 p-2 rounded-md text-white text-sm mt-6 md:mt-0 w-max">
            <p>Made with snapit.gg</p>
          </div>
        )}
      </footer>
    </div>
  ),
  stack: (options) => (
    <div className="h-[500px] flex flex-col overflow-hidden relative">
      <header className="text-center p-6 w-[80%] mx-auto">
        <h2 className="text-xl md:text-3xl text-white font-bold">
          {options.title}
        </h2>
        <p className="text-white mt-4">{options.description}</p>

        {options.author && (
          <div className="flex items-center mt-6 mx-auto w-max">
            <UserCircleIcon className="h-6 w-6 text-gray-400" />
            <p className="text-gray-400 ml-2">{options.author}</p>
          </div>
        )}
      </header>

      <div className="bg-gray-400 h-full w-[500px] mx-auto self-align-end rounded-t-md flex">
        {options.image && (
          <img
            src={options.image.url}
            alt="Image"
            className="object-cover w-full rounded-t-md"
          />
        )}
      </div>

      {/* Watermark */}
      {options.watermark && (
        <div className="bg-green-400 p-2 rounded-md text-white text-sm w-max absolute bottom-5 right-5">
          <p>Made with snapit.gg</p>
        </div>
      )}
    </div>
  ),
  grid: (options) => (
    <div
      className={`grid md:grid-cols-2 ${
        options.image ? "max-h-[500px]" : "min-h-[500px]"
      } relative`}
    >
      <article className="bg-[#1C201E] h-full p-6 flex flex-col justify-center rounded-l-md">
        <h2 className="text-xl md:text-3xl text-white font-bold">
          {options.title}
        </h2>
        <p className="text-white mt-4 text-base md:text-lg">
          {options.description}
        </p>

        {/* author */}
        {options.author && (
          <div className="flex items-center mt-4">
            <UserCircleIcon className="h-6 w-6 text-gray-400" />
            <p className="text-gray-400 ml-2">{options.author}</p>
          </div>
        )}
      </article>

      <article className="row-start-1 md:row-start-auto h-full">
        {options.image && (
          <img
            src={options.image.url}
            alt="preview"
            className="object-cover w-full h-[500px] rounded-t-md md:rounded-t-none md:rounded-r-md"
          />
        )}
      </article>

      {/* Watermark */}
      {options.watermark && (
        <div className="bg-green-400 p-2 rounded-md text-white text-sm w-max absolute bottom-5 right-5">
          <p>Made with snapit.gg</p>
        </div>
      )}
    </div>
  ),
};

const OpenGraphMaker = ({ proMode }) => {
  const { user } = useAuth();

  const wrapperRef = useRef();

  const [options, setOptions] = useState({
    title: "I'm on my way but where am I heading?",
    description: "The quick brown fox jumps over the lazy dog.",
    author: user?.name || "John Doe",
    date: "",

    image: null,

    layout: "card",
    watermark: !proMode,
  });

  useEffect(() => {
    setOptions({ ...options, watermark: !proMode });
  }, [proMode]);

  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setOptions({ ...options, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setOptions({
        ...options,
        image: {
          url: reader.result,
          name: file.name,
        },
      });
    };

    reader.readAsDataURL(file);
  };

  const getMetadataFromURL = async () => {
    if (!proMode) {
      toast.error("You need to be a pro member to use this feature");
      return;
    }

    // valid url with http or https
    if (!websiteUrl.match(/^(http|https):\/\//)) {
      toast.error("Please enter a valid url (https://example.com).");
      return;
    }

    let toastId = toast.loading("Getting website metadata...");

    const res = await fetch(`/api/getMetadata?url=${websiteUrl}`);
    const { metadata, error } = await res.json();

    if (error) {
      toast.error(error, { id: toastId });
      return;
    }

    const httpRegex =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    const trailSlashRegex =
      /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    let image = null;

    if (metadata["image"]) {
      if (httpRegex.test(metadata["image"])) {
        image = {
          url: metadata["image"],
          name: "image",
        };
      } else {
        image = {
          url: metadata["url"] + metadata["image"],
          name: "image",
        };
      }
    }

    setOptions({
      title: metadata.title,
      description: metadata.description,
      author: metadata.author || metadata.publisher || "",
      image: image,
      layout: options.layout,
    });

    toast.success("Website metadata added!", { id: toastId });
  };

  const handleCopyCode = async () => {
    const code = document.querySelector(".code").innerText;
    await navigator.clipboard.writeText(code);

    toast.success("Copied to clipboard!");
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
  const saveImage = async (e) => {
    e.preventDefault();

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
              pirsch("🎉 OpenGraph saved");
            }

            if (user) {
              updateStats(user.id, "OpenGraph_Saved");
            }
          });
      });
  };

  // copy image to clipboard
  const copyImage = (e) => {
    e.preventDefault();

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
          toast.success("Image copied to clipboard");

          if (window.pirsch) {
            pirsch("🎉 OpenGraph copied");
          }

          if (user) {
            updateStats(user.id, "OpenGraph_Copied");
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
                  pirsch("🎉 OpenGraph copied");
                }

                if (user) {
                  updateStats(user.id, "OpenGraph_Copied");
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

  const renderPreview = () => (
    <article
      ref={(el) => (wrapperRef.current = el)}
      className="bg-[#2B2C2F] border border-gray-500 rounded-md"
    >
      {layouts[options.layout](options)}
    </article>
  );

  const renderOptions = () => (
    <article className="bg-[#2B2C2F] w-full border border-gray-500 rounded-md p-4 ">
      {/* fetch from url */}

      <div>
        <input
          type="text"
          className="w-full p-2 text-white text-sm md:text-base bg-[#212121] rounded-md border border-[#2B2C2F]"
          placeholder="Fetch from URL"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getMetadataFromURL();
            }
          }}
        />

        <button
          onClick={getMetadataFromURL}
          disabled={!websiteUrl}
          className="block bg-[#212121] w-max mx-auto mt-2 px-12 py-2 rounded-md disabled:opacity-50 text-white shadow-md shadow-[#1C201E]"
        >
          ⚡ Fetch
        </button>
      </div>

      {/* divider */}
      <div className="border-b border-gray-500 my-4"></div>

      {/* form */}
      <form className="space-y-2">
        {/* title */}
        <input
          type="text"
          className="w-full p-2 text-white text-sm md:text-base bg-[#212121] rounded-md border border-[#2B2C2F]"
          placeholder="Title"
          value={options.title}
          name="title"
          onChange={handleChange}
        />
        <input
          type="text"
          className="w-full p-2 text-white text-sm md:text-base bg-[#212121] rounded-md border border-[#2B2C2F]"
          placeholder="Excerpt"
          value={options.description}
          name="description"
          onChange={handleChange}
        />
        <input
          type="text"
          className="w-full p-2 text-white text-sm md:text-base bg-[#212121] rounded-md border border-[#2B2C2F]"
          placeholder="Author"
          value={options.author}
          name="author"
          onChange={handleChange}
        />

        <input
          type="date"
          className="w-full p-2 text-white text-sm md:text-base bg-[#212121] rounded-md border border-[#2B2C2F]"
          placeholder="Publish Date"
          value={options.date}
          name="date"
          onChange={handleChange}
        />

        {/* upload image */}

        <div>
          <input
            type="file"
            id="image"
            accept="image/png,image/jpg"
            className="hidden"
            onChange={handleImageChange}
          />

          <label
            htmlFor="image"
            className="block w-full p-2 text-white text-sm md:text-base bg-[#212121] rounded-md border border-[#2B2C2F] cursor-pointer"
          >
            {options.image ? options.image.name : "Image"}
          </label>

          {options.image && (
            <button
              onClick={() => setOptions({ ...options, image: null })}
              className="text-green-400 text-sm p-2"
            >
              Remove
            </button>
          )}
        </div>

        <div className="flex justify-center items-center space-x-4 !mt-8">
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
      </form>
    </article>
  );

  const renderCode = () => (
    <article className="bg-[#2B2C2F] rounded-md border border-gray-500 w-full p-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleCopyCode}
          className="bg-green-400 px-2 rounded-md text-white"
        >
          Copy meta tags
        </button>
      </div>

      <div className="space-y-4 font-mono code">
        {/* Primary tags */}
        <div className="text-gray-400">
          <p>{`<!- Primary Tags ->`}</p>
          {/* title */}
          <p>{`<title>${options.title}</title>`}</p>
          <p>{`<meta property="title" content="${options.title}" />`}</p>
          {/* description */}
          <p>{`<meta property="description" content="${options.description}" />`}</p>
        </div>

        {/* Twitter */}
        <div className="text-gray-400">
          <p>{`<!- Twitter ->`}</p>
          {/* title */}
          <p>{`<meta property="twitter:title" content="${options.title}" />`}</p>
          {/* description */}
          <p>{`<meta property="twitter:description" content="${options.description}" />`}</p>
          <p>{`<meta property="twitter:url" content="" />`}</p>
        </div>

        {/* Facebook */}
        <div className="text-gray-400">
          <p>{`<!- Facebook ->`}</p>
          {/* title */}
          <p>{`<meta property="og:title" content="${options.title}" />`}</p>
          {/* description */}
          <p>{`<meta property="og:description" content="${options.description}" />`}</p>
        </div>
      </div>
    </article>
  );

  return (
    <section className="min-h-screen my-12">
      {/* layout changer */}
      <div className="flex items-center justify-end mb-4 space-x-4">
        <p className="text-white">Layouts:</p>
        <button
          onClick={() => setOptions({ ...options, layout: "stack" })}
          className={`px-4 py-2 rounded-md text-white ${
            options.layout === "stack" ? "bg-green-400" : "bg-[#212121]"
          }`}
        >
          Stack
        </button>

        <button
          onClick={() => setOptions({ ...options, layout: "card" })}
          className={`px-4 py-2 rounded-md text-white ${
            options.layout === "card" ? "bg-green-400" : "bg-[#212121]"
          }`}
        >
          Card
        </button>

        <button
          onClick={() => setOptions({ ...options, layout: "grid" })}
          className={`px-4 py-2 rounded-md text-white ${
            options.layout === "grid" ? "bg-green-400" : "bg-[#212121]"
          }`}
        >
          Grid
        </button>
      </div>

      {renderPreview()}

      <section className="grid grid-cols-1 md:grid-cols-[30%,1fr] gap-10 my-12">
        {renderOptions()} {renderCode()}
      </section>
    </section>
  );
};

export default OpenGraphMaker;
