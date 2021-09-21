import React from "react";
import Timer from "./Timer";

export default function Content() {
  return (
    <div className="flex-auto h-auto w-full container justify-around">
      <div className="flex-1 w-full h-auto z-0 inner mx-auto">
        <iframe
          className="h-screen w-screen max-w-4xl mx-auto"
          src="/nft.html"
        ></iframe>
      </div>
      <Timer />
    </div>
  );
}
