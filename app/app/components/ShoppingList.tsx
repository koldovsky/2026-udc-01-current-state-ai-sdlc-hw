'use client';

import { useState, useEffect } from 'react';

interface Item {
  id: string;
  text: string;
}

export default function ShoppingList() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('shopping-items');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('shopping-items', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newItem: Item = {
      id: crypto.randomUUID(),
      text: input.trim(),
    };
    setItems([...items, newItem]);
    setInput('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Shopping List</h2>

      <form onSubmit={addItem} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add item..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2 mb-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-700">{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <button
          onClick={clearAll}
          className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
        >
          Clear All
        </button>
      )}

      {items.length === 0 && (
        <p className="text-center text-gray-400 py-8">No items yet. Add one to get started!</p>
      )}
    </div>
  );
}
