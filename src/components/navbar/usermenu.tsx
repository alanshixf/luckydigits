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
import { signOut } from "next-auth/react";
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
                // showFallback
                as="button"
                className="transition-transform"
                color="secondary"
                name={user?.name || undefined}
                size="sm"
                src={user?.image || ""}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              color="primary"
            >
              <DropdownItem key="profile" className="gap-2" href="/profile">
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="profile" className="gap-2" href="/blog/new">
                <p className="font-semibold">New Blog</p>
              </DropdownItem>

              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
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
