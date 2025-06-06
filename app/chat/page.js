"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Menu, Phone, Video, MoreVertical } from "lucide-react";

export default function ChatUI() {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io(`http://localhost:3000?token=${token}`);
    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("Connected with id:", socket.id);
    });

    socket.on("message", (aiReply) => {
      console.log("🤖 AI says:", aiReply);
      const newMessage = {
        id: Date.now().toString(),
        content: aiReply,
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        content: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 🔥 Send message to server
      if (socketRef.current) {
        socketRef.current.emit("message", message);
      }

      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[900px] h-[100vh] sm:h-[90vh] md:h-[85vh] flex flex-col">
        <Card className="flex-1 flex flex-col shadow-lg">
          {/* Header */}
          <CardHeader className="flex-row items-center justify-between space-y-0 p-3 sm:p-4 border-b bg-white">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                {/* <AvatarImage src="/placeholder.svg?height=40&width=40" /> */}
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-semibold text-sm sm:text-base">Eazy</h3>
                <p className="text-xs sm:text-sm text-green-600">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2"></div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end space-x-2 max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {msg.sender === "other" && (
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                      {/* <AvatarImage src="/placeholder.svg?height=32&width=32" /> */}
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-gray-200 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm sm:text-base leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                    <span
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Input */}
          <CardFooter className="p-3 sm:p-4 border-t bg-white">
            <form
              onSubmit={handleSendMessage}
              className="flex w-full space-x-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full px-4 py-2 sm:py-3 text-sm sm:text-base"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
