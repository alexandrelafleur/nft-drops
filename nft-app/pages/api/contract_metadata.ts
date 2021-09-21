import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const metadata = {
            name: "Study of lines",
            description: "A collection of 1OOO generative artworks experimenting with minimalism, simplicity and linework \n\nhttps://www.studyoflines.art",
            image: "https://www.studyoflines.art/images/red.png",
            image_url: "https://www.studyoflines.art/images/red.png",
            banner: "https://www.studyoflines.art/images/banner.png",
            banner_image_url: "https://www.studyoflines.art/images/banner.png",
            external_link: "https://www.studyoflines.art",
            seller_fee_basis_points: 1000, // Indicates a 10% seller fee.
            fee_recipient: "0x48A7f7bd80F8a8026e66e164086dc03e148bF899" // Where seller fees will be paid to.
        }

        res.json(metadata)
        res.status(200)
    } catch (error) {
        console.error(error);
        res.json({ error: error })
        res.status(500);
    }
}