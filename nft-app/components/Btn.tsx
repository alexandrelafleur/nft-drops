// require("dotenv").config();
import React, { useState } from "react";

import * as ga from "../lib/ga";

declare let window: any;
import { ether_cost, address, abi } from "../lib/abi";
import Web3 from "web3";
const chainHexa = "0x4"; // 0x4 = Rinkeby

export function ConnectButton(props) {
  // loadWeb3();

  return (
    <button onClick={connectMetamask}>
      <div className=" flex-initial  text-4xl px-2 border-4 border-white rounded">
        Connect
      </div>
    </button>
  );
}

export function Mint() {
  const [count, setCounter] = useState<number>(5);

  return (
    <div className="z-10 inner flex flex-col bg-color opacity-90">
      <div className="flex flex-auto flex-row justify-center items-center mb-2 gap-1">
        <button
          className="flex-initial w-12 h-12 border-black border-4 rounded text-4xl"
          onClick={() => {
            if (count > 1) {
              setCounter(count - 1);
            }
          }}
        >
          -
        </button>
        <div className="flex-initial w-12">
          <input
            type="text"
            pattern="[0-9]*"
            className="flex-initial w-full text-3xl"
            value={count}
            onChange={(e) => setCounter(Number(e.target.value))}
          />
        </div>

        <button
          className="flex-initial w-12 h-12 border-black border-4 rounded text-4xl"
          onClick={() => setCounter(count + 1)}
        >
          +
        </button>
      </div>
      <MintButton count={count} />
    </div>
  );
}

export function MintButton(props: { count: number }) {
  return (
    <button onClick={() => handleClickMint(props.count)}>
      <div className="flex-initial  text-4xl md:text-6xl px-2 border-4 border-black rounded text-center">
        MINT
      </div>
    </button>
  );
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
    const provider = window.ethereum;
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

async function handleClickMint(count: number) {
  try {
    await connectMetamask();
    sendTransaction(window.ethereum, count);
  } catch (error) {
    console.log(error);
  }
}

async function sendTransaction(provider, count: number) {
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
