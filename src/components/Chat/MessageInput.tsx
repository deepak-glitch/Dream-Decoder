// src/components/Chat/MessageInput.tsx
import { useState } from 'react';

export function MessageInput({ onSend }: { onSend: (msg: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex border-t border-gray-700 bg-dark-700 p-4">
      <input
        className="flex-1 px-4 py-2 bg-dark-800 text-white rounded-l-lg border border-gray-600 focus:outline-none"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Describe your dream…"
        onKeyDown={e => e.key === 'Enter' && value.trim() && (onSend(value), setValue(''))}
      />
      <button
        className="px-6 py-2 bg-primary-500 hover:bg-primary-600 rounded-r-lg text-white font-semibold transition"
        onClick={() => value.trim() && (onSend(value), setValue(''))}
      >
        Send
      </button>
    </div>
  );
}
