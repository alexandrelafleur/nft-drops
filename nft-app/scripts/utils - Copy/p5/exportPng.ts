import { createAndSaveCanvas } from "./p5nodeSOLpng";
const FormData = require("form-data");
const axios = require("axios");
export { exportPng };

async function exportPng(hash) {
  try {
    const txHash_png = await createPngFile(hash);
    return txHash_png;
  } catch (error) {
    console.log("exportPng() ERROR : ", error);
  }
}

async function createPngFile(hash) {
  return new Promise(function (resolve, reject) {
    createAndSaveCanvas(hash, function (data) {
      if (!data) reject(null);
      else resolve(data);
    });
  });

}


