import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Users, MessageSquare } from "lucide-react"
import bgPattern from "@/images/bg.svg"
import Logo from "@/images/logo.svg"

export default function Home() {
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

          <div className="relative container mx-auto px-4 py-20 text-center z-10">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
              <Image src={Logo.src} alt="Iskonek Logo" width={96} height={96} className="mx-auto" priority />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#702632] mb-6">
              Connect Anonymously
              <br />
              with Fellow PUP Students
            </h1>
            <p className="text-lg text-[#666] max-w-2xl mx-auto mb-12">
              Join Iskonek and chat without revealing your identity. A safe space for PUP students to connect, share,
              and support each other.
            </p>
            <div className="flex gap-6 justify-center">
              <Button size="lg" className="bg-[#702632] hover:bg-[#5c1f28] text-white px-12 py-6 text-lg">
                Log In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-[#702632] text-[#702632] hover:bg-[#702632] hover:text-white px-12 py-6 text-lg"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-[#702632] text-center mb-16">Why Choose Iskonek?</h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <Card className="p-8 bg-gray-50 border-none hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white">
                <Shield className="w-16 h-16 text-[#702632] mb-6 mx-auto" />
                <h3 className="text-2xl font-semibold text-[#702632] mb-4 text-center">Verified PUP Students Only</h3>
                <p className="text-[#666] text-base text-center">
                  Exclusive platform for PUP Students, verified through official PUP Webmail.
                </p>
              </Card>
              <Card className="p-8 bg-gray-50 border-none hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white">
                <Users className="w-16 h-16 text-[#702632] mb-6 mx-auto" />
                <h3 className="text-2xl font-semibold text-[#702632] mb-4 text-center">Stay Anonymous</h3>
                <p className="text-[#666] text-base text-center">
                  Chat freely without revealing your identity while maintaining a safe environment.
                </p>
              </Card>
              <Card className="p-8 bg-gray-50 border-none hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white">
                <MessageSquare className="w-16 h-16 text-[#702632] mb-6 mx-auto" />
                <h3 className="text-2xl font-semibold text-[#702632] mb-4 text-center">Meaningful Connections</h3>
                <p className="text-[#666] text-base text-center">
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
  )
}