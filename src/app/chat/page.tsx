"use client";
import Image from "next/image";
import Logo from "@/images/logo.svg";
import { Button } from "@/components/ui/button";
import { useMatchmaking } from "@/hooks/use-matchmaking";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingScreen from "./loading";

export default function Page() {
  const { isSearching, handleConnect, handleCancelSearch } = useMatchmaking(true);

  return (
    <ScrollArea className="h-screen w-full">
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
        <div className="text-center max-w-4xl mx-auto px-4 z-1">
          <div className="relative h-24 w-24 mx-auto mb-6">
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
          <h1 className="text-5xl font-bold text-[#682A43] mb-4">
            Isko<span className="text-[#C6980F]">nek</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore two ways to connect with fellow Iskolars:
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8">
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
                className="bg-[#682A43] hover:bg-[#571830] text-white px-8 py-6 rounded-xl text-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Blitz Chat
              </Button>
              <p className="text-sm text-gray-600 max-w-[200px]">
                Same as the normal one, but with time restrictions!
              </p>
            </div>
          </div>
        </div>
        {isSearching && <LoadingScreen handleCancelSearch={handleCancelSearch} />}
      </div>
    </ScrollArea>
  );
}
