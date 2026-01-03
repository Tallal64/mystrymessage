"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Message } from "@/model/User";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from "dayjs";
import axios, { AxiosError } from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const DeleteMessageConfirmation = async () => {
    try {
      const response = await axios.delete(`/api/delete-message/${message._id}`);
      toast.success(response.data.message);
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete message."
      );
    }
  };

  return (
    <Card className="relative w-full max-w-md shadow-sm">
      <CardHeader className="pr-14">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 font-medium text-lg">
              {message.message}
            </CardTitle>
            <CardDescription className="text-xs">
              {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
            </CardDescription>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
              >
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Card?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this card? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={DeleteMessageConfirmation}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
}
