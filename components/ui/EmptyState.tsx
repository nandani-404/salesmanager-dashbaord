"use client";

import Lottie from "lottie-react";
import notFoundAnimation from "@/public/lottie/Not-Found.json";

interface EmptyStateProps {
    title?: string;
    message?: string;
    animationSize?: number;
}

export default function EmptyState({
    title = "No Data Found",
    message = "Try adjusting your search criteria",
    animationSize = 200,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center w-full py-16 px-4">
            <div
                style={{ width: animationSize, height: animationSize }}
                className="mb-4"
            >
                <Lottie
                    animationData={notFoundAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1 text-center">
                {title}
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-xs">
                {message}
            </p>
        </div>
    );
}
