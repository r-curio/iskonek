"use client";

import ChatWindow from "@/components/chat/chat-window";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";
import Sidebar from "@/components/sidebar/sidebar";
import { useParams, useSearchParams } from "next/navigation";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  department: string;
  bgColor?: string;
}

interface Message {
  id: string;
  created_at: string | null;
  content: string;
  sender_id: string;
  room_id: string;
}

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const username = searchParams.get('username');
  const isRandom = searchParams.get('isRandom');
  const isBlitz = searchParams.get('isBlitz');

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profilePic, setProfilePic] = useState<string>("");
  const [department, setDepartment] = useState<string | undefined>(undefined);
  const [createdAt, setCreatedAt] = useState<string | undefined>(undefined);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!id || !username || !user) {
        setLoading(false);
        return;
      }
      
      try {
        const messagesPromise = supabase
          .from("messages")
          .select("*")
          .eq("room_id", id)
          .order("created_at", { ascending: true });

        const recipientPromise = supabase
          .from("profiles")
          .select("avatar, department")
          .ilike("username", username)
          .single();

        const roomPromise = supabase
          .from("chat_rooms")
          .select("created_at")
          .eq("id", id)
          .single();
        
        const currentUserProfilePromise = supabase
          .from("profiles")
          .select("id, username, avatar, department, bgColor")
          .eq("id", user.id)
          .single<Profile>();

        const [
          { data: messagesData, error: messagesError },
          { data: recipientData, error: recipientError },
          { data: roomData, error: roomError },
          { data: currentUserProfileData, error: currentUserProfileError }
        ] = await Promise.all([messagesPromise, recipientPromise, roomPromise, currentUserProfilePromise]);

        if (messagesError || recipientError || roomError || currentUserProfileError) {
            console.error(messagesError || recipientError || roomError || currentUserProfileError);
            return;
        }

        if (recipientData) {
            const avatar = createAvatar(funEmoji, {
                seed: recipientData.avatar || username || "Adrian",
            });
            setProfilePic(avatar.toDataUri());
            setDepartment(recipientData.department ?? undefined);
        }

        if (currentUserProfileData) {
          const avatar = createAvatar(funEmoji, {
            seed: currentUserProfileData.avatar || currentUserProfileData.username || "Adrian",
          });
          currentUserProfileData.avatar = avatar.toDataUri();
          setCurrentUserProfile(currentUserProfileData);
        }

        setMessages(messagesData || []);
        setCreatedAt(roomData?.created_at ?? undefined);

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, username]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }
  
  if (!currentUserProfile) {
    // You can also redirect the user or show a more specific message
    return <div>Unauthorized.</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
        <Sidebar 
            user={currentUserProfile}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMenu={toggleMobileMenu}
        />
        <main className="flex-1 flex flex-col min-w-0">
            <ChatWindow
                recipientName={username!}
                recipientProfilePic={profilePic}
                recipientDepartment={department}
                messages={messages}
                roomId={id}
                isRandom={isRandom === "true"}
                isBlitz={isBlitz === "true"}
                createdAt={createdAt}
            >
                <div className="lg:hidden">
                    <MobileMenuButton
                        isOpen={isMobileMenuOpen}
                        onToggle={toggleMobileMenu}
                    />
                </div>
            </ChatWindow>
        </main>
    </div>
  );
}
