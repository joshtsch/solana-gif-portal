import { useEffect } from "react";
import ReactLoading from "react-loading";

interface TweetProps {
  url: string;
}

export default function Tweet({ url }: TweetProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const twttr = window.twttr;
      twttr.widgets.load();
    }
  });

  return (
    <blockquote className="twitter-tweet">
      <ReactLoading
        type="bubbles"
        color="#D0CED0"
        height={"40%"}
        width={"40%"}
      />
      <a href={`${url}?ref_src=twsrc%5Etfw`} />
    </blockquote>
  );
}
