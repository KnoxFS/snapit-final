import { supabase } from "lib/supabase";

const statsType = {
  Screenshot_Saved: "screenshots_saved",
  Screenshot_Copied: "screenshots_copied",
  OpenGraph_Saved: "opengraph_saved",
  OpenGraph_Copied: "opengraph_copied",
  Template_Saved: "templates_saved",
  Template_Copied: "templates_copied",
};

export default async function updateStats(userId, type) {
  // Try to get existing stats
  const { data, error } = await supabase
    .from("stats")
    .select("stats")
    .eq("user_id", userId)
    .single();

  let parsedStats;

  if (error || !data) {
    // Create new stats object if doesn't exist
    parsedStats = {
      screenshots_saved: 0,
      screenshots_copied: 0,
      opengraph_saved: 0,
      opengraph_copied: 0,
      templates_saved: 0,
      templates_copied: 0,
    };
  } else {
    parsedStats = JSON.parse(data.stats);
  }

  // Increment the stat
  parsedStats[statsType[type]] = (parsedStats[statsType[type]] || 0) + 1;

  // Upsert (insert or update)
  const { error: upsertError } = await supabase
    .from("stats")
    .upsert(
      {
        user_id: userId,
        stats: JSON.stringify(parsedStats)
      },
      { onConflict: 'user_id' }
    );

  if (upsertError) {
    console.log('Stats update error:', upsertError);
  }
}
