"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/images/logo.svg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BsChatLeftFill,
  BsPersonFillAdd,
  BsSearch,
  BsFillPeopleFill,
} from "react-icons/bs";
import { CustomInput } from "./custom-input";
import { SectionDivider } from "../ui/section-divider";
import { ContactsList } from "./contacts-list";
import { FriendRequestList } from "./friend-request-list";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { useFriendUpdates } from "@/hooks/use-FriendUpdates";
import { useSearchParams } from "next/navigation";
import UserProfile from "./user-profile";
import { createClient } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

interface RandomChat {
  roomId: string;
  username: string;
}
interface User {
  id: string;
  username: string;
  avatarUrl: string; // Consistent naming
  isRandom?: boolean;
  department?: string;
}

interface Profile {
  id: string;
  username: string;
  avatar: string;
  department?: string;
  bgColor?: string;
}

export default function Sidebar({ user }: { user: Profile }) {
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [displayFriendRequests, setDisplayFriendRequests] = useState(false);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [activeRandomChats, setActiveRandomChats] = useState<RandomChat[]>([]);
  const [userProfile, setUserProfile] = useState(user);
  const searchParams = useSearchParams();
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  useFriendUpdates(setFriendRequests, setContacts);

  useEffect(() => {
    const fetchInitialData = async () => {
      const [requestsResponse, contactsResponse] = await Promise.all([
        fetch("/api/friend?status=pending"),
        fetch("/api/friend?status=accepted"),
      ]);

      const requestsData = await requestsResponse.json();
      const contactsData = await contactsResponse.json();

      setFriendRequests(requestsData.friendRequests || []);
      setContacts(contactsData.acceptedFriends || []);
    };

    fetchInitialData();
  }, []);

  // Add random chat when URL changes
  useEffect(() => {
    const roomId = pathname.split("/chat/")[1];
    const isRandom = searchParams.get("isRandom") === "true";
    const username = searchParams.get("username");

    if (pathname.startsWith("/chat") && isRandom && roomId && username) {
      setActiveRandomChats((prev) => [
        ...prev.filter((chat) => chat.roomId !== roomId),
        { roomId, username },
      ]);
      setSelectedContactId(roomId);
    }

    if (pathname === "/chat") {
      setSelectedContactId(null);
    }
  }, [pathname, searchParams]);

  // Listen for room deletions
  useEffect(() => {
    const channel = supabase
      .channel("sidebar-room-deletion")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_rooms",
        },
        (payload) => {
          setActiveRandomChats((prev) =>
            prev.filter((chat) => chat.roomId !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  //Listen for profile updates
  useEffect(() => {
    const channel = supabase
      .channel("sidebar-profile")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          // Create new avatar
          const avatar = createAvatar(funEmoji, {
            seed: payload.new.avatar || payload.new.username || "Adrian",
          });

          // Update local profile state
          setUserProfile((prev) => ({
            ...prev,
            username: payload.new.username,
            department: payload.new.department,
            avatar: avatar.toDataUri(),
            bgColor: payload.new.bgColor,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id]);

  // Merge contacts with active random chats
  const combinedContacts = [
    ...activeRandomChats.map((chat) => ({
      id: chat.roomId,
      username: chat.username,
      avatarUrl: undefined,
      isRandom: true,
    })),
    ...contacts.filter(
      (contact) => !activeRandomChats.some((chat) => chat.roomId === contact.id)
    ),
  ];

  // Update filteredContacts to use combinedContacts
  const filteredContacts = combinedContacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="h-screen flex flex-col bg-[#FAF9F6] shadow-lg overflow-hidden w-[280px] flex-shrink-0">
      <header className="flex items-center z-10 shadow-md h-16 gap-3 px-4 py-3 bg-white">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={Logo}
            alt="logo"
            width={40}
            height={40}
            className="object-contain pointer-events-none"
          />
          <h1 className="text-2xl font-bold text-accent">
            Isko<span className="text-[#C6980F]">nek</span>
          </h1>
        </Link>
      </header>

      <nav className="p-4 flex flex-col gap-2">
        <Button
          variant="ghost"
          className={`flex gap-3 rounded-lg hover:bg-[#682A43] hover:text-white transition-colors w-full justify-start ${
            pathname === "/chat" ? "bg-[#682A43] text-white" : ""
          }`}
          onClick={() => router.push("/chat")}
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
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-3">
                  <BsPersonFillAdd className="text-2xl" />
                  <span>Friend Requests</span>
                </div>
                {friendRequests.length > 0 && (
                  <Badge variant="destructive" className="">
                    {friendRequests.length}
                  </Badge>
                )}
              </div>
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
        <ScrollArea className="px-4">
          {displayFriendRequests ? (
            <FriendRequestList
              friendRequests={friendRequests}
              onFriendRequestHandled={(id) =>
                setFriendRequests((prev) => prev.filter((req) => req.id !== id))
              }
            />
          ) : (
            <ContactsList
              contacts={filteredContacts}
              onSelectContact={(contact) => setSelectedContactId(contact.id)}
              selectedContactId={selectedContactId}
            />
          )}
        </ScrollArea>
      </div>

      <footer className="h-16 border-t bg-white">
        <UserProfile
          avatarUrl={userProfile.avatar}
          name={userProfile.username ?? "Anonymous"}
          department={userProfile.department ?? "No Department"}
          bgColor={userProfile.bgColor ?? "#F9FAFB"}
        />
      </footer>
    </aside>
  );
}
