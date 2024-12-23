"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createChannel } from "@/actions/channel.action"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"

const formSchema = z.object({
  name: z.string()
    .min(1, "Channel name is required")
    .max(50)
    .regex(/^[a-z0-9\s-]+$/, "Only lowercase letters, numbers, spaces and hyphens are allowed")
    .transform(val => val.toLowerCase().trim().replace(/\s+/g, '-')),
  description: z.string().optional()
})

export function CreateChannelDialog() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [error, setError] = useState("")
  const { user } = useAuth()
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createChannel(values)
    if (result.success) {
      setOpen(false)
      form.reset()
      router.refresh()
      router.push(`/channel/${values.name}`)
    } else {
      setError(result.error || "Failed to create channel")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {user ? (
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create Channel
          </Button>
        </DialogTrigger>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            toast({
              description: "Please login to create a channel",
              action: (
                <Link href="/login">
                  <ToastAction altText="Login">Login</ToastAction>
                </Link>
              ),
            })
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Channel
        </Button>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Create a new channel for your community to chat in.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="general"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase()
                          .replace(/[^a-z0-9-\s]/g, '')
                          .replace(/\s+/g, '-');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Use lowercase letters, numbers, and hyphens only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this channel about?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the channel&apos;s purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Channel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}