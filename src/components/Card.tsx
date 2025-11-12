import React from "react";
import { cn } from "../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-white shadow-md rounded-2xl p-4", className)}>
      {children}
    </div>
  );
};

export default Card;
