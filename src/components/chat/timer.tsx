"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp?: () => void;
}

export function Timer({ initialTime, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp && onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
      setProgress((prevProgress) => prevProgress - 100 / initialTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, initialTime, onTimeUp]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-2 font-bold text-2xl text-primary">
        {formatTime(timeLeft)}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
