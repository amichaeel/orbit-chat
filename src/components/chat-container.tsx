"use client";
import React, { useEffect, useState, useRef } from "react";
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
import { getChannelMessages } from "@/actions/channel.action";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"

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
  uniqueMessages: { id: string; content: string; createdAt: string; user: { username: string } }[];
}

const formSchema = z.object({
  message: z.string().min(1)
})

const TYPING_TIMEOUT = 5000;

const ChatContainer = ({ channel }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);  // Add this state
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const [isCurrentlyTyping, setIsCurrentlyTyping] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [clientId] = useState(() => Math.random().toString(36).substr(2, 9));
  const chatEndRef = useRef<HTMLDivElement | null>(null); // Explicitly type the ref

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
      await sendMessage(values.message, channel, user); // Pass user data
      await sendTypingIndicator(false, clientId, channel, user.username); // Pass username
      setIsCurrentlyTyping(false);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  const handleTyping = async () => {
    if (isCurrentlyTyping || !user) return;

    setIsCurrentlyTyping(true);
    await sendTypingIndicator(true, clientId, channel, user.username);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(async () => {
      await sendTypingIndicator(false, clientId, channel, user.username);
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
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

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
  }, [channel, clientId]);


  return (
    <div className="h-full flex flex-col justify-end">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="flex-1" />
        <div className="flex flex-col gap-y-4">
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
          {/* Dummy div to ensure scrolling works */}
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
  )
}

export default ChatContainer