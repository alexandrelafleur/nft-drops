declare let window: any;
import * as ga from "../../lib/ga";
import Web3 from "web3";
const chainHexa = "0x4"; // 0x4 = Rinkeby

var provider

import { ether_cost, address, abi } from "../../lib/abi";
export { connectMetamask, sendTransaction }

async function loadWeb3() {
    try {
        console.log("loading web3");
        if (window && window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        console.log("loaded web3");
    } catch (error) {
        console.log(error);
    }
}

async function connectMetamask() {
    loadWeb3();
    ga.event({
        action: "connect",
        params: {
            sucess: "true",
        },
    });
    //TODO connect with valid chain
    try {
        provider = window.ethereum;
        if (!provider) {
            window.alert("Please install MetaMask first.");
            return;
        }
        await provider.enable();
        const accounts = await provider.request({
            method: "eth_accounts",
        });
        console.log("account ", accounts);
        console.log("Is connected ?", provider.isConnected());
    } catch (error) {
        console.log(error);
    }
}

async function sendTransaction(count: number) {
    // address = process.env.CONTRACT_ADDRESS;
    console.log("Sending Transaction Request...");
    console.log("address = ", address);

    const mintAmount = count;
    const encodedData = await getEncodedData(mintAmount);
    const params = {
        // gasPrice: DecToHex(GweiToWei(100)), // customizable by user during MetaMask confirmation.
        // gas: DecToHex(800000), // customizable by user during MetaMask confirmation.
        to: address, // Required except during contract publications.
        from: provider.selectedAddress, // must match user's active address.
        value: DecToHex(EthToWei(ether_cost * mintAmount)), // Only required to send ether to the recipient from the initiating external account.
        data: encodedData, // Optional, but used for defining smart contract creation and interaction.
        chainId: chainHexa, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };

    try {
        const txHash = await provider.request({
            method: "eth_sendTransaction",
            params: [params],
        });
        console.log("Transaction Sent!");
        console.log("Tx Hash : ", txHash);
        alert("Transaction sent with hash:" + txHash);
    } catch (error) {
        console.log(error);
    }
}

function DecToHex(decimal) {
    return decimal.toString(16);
}
function EthToWei(number) {
    return 1000000000000000000 * number;
}
function GweiToWei(number) {
    return 1000000000 * number;
}



async function getEncodedData(mintAmount) {
    try {
        const contract = await new window.web3.eth.Contract(abi, address);
        const encodedData = contract.methods.buy(mintAmount).encodeABI();
        console.log(contract);
        return encodedData;
    } catch (error) {
        console.log(error);
    }
}
