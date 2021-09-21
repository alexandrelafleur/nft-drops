//imports needed for this function
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');

var i = 0;

pinDirectoryToIPFS("170fe7a155cc7cbc5721", "3a2c6241986cc68a359daf661dcb40557d9d841b07958ed713815118da3db408");

function writeJSONtoDirectory(i, json_body) {
    fs.writeFile('C:/Users/alexi/Desktop/Github/ChaosNfts/chaos-app/Directory_JSON/' + i, JSON.stringify(json_body), function (err) {
        if (err) throw err;
    });
}

function pinDirectoryToIPFS(pinataApiKey, pinataSecretApiKey) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = 'C:/Users/alexi/Desktop/Github/ChaosNfts/chaos-app/Directory_NFT';

    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(src, function (err, dirs, files) {
        files.forEach((file) => {
            i++;
        });
        let data = new FormData();
        files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(src, file)
            });
        });

        const metadata = JSON.stringify({
            name: 'testname',
            keyvalues: {
                exampleKey: 'exampleValue'
            }
        });
        data.append('pinataMetadata', metadata);

        return axios
            .post(url, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey
                }
            })
            .then(function (response) {
                console.log(response.data.IpfsHash)
                hash = response.data.IpfsHash
                for (let j = 0; j < i; j++) {
                    json = {
                        "description": "Pinata Test #" + j,
                        "image": "ipfs://" + hash + "/" + j + ".png"
                    }
                    // console.log(json);
                    writeJSONtoDirectory(j, json)
                }
                pinJSONDirectoryToIPFS("170fe7a155cc7cbc5721", "3a2c6241986cc68a359daf661dcb40557d9d841b07958ed713815118da3db408");
            })
            .catch(function (error) {
                console.log(error)
            });
    });
};

function pinJSONDirectoryToIPFS(pinataApiKey, pinataSecretApiKey) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = 'C:/Users/alexi/Desktop/Github/ChaosNfts/chaos-app/Directory_JSON';

    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(src, function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(src, file)
            });
        });

        const metadata = JSON.stringify({
            name: 'testname',
            keyvalues: {
                exampleKey: 'exampleValue'
            }
        });
        data.append('pinataMetadata', metadata);

        return axios
            .post(url, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey
                }
            })
            .then(function (response) {
                console.log("JSON Hash : ", response.data.IpfsHash)
            })
            .catch(function (error) {
                console.log(error)
            });
    });
};
