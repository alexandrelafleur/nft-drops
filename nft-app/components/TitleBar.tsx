import React from "react";
import { Logo, Title, Connect, Art, Twitter } from "./svg";
import { ConnectButton } from "./Btn";

export default function TitleBar() {
  return (
    <div className="flex flex-initial flex-col md:flex-row w-full h-48 md:h-auto">
      <div className="hidden md:flex flex-initial w-48 justify-start pl-8">
        {/* <Logo class="w-full" /> */}
        <Twitter class="w-1/3" />
      </div>
      <div className="flex flex-auto justify-center content-center flex-col text-center my-auto ">
        <span className="flex-initial text-6xl md:text-8xl 2xl:text-9xl h-auto  justify-center text-white">
          CHAOS BLOCKS
        </span>
      </div>
      <div className="flex flex-col flex-initial w-full md:w-48 justify-center items-center md:items-end md:pr-10 mx-auto text-white ">
        <ConnectButton />
      </div>
    </div>
  );
}
