import React from "react";
import { Loader } from "../Loader/Loader";

interface LoadingPageProps {
  message?: string;
  description?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Loading...",
  description,
}) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-lg w-full py-10 px-4">
        <div className="flex flex-col items-center space-y-6">
          <Loader />
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            {message}
          </h2>
          {description && (
            <p className="text-gray-500 text-center">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
