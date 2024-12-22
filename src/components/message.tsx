interface MessageProps {
  message: string;
  timestamp: Date;
  username: string;
}

const Message = ({ message, timestamp, username }: MessageProps) => {
  return (
    <div className="flex flex-col md:hover:bg-black/10 md:dark:hover:bg-white/5 py-4 px-4">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium">{username}</span>
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
      <p className="text-sm break-words">{message}</p>
    </div>
  );
};

export default Message;