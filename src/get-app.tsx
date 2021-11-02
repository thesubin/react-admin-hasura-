import React from "react";
import App from "./App";
// import buildHasuraProvider from 'ra-data-hasura-graphql';
import buildHasuraProvider from "ra-data-hasura";
import { BrowserRouter, Route, Link } from "react-router-dom";
const uri = "https://react-admin-low-code.hasura.app/v1/graphql";

export default async function getApp() {
  const provider = await buildHasuraProvider({ clientOptions: { uri: uri } });

  return () =><BrowserRouter> <App dataProvider={provider} /> </BrowserRouter>;
}
