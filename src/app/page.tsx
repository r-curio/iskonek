import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Users, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import bgPattern from "@/images/bg.svg";
import Logo from "@/images/logo.svg";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ScrollArea className="h-screen w-full">
      <main className="w-full">
        {/* Hero Section with Background Pattern */}
        <section className="relative min-h-screen w-full bg-[#e0e0e0] flex items-center">
          <div className="absolute inset-0 w-full h-full opacity-75 pointer-events-none">
            <Image
              src={bgPattern.src}
              alt="Background Pattern"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
          </div>

          <div className="relative container mx-auto px-4 py-12 sm:py-20 text-center z-10">
            <div className="mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300">
              <Image
                src={Logo.src}
                alt="Iskonek Logo"
                width={80}
                height={80}
                className="mx-auto pointer-events-none sm:w-24 sm:h-24"
                priority
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#702632] mb-4 sm:mb-6">
              Connect Anonymously
              <br />
              with Fellow PUP Students
            </h1>
            <p className="text-base sm:text-lg text-[#666] max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              Join Iskonek and chat without revealing your identity. A safe
              space for PUP students to connect, share, and support each other.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/login"
                className="transform transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="bg-[#702632] hover:bg-[#5c1f28] text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out relative after:absolute after:inset-0 after:z-[-1] after:bg-[#702632] after:opacity-30 after:blur-lg after:transition-all after:duration-300 hover:after:opacity-60 w-full sm:w-auto"
                >
                  {user ? "Start Chatting" : "Log In"}
                </Button>
              </Link>
              {user ? null : (
                <Link
                  href="/auth/register"
                  className="transform transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-[#702632] text-[#702632] hover:bg-[#702632] hover:text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#702632] text-center mb-8 sm:mb-16 relative">
              Why Choose Iskonek?
              <span className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-[#702632]/30 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
              <Card className="p-6 sm:p-8 bg-gray-50 border-none hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-[#702632] mb-4 sm:mb-6 mx-auto" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#702632] mb-3 sm:mb-4 text-center">
                  Verified PUP Students Only
                </h3>
                <p className="text-[#666] text-sm sm:text-base text-center">
                  Exclusive platform for PUP Students, verified through official
                  PUP Webmail.
                </p>
              </Card>
              <Card className="p-6 sm:p-8 bg-gray-50 border-none hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-[#702632] mb-4 sm:mb-6 mx-auto" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#702632] mb-3 sm:mb-4 text-center">
                  Stay Anonymous
                </h3>
                <p className="text-[#666] text-sm sm:text-base text-center">
                  Chat freely without revealing your identity while maintaining
                  a safe environment.
                </p>
              </Card>
              <Card className="p-6 sm:p-8 bg-gray-50 border-none hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white sm:col-span-2 lg:col-span-1">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-[#702632] mb-4 sm:mb-6 mx-auto" />
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#702632] mb-3 sm:mb-4 text-center">
                  Meaningful Connections
                </h3>
                <p className="text-[#666] text-sm sm:text-base text-center">
                  Connect with peers who share your interests and experiences.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#702632] text-white py-6 text-center text-base">
          <p>© {new Date().getFullYear()} Iskonek. For PUP Students Only.</p>
        </footer>
      </main>
    </ScrollArea>
  );
}
