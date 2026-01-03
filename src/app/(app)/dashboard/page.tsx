"use client";

import { Message } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User } from "next-auth";
import axios, { AxiosError } from "axios";
import MessageCard from "@/components/MessageCard";

export default function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  // TODO: implement the AI feature suggest messages
  const handleDeleteMessage = (messageId: string) => {
    // If the result is True (The IDs do NOT match), the message stays in the new list.
    // If the result is False (The IDs match), the message is "filtered out" and discarded.
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages || false);
      toast.success("Accept messages status fetched successfully.");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error fetching accept messages status:", axiosError);
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch accept messages status."
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.message || []);
        if (refresh) {
          toast.success("Messages refreshed successfully.");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages."
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages, // for backend toggle
      });
      setValue("acceptMessages", !acceptMessages); // for frontend toggle
      toast.success(
        response.data.message || "Accept messages status updated successfully."
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update messages."
      );
    }
  };

  useEffect(() => {
    const username = session?.user?.username as User;
    const baseUrl = window.location.origin;
    setProfileUrl(`${baseUrl}/u/${username}`);
  }, [session]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard!");
  };

  if (!session || !session.user) {
    return (
      <div className="p-4 text-center">
        Please log in to access the dashboard.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl p-6 mx-4 my-8 rounded md:mx-8 lg:mx-auto">
      <h1 className="mb-4 text-4xl font-bold">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full p-2 mr-2 input input-bordered"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <div>
        <h2 className="mt-6 mb-2 text-2xl font-semibold">Your Messages</h2>
      </div>

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCcw className="w-4 h-4" />
        )}
      </Button>
      <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
