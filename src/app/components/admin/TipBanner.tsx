import React from "react";

interface TipBannerProps {
  title?: string;
  message: string;
  type?: "info" | "success" | "warning";
}

export const TipBanner: React.FC<TipBannerProps> = ({
  title = "Tip",
  message,
  type = "info",
}) => {
  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-400",
      title: "text-blue-800",
      text: "text-blue-700",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-400",
      title: "text-green-800",
      text: "text-green-700",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-400",
      title: "text-amber-800",
      text: "text-amber-700",
    },
  };

  const style = styles[type];

  return (
    <div className={`rounded-md ${style.bg} p-4 border ${style.border} mb-6`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${style.icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${style.title}`}>{title}</h3>
          <div className={`mt-2 text-sm ${style.text}`}>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
