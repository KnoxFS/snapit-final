import Link from "next/link";

const InfoBanner = () => {
  return (
    <div className="text-center text-white font-bold p-2 bg-gradient-to-r from-black via-green-400 to-back">
      <Link href="https://www.producthunt.com/posts/snapit-927d6feb-16f6-42c2-9aa5-98de91904faf?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-snapit&#0045;927d6feb&#0045;16f6&#0045;42c2&#0045;9aa5&#0045;98de91904faf" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=376208&theme=light" alt="Snapit - Creating&#0032;beautiful&#0032;screenshots&#0032;has&#0032;never&#0032;been&#0032;so&#0032;easy | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
        </a>
      </Link>
    </div>
  );
};

export default InfoBanner;
