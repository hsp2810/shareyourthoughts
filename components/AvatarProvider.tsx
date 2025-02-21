"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AvatarProvider({ name }: { name: string[] }) {
  return (
    <Avatar>
      <AvatarFallback className='text-md'>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

function getInitials(name: string[]) {
  return name.map((n) => n.charAt(0).toUpperCase()).join("");
}
