import React from "react";

import TitleBar from "./TitleBar";
import Content from "./Content";

export default function LandingPage() {
  return (
    <div className="flex flex-col bg items-center h-auto text-white">
      <TitleBar />
      {/* <div className=" mt-4 md:mt-12 text-4xl text-center text-white">
        A collection of IOOO generative artworks experimenting with
      </div> */}
      {/* <div className="text-4xl text-center text-white">
        minimalism, simplicity and linework
      </div> */}
      <Content />
      <div className="h-52"></div>
    </div>
  );
}
