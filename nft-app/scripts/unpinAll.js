const axios = require('axios');
const env = require('dotenv').config

function get() {
    const url = `https://api.pinata.cloud/data/pinList?status=pinned`;
    const l = []
    return axios
        .get(url, {
            headers: {
                pinata_api_key: "170fe7a155cc7cbc5721",
                pinata_secret_api_key: "3a2c6241986cc68a359daf661dcb40557d9d841b07958ed713815118da3db408"
            }
        })
        .then(function (response) {
            console.log(response.data);
            response.data.rows.forEach(pin => {
                l.push(pin.ipfs_pin_hash)
            });
            console.log("list", l)
            return l;

        })
        .catch(function (error) {
            console.log(error)
        });
}

function unpin(element) {
    hashToUnpin = element
    const url = `https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`;
    return axios
        .delete(url, {
            headers: {
                pinata_api_key: "170fe7a155cc7cbc5721",
                pinata_secret_api_key: "3a2c6241986cc68a359daf661dcb40557d9d841b07958ed713815118da3db408"
            }
        })
        .then(function (_response) {
            console.log("Unpinned #", element)
        })
        .catch(function (_error) {
            console.log("fuckkk")
        });
}

async function bigman() {
    while (true) {
        console.log("starting 1...")
        l = await get();
        console.log("Starting 2...")
        for (let i = 0; i < l.length; i++) {
            console.log("Unpinning #", l[i])
            await unpin(l[i]);
            console.log("*** UNPINNED ***")
        }
    }

}

bigman()