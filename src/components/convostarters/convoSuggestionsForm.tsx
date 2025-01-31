import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const ConvoStartersSuggestionForm = ({
  onBack,
}: {
  onBack: () => void;
}) => {
  const [suggestion, setSuggestion] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const { toast } = useToast();

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setIsCustomCategory(true);
      setCategory("");
    } else {
      setIsCustomCategory(false);
      setCategory(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategory : category;

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: finalCategory,
          suggestion,
        }),
      });
      if (response.ok) {
        toast({
          title: "Suggestion submitted!",
          description:
            "Thank you for your suggestion. We will review it and add it to our ConvoStarters list.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Failed to submit suggestion",
          description: data.error || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to submit suggestion",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }

    onBack();
  };

  return (
    <div className="flex flex-col gap-3 px-4">
      <Button
        variant="ghost"
        className="w-fit text-black hover:bg-gray-50/2 hover:text-[#682A43] -ml-2"
        onClick={onBack}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to questions
      </Button>
      <div className="text-sm text-black">
        <p>
          Have a suggestion in mind? Send it to us and we&apos;ll add it to our
          ConvoStarters list!
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4 text-black">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3 space-y-2">
              <Select
                value={isCustomCategory ? "custom" : category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Social Issues">Social Issues</SelectItem>
                  <SelectItem value="Personal Growth">
                    Personal Growth
                  </SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="custom">Add custom category</SelectItem>
                </SelectContent>
              </Select>
              {isCustomCategory && (
                <Input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  required
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question" className="text-right">
              Suggestion
            </Label>
            <Textarea
              id="question"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="col-span-3"
              placeholder="Type your convo starter suggestion here..."
              required
            />
          </div>
        </div>
        <Button
          className="w-full bg-[#693d52] hover:bg-[#532e40] text-white h-10 transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
          type="submit"
        >
          Submit Suggestion
        </Button>
      </form>
    </div>
  );
};
