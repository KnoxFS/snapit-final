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
  console.log('[updateStats] Called with:', { userId, type });

  // Try to get existing stats
  const { data, error } = await supabase
    .from("stats")
    .select("stats")
    .eq("user_id", userId)
    .single();

  let parsedStats;

  if (error || !data) {
    console.log('[updateStats] No existing stats, creating new:', error?.message);
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
    // Handle both JSON string and object formats
    parsedStats = typeof data.stats === 'string'
      ? JSON.parse(data.stats)
      : data.stats;
    console.log('[updateStats] Existing stats:', parsedStats);
  }

  // Increment the stat
  parsedStats[statsType[type]] = (parsedStats[statsType[type]] || 0) + 1;
  console.log('[updateStats] Updated stats:', parsedStats);

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
    console.error('[updateStats] Upsert error:', upsertError);
  } else {
    console.log('[updateStats] Successfully saved stats');
  }
}
