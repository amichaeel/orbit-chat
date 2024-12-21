"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Message from "./message";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/actions/message.action";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"

const formSchema = z.object({
  message: z.string()
})

const ChatContainer = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    }
  })

  const sendMessageHandler = async (values: z.infer<typeof formSchema>) => {
    await sendMessage(values.message);
    form.reset();
  }

  const uniqueMessages = messages.filter((value, index, self) => self.indexOf(value) === index);

  useEffect(() => {
    pusherClient.subscribe("global");

    pusherClient.bind("upcoming-message", (data: { message: string }) => {
      console.log(data.message)
      setMessages((prev) => [...prev, data.message]);
    });

    return () => pusherClient.unsubscribe("global");
  }, []);

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
        <div className="p-4 ">
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