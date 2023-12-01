import React from "react";

import logo from "../../assets/logo.png";
import Image from "next/image";
import { getServerSession } from "next-auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/react";
import { authOptions } from "@/lib/auth-options";
import UserMenu from "./usermenu";

const Header = async () => {
  const session = await getServerSession(authOptions);
  return (
    <Navbar
      isBordered
      maxWidth="full"
      height={"8rem"}
      className="m-auto min-w-[300px] max-w-[1600px] 
      bg-warning-100"
    >
      <NavbarContent justify="start">
        <div className="flex flex-col items-center">
          <span className="gradient-text ml-2 hidden text-6xl font-bold sm:block">
            76
          </span>
          <span className="text-zinc-400">
            {new Date().getUTCFullYear()} weeks: 44
          </span>
        </div>
      </NavbarContent>
      <NavbarContent justify="center">
        <NavbarBrand className="mr-4">
          <Link href={"/"} className="isBlock" size="lg">
            <Image src={logo} alt="LKC logo" width={60} height={60} />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <UserMenu session={session} />
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
