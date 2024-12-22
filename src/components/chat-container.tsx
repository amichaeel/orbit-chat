"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Message from "./message";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessage } from "@/actions/message.action";
import { sendTypingIndicator } from "@/actions/typing.action";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"

const formSchema = z.object({
  message: z.string()
})

const TYPING_TIMEOUT = 5000;

const ChatContainer = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  const [clientId] = useState(() => Math.random().toString(36).substr(2, 9));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    }
  })

  const sendMessageHandler = async (values: z.infer<typeof formSchema>) => {
    if (!values.message.trim()) return;

    try {
      await sendMessage(values.message);
      await sendTypingIndicator(false, clientId);
      setIsCurrentlyTyping(false);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  const handleTyping = async () => {
    if (isCurrentlyTyping) {
      return;
    }

    setIsCurrentlyTyping(true);
    await sendTypingIndicator(true, clientId);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(async () => {
      await sendTypingIndicator(false, clientId);
      setIsCurrentlyTyping(false);
    }, TYPING_TIMEOUT);

    setTypingTimeout(timeout);
  };

  const uniqueMessages = messages.filter((value, index, self) => self.indexOf(value) === index);

  useEffect(() => {
    pusherClient.subscribe("global");

    pusherClient.bind("upcoming-message", (data: { message: string }) => {
      console.log(data.message)
      setMessages((prev) => [...prev, data.message]);
    });

    pusherClient.bind('typing-indicator', (data: { isTyping: boolean, clientId: string }) => {
      if (data.clientId !== clientId) {
        setIsTyping(data.isTyping);
        if (data.isTyping) {
          const timeout = setTimeout(() => {
            setIsTyping(false);
          }, TYPING_TIMEOUT);

          return () => clearTimeout(timeout);
        }
      }
    });

    return () => {
      pusherClient.unsubscribe("global");
      pusherClient.unbind("upcoming-message");
      pusherClient.unbind("typing-indicator");
    };
  }, [clientId]);

  return (
    <div className="fixed inset-0">
      <div className="w-full h-full border rounded-md flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-y-4">
          {!uniqueMessages.length ? (
            <div className="text-center text-gray-500">No messages yet</div>
          ) : (
            uniqueMessages.map((message, index) => (
              <Message key={index} message={message} />
            ))
          )}
        </div>
        <div className="p-1">
          {isTyping && (
            <div className="text-sm text-gray-500 animate-pulse">
              Someone is typing...
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(sendMessageHandler)} className="flex gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Say something..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTyping();
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer