import { NextApiRequest, NextApiResponse } from "next";
import { exportGenerative } from "../../utils/exportGenerative";
import { exportPng } from "../../utils/p5/exportPng";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("Handler...");
        const hash = "0xbd1648183df2173e77dc9029b3914a61de1e12e9b66bc7df6f1e043470ba15ec2"
        // let pinataHash = await start(hash, (pinataHash) => {
        //     console.log("Pinata Hash : ", pinataHash)
        // })
        // for (let i = 0; i < 100; i++) {
        //     // await exportGenerative("d3j33j2j3j32j32" + i.toString());
        // }
        await exportPng(hash)
        res.json({ success: true })
        res.status(200)
    } catch (error) {
        console.log(error);
        res.json({ error: error })
        res.status(500);
    }
}
