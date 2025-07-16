"use client";

import { useState, ReactNode } from "react";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-2 font-semibold flex justify-between items-center"
      >
        {title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="pb-2 px-2 text-gray-700">{children}</div>}
    </div>
  );
}

type AccordionProps = {
  children: ReactNode;
};

export function Accordion({ children }: AccordionProps) {
  return <div className="rounded-lg shadow-md bg-white">{children}</div>;
}
