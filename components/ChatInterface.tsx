"use client";

import React, { useState, useEffect, useRef } from "react";
import LineGraph from "./charts/LineGraph";
import { Barplot } from "./charts/BarPlot";
import { ScatterPlot } from "./charts/ScatterPlot";
import { DonutChart } from "./charts/DonutChart";
import { Radar } from "./charts/Radar";
import { Heatmap } from "./charts/Heatmap";
import { BubblePlot } from "./charts/BubblePlot";
import Table from "./charts/Table";
import Image from "next/image";

type BouncingDotsLoaderProps = {
  theme: "light" | "dark";
};

const BouncingDotsLoader: React.FC<BouncingDotsLoaderProps> = ({ theme }) => {
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const dotStyle = {
    width: "8px",
    height: "8px",
    margin: "0 4px",
    borderRadius: "50%",
    backgroundColor: theme === "dark" ? "#fff" : "#000",
    animation: "bouncing 0.6s infinite alternate",
  };

  return (
    <div style={loaderStyle}>
      <div style={dotStyle} />
      <div style={dotStyle} />
      <div style={dotStyle} />
      <style jsx>{`
        @keyframes bouncing {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

type ChartData<T> = {
  type:
    | "string"
    | "table"
    | "bar"
    | "line"
    | "scatter"
    | "donut"
    | "radar"
    | "heatmap"
    | "bubble";
  data: T;
};

type BackendResponse = {
  charts: ChartData<any>[];
};

type Message = {
  isUser: boolean;
  content: string | ChartData<any>[];
};

type PromptCard = {
  title: string;
  description: string;
  prompt: string;
};

const ChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptCards: PromptCard[] = [
    {
      title: "Latest Block Info",
      description: "Show me the latest Ethereum block information",
      prompt: "Show me the latest Ethereum block information",
    },
    {
      title: "Block Transactions",
      description: "List the transactions in the most recent Ethereum block",
      prompt: "List the transactions in the most recent Ethereum block",
    },
    {
      title: "Gas Price Trend",
      description:
        "Show me the gas price trend over the last 10 Ethereum blocks",
      prompt: "Show me the gas price trend over the last 10 Ethereum blocks",
    },
    {
      title: "Block Time Analysis",
      description:
        "Analyze the average block time for the last 100 Ethereum blocks",
      prompt: "Analyze the average block time for the last 100 Ethereum blocks",
    },
  ];

  useEffect(() => {
    const storedHistory = sessionStorage.getItem("storedHistory");
    if (storedHistory) {
      setMessages(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "";
  }, [theme]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    if (messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;
      setShowScrollToBottom(scrollTop + clientHeight < scrollHeight - 20);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit(e);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    sessionStorage.removeItem("storedHistory");
  };

  const handlePromptSubmit = async (
    e: React.FormEvent,
    customPrompt?: string
  ) => {
    e.preventDefault();

    const promptToUse = customPrompt || prompt;
    if (!promptToUse.trim()) return;

    const userMessage: Message = { isUser: true, content: promptToUse };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch("/api/getChartData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToUse }),
      });
      const data: BackendResponse = await response.json();

      const botMessage: Message = {
        isUser: false,
        content: data.charts ?? data,
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, botMessage];
        sessionStorage.setItem(
          "storedHistory",
          JSON.stringify(updatedMessages)
        );
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }

    setPrompt("");
  };

  const handlePromptCardClick = (cardPrompt: string) => {
    handlePromptSubmit(
      { preventDefault: () => {} } as React.FormEvent,
      cardPrompt
    );
  };

  const renderChart = (chart: ChartData<any>, index: number) => {
    switch (chart.type) {
      case "bar":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <Barplot data={chart.data} />
          </div>
        );
      case "line":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <LineGraph data={chart.data} />
          </div>
        );
      case "scatter":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <ScatterPlot data={chart.data} />
          </div>
        );
      case "donut":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <DonutChart data={chart.data} />
          </div>
        );
      case "radar":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <Radar
              data={chart.data}
              axisConfig={[
                { name: "speed", max: 10 },
                { name: "acceleration", max: 10 },
                { name: "conso", max: 10 },
                { name: "safety", max: 2 },
                { name: "style", max: 1000 },
                { name: "price", max: 100 },
              ]}
            />
          </div>
        );
      case "heatmap":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <Heatmap data={chart.data} />
          </div>
        );
      case "bubble":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <BubblePlot data={chart.data} />
          </div>
        );
      case "table":
        return (
          <div key={index} className="max-w-[550px] p-3.5">
            <Table data={chart.data} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex h-screen w-full flex-col p-7 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-[#f0f4fa] text-[#2f3c56]"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <h1
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-[#2f3c56]"
          }`}
        >
          DefiDash
        </h1>
        <div className="flex items-center space-x-4">
          <div className="px-2 py-4">
            <label className="relative flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="sr-only"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />
              <div
                className={`h-6 w-11 rounded-full bg-gray-300 transition duration-300 ease-in-out ${
                  theme === "dark" ? "bg-[#f8b1c3]" : ""
                }`}
              >
                <div
                  className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                    theme === "dark" ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
              <span
                className={`ml-3 text-sm font-bold ${
                  theme === "dark" ? "text-gray-200" : "text-black"
                }`}
              >
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </label>
          </div>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-4 sm:text-base ${
              theme === "dark"
                ? "bg-[#f096af] text-white focus:ring-[#f096af]"
                : "bg-[#f8b1c3] text-[#2f3c56] focus:ring-[#f096af]"
            }`}
            onClick={handleNewConversation}
          >
            +&nbsp;&nbsp;New
          </button>
        </div>
      </div>

      <div
        className={`flex-1 space-y-6 overflow-y-auto rounded-xl p-4 text-sm leading-6 shadow-sm sm:text-base sm:leading-7 ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-[#e6dede] text-[#2f3c56]"
        }`}
        onScroll={handleScroll}
      >
        {messages.length > 0 ? (
          messages.map(
            (message, index) =>
              message.content?.length > 0 && (
                <div
                  key={index}
                  className={`flex ${
                    message.isUser
                      ? "flex-row-reverse items-start"
                      : "items-start"
                  }`}
                >
                  {!message.isUser && (
                    <Image
                      className="mr-2 rounded-full"
                      src="/images/defi.png"
                      alt="Defi Bot"
                      width="32"
                      height="32"
                    />
                  )}
                  <div
                    className={`flex rounded-b-xl p-4 sm:max-w-md md:max-w-2xl lg:max-w-6xl ${
                      message.isUser ? "rounded-tl-xl" : "rounded-tr-xl"
                    } ${theme === "dark" ? "bg-gray-700" : "bg-[#f0f4fa]"}`}
                  >
                    {typeof message.content === "string" ? (
                      <p
                        className={
                          theme === "dark" ? "text-gray-300" : "text-[#3a3a3a]"
                        }
                      >
                        {message.content}
                      </p>
                    ) : (
                      <div className="flex flex-wrap -mx-2 justify-center">
                        {message.content.map((chart, chartIndex) =>
                          renderChart(chart, chartIndex)
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
          )
        ) : (
          <div>
            <h2
              className={`text-2xl font-bold text-center mb-2 ${
                theme === "dark" ? "text-white" : "text-[#2f3c56]"
              }`}
            >
              Welcome to DefiDash!
            </h2>
            <p
              className={`text-center mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-[#2f3c56]"
              }`}
            >
              Your go-to AI chatbot for all things cryptocurrency.
            </p>
            <p
              className={`text-center mb-10 ${
                theme === "dark" ? "text-gray-400" : "text-[#3a3a3a]"
              }`}
            >
              To get started, try one of these popular prompts:
            </p>

            <ul
              role="list"
              className="grid grid-cols-1 gap-6 text-[#2f3c56] sm:grid-cols-2 lg:grid-cols-2"
            >
              {promptCards.map((card, index) => (
                <li
                  key={index}
                  className={`col-span-1 rounded-lg shadow cursor-pointer transition-colors duration-200 ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-[#e9edef] hover:bg-[#d3cfcf]"
                  }`}
                  onClick={() => handlePromptCardClick(card.prompt)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <h3
                        className={`truncate text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-[#2f3c56]"
                        }`}
                      >
                        {card.title}
                      </h3>
                    </div>
                    <p
                      className={`mt-1 truncate text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-[#3a3a3a]"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <BouncingDotsLoader theme={theme} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="mt-2" onSubmit={handlePromptSubmit}>
        <label htmlFor="chat-input" className="sr-only">
          Enter your prompt
        </label>
        <div className="relative">
          <textarea
            id="chat-input"
            className={`block w-full resize-none rounded-xl border-none p-4 pl-10 pr-20 text-sm focus:outline-none focus:ring-2 sm:text-base ${
              theme === "dark"
                ? "bg-gray-700 text-gray-300 focus:ring-[#f096af]"
                : "bg-[#e6dede] text-[#3a3a3a] focus:ring-[#f096af]"
            }`}
            placeholder="Enter your prompt"
            rows={1}
            required
            value={prompt}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className={`absolute bottom-2 right-2.5 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-4 sm:text-base ${
              theme === "dark"
                ? "bg-[#f096af] text-white focus:ring-[#f096af]"
                : "bg-[#f8b1c3] text-[#2f3c56] focus:ring-[#f096af]"
            }`}
          >
            Send <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
