import { NextApiRequest, NextApiResponse } from "next";
import { connect_to_db } from "../../../utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = await connect_to_db();
        const { tokenIdString } = req.query
        const tokenId = parseInt(tokenIdString as string)
        let storedData;
        console.log("new request:");

        console.log("tokenID = ", tokenId);
        const name = "Study of lines #" + tokenId
        const description = "A collection of 1OOO generative artworks experimenting with minimalism, simplicity and linework"
        const data = await db.collection("collectibles").findOne({ tokenId: tokenId })
        console.log("data=", data);
        var metadata
        const image_url = "https://gateway.pinata.cloud/ipfs/" + data.image


        if (data) {
            if (data.animation_url) {
                const animation_url = "https://gateway.pinata.cloud/ipfs/" + data.animation_url
                metadata = {
                    name: name,
                    description: description,
                    image: image_url,
                    image_url: image_url,
                    animation_url: animation_url,
                    seed: data.hash,
                }
            } else {
                metadata = {
                    name: name,
                    description: description,
                    image: image_url,
                    image_url: image_url,
                    seed: data.hash,
                }
            }

        }
        else {
            throw "NFT with this TokenId doesn't exist"
        }
        console.log("metadata = ", metadata);

        res.json(metadata)
        res.status(200)
    } catch (error) {
        console.error(error);
        res.json({ error: error })
        res.status(500);
    }
}