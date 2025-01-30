import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Users, MessageSquare } from "lucide-react"
import bgPattern from "@/images/bg.svg" // Import the SVG directly
import Logo from "@/images/logo.svg"

export default function LandingPage() {
  return (
    <ScrollArea className="h-screen w-full opacity-100">
      <main
        className="min-h-screen w-full opacity-100"
        style={{
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      >
        {/* Hero Section with Background Pattern */}
        <section className="relative bg-[#e0e0e0] min-h-[70vh] w-full bg-repeat bg-auto">
          {/* Background Pattern */}
          <div className="absolute inset-0 w-full h-full opacity-75 pointer-events-none z-[1]">
            <Image
              src={bgPattern.src}
              alt="Background Pattern"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
          </div>

          {/* Hero Content */}
          <div className="relative container mx-auto px-4 pt-20 pb-12 text-center z-[2]">
            <div className="mb-4">
              <Image src={Logo.src} alt="Iskonek Logo" width={64} height={64} className="mx-auto" priority />
            </div>
            <h1 className="text-4xl font-bold text-[#702632] mb-4">
              Connect Anonymously
              <br />
              with Fellow PUP Students
            </h1>
            <p className="text-[#666] max-w-2xl mx-auto mb-8">
              Join Iskonek and chat without revealing your identity. A safe space for PUP students to connect, share,
              and support each other.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-[#702632] hover:bg-[#5c1f28] text-white px-8">
                Log In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#702632] text-[#702632] hover:bg-[#702632] hover:text-white"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section - White Background */}
        <section className="container mx-auto px-4 py-16 bg-white">
          <h2 className="text-3xl font-bold text-[#702632] text-center mb-12">Why Choose Iskonek?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-gray-100 border-none hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Shield className="w-12 h-12 text-[#702632] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-[#702632] mb-2 text-center">Verified PUP Students Only</h3>
              <p className="text-[#666] text-sm text-center">
                Exclusive platform for PUP Students, verified through official PUP Webmail.
              </p>
            </Card>
            <Card className="p-6 bg-gray-100 border-none hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Users className="w-12 h-12 text-[#702632] mb-4  mx-auto" />
              <h3 className="text-xl font-semibold text-[#702632] mb-2 text-center">Stay Anonymous</h3>
              <p className="text-[#666] text-sm text-center">
                Chat freely without revealing your identity while maintaining a safe environment.
              </p>
            </Card>
            <Card className="p-6 bg-gray-100 border-none hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <MessageSquare className="w-12 h-12 text-[#702632] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-[#702632] mb-2 text-center">Meaningful Connections</h3>
              <p className="text-[#666] text-sm text-center">
                Connect with peers who share your interests and experiences.
              </p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#702632] text-white py-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Iskonek. For PUP Students Only.</p>
        </footer>
      </main>
    </ScrollArea>
  )
}