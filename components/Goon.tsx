import { animated, config, useSpring } from "@react-spring/web";
import Image from "next/image";
import { useRef, useState } from "react";

interface GoonProps {
  nft: string;
}

export function Goon({ nft }: GoonProps) {
  const [xys, setXys] = useState([0, 0, 1]);
  const props = useSpring({ xys, config: config.default });
  const ref = useRef(null);

  const calc = (x: number, y: number, rect: any) => [
    -(y - rect.top - rect.height / 2) / 60,
    (x - rect.left - rect.width / 2) / 60,
    1.05,
  ];
  const trans = (x: number, y: number, s: number) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

  return (
    <div ref={ref}>
      <animated.div
        style={{ transform: props.xys.to(trans) }}
        onMouseLeave={() => setXys([0, 0, 1])}
        onMouseMove={(e) => {
          const rect = (ref as any).current.getBoundingClientRect();
          setXys(calc(e.clientX, e.clientY, rect));
        }}
      >
        <Image
          src={nft.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")}
          width={645}
          height={587}
          alt="NFT"
        />
      </animated.div>
    </div>
  );
}
