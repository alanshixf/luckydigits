"use client";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/react";
import { Session } from "next-auth";
import React from "react";

interface UserMenuProps {
  session: Session | null;
}
const UserMenu = ({ session }: UserMenuProps) => {
  const user = session?.user;
  return (
    <div>
      {user ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>

              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              href="/api/auth/signin?callbackUrl=/"
              variant="flat"
            >
              Sign In
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </div>
  );
};

export default UserMenu;
