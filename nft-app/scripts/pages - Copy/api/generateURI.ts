import { NextApiRequest, NextApiResponse } from "next";
import { connect_to_db } from "../../utils/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { db } = await connect_to_db();
        const collection = db.collection("collectibles")
        collection.countDocuments(async function (err, count) {
            if (!err && count > 0) {
                console.log("database non-empty, deleting");
                await delete_all();
            }
            if (!err && count === 0) {
                console.log("database empty, populating");
                await populateDB();
            }
        });

        res.json({ success: true })
        res.status(200)
    } catch (error) {
        console.error(error);
        res.json({ error: error })
        res.status(500);
    }
}

async function delete_all() {
    const { db } = await connect_to_db();
    db.collection("collectibles").deleteMany({})
}

async function populateDB() {
    const { db } = await connect_to_db();
    const collection = db.collection("collectibles")
    for (let i = 0; i < 1000; i++) {
        var data = {
            "hash": null,
            "tokenId": i,
            "image": "Qmd5vrbM2qBh9GgXUgSpC13b81vVupPgipjuXNm7FtL41j",
        }
        await collection.insertOne(data)
        console.log("1 document inserted, tokenId : ", i);
    }
    console.log("done inserting");

}