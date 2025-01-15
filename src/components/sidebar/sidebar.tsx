"use client";
import Image from "next/image";
import Logo from "@/images/logo.svg";
import { Button } from "@/components/ui/button";
import { BsChatLeftFill, BsPersonFillAdd , BsSearch, BsFillPeopleFill } from "react-icons/bs";
import { CustomInput } from "./custom-input";
import { SectionDivider } from "../ui/section-divider";
import { ContactsList } from "./contacts-list";
import { FriendRequestList } from "./friend-request-list";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
interface User {
  id: string;
  username: string;
  avatarUrl: string | undefined;
}


export default function Sidebar() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [, setSelectedContact] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayFriendRequests, setDisplayFriendRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);

  const filteredContacts = contacts?.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    
    const fetchFriendRequests = async () => {
      console.log("fetching friend requests");
      const response = await fetch("/api/friend?status=pending");
      const data = await response.json();
      console.log(data);
      setFriendRequests(data.friendRequests);
    };

    const fetchContacts = async () => {
      console.log("fetching contacts");
      const response = await fetch("/api/friend?status=accepted");
      const data = await response.json();
      console.log(data);
      setContacts(data.acceptedFriends);
    }

    fetchContacts();
    fetchFriendRequests();

  }, []);

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
          onClick={() => setDisplayFriendRequests((prev) => !prev)}
        >
          {displayFriendRequests ? (
            <>
              <BsFillPeopleFill className="text-2xl" />
              <span>Contacts</span>
            </>
          ) : (
            <>
              <BsPersonFillAdd className="text-2xl" />
              <span>Friend Requests</span>
            </>
          )}
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

          {displayFriendRequests ? (
            <FriendRequestList
              friendRequests={friendRequests}
            />
          ) : (
            <ContactsList
              contacts={filteredContacts}
              onSelectContact={setSelectedContact}
            />
          )}
      </div>

      <footer className="h-16 border-t bg-white">
        <UserProfile
          avatarUrl={""}
          name={"John Doe"}
        />
      </footer>
    </aside>
  );
}