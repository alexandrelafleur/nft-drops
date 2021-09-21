// require("dotenv").config();
import React, { useState } from "react";
import { connectMetamask, sendTransaction } from "./utils/metamask";

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

async function handleClickMint(count: number) {
  try {
    await connectMetamask();
    await sendTransaction(count);
  } catch (error) {
    console.log(error);
  }
}
