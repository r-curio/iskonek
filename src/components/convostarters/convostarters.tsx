"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Snowflake, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'

export default function ConvoStarters() {
  const [currentSet, setCurrentSet] = useState(0)
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)

  const questionSets = [
    {
      title: "Social Issues",
      questions: [
        "What are your thoughts about PUP?",
        "What do you think about the quality of education here in PUP?",
        "How would you improve college facilities in PUP?",
        "What's your take on the 'burgis' issue in state universities?",
      ]
    },
    {
      title: "Personal Growth",
      questions: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ]
    },
    {
      title: "Technology",
      questions: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ]
    }
  ]

  const currentQuestions = questionSets[currentSet]

  const goToPrevious = () => {
    setCurrentSet((prev) => (prev > 0 ? prev - 1 : questionSets.length - 1))
  }

  const goToNext = () => {
    setCurrentSet((prev) => (prev < questionSets.length - 1 ? prev + 1 : 0))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitOpen(false)
    // Handle the submission logic here
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Snowflake className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-sm bg-white/95">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[#682A43]/60">ConvoStarters</DialogTitle>
            <div className="flex items-center justify-between mt-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={goToPrevious} 
                className="h-8 w-8 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
              </Button>
              <p className="text-sm text-black font-bold">{currentQuestions.title}</p>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={goToNext} 
                className="h-8 w-8 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
              >
                <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-0">
            {currentQuestions.questions.map((question, index) => (
              <div key={index} className="flex items-center gap-3 group">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-black fill-yellow-400 transition-transform duration-200 ease-in-out group-hover:scale-125" />
                  </div>
                </div>
                <Button
                  className="w-full justify-start bg-[#693d52] hover:bg-[#532e40] text-left h-auto py-3 px-4 whitespace-normal transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
                >
                  {question}
                </Button>
              </div>
            ))}
            <div className="mt-2 text-center text-sm">
              <span className="text-muted-foreground">Have a question suggestion in mind? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto text-[#693d52] transition-colors duration-200 ease-in-out hover:text-[#532e40]"
                onClick={() => setIsSubmitOpen(true)}
              >
                Submit Here
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-md bg-[#F1EAEA] pt-6">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-[#682A43]/60">
              Ask your Question here.
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <Input 
              placeholder="Type your question..."
              className="bg-white/80 border-gray-200 focus-visible:ring-[#693d52]"
            />
            <Button 
              type="submit"
              className="w-full bg-[#693d52] hover:bg-[#532e40] transition-colors duration-200"
            >
              Submit Question
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

