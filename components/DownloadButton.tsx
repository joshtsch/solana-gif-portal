import { animated, useSpring } from "@react-spring/web";
import { ButtonHTMLAttributes, useState } from "react";

interface DownloadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
}

export function DownloadButton({ src, style, ...props }: DownloadButtonProps) {
  const [hover, setHover] = useState(false);
  const { opacity } = useSpring({ opacity: hover ? 1 : 0.7 });

  return (
    <a href={src} download="" target="_blank" rel="noreferrer">
      <animated.button
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "none",
          fontSize: "1rem",
          border: "none",
          cursor: "pointer",
          opacity,
          ...style,
        }}
        {...props}
      />
    </a>
  );
}
