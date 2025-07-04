"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConvoStartersSuggestionForm } from "./convoSuggestionsForm";

const QUESTION_SETS = [
  {
    title: "Social Issues",
    questions: [
      "What are your thoughts about PUP?",
      "What do you think about the quality of education here in PUP?",
      "How would you improve college facilities in PUP?",
      "What's your take on the 'burgis' issue in state universities?",
    ],
  },
  {
    title: "Personal Growth",
    questions: [
      "How do you handle pressure?",
      "How do you improve your study habits?",
      "If you'll be given a chance to change one thing in your life, what would it be?",
      "Are you satisfied with your current academic performance?",
    ],
  },
  {
    title: "Technology",
    questions: [
      "Do you think AI will replace human jobs in the future?",
      "Does technology make us smarter or lazier?",
      "Do you think social media is beneficial or harmful to society?",
      "Do you think AI detection tools are effective in preventing cheating?",
    ],
  },
] as const;

interface ConvoStartersProps {
  onSelect: (question: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const QuestionButton = ({
  question,
  onClick,
}: {
  question: string;
  onClick: () => void;
}) => (
  <div className="flex items-center gap-3 group">
    <div className="flex-shrink-0 flex items-center">
      <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
        <Lightbulb className="h-4 w-4 text-black fill-yellow-400 transition-transform duration-200 ease-in-out group-hover:scale-125" />
      </div>
    </div>
    <Button
      className="w-full justify-start bg-[#693d52] hover:bg-[#532e40] text-left h-auto py-3 px-4 whitespace-normal transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      {question}
    </Button>
  </div>
);

export function ConvoStarters({
  onSelect,
  onOpenChange,
  open,
}: ConvoStartersProps) {
  const [currentSet, setCurrentSet] = useState(0);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  const navigate = (direction: "next" | "prev") => {
    setCurrentSet((prev) => {
      if (direction === "next") {
        return prev < QUESTION_SETS.length - 1 ? prev + 1 : 0;
      }
      return prev > 0 ? prev - 1 : QUESTION_SETS.length - 1;
    });
  };

  const currentQuestions = QUESTION_SETS[currentSet];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[450px] min-h-[450px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-sm bg-white/95">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#682A43]/60">
            {showSuggestionForm ? "Submit a Suggestion" : "ConvoStarters"}
          </DialogTitle>
          {!showSuggestionForm && (
            <div className="flex items-center justify-between mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("prev")}
                className="h-8 w-8 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
              >
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
              </Button>
              <p className="text-sm text-black font-bold">
                {currentQuestions.title}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("next")}
                className="h-8 w-8 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
              >
                <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
              </Button>
            </div>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[310px] h-[310px]">
          {showSuggestionForm ? (
            <ConvoStartersSuggestionForm
              onBack={() => setShowSuggestionForm(false)}
            />
          ) : (
            <>
              <div className="flex flex-col gap-3 py-3">
                {currentQuestions.questions.map((question, index) => (
                  <QuestionButton
                    key={index}
                    question={question}
                    onClick={() => {
                      onSelect(question);
                      onOpenChange(false);
                    }}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-[#682A43]/80 mt-4">
                Got a suggestion in mind? Send it to us{" "}
                <u
                  className="cursor-pointer hover:text-[#682A43]"
                  onClick={() => setShowSuggestionForm(true)}
                >
                  here
                </u>
                .
              </div>
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
