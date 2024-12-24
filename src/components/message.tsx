import React, { useState } from 'react';
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from './ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface MessageProps {
  message: string;
  timestamp: Date;
  username: string;
}

const Message = ({ message, timestamp, username }: MessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHARACTER_LIMIT = 1000;
  const shouldCollapse = message.length > CHARACTER_LIMIT;

  const displayMessage = shouldCollapse && !isExpanded
    ? message.slice(0, CHARACTER_LIMIT) + '...'
    : message;

  return (
    <div className="flex w-full md:hover:bg-muted-foreground/5 py-4 px-4">
      <div className="flex-shrink-0 pt-2 pr-4">
        <Avatar className='h-8 w-8'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <Link href={`/user/${username}`}>
            <span className="text-sm font-medium">{username}</span>
          </Link>
          <span className="text-xs text-muted-foreground">
            {(() => {
              const now = new Date();
              const isToday =
                timestamp.getFullYear() === now.getFullYear() &&
                timestamp.getMonth() === now.getMonth() &&
                timestamp.getDate() === now.getDate();

              if (isToday) {
                return `Today, ${timestamp.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}`;
              }

              return timestamp.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
            })()}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm break-words">{displayMessage}</p>
          {shouldCollapse && (
            <Button
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center p-0 gap-1 text-xs w-fit"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;