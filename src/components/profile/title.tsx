"use client";
import React from "react";

interface TitleProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}
export const Title = ({ title, setTitle }: TitleProps) => {
  return <div>{title}</div>;
};
