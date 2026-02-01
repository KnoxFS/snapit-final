import { useEffect, useState } from "react";
import useAuth from "hooks/useAuth";

import { supabase } from "lib/supabase";

const statsLabels = [
  {
    id: 1,
    title: "Screenshots Copied",
    key: "screenshots_copied",
  },
  {
    id: 2,
    title: "Screenshots Saved",
    key: "screenshots_saved",
  },
  {
    id: 3,
    title: "OpenGraph Images Copied",
    key: "opengraph_copied",
  },
  {
    id: 4,
    title: "OpenGraph Images Saved",
    key: "opengraph_saved",
  },
  {
    id: 5,
    title: "Templates outputs Copied",
    key: "templates_copied",
  },
  {
    id: 6,
    title: "Templates outputs Saved",
    key: "templates_saved",
  },
];

const Stats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) getStats().then(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  const getStats = async () => {
    const { data, error } = await supabase
      .from("stats")
      .select("stats")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.log('Stats fetch error:', error);
      // Set default stats if error
      setStats({
        screenshots_saved: 0,
        screenshots_copied: 0,
        opengraph_saved: 0,
        opengraph_copied: 0,
        templates_saved: 0,
        templates_copied: 0,
      });
      return;
    }

    if (data?.stats) {
      setStats(JSON.parse(data.stats));
    }
  };

  if (loading)
    // loading
    return (
      <section className="mt-24">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      </section>
    );

  return (
    <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 my-12">
      {statsLabels.map((stat) => (
        <div
          key={stat.id}
          className="flex flex-col justify-center items-center text-center border border-green-500 rounded-md p-4 shadow-md"
        >
          {user && (
            <h3 className="text-white text-2xl font-bold">{stats[stat.key]}</h3>
          )}

          {!user && (
            <div className="h-12 w-12 rounded-full blur-lg bg-green-500 my-2"></div>
          )}

          <p className="text-white text-sm mt-4">{stat.title}</p>
        </div>
      ))}
    </section>
  );
};

export default Stats;
