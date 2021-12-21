// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  nfts: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { tokenIds } = JSON.parse(req.body);
  console.log(tokenIds);
  const nftPromises = tokenIds.map((id: number) =>
    fetch(
      `https://cloudflare-ipfs.com/ipfs/QmTycTt6y9SapbqVVNHFj8uAKhQt8rTFu2FqfKrWtqadMB/${id}.json`
    )
  );

  const responses = await Promise.all(nftPromises);
  console.log("responses", responses);
  const responsePromises = responses.map((resp) => resp.json());
  const response = await Promise.all(responsePromises);
  const images = response.map((resp) => resp.image);
  console.log("images", images);
  res.status(200).json({ nfts: images });
}
