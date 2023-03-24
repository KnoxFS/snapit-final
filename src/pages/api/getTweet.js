import { fetchTweetAst } from "static-tweets";

export default async function handler(req, res) {
  const { id } = req.query.id;

  try {
    const tweet = await fetchTweetAst(id);
    res.status(200).json(tweet[0]);
  } catch (error) {
    res.status(404).json({ error: 'Tweet not found.' });
  }
}