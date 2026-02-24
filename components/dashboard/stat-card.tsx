"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ComponentType } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ComponentType<{ className?: string }>;
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="p-6 hover:shadow-md transition-shadow duration-200 h-full">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-md flex-shrink-0">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 truncate">{value}</p>
            {change && (
              <p
                className={`mt-2 text-sm font-medium ${changeType === "positive"
                  ? "text-green-600"
                  : changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
                  }`}
              >
                {change}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
