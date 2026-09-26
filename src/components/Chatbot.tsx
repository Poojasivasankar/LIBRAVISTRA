import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store';
import { getBookAvailability, shelves } from '@/data';
import { Sparkles, X, Send, MessageCircle } from 'lucide-react';
import type { ChatMessage } from '@/types';

const suggestions = [
  'Where is the Python section?',
  'Recommend books for machine learning',
  'Is Clean Code available?',
  'What books are in Computer Science?',
  'How do I borrow a book?',
  'Show books near Shelf CS-04',
];

export function Chatbot() {
  const { books, navigate } = useStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      text: "Hi! I'm LaraAI. What would you like to find?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Location queries
    if (q.includes('where') && (q.includes('python') || q.includes('section'))) {
      const genreMatch = q.includes('python') ? 'Computer Science' : '';
      const shelf = shelves.find((s) => s.department.toLowerCase().includes(genreMatch.toLowerCase()) || s.genre.toLowerCase().includes(genreMatch.toLowerCase()));
      if (shelf) {
        return `You can find the ${genreMatch || 'Python'} section at:\n\nFloor ${shelf.floor} → ${shelf.section} → Shelf ${shelf.id}\n\nIt has ${shelf.bookCount} books with ${shelf.availableCount} currently available. Would you like to see the books on this shelf?`;
      }
    }

    // Recommendation queries
    if (q.includes('recommend') || q.includes('suggest')) {
      if (q.includes('machine learning') || q.includes('ml') || q.includes('ai') || q.includes('artificial')) {
        const mlBooks = books.filter((b) => b.title.toLowerCase().includes('machine learning') || b.title.toLowerCase().includes('deep learning') || b.title.toLowerCase().includes('artificial intelligence'));
        return `Based on your interest in machine learning, I recommend:\n\n${mlBooks.slice(0, 3).map((b, i) => `${i + 1}. "${b.title}" by ${b.author} — ${getBookAvailability(b) === 'available' ? 'Available' : 'Currently borrowed'}\n   ${b.shelfId}, Floor ${b.floor}`).join('\n\n')}\n\nYou may like these because they cover foundational and advanced ML concepts.`;
      }
      if (q.includes('python') || q.includes('data science')) {
        const pyBooks = books.filter((b) => b.title.toLowerCase().includes('python') || b.title.toLowerCase().includes('data science'));
        return `Here are my Python & Data Science recommendations:\n\n${pyBooks.slice(0, 3).map((b, i) => `${i + 1}. "${b.title}" by ${b.author} — ${getBookAvailability(b) === 'available' ? 'Available' : 'Currently borrowed'}\n   ${b.shelfId}, Floor ${b.floor}`).join('\n\n')}\n\nThese are popular picks for students exploring Python and data science.`;
      }
      return `I can recommend books based on your interests! Try asking:\n- "Recommend books for machine learning"\n- "Suggest Python books"\n- "What should I read for data science?"`;
    }

    // Availability queries
    if (q.includes('available') || q.includes('is ') ) {
      const bookMatch = books.find((b) => q.includes(b.title.toLowerCase().split(' ').slice(0, 2).join(' ')));
      if (bookMatch) {
        const av = getBookAvailability(bookMatch);
        return `"${bookMatch.title}" by ${bookMatch.author} is currently ${av === 'available' ? 'available' : av === 'few' ? 'available (few copies left)' : 'currently borrowed'}.\n\nLocation: ${bookMatch.shelfId}, Floor ${bookMatch.floor}\n${bookMatch.availableCopies} of ${bookMatch.totalCopies} copies available.`;
      }
    }

    // Department queries
    if (q.includes('computer science') || q.includes('cs ')) {
      const csBooks = books.filter((b) => b.department === 'Computer Science');
      return `Computer Science has ${csBooks.length} books across 3 shelves. Here are some highlights:\n\n${csBooks.slice(0, 4).map((b) => `• "${b.title}" — ${getBookAvailability(b) === 'available' ? 'Available' : 'Borrowed'} (${b.shelfId})`).join('\n')}\n\nVisit the Explore Books page and filter by Computer Science to see all.`;
    }

    // Shelf queries
    const shelfMatch = q.match(/shelf\s+([a-z]{2,3}-\d{2})/i);
    if (shelfMatch) {
      const shelf = shelves.find((s) => s.id.toLowerCase() === shelfMatch[1].toLowerCase());
      if (shelf) {
        const shelfBooks = books.filter((b) => b.shelfId === shelf.id);
        return `Shelf ${shelf.id} (${shelf.name}) has ${shelf.bookCount} books:\n\n${shelfBooks.slice(0, 4).map((b) => `• "${b.title}" by ${b.author} — ${getBookAvailability(b) === 'available' ? 'Available' : 'Borrowed'}`).join('\n')}\n\nLocation: Floor ${shelf.floor}, ${shelf.section}`;
      }
    }

    // How to borrow
    if (q.includes('borrow') || q.includes('how')) {
      return `To borrow a book:\n\n1. Search for the book in Explore Books\n2. Check if it's available (green badge)\n3. Click "Borrow" on the book card or detail page\n4. Confirm in the borrow modal\n5. Find the book on the library map using "Find on Map"\n6. Visit the shelf and pick it up\n\nBooks are due in 14 days. You can borrow up to 5 books at a time.`;
    }

    // Default
    return `I can help you find books, check availability, locate shelves, and get recommendations. Try asking:\n\n- "Where is the Python section?"\n- "Recommend books for machine learning"\n- "Is Clean Code available?"\n- "Show books near Shelf CS-04"`;
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      role: 'user',
      text: msg,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg);
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: 'assistant',
        text: response,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-2xl shadow-emerald-500/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group"
        aria-label="Ask LaraAI"
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-300 animate-ping-slow" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[500px] max-h-[70vh] glass-card rounded-3xl flex flex-col overflow-hidden shadow-2xl border-2 border-emerald-500/20 animate-scale-in">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-700/40 to-forest-700/40 border-b border-emerald-500/20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm">LaraAI</h3>
              <p className="text-xs text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-emerald-500/30 text-emerald-50 rounded-br-md'
                      : 'glass-light text-gray-100 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shrink-0 mr-2">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="glass-light px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-2.5 py-1.5 rounded-full glass-light text-xs text-emerald-200 hover:bg-emerald-500/20 transition-all border border-emerald-500/15"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-emerald-500/15">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light border border-emerald-500/15 focus-within:border-emerald-400/40 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none flex-1"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 disabled:opacity-30 text-emerald-100 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
