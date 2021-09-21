import Head from "next/head";
import Header from "../components/Header";
import LandingPage from "../components/LandingPage";
import Footer from "../components/Footer";
import React from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="">
      <title>Chaos Blocks</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta name="description" content="" />
      <meta name="keywords" content="" />
      <meta name="author" content="" />
      <meta name="theme-color" content="" />
      <meta
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />

      <link
        href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700"
        rel="stylesheet"
      />

      <main className="">
        <LandingPage />
      </main>
    </div>
  );
}
