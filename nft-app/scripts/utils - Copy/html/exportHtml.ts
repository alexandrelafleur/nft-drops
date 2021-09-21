import { fs } from "memfs";
import { p1, p2 } from "./html.js";
const FormData = require("form-data");
const axios = require("axios");
export { exportHtml };

async function exportHtml(hash) {
  const p_all = p1 + hash + p2;
  try {
    await createHtmlFile(p_all);
    const pinataHash = await pinToPinataAxios();
    console.log("returned to early: ", pinataHash);
    return pinataHash;
  } catch (error) {
    console.log("ExportHtml() ERROR : ", error);
  }
}

async function createHtmlFile(htmlData) {
  try {
    fs.writeFileSync("/CHAOS" + ".html", htmlData);
  } catch (error) {
    console.log("createHtmlFile() ERROR :", error);
  }
}

async function pinToPinataAxios() {
  let dataform = new FormData();
  const streame = fs.createReadStream("/CHAOS" + ".html", "utf-8");
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
