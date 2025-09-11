// import { fetchTweetAst } from "static-tweets";

export default async function handler(req, res) {
  // res.status(200).json(req.query.id);
  // const { id } = req.query.id;
  var id = req.query.id;

  try {

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer AAAAAAAAAAAAAAAAAAAAAK78sgEAAAAARYf9fGL0r28BzdE4%2BWz1erB9GHI%3Dqbyw5xd229iWo8ySKaUf42CfLBSHaAVOKdcrwquMMNXcVH2SML");
    myHeaders.append("Cookie", "guest_id=v1%3A171286196750750306; guest_id_ads=v1%3A171286196750750306; guest_id_marketing=v1%3A171286196750750306; personalization_id=\"v1_/V3PXfr25v6ef0SnaHsNZQ==\"");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch("https://api.twitter.com/2/tweets/"+id+"?tweet.fields=public_metrics,created_at&expansions=author_id&user.fields=profile_image_url", requestOptions)
      .then((response) => response.text())
      .then(function(result) {
        var tweetData = JSON.parse(result);
        var returnTweet = {
          id: tweetData.data.id,
          text: tweetData.data.text,
          createdAt: new Date(tweetData.data.created_at).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC',
          }),
          metrics: {
            replies: formatMetric(tweetData.data.public_metrics.reply_count?tweetData.data.public_metrics.reply_count:0),
            likes: formatMetric(tweetData.data.public_metrics.like_count?tweetData.data.public_metrics.like_count:0),
            retweets: formatMetric(tweetData.data.public_metrics.retweet_count?tweetData.data.public_metrics.retweet_count:0),
          },
          author: {
            name: tweetData.includes.users[0].name,
            username: tweetData.includes.users[0].username,
            profileImageUrl: tweetData.includes.users[0].profile_image_url,
          },
          url: 'https://twitter.com/'+tweetData.includes.users[0].username+'/status/'+tweetData.data.id,
        }
        res.status(200).json(returnTweet);
      })
      .catch((error) => res.status(404).json({ error: error.message }));
  } catch(error) {
    res.status(404).json({ error: 'Unable to fetch the tweet.' });
  }
}

export const formatMetric = (number) => {
  if (number < 1000) {
    return number
  }
  if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`
  }
  return `${(number / 1000000).toFixed(1)}M`
}

