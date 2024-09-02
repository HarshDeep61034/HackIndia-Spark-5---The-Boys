"use client";
import React from "react";
import { RecoilRoot } from "recoil";
const RecoilContextProvider = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};
export default RecoilContextProvider;