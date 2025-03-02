"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";

interface CountdownTimerProps {
  expiryTime?: string; // ISO date string
}

export const CountdownTimer = ({ expiryTime }: CountdownTimerProps) => {
  const [countdown, setCountdown] = useState("00:00");
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (!expiryTime) return;
    
    // Get the initial time difference when the component mounts
    const initialExpiryTime = new Date(expiryTime).getTime();
    const initialCurrentTime = new Date().getTime();
    const initialDifference = initialExpiryTime - initialCurrentTime;
    
    // If already expired, don't set up the timer
    if (initialDifference <= 0) {
      setProgressPercentage(100);
      setCountdown("00:00");
      return;
    }
    
    // Store the initial total seconds for percentage calculation
    const initialTotalSeconds = Math.floor(initialDifference / 1000);
    
    const calculateTimeLeft = () => {
      const expiryTimeMs = new Date(expiryTime).getTime();
      const currentTime = new Date().getTime();
      const difference = expiryTimeMs - currentTime;
      
      if (difference <= 0) {
        setProgressPercentage(100);
        return "00:00";
      }
      
      // Calculate minutes and seconds
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      
      // Calculate total seconds remaining
      const totalSecondsRemaining = Math.floor(difference / 1000);
      
      // Calculate percentage based on how much time has elapsed compared to initial time
      const percentageElapsed = 100 - ((totalSecondsRemaining / initialTotalSeconds) * 100);
      setProgressPercentage(Math.min(100, Math.max(0, percentageElapsed)));
      
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Set initial countdown and progress
    setCountdown(calculateTimeLeft());
    
    // Update countdown every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setCountdown(timeLeft);
      
      if (timeLeft === "00:00") {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [expiryTime]);

  if (!expiryTime) return null;

  return (
    <div className="bg-accent w-full pt-3 pb-4 px-4 flex flex-row justify-between text-white text-sm relative">
      <p>We are holding your special offer</p>
      <p className="font-bold">{countdown}</p>
      <div className="absolute bottom-0 left-0 right-0">
        <ProgressBar percentage={progressPercentage} />
      </div>
    </div>
  );
}; 