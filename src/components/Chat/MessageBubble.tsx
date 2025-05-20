// src/components/Chat/MessageBubble.tsx
type Props = { from: 'user' | 'oracle'; text: string };

export function MessageBubble({ from, text }: Props) {
  const isUser = from === 'user';
  const bg = isUser ? 'bg-primary-500/40' : 'bg-white/10';
  const align = isUser ? 'self-end' : 'self-start';
  const textColor = isUser ? 'text-white' : 'text-gray-200';

  return (
    <div
      className={`max-w-[70%] px-5 py-3 rounded-2xl backdrop-blur-sm ${bg} ${align} ${textColor}`}
    >
      {text}
    </div>
  );
}
