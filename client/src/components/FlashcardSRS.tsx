import React, { useState, useEffect } from 'react';
import { Layers, Plus, CheckCircle, RefreshCw, Eye } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  interval: number;
  easeFactor: number;
  reps: number;
  nextReview: string;
}

interface FlashcardSRSProps {
  soundOn?: boolean;
}

export const FlashcardSRS: React.FC<FlashcardSRSProps> = ({ soundOn = true }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);

  const playSoundEffect = (type: 'flip' | 'click') => {
    if (!soundOn) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch (e) {
      console.warn("AudioContext playback failed", e);
    }
  };
  const [dueOnly, setDueOnly] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New Flashcard Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/study/flashcards?due=${dueOnly}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to retrieve flashcards.');
      const data = await res.json();
      setCards(data.flashcards || []);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      setError(err.message || 'Error fetching cards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [dueOnly]);

  const handleGrade = async (score: number) => {
    if (cards.length === 0) return;
    const currentCard = cards[currentIndex];

    try {
      const res = await fetch('/api/study/flashcards/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ flashcardId: currentCard.id, score }),
      });

      if (!res.ok) throw new Error('Failed to record card score.');

      // Remove from list or move to next
      setIsFlipped(false);
      
      // Delay transition for flip animation
      setTimeout(() => {
        if (dueOnly) {
          // If due-only, remove card from active queue
          setCards(prev => prev.filter(c => c.id !== currentCard.id));
        } else {
          // Go to next card in list
          setCurrentIndex(prev => (prev + 1) % cards.length);
        }
      }, 200);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    try {
      const res = await fetch('/api/study/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ front, back }),
      });

      if (!res.ok) throw new Error('Failed to create flashcard.');

      setFront('');
      setBack('');
      setShowAddForm(false);
      fetchCards();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold text-foreground">Smart Study Cards</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted">
            <input
              type="checkbox"
              checked={dueOnly}
              onChange={(e) => setDueOnly(e.target.checked)}
              className="rounded bg-input border-border text-primary focus:ring-primary h-4 w-4"
            />
            Show Due Only
          </label>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Card
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateCard} className="glass-panel p-5 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Create New Study Card</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted mb-1">Front (Question / Prompt)</label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="e.g. What is the Big-O time complexity of Binary Search?"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Back (Answer / Explanation)</label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="e.g. O(log n) because the search space is cut in half at each step."
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                rows={2}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 text-xs pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg font-semibold"
            >
              Save Card
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <RefreshCw className="h-8 w-8 text-accent animate-spin" />
          <span className="text-sm text-muted">Loading active recall queue...</span>
        </div>
      ) : error ? (
        <div className="bg-red-950/20 border border-red-900/40 text-red-300 p-4 rounded-xl text-center text-sm">
          {error}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16 bg-secondary border border-border rounded-2xl p-6">
          <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-foreground text-lg">Active Recall Completed</h3>
          <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
            {dueOnly 
              ? "Awesome! No flashcards are due for review right now. Switch 'Show Due Only' off to browse your collection."
              : "No study cards found. Create your first card above to get started with Smart Study Cards!"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-muted px-1">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="bg-input px-2.5 py-0.5 rounded-full border border-border text-muted">
              Reps: {currentCard.reps} · Interval: {currentCard.interval}d
            </span>
          </div>

          {/* 3D Flippable Card Container */}
          <div 
            onClick={() => {
              setIsFlipped(!isFlipped);
              playSoundEffect('flip');
            }}
            className="w-full h-80 cursor-pointer perspective-1000 group"
          >
            <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              
              {/* Front Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-secondary border border-border rounded-2xl flex flex-col justify-between p-8 hover:border-zinc-700 transition-all shadow-xl">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Prompt / Question</span>
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed whitespace-pre-wrap">{currentCard.front}</p>
                </div>
                <div className="flex justify-center items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Click card to reveal answer</span>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-secondary border border-border rounded-2xl flex flex-col justify-between p-8 hover:border-zinc-700 shadow-xl transition-all">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Solution / Details</span>
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed whitespace-pre-wrap">{currentCard.back}</p>
                </div>
                <span className="text-xs text-muted-foreground text-center">Rate your recall performance below</span>
              </div>

            </div>
          </div>

          {/* Spaced Repetition Quality Selectors (Visible when card is revealed) */}
          {isFlipped && (
            <div className="bg-secondary border border-border p-4 rounded-2xl space-y-3 shadow-lg">
              <p className="text-center text-xs text-muted font-semibold">How accurately did you recall the solution?</p>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { score: 0, label: 'Forgot', color: 'hover:bg-zinc-800/40 hover:text-red-400' },
                  { score: 1, label: 'Bad', color: 'hover:bg-zinc-800/40 hover:text-orange-400' },
                  { score: 2, label: 'Hard', color: 'hover:bg-zinc-800/40 hover:text-yellow-400' },
                  { score: 3, label: 'Good', color: 'hover:bg-zinc-800/40 hover:text-emerald-400' },
                  { score: 4, label: 'Easy', color: 'hover:bg-zinc-800/40 hover:text-sky-400' },
                  { score: 5, label: 'Perfect', color: 'hover:bg-zinc-800/40 hover:text-indigo-400' },
                ].map((option) => (
                  <button
                    key={option.score}
                    onClick={() => {
                      handleGrade(option.score);
                      playSoundEffect('click');
                    }}
                    className={`flex flex-col items-center justify-center py-2 px-1 bg-input border border-border rounded-xl transition text-foreground font-semibold ${option.color} hover:border-zinc-700`}
                  >
                    <span className="text-sm">{option.score}</span>
                    <span className="text-[10px] mt-0.5 text-muted font-normal">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
