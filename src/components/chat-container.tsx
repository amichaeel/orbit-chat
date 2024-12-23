/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Message from "./message";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMessage } from "@/actions/message.action";
import { sendTypingIndicator } from "@/actions/typing.action";
import { getChannelMessages } from "@/actions/channel.action";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { useAuth } from "@/hooks/use-auth";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  channelId: string;
  userId: string;
  updatedAt: Date;
  user: {
    username: string;
  }
}

interface ChatContainerProps {
  channel: string;
}

const formSchema = z.object({
  message: z.string().min(1)
})

const TYPING_TIMEOUT = 5000;

const ChatContainer = ({ channel }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  const [clientId] = useState(() => Math.random().toString(36).substr(2, 9));
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const uniqueMessages = messages.filter((message, index, self) =>
    index === self.findIndex((m) => m.id === message.id)
  );

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [uniqueMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    }
  })

  const sendMessageHandler = async (values: z.infer<typeof formSchema>) => {
    if (!values.message.trim() || !user) return;

    try {
      await sendMessage(values.message, channel, { id: user.id, username: user.username! });
      await sendTypingIndicator(false, clientId, channel, user.username!);
      setIsCurrentlyTyping(false);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  const handleTyping = async () => {
    if (isCurrentlyTyping || !user) return;

    setIsCurrentlyTyping(true);
    await sendTypingIndicator(true, clientId, channel, user.username!);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(async () => {
      await sendTypingIndicator(false, clientId, channel, user.username!);
      setIsCurrentlyTyping(false);
    }, TYPING_TIMEOUT);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const channelMessages = await getChannelMessages(channel);
        setMessages(channelMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [channel]);

  useEffect(() => {
    const channelName = `channel-${channel}`;
    pusherClient.subscribe(channelName);

    pusherClient.bind("upcoming-message", (data: Message) => {
      setMessages((prev) => {
        if (prev.some(msg => msg.id === data.id)) {
          return prev;
        }
        return [...prev, {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        }];
      });
    });

    pusherClient.bind('typing-indicator', (data: {
      isTyping: boolean;
      clientId: string;
      username: string;
    }) => {
      if (data.clientId !== clientId) {
        setIsTyping(data.isTyping);
        setTypingUser(data.isTyping ? data.username : null);
        if (data.isTyping) {
          const timeout = setTimeout(() => {
            setIsTyping(false);
          }, TYPING_TIMEOUT);

          return () => clearTimeout(timeout);
        }
      }
    });

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind("upcoming-message");
      pusherClient.unbind("typing-indicator");
    };
  }, [channel]);


  return (
    <div className="h-full flex flex-col justify-end">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1" />
        <div className="flex flex-col">
          {!uniqueMessages.length ? (
            <div className="text-center text-gray-500">No messages yet</div>
          ) : (
            uniqueMessages.map((message) => (
              <Message
                key={message.id}
                message={message.content}
                timestamp={message.createdAt}
                username={message.user.username}
              />
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="flex flex-col p-4">
        {isTyping && (
          <div className="text-sm items-center pb-2 text-gray-500 animate-pulse">
            {typingUser} is typing...
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(sendMessageHandler)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="Say something..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTyping();
                      }}
                      className="md:text-xs text-base"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" onClick={() => {
              if (!user) {
                return toast({
                  description: "Please login to send a message",
                  action: (
                    <Link href="/login">
                      <ToastAction altText="Login">Login</ToastAction>
                    </Link>
                  ),
                })
              }
            }}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ChatContainer