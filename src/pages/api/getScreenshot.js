import * as screenshotone from "screenshotone-api-sdk";

const client = new screenshotone.Client(
  process.env.SCREENSHOT_API_KEY,
  process.env.SCREENSHOT_SECRET_KEY
);

export default async function handler(req, res) {
  const { url, width, height } = req.query;

  // set up options
  const options = screenshotone.TakeOptions.url(url)
    .delay(1)
    .viewportWidth(width || 1920)
    .viewportHeight(height || 1080)
    .format("png")
    .blockAds(true);

  client
    .take(options)
    .then(async (imageBlob) => {
      const buffer = Buffer.from(await imageBlob.arrayBuffer());
      res.status(200).json({ image: buffer, error: null });

      return;
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "No website found with provided URL.", image: null });

      return;
    });
}
