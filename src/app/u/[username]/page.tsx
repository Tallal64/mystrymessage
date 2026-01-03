"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export default function PublicProfilePage() {
  const [message, setMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const params = useParams();
  const username = params.username;

  const suggestedMessages = [
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?",
  ];

  const handleMessageClick = (msg: string) => {
    setSelectedMessage(msg);
    setMessage(msg);
  };

  const handleSendMessage = async () => {
    console.log("[v0] Sending message:", message);
    console.log("message :", message);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        message,
      });
      toast.success(response.data.message || "Message sent successfully.");
      setMessage("");
      setSelectedMessage(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update messages."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-balance mb-4">
            Public Profile Link
          </h1>
        </div>

        {/* Message Form */}
        <div className="space-y-4">
          <p className="text-base">Send Anonymous Message</p>

          <Textarea
            placeholder="Write your anonymous message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          <div className="flex justify-center pt-2">
            <Button onClick={handleSendMessage} className="px-8">
              Send It
            </Button>
          </div>
        </div>

        {/* Message Selection */}
        <div className="space-y-4">
          <p className="text-base">Click on any message below to select it.</p>

          <div className="border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Messages</h2>

            <div className="space-y-3">
              {suggestedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageClick(msg)}
                  className={`w-full text-center border border-border rounded-md py-3 px-4 hover:bg-accent transition-colors ${
                    selectedMessage === msg ? "bg-accent" : "bg-background"
                  }`}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-base">Get Your Message Board</p>
          <Button className="px-8">Create Your Account</Button>
        </div>
      </div>
    </div>
  );
}
