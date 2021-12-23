import { animated, config, useSpring } from "@react-spring/web";
import Image from "next/image";
import { useRef, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { DownloadButton } from "./DownloadButton";

interface NftCardProps {
  nft: string;
  tokenId?: number;
}

export function NftCard({ nft, tokenId }: NftCardProps) {
  const [xys, setXys] = useState([0, 0, 1]);
  const props = useSpring({ xys, config: config.default });
  const ref = useRef(null);

  const calc = (x: number, y: number, rect: any) => [
    -(y - rect.top - rect.height / 2) / 40,
    (x - rect.left - rect.width / 2) / 40,
    1.05,
  ];
  const trans = (x: number, y: number, s: number) =>
    `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
  const src = nft.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column" }}>
      <animated.div
        style={{ transform: props.xys.to(trans) }}
        onMouseLeave={() => setXys([0, 0, 1])}
        onMouseMove={(e) => {
          const rect = (ref as any).current.getBoundingClientRect();
          setXys(calc(e.clientX, e.clientY, rect));
        }}
      >
        <Image src={src} width={400} height={364} alt="NFT" />
        <h2>#{tokenId}</h2>
      </animated.div>
      <div style={{ display: "flex" }}>
        <DownloadButton
          src={src}
          style={{
            marginRight: "0.5rem",
            width: "2rem",
            height: "2rem",
            borderRadius: "50rem",
            backgroundColor: "black",
          }}
        >
          <FaExternalLinkAlt />
        </DownloadButton>
        <DownloadButton
          src={`https://opensea.io/assets/0x0322f6f11a94cfb1b5b6e95e059d8deb2bf17d6a/${tokenId}`}
          style={{ marginRight: "0.5rem" }}
        >
          <Image
            src="/opensea-logo.svg"
            alt="Opensea Link"
            width={32}
            height={32}
          />
        </DownloadButton>
      </div>
    </div>
  );
}
