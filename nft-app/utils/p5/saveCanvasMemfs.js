//SAVE CANVAS
const fs = require('memfs')
const FormData = require("form-data");
const axios = require("axios");
export { saveCanvas }

// GET CANVAS DATA URL
function getCanvasDataURL(c) {
    return c.canvas.toDataURL();
}

async function saveCanvas(c, f, ext) {
    let extensions = ['png', 'jpg'];
    // return new Promise(async (resolve, reject) => {
    // if (!c.canvas) reject(new Error('No canvas passed to SaveCanvas'));
    let f_arr = f.split('.');
    if (!extensions.includes(f_arr[f_arr.length - 1])) {
        if (ext) {
            f = `${f}.${ext}`;
        } else {
            f = `${f}.png`;
        }
    }
    try {
        fs.writeFileSync('/CHAOS.png', getCanvasDataURL(c).replace(/^data:image\/png;base64,/, ""), 'base64')
        console.log("Create file :", f)
        return await pinToPinataAxios()
    } catch (error) {
        console.log(error)
    }
    // });
}

async function pinToPinataAxios() {
    let dataform = new FormData();
    const streame = fs.createReadStream("/CHAOS" + ".png", "utf-8");
    dataform.append("file", streame);
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    console.log("Pinning File...");
    // console.log("dataform :", streame);
    var res = await axios
        .post(url, dataform, {
            maxBodyLength: "Infinity",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${dataform._boundary}`,
                pinata_api_key: "170fe7a155cc7cbc5721", // process.env.PINATA_1 //TODO : put back dotenv
                pinata_secret_api_key:
                    "3a2c6241986cc68a359daf661dcb40557d9d841b07958ed713815118da3db408", // process.env.PINATA_2
            },
        })
        .then((response) => {
            console.log("Filed" + "Pinned! Hash :");
            console.log(response.data.IpfsHash);
            return response.data.IpfsHash;
        })
        .catch((error) => {
            console.log("pinToPinataAxios() ERROR :", error);
        });
    console.log("res = ", res);
    return res;
}