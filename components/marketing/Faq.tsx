"use client";

import { useState } from "react";

export default function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.question} className={`faq-item${openIndex === i ? " open" : ""}`}>
          <div className="faq-q" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
            <h4>{item.question}</h4>
            <span className="plus">+</span>
          </div>
          <div className="faq-a">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
