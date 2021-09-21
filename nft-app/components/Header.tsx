import React from "react";

export default function Header() {
  return (
      <div className="bg-black">
        <div className="h-auto justify-between px-3 md:px-10 2xl:px-20 md:mx-auto flex flex-col items-center">
        <div className="flex h-auto justify-between flex-col w-full items-center md:flex-row">
          <div className="flex justify-around flex-col w-full md:justify-around items-center text-center h-full my-4">
            <span className="text-gray-200 text-4xl font-bold w-auto md:w-full">
              Flower People
            </span>
          </div>
        </div>
      </div>
      </div>
    );
}
