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
  // get stats from supabase
  const {
    data: { stats },
    error,
  } = await supabase.from("stats").select("stats").eq("user_id", userId).single();

  // parse stats json
  const parsedStats = JSON.parse(stats);

  // update stats
  parsedStats[statsType[type]] += 1;

  // update stats in supabase
  const { error: update_error } = await supabase
    .from("stats")
    .update({ stats: JSON.stringify(parsedStats) })
    .eq("user_id", userId);

  if (error || update_error) {
    console.log(error || update_error);
  }
}
