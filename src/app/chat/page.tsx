"use client";

import Image from "next/image";
import Logo from "@/images/logo.svg";
import { Button } from "@/components/ui/button";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingScreen from "./searching";
import Sidebar from "@/components/sidebar/sidebar";
import { MobileMenuButton } from "@/components/ui/mobile-menu-button";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  department: string;
  bgColor?: string;
}

export default function Page() {
  const { isSearching, handleConnect, handleCancelSearch } =
    useMatchmaking(true);
  const {
    isSearching: isBlitzSearching,
    handleConnect: handleBlitzConnect,
    handleCancelSearch: handleBlitzCancel,
  } = useMatchmaking(false, true);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("id, username, avatar, department, bgColor")
          .eq("id", user.id)
          .single<Profile>();
        
        if (userProfile) {
          const avatar = createAvatar(funEmoji, {
            seed: userProfile.avatar || userProfile.username || "Adrian",
          });
          userProfile.avatar = avatar.toDataUri();
          setProfile(userProfile);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  if (!profile) {
    return <div>Unauthorized</div>; // Or redirect to login
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
        <Sidebar 
            user={profile}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMenu={() => setMobileMenuOpen(!isMobileMenuOpen)}
        />
        {!isMobileMenuOpen && (
            <div className="absolute top-4 left-4 z-50 lg:hidden">
                <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
                />
            </div>
        )}
        <main className="flex-1 flex flex-col min-w-0">
            <ScrollArea className="h-screen w-full">
                <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
                    <div className="text-center max-w-4xl mx-auto px-4 z-1">
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-4 sm:mb-6">
                            <Image
                            src={Logo}
                            alt="Iskonek Logo"
                            fill
                            priority
                            className="object-contain drop-shadow-lg"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#682A43] mb-3 sm:mb-4">
                            Isko<span className="text-[#C6980F]">nek</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Explore two ways to connect with fellow Iskolars:
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 max-w-2xl mx-auto">
                            <div className="flex flex-col items-center gap-3 transition-transform duration-200 hover:-translate-y-1">
                            <Button
                                className="bg-[#682A43] hover:bg-[#571830] text-white px-8 py-6 rounded-xl text-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                onClick={handleConnect}
                            >
                                Talk with Iskolars
                            </Button>
                            <p className="text-sm text-gray-600 max-w-[200px]">
                                Fully random matching across currently online Iskolars
                            </p>
                            </div>
                            <div className="flex flex-col items-center gap-3 transition-transform duration-200 hover:-translate-y-1">
                            <Button
                                className="bg-[#682A43] hover:bg-[#571830] text-white px-8 py-6 rounded-xl text-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                onClick={handleBlitzConnect}
                            >
                                Blitz Chat
                            </Button>
                            <p className="text-sm text-gray-600 max-w-[200px]">
                                Same as the normal one, but with time restrictions!
                            </p>
                            </div>
                        </div>
                    </div>
                    {isSearching && (
                    <LoadingScreen handleCancelSearch={handleCancelSearch} />
                    )}
                    {isBlitzSearching && (
                    <LoadingScreen handleCancelSearch={handleBlitzCancel} />
                    )}
                </div>
            </ScrollArea>
        </main>
    </div>
  );
}
