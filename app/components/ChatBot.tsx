// ChatBot.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { predefinedQuestions } from "@/app/data/chatbots"; // Import predefined questions

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", isUser: false },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const questionContainerRef = useRef<HTMLDivElement>(null);

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const handleQuestionClick = async (question: string) => {
    // Add user's question to messages
    setMessages((prev) => [...prev, { text: question, isUser: true }]);

    // Simulate bot response (replace this with DeepSeek V3 API call in the future)
    const botResponse = await simulateBotResponse(question);

    // Add bot's response to messages
    setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
  };

  const simulateBotResponse = async (question: string): Promise<string> => {
    // Simulate a delay for API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find the matching question in the predefinedQuestions array
    const matchedQuestion = predefinedQuestions.find(
      (item) => item.question === question
    );

    // Return the answer if found; otherwise, return a default response
    return matchedQuestion
      ? matchedQuestion.answer
      : "I'm sorry, I don't have information about that specific question. Is there anything else I can help you with?";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (questionContainerRef.current?.offsetLeft || 0));
    setScrollLeft(questionContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (questionContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1;
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="bg-[#131821]/50 backdrop-blur-lg p-4 rounded-lg shadow-lg mb-2 w-80 h-96 flex flex-col border-[2px] border-[#273344]/50 z-40" // Add z-40
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <ScrollArea className="flex-grow mb-4 h-[calc(100%-5em)]">
              <div className="pr-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      message.isUser ? "text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
                        message.isUser
                          ? "bg-[#1c2736] text-slate-200"
                          : "bg-[#273344] text-slate-200"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div
              ref={questionContainerRef}
              className="w-full h-[5em] overflow-x-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
            >
              <div className="flex space-x-2" style={{ width: "max-content" }}>
                {predefinedQuestions.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuestionClick(item.question)} // Pass the `question` string
                    variant="outline"
                    className="whitespace-nowrap bg-[#131821]/50 backdrop-blur-lg border-[1px] border-[#273344]/50 text-slate-200"
                  >
                    {item.question} {/* Display the question */}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`rounded-full p-2 bg-[#131821]/50 backdrop-blur-lg border-[2px] border-[#273344]/50 text-slate-200 ${
          isChatOpen ? "bg-[#1c2736]" : ""
        }`}
        variant={isChatOpen ? "default" : "outline"}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Bot Chat</span>
      </Button>
    </>
  );
}
