import { NextApiRequest, NextApiResponse } from 'next';
import { connect_to_db } from '../../utils/database';
import { address, abi } from '../../lib/abi'

const Web3 = require("web3");
import { exportGenerative } from '../../utils/exportGenerative'
import { exportHtml } from '../../utils/html/exportHtml';
import { exportPng } from '../../utils/p5/exportPng';
export { scanForTransactions }


// const HDWalletProvider = require("@truffle/hdwallet-provider");

// const web3 = new Web3(
//     new HDWalletProvider(process.env.PRIVATE_KEY, process.env.RPC_URL)
// );
var websocket_options = {
    keepAlive: true,
    withCredentials: false,
    timeout: 2000000, // ms
    clientConfig: {
        maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
        maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
    },

    reconnect: {
        auto: true,
        delay: 300000, // ms
        maxAttempts: 5,
        onTimeout: true,
    },
};

const provider = new Web3.providers.WebsocketProvider(
    "wss://rinkeby.infura.io/ws/v3/1a5cc948a06b49d3b796317da68cab31",
    websocket_options
);

const web3 = new Web3(provider);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        try {
            const { authorization } = req.headers;
            console.log("new request");
            const answer = `Bearer ${process.env.API_SECRET_KEY}`
            console.log("authorization From Asker = ", authorization);
            console.log("authorization Demanded = ", answer);

            if (authorization === answer) {
                console.log("i'm in");
                const events = await scanForTransactions();
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false });
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}


async function scanForTransactions() {
    const { db } = await connect_to_db();

    console.log("scanning...");
    const contract = new web3.eth.Contract(abi, address);

    // Call a contract method for a test
    console.log("calling method for test...");
    const owner_of_tile = await contract.methods.isActive().call();
    console.log("Contract active: ", owner_of_tile);

    // Pick up wehre we left off from db
    const last_added = await db.collection("last_minted").findOne({})
    const old_index = last_added.index
    const old_block = last_added.block
    console.log("getting data from:", old_block, old_index);

    //
    const events = await get_past_events(contract, old_block)

    console.log("got these events:");
    for (let i = 0; i < events.length; i++) {
        const element = events[i];
        console.log(i, element.returnValues.tokenId, element.transactionHash);
    }
    console.log("-------------");

    if (events.length > 1 || !last_added.tokenId) {
        const MAX_BATCH_SIZE = 11
        const batch_size = Math.min(MAX_BATCH_SIZE, events.length - old_index)
        console.log("batch size = ", batch_size);

        const new_index = old_index + batch_size
        let current_block = old_block
        let current_counter = old_index
        console.log(events.length, " events received, getting events ", old_index, "to ", new_index);

        for (let i = old_index; i < new_index; i++) {

            // Logic to know where in the block events should be processed
            const block_i = events[i].blockNumber
            if (block_i > current_block) {
                current_block = block_i
                current_counter = 1
            } else {
                current_counter++
            }

            const tokenId = parseInt(events[i].returnValues.tokenId)
            const transactionHash = events[i].transactionHash

            // First event of the batch is supposed to match last event of past batch to assure continuity
            if (last_added.tokenId && i == old_index) {
                // Check if last event of last batch is the same as the first event from this batch
                if (last_added.tokenId && tokenId != last_added.tokenId) {
                    console.log("------------------------error, discontinuity in events-------------------------");
                }
                console.log("wont be adding this one: ", i, current_counter, current_block, block_i, transactionHash)
            } else {
                // Export html and add metadata to database
                console.log(i, current_counter, block_i, transactionHash, tokenId)
                const hash = transactionHash + tokenId


                // await start(hash, async (pinataHash) => {
                const png_hash = await exportPng(hash);
                console.log("Pinata Hash : ", png_hash)
                //exportGenerative(hash) PFP generator
                const html_hash = await exportHtml(hash);
                await add_metadata_to_db(tokenId, hash, png_hash, html_hash)
                await update_opensea_metadata(tokenId);
                // })
            }
        }
        const next_block = events[new_index - 1].blockNumber
        const next_index = current_counter - 1
        update_last_minted_db(events[new_index - 1].returnValues.tokenId, next_block, next_index)
        console.log(events.length);
    } else {
        console.log("no new events received");
    }



}

async function get_past_events(contract, starting_block) {
    const events = await contract.getPastEvents('Transfer', {
        // filter: { transactionHash: "0xd695ac737cdabade9f445f8147b67500adf810cb520c961b6e34f6cdcce2f551" },
        fromBlock: starting_block,
        toBlock: 'latest'
    })
        .catch(function (e) {
            console.error(e);
        })
    return events
}

async function add_metadata_to_db(tokenId, hash, image_url, animation_url = null) {
    const { db } = await connect_to_db();
    var data
    if (animation_url) {
        data = {
            "hash": hash,
            "tokenId": tokenId,
            "image": image_url,
            "animation_url": animation_url,
        }
    } else {
        data = {
            "hash": hash,
            "tokenId": tokenId,
            "image": image_url,
        }
    }

    await db.collection("collectibles").replaceOne({ tokenId: tokenId }, data)
    console.log("1 document inserted, tokenId : ", tokenId);
}

async function update_last_minted_db(tokenId, block, index) {
    const { db } = await connect_to_db();

    const data = {
        "tokenId": tokenId,
        "block": block,
        "index": index,
    }
    await db.collection("last_minted").replaceOne({}, data)
    console.log("1 document replaced : ", data);
}


async function update_opensea_metadata(tokenId: number) {
    const call_url = "https://testnets-api.opensea.io/api/v1/asset/" + address + "/" + tokenId + "/?force_update=true"
    console.log("url = ", call_url);

    const res = await fetch(call_url)
    console.log("updated token #", tokenId);

}

