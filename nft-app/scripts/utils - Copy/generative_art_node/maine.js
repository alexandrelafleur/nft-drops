const myArgs = process.argv.slice(2);
const { buildSetup, createFiles, createMetaData } = require("./main.js");
const { defaultEdition } = require("./config.js");
const edition = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition;
export { exportPng }

async function exportPng(transactionHash) {
  // Send Xmur Seed (entre 0 et 1) ET le numéro du token ID ici :
  var edition = 1;
  // var transactionHash = "k1j25jks8fhf8fdh4d"
  var seed = xmur3(transactionHash);
  var rand = mulberry32(seed());
  buildSetup();
  createFiles(edition, rand);
  createMetaData();
};

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}