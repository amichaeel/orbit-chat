interface MessageProps {
  message: string;
  timestamp: Date;
  userId: string;
}

const Message = ({ message, timestamp, userId }: MessageProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{userId}</span>
        <span className="text-xs text-muted-foreground">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Message;