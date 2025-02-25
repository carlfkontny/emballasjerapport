import type { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export function Card({ title, value, icon }: CardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-700 dark:text-gray-200">
            {value}
          </p>
        </div>
        <div className="text-gray-400 dark:text-gray-500">{icon}</div>
      </div>
    </div>
  );
}
