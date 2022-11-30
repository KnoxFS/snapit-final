import urlMetadata from "metadata-scraper";

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const metadata = await urlMetadata(url, {
      timeout: 1000 * 15,
    });
    res.status(200).json({ metadata });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Metadata not found for URL provided." });
  }
}
