"use client";
import Image from "next/image";
import Logo from "@/images/logo.svg";
import { Button } from "@/components/ui/button";
import { BsChatLeftFill, BsFillPeopleFill, BsSearch } from "react-icons/bs";
import { CustomInput } from "./custom-input";
import { SectionDivider } from "../ui/section-divider";
import { ContactsList } from "./contacts-list";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
}

interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

const contacts: Contact[] = [
  {
    id: "2",
    name: "Alice Smith",
    avatarUrl: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Bob Johnson",
    avatarUrl: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Carol Williams",
    avatarUrl: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    name: "David Brown",
    avatarUrl: "/placeholder.svg?height=32&width=32",
  },
];

const currentUser: User = {
  id: "1",
  name: "John Doe",
  avatarUrl: "https://github.com/shadcn.png",
};

export default function Sidebar() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="h-screen flex flex-col bg-[#FAF9F6] shadow-lg overflow-hidden w-[280px] flex-shrink-0">
      <header className="flex items-center z-10 shadow-md h-16 gap-3 px-4 py-3 bg-white">
        <Image
          src={Logo}
          alt="logo"
          width={40}
          height={40}
          className="object-contain"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        <h1 className="text-2xl font-bold text-accent">
          Isko<span className="text-[#C6980F]">nek</span>
        </h1>
      </header>

      <nav className="p-4 flex flex-col gap-2">
        <Button
          variant="ghost"
          className="flex gap-3 rounded-lg hover:bg-[#682A43] hover:text-white transition-colors w-full justify-start"
        >
          <BsChatLeftFill className="text-lg" />
          <span>New Chat</span>
        </Button>
        <Button
          variant="ghost"
          className="flex gap-3 rounded-lg hover:bg-[#682A43] hover:text-white transition-colors w-full justify-start"
        >
          <BsFillPeopleFill className="text-lg" />
          <span>Add Friends</span>
        </Button>
      </nav>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-2">
          <SectionDivider text="Direct Messages" />
          <div className="mt-2">
            <CustomInput
              icon={BsSearch}
              placeholder="Search contacts..."
              className="bg-gray-100 border-gray-300 focus:border-accent transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <ContactsList
            contacts={filteredContacts}
            onSelectContact={setSelectedContact}
            selectedContact={selectedContact}
          />
        </ScrollArea>
      </div>

      <footer className="h-16 border-t bg-white">
        <UserProfile
          avatarUrl={currentUser.avatarUrl}
          name={currentUser.name}
        />
      </footer>
    </aside>
  );
}
