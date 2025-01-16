import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Users, MessageSquare } from 'lucide-react'
import Logo from '@/images/logo.svg'
import Background from '@/images/bg.svg'

export default function LandingPage() {
  return (
    <ScrollArea className="h-screen w-full">
      <main className="min-h-screen w-full bg-[#f5f5f5] relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          style={{
            backgroundImage: "url('/bg.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "auto"
          }}
        />
        
        {/* Hero Section */}
        <div className="relative container mx-auto px-4 pt-20 pb-12 text-center">
          <div className="mb-4">
            <Image
              src={Logo}
              alt="logo"
              width={64}
              height={64}
              className="mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#702632] mb-4">
            Connect Anonymously
            <br />
            with Fellow PUP Students
          </h1>
          <p className="text-[#666] max-w-2xl mx-auto mb-8">
            Join Iskonek and chat without revealing your identity. A safe space for PUP
            students to connect, share, and support each other.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-[#702632] hover:bg-[#5c1f28] text-white px-8"
            >
              Log in
            </Button>
            <Button 
              variant="outline" 
              className="border-[#702632] text-[#702632] hover:bg-[#702632] hover:text-white"
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-[#702632] text-center mb-12">
            Why Choose Iskonek?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 bg-gray-100 border-none">
              <Shield className="w-12 h-12 text-[#702632] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-[#702632] mb-2">
                Verified PUP Students Only
              </h3>
              <p className="text-[#666] text-sm">
                Exclusive platform for PUP Students, verified through official PUP Webmail.
              </p>
            </Card>
            <Card className="p-6 bg-gray-100 border-none">
              <Users className="w-12 h-12 text-[#702632] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-[#702632] mb-2">
                Stay Anonymous
              </h3>
              <p className="text-[#666] text-sm">
                Chat freely without revealing your identity while maintaining a safe environment.
              </p>
            </Card>
            <Card className="p-6 bg-gray-100 border-none">
              <MessageSquare className="w-12 h-12 text-[#702632] mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-[#702632] mb-2">
                Meaningful Connections
              </h3>
              <p className="text-[#666] text-sm">
                Connect with peers who share your interests and experiences.
              </p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#702632] text-white py-4 text-center text-sm">
          <p>© 2024 Iskonek. For PUP Students Only.</p>
        </footer>
      </main>
    </ScrollArea>
  )
}

