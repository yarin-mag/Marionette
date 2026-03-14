import { Bot, User } from 'lucide-react';

interface MessageAvatarProps {
  isUser: boolean;
}

export function MessageAvatar({ isUser }: MessageAvatarProps) {
  if (isUser) {
    return (
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center">
        <User className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
      <Bot className="h-5 w-5 text-primary" />
    </div>
  );
}
