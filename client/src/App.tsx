import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  BookOpen,
  Award,
  FileText,
  Trash2,
  FolderPlus,
  Send,
  MessageSquare,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  LogOut,
  Menu,
  Clock,
  Loader2,
  Upload,
  Plus,
  X,
  History,
  TrendingUp,
  AlertTriangle,
  Check,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  HelpCircle,
  Eye,
  Copy,
  BookMarked,
  Volume2 as SpeakerIcon,
  Sun,
  Moon,
  GraduationCap,
  RefreshCw,
  Info,
  Brain,
  Headphones,
  Languages
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { FlashcardSRS } from './components/FlashcardSRS';
import { MockExamEngine } from './components/MockExamEngine';
import { MermaidRenderer } from './components/MermaidRenderer';
import { useAppStore, store } from './store/AppStore';
import { VFS } from './services/FileSystemService';
import { SandboxedApp } from './components/SandboxedApp';
import { Paperclip } from 'lucide-react';

class SafeErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-red-950/20 border border-red-900/35 text-red-400 p-4 rounded-lg text-xs font-mono my-2 select-text">
          ⚠️ Visual Render Fallback: A component crashed during draw.
        </div>
      );
    }
    return this.props.children;
  }
}

// Interfaces
export interface User {
  userId: string;
  email: string;
  name: string;
  isGuest?: boolean;
  picture?: string | null;
}

interface Binder {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    documents: number;
  };
}

interface Document {
  id: string;
  name: string;
  fileType: string;
  content?: string;
  createdAt?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  thoughts?: string[];
}

interface StudyHistoryItem {
  id: string;
  query: string;
  response: string;
  createdAt: string;
}

interface UploadProgress {
  name: string;
  loaded: number;
  total: number;
  status: 'pending' | 'uploading' | 'extracting' | 'completed' | 'failed';
  error?: string;
}

interface PodcastTurn {
  speaker: 'Alex' | 'Taylor';
  text: string;
}

const StudySphereLogo = ({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) => {
  const dim = size === 'small' ? 'h-8 w-8' : size === 'medium' ? 'h-12 w-12' : 'h-24 w-24';
  return (
    <div className={`relative ${dim} flex items-center justify-center select-none`}>
      <svg className="w-full h-full text-foreground/90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="25" width="50" height="50" rx="12" stroke="currentColor" strokeWidth="6" className="opacity-90" />
        <path d="M40 37 L60 37 M40 50 L60 50 M40 63 L52 63" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const ModelThoughtsAccordion = ({ thoughts, isStreaming }: { thoughts?: string[]; isStreaming: boolean }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="mb-3 border border-indigo-500/20 bg-indigo-500/5 rounded-xl overflow-hidden text-xs transition-all duration-300">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-[9px] font-bold text-[#6366f1] tracking-wider uppercase bg-indigo-500/10 hover:bg-indigo-500/15 transition select-none animate-fade-in-up"
      >
        <span className="flex items-center gap-1.5">
          <Brain className="h-3 w-3 text-[#6366f1] animate-pulse" />
          <span>Thinking Process</span>
        </span>
        <ChevronRight className={`h-3 w-3 transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="p-2.5 space-y-1 border-t border-indigo-500/10 font-mono text-[9.5px] text-muted leading-relaxed animate-fade-in-up">
          {thoughts.map((thought, idx) => (
            <div key={idx} className="flex items-start gap-1">
              <span className="text-[#6366f1]">•</span>
              <span>{thought}</span>
            </div>
          ))}
          {isStreaming && (
            <div className="flex items-center gap-1 mt-1 text-[8.5px] text-[#6366f1]/80">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-ping"></span>
              <span>Processing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// Browser-Based Lofi Study Lounger Synthesizer
// ==========================================
let lofiAudioCtx: AudioContext | null = null;
let lofiFilterNode: BiquadFilterNode | null = null;
let lofiIntervalId: any = null;
let lofiNotes: any[] = [];
let noiseSource: AudioBufferSourceNode | null = null;

const startLofiMusic = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    lofiAudioCtx = new AudioContextClass();
    if (lofiAudioCtx.state === 'suspended') {
      lofiAudioCtx.resume().catch(e => console.warn('Failed to resume lofi AudioContext:', e));
    }
    
    // Lowpass filter for warm, cozy, low-fidelity lounge vibes
    lofiFilterNode = lofiAudioCtx.createBiquadFilter();
    lofiFilterNode.type = 'lowpass';
    lofiFilterNode.frequency.setValueAtTime(320, lofiAudioCtx.currentTime); 
    lofiFilterNode.connect(lofiAudioCtx.destination);
    
    // 1. Vinyl Record Crackle Sound Generator (White noise processed through bandpass and gain)
    const bufferSize = lofiAudioCtx.sampleRate * 2;
    const noiseBuffer = lofiAudioCtx.createBuffer(1, bufferSize, lofiAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noiseSource = lofiAudioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    const noiseFilter = lofiAudioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1200;
    noiseFilter.Q.value = 0.6;
    
    const noiseGain = lofiAudioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.004, lofiAudioCtx.currentTime); // very quiet background crackle
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(lofiAudioCtx.destination);
    noiseSource.start();
    
    // 2. Warm ambient pad chord progression (Dm7 -> G7 -> Cmaj7 -> Am7)
    const chords = [
      [146.83, 174.61, 220.00, 261.63], // D3, F3, A3, C4 (Dm7)
      [98.00, 246.94, 293.66, 349.23],  // G2, B3, D4, F4 (G7)
      [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3 (Cmaj7)
      [110.00, 130.81, 164.81, 196.00]  // A2, C3, E3, G3 (Am7)
    ];
    
    let currentChordIdx = 0;
    
    const playNextChord = () => {
      if (!lofiAudioCtx || lofiAudioCtx.state === 'closed') return;
      const freqs = chords[currentChordIdx];
      const now = lofiAudioCtx.currentTime;
      
      // Stop previous active notes
      lofiNotes.forEach(node => {
        try {
          node.stop(now);
        } catch(e){}
      });
      lofiNotes = [];
      
      freqs.forEach(freq => {
        const osc = lofiAudioCtx!.createOscillator();
        const gain = lofiAudioCtx!.createGain();
        
        osc.type = 'triangle'; // warm, smooth waveform
        osc.frequency.setValueAtTime(freq, now);
        
        // Soft envelope: slow attack, constant sustain, smooth release
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.015, now + 1.8); 
        gain.gain.setValueAtTime(0.015, now + 5.0);
        gain.gain.linearRampToValueAtTime(0, now + 6.8); 
        
        osc.connect(gain);
        gain.connect(lofiFilterNode!);
        
        osc.start(now);
        osc.stop(now + 7.0);
        lofiNotes.push(osc);
      });
      
      currentChordIdx = (currentChordIdx + 1) % chords.length;
    };
    
    // Play immediately and set 6.8-second interval loops
    playNextChord();
    lofiIntervalId = setInterval(playNextChord, 6800);
    
  } catch (err) {
    console.error('Failed to initialize lofi synthesizer:', err);
  }
};

const stopLofiMusic = () => {
  if (lofiIntervalId) {
    clearInterval(lofiIntervalId);
    lofiIntervalId = null;
  }
  if (noiseSource) {
    try { noiseSource.stop(); } catch(e){}
    noiseSource = null;
  }
  lofiNotes.forEach(node => {
    try { node.stop(); } catch(e){}
  });
  lofiNotes = [];
  if (lofiAudioCtx) {
    try {
      lofiAudioCtx.close();
    } catch (e) {}
    lofiAudioCtx = null;
  }
};

const safeParseJson = async (res: Response, fallbackError = 'Invalid server response.') => {
  try {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { error: fallbackError };
    }
  } catch (err) {
    return { error: fallbackError };
  }
};

interface AdminMetricsViewProps {
  metrics: any;
  error: string | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  playSoundEffect: (type: 'click' | 'success' | 'flip' | 'correct') => void;
}

const UI_PROMPTS = [
  {
    title: "Abstract Neural Network Nodes",
    category: "Holo UI Node",
    prompt: "A high-fidelity minimalist abstract 3D render of neural network nodes connecting via glowing neon light pathways. Dark obsidian background, glassmorphism nodes, cyan and purple color palette, isometric perspective, shallow depth of field, Octane render, 8k resolution, sleek tech aesthetics."
  },
  {
    title: "Minimalist Study Desk Workspace",
    category: "Aesthetic Scene",
    prompt: "A sleek and clean study desk scene, soft study lamp casting warm light, a thin bezel digital tablet showing a clean glowing chart, modern minimalist room, dark mode color grading with warm highlights, high detail, interior design concept, 8k resolution."
  },
  {
    title: "Futuristic Holographic Brain",
    category: "Interactive Model",
    prompt: "A high-fidelity holographic brain model spinning in mid-air above a sleek dark console. Glowing blue, violet and orange fiber optics, micro-details, futuristic workspace, volumetric lighting, photorealistic, Unreal Engine 5 render."
  },
  {
    title: "Conceptual Gap Radar Chart",
    category: "Data Visualization",
    prompt: "A futuristic radar graph depicting learning progress and conceptual gaps. Dark mode user interface style, neon green and red accent lines, glowing data visualizations, vector HUD interface element, clean glass panel background."
  },
  {
    title: "Obsidian Active Recall Cards",
    category: "3D Asset Card",
    prompt: "A beautiful high-fidelity render of a stack of obsidian-textured flashcards floating in space. Sleek dark glassmorphic materials, micro-etched cybernetic grid patterns, glowing violet borders, clean futuristic typography, 3D style."
  },
  {
    title: "Cybernetic Study Schedule UI",
    category: "Dashboard Widget",
    prompt: "A digital dashboard widget displaying a futuristic study timeline. Glowing linear progress bar, neon indicators, clean abstract interface, dark matte obsidian texture, sleek user experience element."
  },
  {
    title: "AI Note Summarization Core",
    category: "Particle Core",
    prompt: "A high-fidelity conceptual visual of data particles merging into a central glowing energy sphere. Representing notes synthesis, purple and cyan color scheme, fluid particle dynamics, digital art, cinematic lighting, 8k."
  },
  {
    title: "Futuristic Exam Shield Icon",
    category: "3D Cyber Icon",
    prompt: "A premium futuristic 3D icon of a cybernetic graduation cap and shield. Metallic gold and obsidian textures, subtle blue neon accents, glowing holographic HUD display in front, dark backdrop, studio lighting."
  },
  {
    title: "Interactive Study Binders",
    category: "File Folder UI",
    prompt: "A minimalist rows of abstract vertical files and study folders in a library. Dark glassmorphic tab divider, neon color highlights on tags, futuristic dashboard design element, clean corporate identity, 3D render."
  },
  {
    title: "Zenith Cosmic Workspace Texture",
    category: "UI Background",
    prompt: "An abstract dark cosmic background with soft nebula gases in deep violet and indigo. Subtle glowing digital grid overlays, microscopic star-like light nodes, premium sleek background texture for a next-gen web application."
  }
];

function AdminMetricsView({ metrics, error, showToast, playSoundEffect }: AdminMetricsViewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyPrompt = (promptText: string, index: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedIndex(index);
    showToast('Prompt copied to clipboard!', 'success');
    playSoundEffect('click');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const usersCount = metrics?.users || { total: 0, registered: 0, guest: 0 };
  const sessions = metrics?.sessions || { activeCount: 0, logs: [] };
  const tokens = metrics?.tokens || { totalPromptTokens: 0, totalCompletionTokens: 0, totalTokens: 0, actionBreakdown: {} };
  const personalTokens = metrics?.personal?.tokens || 0;

  return (
    <div className="space-y-6 w-full text-foreground pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between border-b border-border pb-4 bg-input/10 p-4 rounded-2xl">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Project Zenith Workspace Intelligence
          </h2>
          <p className="text-[11px] text-muted">
            Real-time PostgreSQL analytics, active sessions, Zenith AI token monitoring, and design prompt suites.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/20 border border-emerald-900/35 px-2.5 py-1 rounded-full">
            Live Diagnostics
          </span>
        </div>
      </div>

      {/* Warnings / Restricted Message */}
      {error && (
        <div className="p-4 bg-yellow-950/20 border border-yellow-900/35 text-yellow-400 rounded-xl text-xs flex gap-2.5 items-start animate-pulse">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
          <div>
            <span className="font-bold">Access Alert: </span> {error}
          </div>
        </div>
      )}

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users */}
        <div className="p-4 bg-secondary border border-border hover:border-primary/30 rounded-2xl flex flex-col justify-between hover-lift relative overflow-hidden group animate-slide-up">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4 group-hover:bg-primary/10 transition-all duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Workspace Members</span>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold tracking-tight">{usersCount.total}</div>
            <div className="text-[9px] text-muted flex gap-2 mt-1">
              <span>{usersCount.registered} registered</span>
              <span>•</span>
              <span>{usersCount.guest} guests</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Sessions */}
        <div className="p-4 bg-secondary border border-border hover:border-emerald-500/30 rounded-2xl flex flex-col justify-between hover-lift relative overflow-hidden group animate-slide-up [animation-delay:0.05s]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4 group-hover:bg-emerald-500/10 transition-all duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Sessions</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold tracking-tight">{sessions.activeCount}</div>
            <div className="text-[9px] text-emerald-400 mt-1 font-semibold">
              Active in last 15 minutes
            </div>
          </div>
        </div>

        {/* Card 3: Total Tokens */}
        <div className="p-4 bg-secondary border border-border hover:border-purple-500/30 rounded-2xl flex flex-col justify-between hover-lift relative overflow-hidden group animate-slide-up [animation-delay:0.1s]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4 group-hover:bg-purple-500/10 transition-all duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Total AI Tokens</span>
            <Zap className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold tracking-tight">{tokens.totalTokens.toLocaleString()}</div>
            <div className="text-[9px] text-muted flex gap-2 mt-1">
              <span>{tokens.totalPromptTokens.toLocaleString()} prompt</span>
              <span>•</span>
              <span>{tokens.totalCompletionTokens.toLocaleString()} comp</span>
            </div>
          </div>
        </div>

        {/* Card 4: Personal Footprint */}
        <div className="p-4 bg-secondary border border-border hover:border-accent/30 rounded-2xl flex flex-col justify-between hover-lift relative overflow-hidden group animate-slide-up [animation-delay:0.15s]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl transform translate-x-4 -translate-y-4 group-hover:bg-accent/10 transition-all duration-300" />
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">My AI Usage</span>
            <Brain className="h-4 w-4 text-accent" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold tracking-tight">{personalTokens.toLocaleString()}</div>
            <div className="text-[9px] text-accent mt-1 font-semibold">
              Your session accumulation
            </div>
          </div>
        </div>
      </div>

      {/* Main diagnostics: Session logs & Token actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active User Logs */}
        <div className="lg:col-span-7 bg-secondary border border-border rounded-2xl p-4 flex flex-col overflow-hidden animate-slide-up [animation-delay:0.2s]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Active Sessions Log
            </h3>
            <span className="text-[9px] text-muted font-mono bg-input border border-border px-2 py-0.5 rounded font-semibold">
              refresh rate: 10s
            </span>
          </div>

          <div className="flex-1 overflow-x-auto min-h-[250px] max-h-[350px] pr-1 scrollbar-thin">
            {sessions.logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted text-xs min-h-[250px]">
                <Info className="h-6 w-6 text-muted-foreground/40 mb-2" />
                No active sessions. Stats will populate as workspace users trigger actions.
              </div>
            ) : (
              <table className="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted font-bold">
                    <th className="py-2 pr-2">User / Email</th>
                    <th className="py-2 pr-2">IP Address</th>
                    <th className="py-2 pr-2">OS / Client</th>
                    <th className="py-2 pr-2 text-right">Study Time</th>
                    <th className="py-2 pl-2 text-right">Last Heartbeat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {sessions.logs.map((log: any) => {
                    const elapsed = log.activeSeconds;
                    const mins = Math.floor(elapsed / 60);
                    const secs = elapsed % 60;
                    const studyStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                    const date = new Date(log.lastActiveAt);
                    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    
                    return (
                      <tr key={log.id} className="hover:bg-input/20 transition-colors">
                        <td className="py-2.5 pr-2 font-semibold text-foreground max-w-[120px] truncate" title={log.email}>
                          {log.email}
                        </td>
                        <td className="py-2.5 pr-2 text-muted font-mono">
                          {log.ipAddress}
                        </td>
                        <td className="py-2.5 pr-2 text-muted truncate max-w-[80px]" title={log.userAgent}>
                          {log.userAgent}
                        </td>
                        <td className="py-2.5 pr-2 text-right font-semibold text-accent font-mono">
                          {studyStr}
                        </td>
                        <td className="py-2.5 pl-2 text-right text-muted font-mono">
                          {timeStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: AI Action breakdowns */}
        <div className="lg:col-span-5 bg-secondary border border-border rounded-2xl p-4 flex flex-col animate-slide-up [animation-delay:0.25s]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 mb-3">
            <Zap className="h-3.5 w-3.5 text-purple-500" />
            Zenith AI API Footprint
          </h3>

          <div className="space-y-4 overflow-y-auto max-h-[350px] flex-1 pr-1 scrollbar-thin">
            {Object.keys(tokens.actionBreakdown).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted text-xs min-h-[250px]">
                <Info className="h-6 w-6 text-muted-foreground/40 mb-2" />
                No tokens logged yet. Trigger Synthesis Queries, SRS active recalls, or chats to see distribution.
              </div>
            ) : (
              Object.entries(tokens.actionBreakdown).map(([actionName, stats]: any) => {
                const totalPct = tokens.totalTokens > 0 ? (stats.total / tokens.totalTokens) * 100 : 0;
                const promptPct = stats.total > 0 ? (stats.prompt / stats.total) * 100 : 0;
                
                return (
                  <div key={actionName} className="space-y-1 bg-input/20 border border-border/40 p-2.5 rounded-xl">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-bold text-foreground">{actionName}</span>
                      <span className="text-muted font-mono font-semibold">{stats.total.toLocaleString()} tokens ({stats.count} calls)</span>
                    </div>

                    {/* Composite progress bar */}
                    <div className="w-full h-2 bg-input rounded-full overflow-hidden flex">
                      <div 
                        className="bg-purple-500 h-full transition-all" 
                        style={{ width: `${promptPct}%` }}
                        title={`Prompt tokens: ${stats.prompt.toLocaleString()}`}
                      />
                      <div 
                        className="bg-pink-500 h-full transition-all" 
                        style={{ width: `${100 - promptPct}%` }}
                        title={`Completion tokens: ${stats.completion.toLocaleString()}`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[8.5px] text-muted">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" /> Prompt: {stats.prompt.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block" /> Completion: {stats.completion.toLocaleString()}
                      </span>
                      <span className="font-semibold text-primary">
                        {totalPct.toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Copy Hub section */}
      <div className="bg-secondary border border-border rounded-2xl p-5 space-y-4 animate-slide-up [animation-delay:0.3s]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-xl">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Zenith UI Asset Prompts Hub
              </h3>
              <p className="text-[10px] text-muted">
                10 distinct high-fidelity image generator prompts for UI icons, nodes, and ambient dashboard textures.
              </p>
            </div>
          </div>
          <span className="text-[8.5px] px-2 py-0.5 bg-input border border-border rounded text-muted mt-2 md:mt-0 font-semibold self-start">
            Optimized for Midjourney v6 / DALL-E 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UI_PROMPTS.map((promptObj, idx) => (
            <div 
              key={idx} 
              className="bg-input/20 border border-border/60 hover:border-primary/20 rounded-xl p-3 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-foreground tracking-tight">{promptObj.title}</span>
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full">
                    {promptObj.category}
                  </span>
                </div>
                <div className="bg-input/40 border border-border/40 rounded-lg p-2.5 text-[9.5px] font-mono text-muted select-all max-h-[75px] overflow-y-auto leading-relaxed scrollbar-thin">
                  {promptObj.prompt}
                </div>
              </div>
              
              <button
                onClick={() => handleCopyPrompt(promptObj.prompt, idx)}
                className={`w-full mt-3 py-1.5 px-3 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1.5 ${
                  copiedIndex === idx
                    ? 'bg-emerald-950/20 border border-emerald-900/35 text-emerald-400'
                    : 'bg-secondary border border-border hover:bg-input text-muted hover:text-foreground'
                }`}
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied Prompt Suite</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Asset Prompt</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

interface ArtifactPart {
  type: 'text' | 'artifact';
  content?: string;
  artifactType?: string;
  binderId?: string;
  questionCount?: number;
}

const parseMessageArtifacts = (content: string): ArtifactPart[] => {
  if (!content) return [{ type: 'text', content: '' }];
  
  // Matches <study-artifact ...>, <study-artifact .../>, or <study-artifact ...>...</study-artifact>
  const regex = /<study-artifact\s+([^>]*?)(?:\/>|>([\s\S]*?)<\/study-artifact>|>)/gi;
  
  const parts: ArtifactPart[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push({ type: 'text', content: content.substring(lastIndex, matchIndex) });
    }
    
    const attrString = match[1];
    
    // Parse attributes from attrString supporting single, double, or no quotes
    const typeMatch = attrString.match(/type\s*=\s*["']?([^"'\s>]+)["']?/i);
    const binderIdMatch = attrString.match(/binderId\s*=\s*["']?([^"'\s>]+)["']?/i);
    const questionCountMatch = attrString.match(/questionCount\s*=\s*["']?([^"'\s>]+)["']?/i);
    
    const artifactType = typeMatch ? typeMatch[1] : '';
    const binderId = binderIdMatch ? binderIdMatch[1] : undefined;
    const questionCount = questionCountMatch ? parseInt(questionCountMatch[1], 10) : undefined;
    
    parts.push({
      type: 'artifact',
      artifactType,
      binderId,
      questionCount
    });
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.substring(lastIndex) });
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', content }];
};

// Auto-triggering wrapper for Weaknesses Study Artifact
interface WeaknessArtifactWrapperProps {
  binderId: string;
  gapAnalysis: string;
  documentLoading: boolean;
  onScan: () => void;
  renderContent: () => React.ReactNode;
}

const WeaknessArtifactWrapper: React.FC<WeaknessArtifactWrapperProps> = ({
  binderId,
  gapAnalysis,
  documentLoading,
  onScan,
  renderContent
}) => {
  useEffect(() => {
    if (binderId && !gapAnalysis && !documentLoading) {
      onScan();
    }
  }, [binderId, gapAnalysis, documentLoading, onScan]);

  return <>{renderContent()}</>;
};

// Auto-triggering wrapper for Audio Review Study Artifact
interface AudioReviewArtifactWrapperProps {
  binderId: string;
  podcastTurns: any[];
  podcastLoading: boolean;
  onGenerate: () => void;
  renderContent: () => React.ReactNode;
}

const AudioReviewArtifactWrapper: React.FC<AudioReviewArtifactWrapperProps> = ({
  binderId,
  podcastTurns,
  podcastLoading,
  onGenerate,
  renderContent
}) => {
  useEffect(() => {
    if (binderId && podcastTurns.length === 0 && !podcastLoading) {
      onGenerate();
    }
  }, [binderId, podcastTurns.length, podcastLoading, onGenerate]);

  return <>{renderContent()}</>;
};

// Dismissable Artifact Container for close / dismiss handles
interface DismissableArtifactContainerProps {
  children: React.ReactNode;
}

const DismissableArtifactContainer: React.FC<DismissableArtifactContainerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) return null;
  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 p-1.5 rounded-xl bg-secondary/80 border border-border hover:bg-input text-muted hover:text-foreground opacity-80 hover:opacity-100 transition duration-200 z-10"
        title="Dismiss Artifact"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {children}
    </div>
  );
};

// Auto-triggering wrapper for Syllabus Study Artifact
interface SyllabusArtifactWrapperProps {
  binderId: string;
  sourceGuideText: string;
  sourceGuideLoading: boolean;
  onGenerate: () => void;
  renderContent: () => React.ReactNode;
}

const SyllabusArtifactWrapper: React.FC<SyllabusArtifactWrapperProps> = ({
  binderId,
  sourceGuideText,
  sourceGuideLoading,
  onGenerate,
  renderContent
}) => {
  useEffect(() => {
    if (binderId && !sourceGuideText && !sourceGuideLoading) {
      onGenerate();
    }
  }, [binderId, sourceGuideText, sourceGuideLoading, onGenerate]);

  return <>{renderContent()}</>;
};
const getFileIconColor = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'text-red-400';
    case 'doc':
    case 'docx':
      return 'text-blue-400';
    case 'txt':
    case 'md':
      return 'text-emerald-400';
    case 'csv':
    case 'xlsx':
    case 'xls':
      return 'text-green-400';
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'json':
      return 'text-purple-400';
    default:
      return 'text-primary';
  }
};


export default function App() {
  // Central State Store Selectors
  const theme = useAppStore(s => s.theme);
  const setTheme = (val: 'light' | 'dark' | ((prev: 'light' | 'dark') => 'light' | 'dark')) => {
    const nextVal = typeof val === 'function' ? val(store.getState().theme) : val;
    store.setState({ theme: nextVal });
    localStorage.setItem('studysphere-theme', nextVal);
  };

  const user = useAppStore(s => s.user);
  const setUser = (val: any) => store.setState({ user: val });

  const viewingWorkspace = useAppStore(s => s.viewingWorkspace);
  const setViewingWorkspace = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().viewingWorkspace) : val;
    store.setState({ viewingWorkspace: nextVal });
  };

  const studyMusicPlaying = useAppStore(s => s.studyMusicPlaying);
  const setStudyMusicPlaying = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().studyMusicPlaying) : val;
    store.setState({ studyMusicPlaying: nextVal });
  };

  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // User Memory / Personalization State
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [showMemoryModal, setShowMemoryModal] = useState<boolean>(false);
  const [savingMemory, setSavingMemory] = useState<boolean>(false);

  // Cycling Loader State
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const loadingMessages = [
    'Initializing StudySphere OS...',
    'Synthesizing document workspace...',
    'Syncing spatial recall indexes...',
    'Readying smart learning pathways...',
    'Securing session handshake...'
  ];

  const [googleClientId, setGoogleClientId] = useState<string | null | undefined>(undefined);
  const [googleCallbackUrl, setGoogleCallbackUrl] = useState<string | null>(null);

  // Unified loading screen wrapper for auth operations
  const performAuthActionWithLoader = async (actionFn: () => Promise<void>) => {
    const startTime = Date.now();
    setAuthChecking(true);
    setLoadingProgress(0);
    try {
      await actionFn();
    } catch (err) {
      console.error('Auth action execution failed:', err);
    } finally {
      const elapsed = Date.now() - startTime;
      const minDuration = 1500;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(() => {
        setLoadingProgress(100);
        setTimeout(() => {
          setAuthChecking(false);
        }, 200);
      }, remaining);
    }
  };

  // Internal guest login executor without loader wrapper
  const executeGuestLogin = async (storedGuestId?: string) => {
    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ guestUserId: storedGuestId })
      });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to parse guest session.');
        setUser(data.user);
        localStorage.setItem('studysphere_guest_user_id', data.user.userId);
        playSoundEffect('success');
      }
    } catch (err) {
      console.error('Guest Session Error:', err);
    }
  };

  // Public guest login wrapper with boot loading sequence
  const handleGuestLogin = async (storedGuestId?: string) => {
    await performAuthActionWithLoader(async () => {
      await executeGuestLogin(storedGuestId);
      setViewingWorkspace(true);
    });
  };


  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/auth/config');
        if (res.ok) {
          const data = await safeParseJson(res);
          setGoogleClientId(data.googleClientId || null);
          setGoogleCallbackUrl(data.googleCallbackUrl || null);
        } else {
          setGoogleClientId(null);
          setGoogleCallbackUrl(null);
        }
      } catch (err) {
        console.error('Failed to load auth config:', err);
        setGoogleClientId(null);
        setGoogleCallbackUrl(null);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!authChecking) return;
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 900);
    return () => clearInterval(interval);
  }, [authChecking]);

  useEffect(() => {
    if (!authChecking) return;
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          return 99;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [authChecking]);

  // Session Study Time State
  const [sessionStudyTime, setSessionStudyTime] = useState<number>(0);

  // Layout Navigation (Responsive Sidebar Controls)
  const [activeTab, setActiveTab] = useState<'chat' | 'guide' | 'podcast' | 'srs' | 'quiz' | 'synthesis' | 'admin'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [mobileTab, setMobileTab] = useState<'workbench' | 'chat'>('chat');

  // Competitor Document Preview & Gaps Tabs
  // Connect tabs, documents, loaders and chat to global store
  const activeRightTab = useAppStore(s => s.activeRightTab);
  const setActiveRightTab = (val: 'gaps' | 'viewer' | 'guide' | 'podcast' | 'srs' | 'quiz') => store.setState({ activeRightTab: val });

  const selectedDocumentText = useAppStore(s => s.selectedDocumentText);
  const setSelectedDocumentText = (val: string) => store.setState({ selectedDocumentText: val });

  const selectedDocumentName = useAppStore(s => s.selectedDocumentName);
  const setSelectedDocumentName = (val: string) => store.setState({ selectedDocumentName: val });

  const documentLoading = useAppStore(s => s.documentLoading);
  const setDocumentLoading = (val: boolean) => store.setState({ documentLoading: val });

  // Inline Flashcard Modal State (Direct Creation from Chat response)
  const [showInlineCardModal, setShowInlineCardModal] = useState<boolean>(false);
  const [generatingCards, setGeneratingCards] = useState<boolean>(false);
  const [generatedCards, setGeneratedCards] = useState<{ front: string; back: string; selected: boolean }[]>([]);

  // Translation States
  const [translatingDocId, setTranslatingDocId] = useState<string | null>(null);
  const [activeTranslationDropdown, setActiveTranslationDropdown] = useState<string | null>(null);

  // Landing Page Interactive State & Stepper
  const [activeTutorialTab, setActiveTutorialTab] = useState<'ingest' | 'chat' | 'srs' | 'exams'>('ingest');
  const [tutorialStepIndex, setTutorialStepIndex] = useState<number>(0);
  const [selectedReviewCategory, setSelectedReviewCategory] = useState<'all' | 'stem' | 'humanities' | 'law'>('all');

  // Binder & Documents State
  const binders = useAppStore(s => s.binders);
  const setBinders = (val: Binder[] | ((prev: Binder[]) => Binder[])) => {
    const nextVal = typeof val === 'function' ? val(store.getState().binders) : val;
    store.setState({ binders: nextVal });
  };

  const selectedBinderId = useAppStore(s => s.selectedBinderId);
  const setSelectedBinderId = (val: string | ((prev: string) => string)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().selectedBinderId) : val;
    store.setState({ selectedBinderId: nextVal });
  };

  const documents = useAppStore(s => s.documents);
  const setDocuments = (val: Document[] | ((prev: Document[]) => Document[])) => {
    const nextVal = typeof val === 'function' ? val(store.getState().documents) : val;
    store.setState({ documents: nextVal });
  };

  const [newBinderName, setNewBinderName] = useState<string>('');
  const [showAddBinder, setShowAddBinder] = useState<boolean>(false);

  // Upload Progress State
  const uploads = useAppStore(s => s.uploads);
  const setUploads = (val: Record<string, UploadProgress> | ((prev: Record<string, UploadProgress>) => Record<string, UploadProgress>)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().uploads) : val;
    store.setState({ uploads: nextVal });
  };

  const [dragActive, setDragActive] = useState<boolean>(false);

  // Active Study Chat State
  const chatMessages = useAppStore(s => s.chatMessages);
  const setChatMessages = (val: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    const nextVal = typeof val === 'function' ? val(store.getState().chatMessages) : val;
    store.setState({ chatMessages: nextVal });
  };

  const [chatInput, setChatInput] = useState<string>('');
  const chatStreaming = useAppStore(s => s.chatStreaming);
  const setChatStreaming = (val: boolean) => store.setState({ chatStreaming: val });

  const chatError = useAppStore(s => s.chatError);
  const setChatError = (val: string | null) => store.setState({ chatError: val });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Right Sidebar State: History & Gap Analysis
  const [studyHistory, setStudyHistory] = useState<StudyHistoryItem[]>([]);

  const gapAnalysis = useAppStore(s => s.gapAnalysis);
  const setGapAnalysis = (val: string | null) => store.setState({ gapAnalysis: val || '' });

  const [suggestedPathways, setSuggestedPathways] = useState<string[]>([]);

  const dueCardsCount = useAppStore(s => s.dueCardsCount);
  const setDueCardsCount = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().dueCardsCount) : val;
    store.setState({ dueCardsCount: nextVal });
  };

  // Pomodoro Focus Timer
  const pomodoroTime = useAppStore(s => s.pomodoroTime);
  const setPomodoroTime = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().pomodoroTime) : val;
    store.setState({ pomodoroTime: nextVal });
  };

  const pomodoroActive = useAppStore(s => s.pomodoroActive);
  const setPomodoroActive = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().pomodoroActive) : val;
    store.setState({ pomodoroActive: nextVal });
  };

  const soundOn = useAppStore(s => s.soundOn);
  const setSoundOn = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().soundOn) : val;
    store.setState({ soundOn: nextVal });
  };

  // Daily Streak Counter
  const streak = useAppStore(s => s.streak);
  const setStreak = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(store.getState().streak) : val;
    store.setState({ streak: nextVal });
  };

  // Toast Notification System
  interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // ==========================================
  // Project Zenith Admin & Heartbeat states/helpers
  // ==========================================
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Heartbeat ping called every 10 seconds to sync study active seconds
  useEffect(() => {
    if (!user) return;
    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/auth/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await safeParseJson(res);
          if (data && data.activeSeconds) {
            setSessionStudyTime(data.activeSeconds);
          }
        }
      } catch (err) {
        console.warn('Heartbeat activity ping failed:', err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Poll Admin & Database metrics every 10 seconds in the admin tab view
  useEffect(() => {
    if (!user || activeTab !== 'admin') return;

    const fetchAdminMetrics = async () => {
      try {
        const res = await fetch('/api/admin/metrics');
        if (res.ok) {
          const data = await safeParseJson(res);
          setAdminMetrics(data.metrics);
          setAdminError(null);
        } else {
          setAdminMetrics(null);
          if (res.status === 403) {
            setAdminError('Workspace statistics loaded. Global server logs are restricted to administrators.');
          } else {
            setAdminError('Failed to fetch database metrics.');
          }
        }
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
        setAdminError('Connection error while fetching database metrics.');
      }
    };

    fetchAdminMetrics();
    const interval = setInterval(fetchAdminMetrics, 10000);
    return () => clearInterval(interval);
  }, [user, activeTab]);

  // Execute conceptual gap analysis on demand
  const handleRunGapAnalysis = async () => {
    if (!selectedBinderId) return;
    playSoundEffect('click');
    setDocumentLoading(true);
    showToast('Scanning binder for conceptual gaps...', 'info');
    try {
      const res = await fetch(`/api/study/binders/${selectedBinderId}/gaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await safeParseJson(res);
        if (data && data.gapAnalysis) {
          setGapAnalysis(data.gapAnalysis);
          setSuggestedPathways(data.suggestedPathways || []);
          setActiveRightTab('gaps');
          setRightSidebarOpen(true);
          showToast('Study Weakness Finder scan compiled successfully!', 'success');
        } else {
          showToast('Failed to find weaknesses in documents.', 'error');
        }
      } else {
        const errData = await safeParseJson(res);
        showToast(errData.error || 'Failed to scan binder.', 'error');
      }
    } catch (err) {
      console.error('Error running gap analysis:', err);
      showToast('Connection failed during analysis scan.', 'error');
    } finally {
      setDocumentLoading(false);
    }
  };

  // Guided Tour Onboarding State (6-Step Spotlight Flow)
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Tour effect to open sidebar
  useEffect(() => {
    if (tourStep === 2 || tourStep === 3) {
      setSidebarOpen(true);
    } else if (tourStep === 5) {
      setActiveTab('chat');
    }
  }, [tourStep]);

  const getTourCardPosition = () => {
    if (tourStep === 1) return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[92vw] lg:max-w-sm lg:-translate-x-1/2 lg:top-1/2 lg:left-1/2 z-[9999]';
    if (tourStep === 2) return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[92vw] lg:max-w-sm lg:translate-y-0 lg:translate-x-0 lg:top-28 lg:left-[19rem] z-[9999]';
    if (tourStep === 3) return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[92vw] lg:max-w-sm lg:translate-y-0 lg:translate-x-0 lg:bottom-28 lg:left-[19rem] lg:top-auto z-[9999]';
    if (tourStep === 4) return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[92vw] lg:max-w-sm lg:translate-y-0 lg:-translate-x-1/2 lg:top-20 lg:left-1/2 z-[9999]';
    if (tourStep === 5) return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[92vw] lg:max-w-sm lg:translate-y-0 lg:-translate-x-1/2 lg:top-1/3 lg:left-1/2 z-[9999]';
    if (tourStep === 6) return 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[92vw] lg:max-w-sm lg:-translate-x-1/2 lg:top-1/2 lg:left-1/2 z-[9999]';
    return 'fixed bottom-6 right-6 z-[9999]';
  };

  // NotebookLM Source Guide State
  const [sourceGuideText, setSourceGuideText] = useState<string>('');
  const [sourceGuideLoading, setSourceGuideLoading] = useState<boolean>(false);

  // NotebookLM AI Podcast State
  const [podcastTurns, setPodcastTurns] = useState<PodcastTurn[]>([]);
  const [podcastLoading, setPodcastLoading] = useState<boolean>(false);
  const [activePodcastIndex, setActivePodcastIndex] = useState<number>(-1);
  const [podcastPlaying, setPodcastPlaying] = useState<boolean>(false);
  const [podcastSpeed, setPodcastSpeed] = useState<number>(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPodcastPlayingRef = useRef<boolean>(false);
  const podcastTimerRef = useRef<any>(null);

  // Audio Playback Helper (Web Audio API Synthesizer)
  const playSoundEffect = (type: 'click' | 'success' | 'flip' | 'correct') => {
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
      } else if (type === 'success') {
        const playDing = (delay: number, pitch: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(pitch, ctx.currentTime + delay);
          
          gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.2);
          
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.2);
        };
        playDing(0, 523.25); // C5
        playDing(0.08, 659.25); // E5
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
      } else if (type === 'correct') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
          
          gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.05 + 0.25);
          
          osc.start(ctx.currentTime + idx * 0.05);
          osc.stop(ctx.currentTime + idx * 0.05 + 0.25);
        });
      }
    } catch (e) {
      console.warn("AudioContext playback failed", e);
    }
  };

  // Interactive Tutorial Onboarding States
  const [chatDemoText, setChatDemoText] = useState<string>('');
  const [tutorialCardFlipped, setTutorialCardFlipped] = useState<boolean>(false);
  const [examScoreProgress, setExamScoreProgress] = useState<number>(0);

  // Testimonials Data
  const testimonials = [
    { name: 'Marcus Chen', role: 'Computer Science Student', text: 'StudySphere synthesized 12 code repos and explained the whole microservice boundary in seconds. The mind map generation is a lifesaver.', rating: 5, category: 'stem' },
    { name: 'Dr. Sarah Jenkins', role: 'Medical Resident', text: 'The spaced repetition SM-2 card system is perfect for pharmacology. I just drag in my PDF lectures, and the AI drafts my review schedule automatically.', rating: 5, category: 'stem' },
    { name: 'Elena Rostova', role: 'Law Student', text: 'Comparing contradictions across 4 files of legal code was impossible before. The cross-reference semantic synthesis cites file names accurately.', rating: 5, category: 'law' },
    { name: 'David K.', role: 'History Student', text: 'Mock exams draft accurate questions from my syllabus. The conceptual gap analysis points out what I missed so I do not waste time studying what I already know.', rating: 5, category: 'humanities' }
  ];

  // Onboarding Step Config
  const tutorialSteps = [
    { id: 'ingest', title: '1. Ingest Study Materials' },
    { id: 'chat', title: '2. Chat & Visual Mindmaps' },
    { id: 'srs', title: '3. Active Recall Cards' },
    { id: 'exams', title: '4. Adaptive Mock Exams' }
  ];

  // Apply Theme on Mount and change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-claude-light', 'theme-claude-dark');
    root.classList.add(theme === 'light' ? 'theme-claude-light' : 'theme-claude-dark');
    localStorage.setItem('studysphere-theme', theme);
  }, [theme]);

  // Set default sidebars on desktop viewports on mount (close right sidebar by default for spaciousness)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
        setRightSidebarOpen(false); // Closed by default for spacious workspace layout
      } else {
        setSidebarOpen(false);
        setRightSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typewriter effect for Chat onboarding
  useEffect(() => {
    if (activeTutorialTab !== 'chat') {
      setChatDemoText('');
      return;
    }
    const fullText = 'Microservices decompose applications into isolated databases and APIs. Here is the structure:';
    let idx = 0;
    const timer = setInterval(() => {
      setChatDemoText(fullText.substring(0, idx));
      idx++;
      if (idx > fullText.length) {
        clearInterval(timer);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [activeTutorialTab]);

  // Score counter for Mock Exam onboarding
  useEffect(() => {
    if (activeTutorialTab !== 'exams') {
      setExamScoreProgress(0);
      return;
    }
    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current > 80) {
        current = 80;
        clearInterval(timer);
        playSoundEffect('correct');
      }
      setExamScoreProgress(current);
    }, 20);
    return () => clearInterval(timer);
  }, [activeTutorialTab]);

  // 1. Session Verification on Mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      // Clean up the URL query params so they don't persist in the address bar
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      if (oauthError === 'auth_failed') {
        showToast('Google Sign-In failed. Please try again.', 'error');
      } else if (oauthError === 'missing_credential') {
        showToast('Google credentials missing. Please try again.', 'error');
      } else if (oauthError === 'misconfigured') {
        showToast('Google auth is misconfigured on the server.', 'error');
      } else {
        showToast(`Google login error: ${oauthError}`, 'error');
      }
    }

    const checkSession = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await safeParseJson(res, 'Session verify failed.');
          setUser(data.user);
        } else {
          // Check if a guest session exists locally and restore it
          const storedGuestId = localStorage.getItem('studysphere_guest_user_id');
          if (storedGuestId) {
            await executeGuestLogin(storedGuestId);
          }
        }
      } catch (err) {
        console.error('Session check failure:', err);
      } finally {
        const elapsed = Date.now() - startTime;
        const minDuration = 1500;
        const remaining = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
          setLoadingProgress(100);
          setTimeout(() => {
            setAuthChecking(false);
          }, 200);
        }, remaining);
      }
    };
    checkSession();
  }, []);

  // 2. Fetch Binders & History when Authenticated
  const fetchBinders = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/study/binders', { credentials: 'include' });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to fetch binders.');
        const bindersList = data.binders || [];
        setBinders(bindersList);
        
        if (bindersList.length > 0) {
          if (!selectedBinderId) {
            setSelectedBinderId(bindersList[0].id);
          }
        } else {
          // Auto-create default study session chat
          try {
            const createRes = await fetch('/api/study/binders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ name: 'My Study Chat', description: 'Primary active study workspace' }),
            });
            if (createRes.ok) {
              const newBinder = await createRes.json();
              setBinders([newBinder]);
              setSelectedBinderId(newBinder.id);
            }
          } catch (createErr) {
            console.error('Error auto-creating default binder:', createErr);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching binders:', e);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    if ((user as any).isGuest) {
      const localKey = `studyHistory_guest_${user.userId}`;
      try {
        const stored = localStorage.getItem(localKey);
        setStudyHistory(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error('Failed to read guest history from localStorage:', e);
        setStudyHistory([]);
      }
      return;
    }
    try {
      const res = await fetch('/api/study/history', { credentials: 'include' });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to fetch history.');
        setStudyHistory(data.history || []);
      }
    } catch (e) {
      console.error('Error fetching history:', e);
    }
  };

  const fetchDueCards = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/study/flashcards?due=true', { credentials: 'include' });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to check due cards.');
        setDueCardsCount(data.flashcards?.length || 0);
      }
    } catch (e) {
      console.error('Error fetching due flashcards count:', e);
    }
  };

  const fetchMemory = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/memory', { credentials: 'include' });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to load memory settings.');
        setCustomInstructions(data.customInstructions || '');
      }
    } catch (err) {
      console.error('Failed to load memory settings:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBinders();
      fetchHistory();
      fetchDueCards();
      fetchMemory();
    }
  }, [user]);

  // 3. Fetch documents when binder selection changes
  const fetchDocuments = async () => {
    if (!selectedBinderId) {
      setDocuments([]);
      return;
    }
    try {
      const res = await fetch(`/api/study/binders/${selectedBinderId}/documents`, { credentials: 'include' });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to load documents.');
        setDocuments(data.documents || []);
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
    }
  };

  useEffect(() => {
    fetchDocuments();
    setSourceGuideText('');
    setPodcastTurns([]);
    setActivePodcastIndex(-1);
    setPodcastPlaying(false);
    window.speechSynthesis.cancel();
  }, [selectedBinderId]);



  // Render Google Button on sign-in screen
  useEffect(() => {
    if (user || authChecking || googleClientId === undefined) return;

    const handleGoogleCredentialResponse = async (response: any) => {
      await performAuthActionWithLoader(async () => {
        try {
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: response.credential }),
          });
          if (res.ok) {
            const data = await safeParseJson(res, 'Google login response parsing failed.');
            setUser(data.user);
            showToast('Successfully signed in with Google!', 'success');
            setViewingWorkspace(true);
          } else {
            const data = await res.json().catch(() => ({}));
            showToast(data.error || 'Google login failed.', 'error');
          }
        } catch (err) {
          console.error('Google Sign-in error:', err);
          showToast('An error occurred during Google Sign-in.', 'error');
        }
      });
    };

    const initializeGoogleBtn = () => {
      if ((window as any).google) {
        if (!(window as any).__google_gsi_initialized) {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId || '779960370065-orcbqonmg0irnqivbcemhpbp73k0k93g.apps.googleusercontent.com',
            ux_mode: 'popup',
            callback: handleGoogleCredentialResponse,
          });
          (window as any).__google_gsi_initialized = true;
        }
        const container = document.getElementById('google-btn-container');
        if (container) {
          (window as any).google.accounts.id.renderButton(
            container,
            { theme: theme === 'light' ? 'outline' : 'filled_blue', size: 'large', width: 280 }
          );
        }
        const navContainer = document.getElementById('google-btn-container-nav');
        if (navContainer) {
          (window as any).google.accounts.id.renderButton(
            navContainer,
            { theme: theme === 'light' ? 'outline' : 'filled_blue', size: 'medium', width: 180 }
          );
        }
      }
    };

    const checkAndInit = () => {
      if ((window as any).google) {
        initializeGoogleBtn();
        clearInterval(interval);
      }
    };
    const interval = setInterval(checkAndInit, 150);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user, authChecking, theme, googleClientId, googleCallbackUrl]);

  // Sign Out Handler
  const handleSignOut = async () => {
    await performAuthActionWithLoader(async () => {
      try {
        await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include'
        }).catch(err => console.error('Sign Out backend error:', err));
      } catch (err) {
        console.error('Sign Out Error:', err);
      } finally {
        localStorage.removeItem('studysphere_guest_user_id');
        setUser(null);
        setViewingWorkspace(false);
        setBinders([]);
        setSelectedBinderId('');
        setDocuments([]);
        setChatMessages([]);
        setStudyHistory([]);
        setGapAnalysis('');
        setSuggestedPathways([]);
        setSelectedDocumentText('');
        setSelectedDocumentName('');
        setSourceGuideText('');
        setPodcastTurns([]);
        setTourStep(null);
        window.speechSynthesis.cancel();
        playSoundEffect('click');
        showToast('Signed out successfully.', 'info');
      }
    });
  };

  // Binder Management Actions
  const handleCreateBinder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBinderName.trim()) return;

    try {
      const res = await fetch('/api/study/binders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newBinderName }),
      });

      if (res.ok) {
        const newBinder = await safeParseJson(res, 'Failed to create binder.');
        setBinders(prev => [newBinder, ...prev]);
        setSelectedBinderId(newBinder.id);
        setNewBinderName('');
        setShowAddBinder(false);
        playSoundEffect('correct');
        if (tourStep === 1) {
          setTourStep(2); // Advance tour
        }
      }
    } catch (err) {
      console.error('Binder Creation Failure:', err);
    }
  };

  const handleDeleteBinder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this binder and all its documents?')) return;
    try {
      const res = await fetch(`/api/study/binders/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setBinders(prev => prev.filter(b => b.id !== id));
        if (selectedBinderId === id) {
          setSelectedBinderId(binders.find(b => b.id !== id)?.id || '');
        }
      }
    } catch (err) {
      console.error('Binder Deletion Failure:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Delete this document from the binder?')) return;
    try {
      const res = await fetch(`/api/study/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (selectedDocumentName) {
          setSelectedDocumentText('');
          setSelectedDocumentName('');
        }
        fetchBinders();
      }
    } catch (err) {
      console.error('Document Deletion Failure:', err);
    }
  };

  // Fetch document text for slide-out reader
  const handleViewDocumentText = async (docId: string, name: string) => {
    try {
      setDocumentLoading(true);
      setSelectedDocumentName(name);
      setSelectedDocumentText('');
      setActiveRightTab('viewer');
      setRightSidebarOpen(true);
      playSoundEffect('click');

      const res = await fetch(`/api/study/documents/${docId}`, { credentials: 'include' });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to fetch document content.');
        setSelectedDocumentText(data.document?.content || 'Empty context.');
      } else {
        setSelectedDocumentText('Failed to retrieve document text content.');
      }
    } catch (err) {
      console.error(err);
      setSelectedDocumentText('Network error fetching document text.');
    } finally {
      setDocumentLoading(false);
    }
  };

  const handleTranslateDocument = async (docId: string, docName: string, targetLanguage: string) => {
    if (!selectedBinderId) return;
    setTranslatingDocId(docId);
    playSoundEffect('click');
    
    try {
      const res = await fetch(`/api/study/binders/${selectedBinderId}/documents/${docId}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetLanguage }),
      });
      
      const data = await safeParseJson(res, 'Translation service failed.');
      if (res.ok) {
        showToast(`Successfully translated "${docName}" to ${targetLanguage}!`, 'success');
        fetchDocuments();
        fetchBinders();
      } else {
        showToast(data.error || 'Translation failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to translation endpoint.', 'error');
    } finally {
      setTranslatingDocId(null);
    }
  };

  // Prefill and open inline card creator modal calling the AI generator
  const handleOpenInlineCardModal = async (textToDistill: string) => {
    setShowInlineCardModal(true);
    setGeneratingCards(true);
    setGeneratedCards([]);
    playSoundEffect('click');
    try {
      const res = await fetch('/api/study/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: textToDistill }),
      });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to generate flashcards.');
        const cards = (data.cards || []).map((c: any) => ({
          front: c.front || '',
          back: c.back || '',
          selected: true
        }));
        setGeneratedCards(cards);
        playSoundEffect('correct');
      } else {
        showToast('AI could not generate flashcards for this message.', 'error');
        setShowInlineCardModal(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to AI flashcard generator.', 'error');
      setShowInlineCardModal(false);
    } finally {
      setGeneratingCards(false);
    }
  };

  const handleUpdateCard = (idx: number, field: 'front' | 'back' | 'selected', val: any) => {
    setGeneratedCards(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleSaveInlineCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const cardsToSave = generatedCards.filter(c => c.selected && c.front.trim() && c.back.trim());
    if (cardsToSave.length === 0) {
      showToast('No cards selected to save.', 'info');
      return;
    }

    let successCount = 0;
    for (const card of cardsToSave) {
      try {
        const res = await fetch('/api/study/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ front: card.front, back: card.back }),
        });
        if (res.ok) {
          successCount++;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (successCount > 0) {
      playSoundEffect('correct');
      setShowInlineCardModal(false);
      fetchDueCards();
      showToast(`Successfully saved ${successCount} card(s) to your SRS deck!`, 'success');
    } else {
      showToast('Failed to save flashcards.', 'error');
    }
  };

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMemory(true);
    try {
      const res = await fetch('/api/auth/memory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ customInstructions }),
      });
      if (res.ok) {
        showToast('Memory preferences updated successfully!', 'success');
        setShowMemoryModal(false);
        playSoundEffect('correct');
      } else {
        showToast('Failed to save memory preferences.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error connecting to memory API.', 'error');
    } finally {
      setSavingMemory(false);
    }
  };

  const getScreenContext = () => {
    let context = `[USER ACTIVE SCREEN CONTEXT]\n`;
    context += `- Active View Tab: "${activeTab}"\n`;
    
    const activeBinder = binders.find(b => b.id === selectedBinderId);
    if (activeBinder) {
      context += `- Active Binder: "${activeBinder.name}"\n`;
    }
    
    if (selectedDocumentName) {
      context += `- Selected Document: "${selectedDocumentName}"\n`;
      if (selectedDocumentText) {
        context += `- Selected Document Text Preview (first 4000 characters):\n${selectedDocumentText.slice(0, 4000)}\n\n`;
      }
    }
    
    if (activeTab === 'synthesis') {
      if (sourceGuideText) {
        context += `- Active Synthesized Study Guide Text Preview (first 4000 characters):\n${sourceGuideText.slice(0, 4000)}\n\n`;
      }
      if (podcastTurns.length > 0) {
        context += `- Generated Podcast turns count: ${podcastTurns.length}\n`;
      }
    }
    
    if (activeTab === 'srs') {
      context += `- Active Spaced Repetition Due Cards Count: ${dueCardsCount}\n`;
    }
    
    if (activeTab === 'quiz') {
      context += `- Active Practice Exam Dashboard\n`;
    }

    if (gapAnalysis) {
      context += `- Active Conceptual Gap Analysis on Screen Preview:\n${gapAnalysis.slice(0, 1500)}\n\n`;
      if (suggestedPathways.length > 0) {
        context += `- Suggested Learning Pathways: ${suggestedPathways.join(', ')}\n`;
      }
    }

    if (chatMessages.length > 0) {
      context += `- Active Chat Tab Conversation History (Last 10 turns):\n`;
      const recentMessages = chatMessages.slice(-10);
      recentMessages.forEach(msg => {
        context += `  * [${msg.role.toUpperCase()}]: ${msg.content.substring(0, 1000)}\n`;
      });
      context += `\n`;
    }
    
    return context + `[END OF SCREEN CONTEXT]\n\n`;
  };

  // NotebookLM Source Study Guide Generator
  const handleGenerateStudyGuide = async () => {
    if (!selectedBinderId) return;
    setSourceGuideLoading(true);
    playSoundEffect('click');
    try {
      const res = await fetch(`/api/study/binders/${selectedBinderId}/guide`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to parse study guide.');
        setSourceGuideText(data.guide || 'Failed to synthesize guide.');
        playSoundEffect('correct');
      } else {
        const err = await safeParseJson(res, 'Failed to parse error response.');
        showToast(err.error || 'Failed to generate study guide.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error connecting to synthesis guide endpoint.', 'error');
    } finally {
      setSourceGuideLoading(false);
    }
  };

  // NotebookLM AI Podcast Overview Generator
  const handleGeneratePodcast = async () => {
    if (!selectedBinderId) return;
    setPodcastLoading(true);
    playSoundEffect('click');
    setPodcastTurns([]);
    setActivePodcastIndex(-1);
    setPodcastPlaying(false);
    window.speechSynthesis.cancel();
    try {
      const res = await fetch(`/api/study/binders/${selectedBinderId}/podcast`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await safeParseJson(res, 'Failed to parse podcast dialogue.');
        setPodcastTurns(data.podcast || []);
        playSoundEffect('correct');
      } else {
        const err = await safeParseJson(res, 'Failed to parse error response.');
        showToast(err.error || 'Failed to compile podcast briefing script.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error connecting to podcast generation endpoint.', 'error');
    } finally {
      setPodcastLoading(false);
    }
  };

  // SpeechSynthesis Loop for Podcast Player
  const speakDialogue = (index: number) => {
    if (podcastTimerRef.current) {
      clearTimeout(podcastTimerRef.current);
      podcastTimerRef.current = null;
    }

    if (!isPodcastPlayingRef.current) {
      return;
    }

    if (index < 0 || index >= podcastTurns.length) {
      setPodcastPlaying(false);
      isPodcastPlayingRef.current = false;
      setActivePodcastIndex(-1);
      return;
    }

    setActivePodcastIndex(index);
    const line = podcastTurns[index];

    // Scroll active line into viewport
    const elem = document.getElementById(`podcast-turn-${index}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    window.speechSynthesis.cancel();

    const cleanedText = line.text.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utteranceRef.current = utterance;
    utterance.rate = podcastSpeed;
    utterance.pitch = line.speaker === 'Alex' ? 0.95 : 1.15;

    // Retrieve compatible browser voices
    const browserVoices = voices.length ? voices : window.speechSynthesis.getVoices();
    let selectedVoice = null;

    const englishVoices = browserVoices.filter(v => v.lang.startsWith('en') || v.lang.toLowerCase().startsWith('en-'));
    
    // Sort to prioritize natural/neural/online voices
    const sortNaturalFirst = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aIsNatural = aName.includes('natural') || aName.includes('neural') || aName.includes('online');
      const bIsNatural = bName.includes('natural') || bName.includes('neural') || bName.includes('online');
      if (aIsNatural && !bIsNatural) return -1;
      if (!aIsNatural && bIsNatural) return 1;
      return 0;
    };
    englishVoices.sort(sortNaturalFirst);
    
    if (line.speaker === 'Alex') {
      // Alex: Male speaker
      selectedVoice = englishVoices.find(v => 
        (v.name.toLowerCase().includes('google us english') || 
         v.name.toLowerCase().includes('male') || 
         v.name.toLowerCase().includes('david') || 
         v.name.toLowerCase().includes('natural') ||
         v.name.toLowerCase().includes('guy') ||
         v.name.toLowerCase().includes('google')) &&
         !v.name.toLowerCase().includes('female') &&
         !v.name.toLowerCase().includes('zira')
      ) || englishVoices.find(v => v.name.toLowerCase().includes('microsoft david')) 
        || englishVoices[0] 
        || browserVoices[0];
    } else {
      // Taylor: Female speaker
      selectedVoice = englishVoices.find(v => 
        (v.name.toLowerCase().includes('zira') || 
         v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('google uk english female') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('aria') ||
         v.name.toLowerCase().includes('google')) &&
         !v.name.toLowerCase().includes('male') &&
         !v.name.toLowerCase().includes('david')
      ) || englishVoices.find(v => v.name.toLowerCase().includes('microsoft zira')) 
        || englishVoices[1] 
        || englishVoices[0] 
        || browserVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      if (isPodcastPlayingRef.current) {
        podcastTimerRef.current = setTimeout(() => {
          speakDialogue(index + 1);
        }, 350);
      }
    };

    utterance.onerror = (e: any) => {
      // If interrupted or canceled manually, do not proceed
      if (e.error === 'interrupted' || e.error === 'canceled' || !isPodcastPlayingRef.current) {
        return;
      }
      // Graceful duration fallback if speech engine fails
      const delay = Math.max(3000, cleanedText.split(' ').length * 300 / podcastSpeed) + 350;
      podcastTimerRef.current = setTimeout(() => {
        if (isPodcastPlayingRef.current) {
          speakDialogue(index + 1);
        }
      }, delay);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startPodcastPlayback = () => {
    if (podcastTurns.length === 0) return;
    setPodcastPlaying(true);
    isPodcastPlayingRef.current = true;
    const startIdx = activePodcastIndex === -1 ? 0 : activePodcastIndex;
    speakDialogue(startIdx);
    playSoundEffect('click');
  };

  const pausePodcastPlayback = () => {
    setPodcastPlaying(false);
    isPodcastPlayingRef.current = false;
    if (podcastTimerRef.current) {
      clearTimeout(podcastTimerRef.current);
      podcastTimerRef.current = null;
    }
    window.speechSynthesis.cancel();
    playSoundEffect('click');
  };

  // 3. SpeechSynthesis voices loader
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // File Ingestion drag-and-drop & uploads
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (filesList: File[]) => {
    let binderId = selectedBinderId;
    if (!binderId) {
      try {
        const res = await fetch('/api/study/binders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: 'My Study Workspace' }),
        });
        if (res.ok) {
          const newBinder = await res.json();
          setBinders(prev => [newBinder, ...prev]);
          setSelectedBinderId(newBinder.id);
          binderId = newBinder.id;
          showToast('Created default study binder: My Study Workspace', 'success');
        } else {
          showToast('Failed to create default binder for upload.', 'error');
          return;
        }
      } catch (err) {
        console.error('Auto Binder Creation Failure:', err);
        showToast('Error creating default study binder.', 'error');
        return;
      }
    }

    const newUploads = { ...uploads };
    filesList.forEach(file => {
      newUploads[file.name] = {
        name: file.name,
        loaded: 0,
        total: file.size,
        status: 'pending',
      };
    });
    setUploads(newUploads);

    filesList.forEach(file => {
      VFS.write(binderId, file, (progressPercent) => {
        const loadedBytes = Math.round((progressPercent / 100) * file.size);
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            loaded: loadedBytes,
            status: 'uploading',
          },
        }));
      })
      .then(() => {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            loaded: file.size,
            status: 'completed',
          },
        }));
        playSoundEffect('correct');
        fetchDocuments();
        fetchBinders();
        
        // Post ingestion message directly to chat
        const autoMsgContent = `Uploaded and ingested \`${file.name}\`. Zenith AI has parsed the layout and added it to your active study context.`;
        setChatMessages(prev => [...prev, { role: 'system', content: autoMsgContent }]);
        
        if (tourStep === 2) {
          setTourStep(3); // Advance onboarding tour
        }
      })
      .catch((err: any) => {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'failed',
            error: err.message || 'Upload failed',
          },
        }));
      });
    });
  };

  const clearUploadProgressItem = (name: string) => {
    setUploads(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };



  const renderChatArtifact = (type: string, binderId?: string, questionCount?: number) => {
    const activeBinderId = binderId || selectedBinderId;
    
    switch (type) {
      case 'flashcards':
        return (
          <DismissableArtifactContainer>
            <div className="w-full glass-panel p-6 rounded-2xl border border-border shadow-xl my-4">
              <FlashcardSRS soundOn={soundOn} binderId={activeBinderId} />
            </div>
          </DismissableArtifactContainer>
        );
      case 'quiz':
        return (
          <DismissableArtifactContainer>
            <div className="w-full glass-panel p-6 rounded-2xl border border-border shadow-xl my-4">
              <MockExamEngine 
                initialBinderId={activeBinderId} 
                initialQuestionCount={questionCount}
                onGradeCompleted={(gaps, pathways) => {
                  setGapAnalysis(gaps);
                  setSuggestedPathways(pathways);
                  showToast('Exam completed and weakness report generated.', 'success');
                }} 
              />
            </div>
          </DismissableArtifactContainer>
        );
      case 'weaknesses':
        return (
          <DismissableArtifactContainer>
            <WeaknessArtifactWrapper
              binderId={activeBinderId}
              gapAnalysis={gapAnalysis}
              documentLoading={documentLoading}
              onScan={handleRunGapAnalysis}
              renderContent={() => (
                <div className="w-full glass-panel p-6 rounded-2xl border border-border shadow-xl my-4 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <h3 className="text-base font-bold text-foreground font-sans">Study Weakness Finder</h3>
                    </div>
                    <button
                      onClick={handleRunGapAnalysis}
                      disabled={documentLoading || !activeBinderId}
                      className="px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      {documentLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      <span>Scan / Refresh</span>
                    </button>
                  </div>
                  {gapAnalysis ? (
                    <div className="space-y-4">
                      <div className="text-xs text-foreground leading-relaxed prose prose-invert max-w-none academic-prose">
                        <ReactMarkdown components={renderMarkdownComponents} remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}>
                          {gapAnalysis}
                        </ReactMarkdown>
                      </div>
                      {suggestedPathways.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Suggested Study Pathways:</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {suggestedPathways.map((path, idx) => (
                              <div key={idx} className="flex gap-2 p-2 bg-input border border-border rounded-lg text-xs text-foreground font-semibold items-start">
                                <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{path}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-secondary/50 border border-border rounded-xl">
                      <p className="text-xs text-muted">No weakness report compiled yet. Click "Scan / Refresh" or take a Practice Exam to identify conceptual gaps.</p>
                    </div>
                  )}
                </div>
              )}
            />
          </DismissableArtifactContainer>
        );
      case 'audio-review':
        return (
          <DismissableArtifactContainer>
            <AudioReviewArtifactWrapper
              binderId={activeBinderId}
              podcastTurns={podcastTurns}
              podcastLoading={podcastLoading}
              onGenerate={handleGeneratePodcast}
              renderContent={() => (
                <div className="w-full glass-panel p-6 rounded-2xl border border-border shadow-xl my-4 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-accent" />
                      <h3 className="text-base font-bold text-foreground font-sans">Audio Study Review</h3>
                    </div>
                    <button
                      onClick={handleGeneratePodcast}
                      disabled={podcastLoading || !activeBinderId}
                      className="px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      {podcastLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      <span>Generate Audio</span>
                    </button>
                  </div>

                  {podcastLoading ? (
                    <div className="flex flex-col justify-center items-center py-10 gap-3">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <span className="text-sm font-semibold text-foreground">Compiling review audio dialogue...</span>
                    </div>
                  ) : podcastTurns.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-col p-4 bg-secondary/60 border border-border rounded-xl space-y-4 shadow-md">
                        <div className="w-full flex items-center justify-between p-3.5 bg-input/50 border border-border rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg border ${podcastPlaying ? 'bg-primary/15 border-primary/25 text-primary' : 'bg-secondary border-border text-muted-foreground'}`}>
                              <Headphones className="h-4.5 w-4.5" />
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] font-bold text-foreground block">Alex & Taylor Briefing</span>
                              <span className="text-[9.5px] text-muted block">
                                {podcastPlaying ? 'Playing Audio Review' : 'Audio Review Paused'}
                              </span>
                            </div>
                          </div>
                          {podcastPlaying && (
                            <div className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 h-full bg-primary rounded-full animate-pulse" style={{ animationDuration: '0.6s' }}></span>
                              <span className="w-0.5 h-3/4 bg-primary rounded-full animate-pulse" style={{ animationDuration: '0.8s' }}></span>
                              <span className="w-0.5 h-1/2 bg-primary rounded-full animate-pulse" style={{ animationDuration: '0.5s' }}></span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-center gap-4">
                          {podcastPlaying ? (
                            <button
                              onClick={pausePodcastPlayback}
                              className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={startPodcastPlayback}
                              className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition"
                            >
                              <Play className="h-4 w-4 fill-current" />
                            </button>
                          )}
                          <select
                            value={podcastSpeed}
                            onChange={(e) => {
                              setPodcastSpeed(Number(e.target.value));
                              if (podcastPlaying) speakDialogue(activePodcastIndex);
                            }}
                            className="bg-input border border-border rounded px-2 py-0.5 text-xs text-foreground focus:outline-none"
                          >
                            <option value={0.85}>0.85x Speed</option>
                            <option value={1}>1.0x Speed</option>
                            <option value={1.2}>1.2x Speed</option>
                            <option value={1.5}>1.5x Speed</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                        {podcastTurns.map((turn, idx) => {
                          const isActive = idx === activePodcastIndex;
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                speakDialogue(idx);
                                if (!podcastPlaying) setPodcastPlaying(true);
                              }}
                              className={`p-2 border rounded-lg cursor-pointer text-xs transition ${
                                isActive
                                  ? 'bg-primary/15 border-primary text-foreground font-semibold'
                                  : 'bg-input/40 border-border text-muted hover:text-foreground'
                              }`}
                            >
                              <span className={`font-bold text-[9px] uppercase tracking-wider block mb-0.5 ${turn.speaker === 'Alex' ? 'text-primary' : 'text-accent'}`}>
                                {turn.speaker}
                              </span>
                              <p className="leading-relaxed">{turn.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-secondary/50 border border-border rounded-xl">
                      <p className="text-xs text-muted">Generate a text-to-speech dialogue briefing of binder concepts.</p>
                    </div>
                  )}
                </div>
              )}
            />
          </DismissableArtifactContainer>
        );
      case 'syllabus':
        return (
          <DismissableArtifactContainer>
            <SyllabusArtifactWrapper
              binderId={activeBinderId}
              sourceGuideText={sourceGuideText}
              sourceGuideLoading={sourceGuideLoading}
              onGenerate={handleGenerateStudyGuide}
              renderContent={() => (
                <div className="w-full glass-panel p-6 rounded-2xl border border-border shadow-xl my-4 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5 text-accent" />
                      <h3 className="text-base font-bold text-foreground font-sans">Master Study Syllabus</h3>
                    </div>
                    <button
                      onClick={handleGenerateStudyGuide}
                      disabled={sourceGuideLoading || !activeBinderId}
                      className="px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      {sourceGuideLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      <span>Generate Syllabus</span>
                    </button>
                  </div>

                  {sourceGuideLoading ? (
                    <div className="flex flex-col justify-center items-center py-10 gap-3">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <span className="text-xs text-foreground font-semibold">Creating master study syllabus...</span>
                    </div>
                  ) : sourceGuideText ? (
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(sourceGuideText);
                            playSoundEffect('correct');
                            showToast('Copied syllabus to clipboard!', 'success');
                          }}
                          className="px-2 py-1 bg-input border border-border hover:bg-secondary text-[10px] text-foreground rounded flex items-center gap-1 font-semibold transition"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Markdown</span>
                        </button>
                      </div>
                      <div className="glass-panel p-4 rounded-xl shadow-md academic-prose text-xs max-h-72 overflow-y-auto bg-input/40 border border-border">
                        <ReactMarkdown components={renderMarkdownComponents} remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}>
                          {sourceGuideText}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-secondary/50 border border-border rounded-xl">
                      <p className="text-xs text-muted">Generate a structured master study syllabus from all files in this binder.</p>
                    </div>
                  )}
                </div>
              )}
            />
          </DismissableArtifactContainer>
        );
      default:
        return null;
    }
  };

  // Inline Refinement / Human-in-the-Loop Handlers
  const handleStartRefinement = (index: number) => {
    const updated = [...chatMessages];
    updated[index] = { ...updated[index], isEditing: true };
    setChatMessages(updated);
  };

  const handleCancelRefinement = (index: number) => {
    const updated = [...chatMessages];
    updated[index] = { ...updated[index], isEditing: false };
    setChatMessages(updated);
  };

  const handleUpdateMessageContent = (index: number, val: string) => {
    const updated = [...chatMessages];
    updated[index] = { ...updated[index], content: val };
    setChatMessages(updated);
  };

  const handleSaveRefinement = (index: number) => {
    const updated = [...chatMessages];
    updated[index] = { ...updated[index], isEditing: false };
    setChatMessages(updated);
    showToast('AI response updated locally.', 'success');
  };

  // Chat Streaming
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatStreaming(true);
    setChatError(null);
    playSoundEffect('click');

    // Build context prompt injecting screen context
    const contextExplanation = getScreenContext();

    const assistantMsgIndex = chatMessages.length + 1;
    setChatMessages(prev => [...prev, { role: 'assistant', content: '', thoughts: [] }]);

    let fullResponse = '';
    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messages: [
            ...chatMessages,
            { role: 'user', content: userMessage.content }
          ],
          contextExplanation: contextExplanation,
          binderId: selectedBinderId || undefined,
          webSearch: true,
          userLocalTime: new Date().toString(),
          userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        const errorData = await safeParseJson(response).catch(() => ({}));
        throw new Error(errorData.error || 'Server rejected the streaming request.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let streamBuffer = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          streamBuffer += decoder.decode(value, { stream: true });
          const lines = streamBuffer.split('\n');
          streamBuffer = lines.pop() || '';

          for (let line of lines) {
            line = line.trim();
            if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6).trim();
              if (jsonStr === '[DONE]') continue;
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                const chunkText = parsed.text;
                const chunkThought = parsed.thought;
                
                if (chunkThought) {
                  setChatMessages(prev => {
                    const next = [...prev];
                    const targetMsg = next[assistantMsgIndex];
                    if (targetMsg) {
                      if (!targetMsg.thoughts) targetMsg.thoughts = [];
                      if (targetMsg.thoughts[targetMsg.thoughts.length - 1] !== chunkThought) {
                        targetMsg.thoughts.push(chunkThought);
                      }
                    }
                    return next;
                  });
                }
                
                if (chunkText) {
                  fullResponse += chunkText;
                  setChatMessages(prev => {
                    const next = [...prev];
                    const targetMsg = next[assistantMsgIndex];
                    if (targetMsg) {
                      targetMsg.content += chunkText;
                    }
                    return next;
                  });
                }
              } catch (e: any) {
                console.error('Buffer chunk parse failure:', e);
              }
            }
          }
        }
      }
      
      if (user && (user as any).isGuest && fullResponse) {
        const localKey = `studyHistory_guest_${user.userId}`;
        try {
          const stored = localStorage.getItem(localKey);
          const list = stored ? JSON.parse(stored) : [];
          list.unshift({
            id: 'local-' + Date.now(),
            query: userMessage.content,
            response: fullResponse,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem(localKey, JSON.stringify(list.slice(0, 100)));
        } catch (e) {
          console.error('Failed to save local history:', e);
        }
      }
      fetchHistory();
      setStreak(prev => prev + 1);
    } catch (err: any) {
      setChatError(err.message || 'Streaming failed.');
      setChatMessages(prev => {
        const next = [...prev];
        const targetMsg = next[assistantMsgIndex];
        if (targetMsg) {
          targetMsg.content = `⚠️ Chat stream interrupted: ${err.message || 'Server error'}`;
        }
        return next;
      });
    } finally {
      setChatStreaming(false);
      if (tourStep === 3) {
        setTourStep(null); // Complete tour!
      }
    }
  };


  // Mock Exam Grade Callback
  const handleExamGradeCompleted = (analysis: string, pathways: string[]) => {
    setGapAnalysis(analysis);
    setSuggestedPathways(pathways);
    setActiveRightTab('gaps');
    setRightSidebarOpen(true);
    fetchHistory();
    fetchDueCards();
  };

  // Load History Response
  const handleLoadHistoryItem = (historyItem: StudyHistoryItem) => {
    setChatMessages([
      { role: 'user', content: historyItem.query },
      { role: 'assistant', content: historyItem.response }
    ]);
    setActiveTab('chat');
    playSoundEffect('click');
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: chatStreaming ? 'auto' : 'smooth' });
  }, [chatMessages, chatStreaming]);

  // Session Study Time Tracker
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      setSessionStudyTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const formatStudyTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Pomodoro Focus Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0 && pomodoroActive) {
      setPomodoroActive(false);
      if (soundOn) {
        playSoundEffect('correct');
      }
      showToast('Focus interval completed! Take a break.', 'success');
      setPomodoroTime(25 * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoroActive, pomodoroTime, soundOn]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Custom Markdown customizer
  const renderMarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (!inline && language === 'mermaid') {
        return (
          <SafeErrorBoundary>
            <MermaidRenderer chart={String(children).replace(/\n$/, '')} />
          </SafeErrorBoundary>
        );
      }

      return !inline && match ? (
        <div className="rounded-lg overflow-hidden border border-border my-4 text-xs font-mono">
          <div className="bg-input px-4 py-1.5 flex justify-between items-center text-muted border-b border-border">
            <span>{language}</span>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus as any}
            language={language}
            PreTag="div"
            customStyle={{ margin: 0, background: 'var(--input)' }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-input border border-border rounded px-1.5 py-0.5 text-xs text-accent font-mono" {...props}>
          {children}
        </code>
      );
    }
  };

  // Filter Testimonials
  const filteredTestimonials = testimonials.filter(
    t => selectedReviewCategory === 'all' || t.category === selectedReviewCategory
  );

  // Loading Screen
  if (authChecking) {
    const zenithAds = [
      {
        sponsor: "Hostinger / Railway",
        title: "Deploy Zenith with 1-Click",
        desc: "Host PostgreSQL, pgvector, and Express containers globally. High-performance container cloud starting at $5/mo.",
        link: "https://railway.app"
      },
      {
        sponsor: "Notion Workspace",
        title: "AI-Powered Notes Integration",
        desc: "Organize folders, study guides, and flashcards. Notion Sync coming soon to Project Zenith.",
        link: "https://notion.so"
      },
      {
        sponsor: "Grammarly Partner",
        title: "Polish Academic Writing",
        desc: "Refine essays, citations, and research papers with premium AI suggestions. Academic writing simplified.",
        link: "https://grammarly.com"
      }
    ];

    const activeAd = zenithAds[loadingStep % zenithAds.length];

    return (
      <div className="min-h-screen bg-[#0d0d0e] flex flex-col justify-center items-center relative overflow-hidden font-sans">
        {/* Apple-style soft blurred ambient lights */}
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        
        {/* Glowing Logo */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-500/15 rounded-3xl blur-2xl"></div>
          <StudySphereLogo size="large" />
        </div>

        {/* Loading text container */}
        <div className="text-center space-y-4 max-w-sm px-4 z-10">
          <div className="h-6 overflow-hidden">
            <span className="text-[11px] text-muted font-bold tracking-widest uppercase block animate-fade-in-up" key={loadingStep}>
              {loadingMessages[loadingStep]}
            </span>
          </div>

          {/* Progressive Loading Line */}
          <div className="space-y-2">
            <div className="w-56 h-[3px] bg-secondary rounded-full overflow-hidden mx-auto border border-border">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-semibold text-muted block">{loadingProgress}% Complete</span>
          </div>
        </div>

        {/* Zenith Partners Ad Slot */}
        <div className="mt-8 max-w-sm w-full bg-secondary/35 border border-border/40 p-4 rounded-xl text-center relative overflow-hidden backdrop-blur-md shadow-2xl z-10 mx-4 animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#6366f1]/40 to-transparent" />
          <div className="flex justify-between items-center mb-1 text-[8px] font-bold text-[#6366f1] tracking-wider uppercase select-none">
            <span>Zenith Partner</span>
            <span>Sponsored</span>
          </div>
          <h4 className="text-[11px] font-bold text-foreground text-left flex items-center gap-1">
            <Zap className="h-3 w-3 text-[#6366f1]" />
            {activeAd.title}
          </h4>
          <p className="text-[9.5px] text-muted text-left leading-relaxed mt-1">
            {activeAd.desc}
          </p>
          <div className="text-[8px] font-mono text-muted text-right mt-2 select-none">
            {activeAd.sponsor} ↗
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // Competitor-Grade Landing Page (Unauthenticated View)
  // ========================================================
  if (!user || !viewingWorkspace) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-y-auto relative apple-grid">
        {/* Decorative Floating Orbits */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-orbit-slow z-0"></div>
        <div className="absolute top-[60%] right-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[130px] pointer-events-none animate-orbit-slower z-0"></div>
        
        {/* Navigation Bar */}
        <nav className="h-16 border-b border-border bg-secondary/80 backdrop-blur-md sticky top-0 z-50 px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <StudySphereLogo size="small" />
            <span className="hidden sm:inline font-bold text-sm tracking-tight text-foreground">StudySphere <span className="text-primary font-normal">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            {/* Lofi study music synth on landing page */}
            <button
              onClick={() => {
                setStudyMusicPlaying(prev => {
                  const next = !prev;
                  if (next) {
                    startLofiMusic();
                  } else {
                    stopLofiMusic();
                  }
                  return next;
                });
                playSoundEffect('click');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-[10.5px] font-bold transition transform hover:scale-105 active:scale-95 duration-200 ${
                studyMusicPlaying
                  ? 'bg-[#6366f1]/15 border-[#6366f1] text-[#6366f1] shadow-glow animate-pulse'
                  : 'hover:bg-input border-border/40 text-muted hover:text-foreground'
              }`}
              title="Study Lofi Synth Lounge"
            >
              <Headphones className={`h-3.5 w-3.5 ${studyMusicPlaying ? 'animate-bounce-slow' : ''}`} />
              <span>{studyMusicPlaying ? 'Lounge Active' : 'Study Lofi'}</span>
              {studyMusicPlaying && (
                <div className="flex items-center gap-0.5 h-2.5 ml-0.5">
                  <span className="wave-bar bg-[#6366f1]" style={{ animationDuration: '0.6s' }}></span>
                  <span className="wave-bar bg-[#6366f1]" style={{ animationDuration: '0.9s' }}></span>
                </div>
              )}
            </button>

            {/* Google Sign-In & Guest Access Navbar Block */}
            {user ? (
              <div className="flex items-center gap-3 bg-input/20 px-3.5 py-1 rounded-2xl border border-border/40 backdrop-blur shadow-sm animate-scale-in">
                {user.picture ? (
                  <img src={user.picture} alt={user.name || 'User'} className="w-6 h-6 rounded-full border border-primary/20" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/25 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-semibold text-foreground hidden sm:inline">{user.name || 'Student'}</span>
                <div className="h-4 w-[1px] bg-border/40 mx-1"></div>
                <button
                  onClick={() => { setViewingWorkspace(true); playSoundEffect('success'); }}
                  className="text-xs font-bold text-white transition bg-gradient-to-r from-primary to-accent hover:opacity-95 px-4 py-1.5 rounded-xl active:scale-95 duration-200 transform hover:scale-105"
                >
                  Enter Workspace
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border border-border/40 bg-input/10 px-3 py-1 rounded-2xl backdrop-blur shadow-sm">
                <div id="google-btn-container-nav" className="min-h-[36px] flex items-center justify-center"></div>
                <div className="h-4 w-[1px] bg-border/40 mx-1"></div>
                <button
                  onClick={() => { handleGuestLogin(); playSoundEffect('click'); }}
                  className="text-xs font-bold text-white transition bg-gradient-to-r from-primary to-accent hover:opacity-95 px-3.5 py-1.5 rounded-xl active:scale-95 duration-200 transform hover:scale-105"
                >
                  Guest<span className="hidden sm:inline"> Access</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative py-16 md:py-24 px-6 text-center max-w-4xl mx-auto space-y-6 z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-xs text-primary font-medium">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <span>Powered by Zenith AI Streaming</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight animate-fade-in-up">
            Study <span className="text-primary">Smarter, Faster</span>, and Relational
          </h1>
          
          <p className="text-xs md:text-sm text-muted max-w-xl mx-auto leading-relaxed text-muted-foreground animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            The professional AI workspace that synthesizes multiple code files, lecture slides, and text documents into active recall pathways, mock exams, and visual mind maps.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-6 max-w-sm mx-auto z-10 relative animate-scale-in" style={{ animationDelay: '200ms' }}>
            {user ? (
              <button
                onClick={() => { setViewingWorkspace(true); playSoundEffect('success'); }}
                className="w-full max-w-[280px] py-3.5 bg-gradient-to-r from-primary via-accent to-indigo-600 hover:opacity-95 text-white text-sm font-extrabold rounded-xl transition duration-300 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4" />
                <span>Go to Workspace</span>
              </button>
            ) : (
              <div className="w-full flex flex-col items-center gap-3.5">
                <div id="google-btn-container" className="min-h-[40px] flex items-center justify-center"></div>
                <div className="flex items-center gap-2.5 w-full max-w-[280px] select-none">
                  <div className="h-[1.5px] bg-border/40 flex-1"></div>
                  <span className="text-[9px] text-muted font-extrabold uppercase tracking-widest">or</span>
                  <div className="h-[1.5px] bg-border/40 flex-1"></div>
                </div>
                <button
                  onClick={() => { handleGuestLogin(); playSoundEffect('click'); }}
                  className="w-full max-w-[280px] py-3 bg-secondary hover:bg-input text-foreground border border-border/60 hover:border-border text-xs font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 active:scale-95 transform hover:scale-[1.02]"
                >
                  <Zap className="h-3.5 w-3.5 text-accent" />
                  <span>Start Studying Free (Guest)</span>
                </button>
              </div>
            )}
            <p className="text-[10px] text-muted">
              Sync across devices using secure Google login or proceed instantly as a guest.
            </p>
          </div>

          {/* Premium Workspace AI Image Mockup */}
          <div className="pt-8 max-w-3xl mx-auto w-full animate-fade-in-up">
            <div className="relative rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-secondary/20 backdrop-blur-md p-1.5 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5 pointer-events-none rounded-2xl"></div>
              <img 
                src="/assets/hero_workspace.png" 
                alt="StudySphere AI Premium Workspace" 
                className="w-full h-auto rounded-xl border border-border/40 group-hover:scale-[1.01] transition-transform duration-700 ease-out" 
              />
            </div>
          </div>
        </header>

        {/* Statistics Grid */}
        <section className="pb-16 px-6 max-w-4xl mx-auto w-full z-10 animate-fade-in-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "50MB+", label: "Max File Ingest", desc: "PDFs, slides & repos" },
              { val: "10k+", label: "Study Binders", desc: "Active workspaces" },
              { val: "99.4%", label: "Accuracy Rate", desc: "Semantic retrieval" },
              { val: "SM-2", label: "Recall Algorithm", desc: "Spaced repetition" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-secondary/40 border border-border p-4 rounded-xl text-center space-y-1 hover:border-primary transition duration-300">
                <span className="text-xl md:text-2xl font-extrabold text-primary block">{stat.val}</span>
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wider block">{stat.label}</span>
                <span className="text-[9px] text-muted block">{stat.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Features Walkthrough */}
        <section className="py-12 bg-secondary border-y border-border px-6 max-w-5xl mx-auto w-full rounded-2xl z-10">
          <div className="text-center space-y-1 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Interactive Feature Walkthrough</h2>
            <p className="text-xs text-muted">Click through the study phases below to preview how our platform accelerates learning.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Steps Navigation */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {tutorialSteps.map((step, idx) => {
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setActiveTutorialTab(step.id as any);
                      setTutorialStepIndex(idx);
                      playSoundEffect('click');
                    }}
                    className={`p-3 rounded-xl border text-left transition ${
                      activeTutorialTab === step.id
                        ? 'bg-background border-primary shadow-sm'
                        : 'bg-transparent border-transparent hover:border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${activeTutorialTab === step.id ? 'bg-primary/15 border-primary/20 text-primary' : 'bg-input border-border text-muted'}`}>
                        {idx === 0 && <Upload className="h-4 w-4" />}
                        {idx === 1 && <MessageSquare className="h-4 w-4" />}
                        {idx === 2 && <Layers className="h-4 w-4" />}
                        {idx === 3 && <Award className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{step.title}</h4>
                        <p className="text-[10px] text-muted leading-normal mt-0.5">
                          {idx === 0 && 'Securely upload PDFs, DOCX, and code files up to 50MB with semantic text parsing.'}
                          {idx === 1 && 'Query your binder, ask formulas, and auto-compile interactive Mermaid diagrams.'}
                          {idx === 2 && 'Recall cards graded dynamically and scheduled using the SM-2 spaced repetition algorithm.'}
                          {idx === 3 && 'Simulate coding challenges, MCQ and conceptual queries. Get real-time gap reviews.'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Step counter with stepper controls */}
              <div className="flex justify-between items-center pt-2 px-1 mt-2">
                <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Step {tutorialStepIndex + 1} of 4</span>
                <button
                  onClick={() => {
                    const nextIndex = (tutorialStepIndex + 1) % 4;
                    setTutorialStepIndex(nextIndex);
                    setActiveTutorialTab(tutorialSteps[nextIndex].id as any);
                    playSoundEffect('click');
                  }}
                  className="px-3 py-1 bg-input hover:bg-secondary text-primary text-[10px] font-bold rounded-lg border border-border transition"
                >
                  Next Preview Step →
                </button>
              </div>
            </div>

            {/* Visual Preview Panel */}
            <div className="lg:col-span-8 bg-background border border-border rounded-2xl p-6 flex flex-col justify-center min-h-[250px] relative overflow-hidden animate-fade-in-up">
              {activeTutorialTab === 'ingest' && (
                <div className="space-y-4 relative">
                  {/* Glowing Laser Scan VFX */}
                  <div className="scan-line"></div>
                  
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs font-bold text-foreground">Ingested Lecture Files</span>
                    <span className="text-[9px] px-2 py-0.5 bg-input border border-border rounded text-muted">CS_Algorithm_Data.pdf</span>
                  </div>
                  <div className="p-4 border-2 border-dashed border-border bg-input/40 rounded-xl text-center space-y-2 relative">
                    <Upload className="h-6 w-6 text-primary mx-auto" />
                    <p className="text-xs font-semibold text-foreground">File upload complete (1.4 MB)</p>
                    <div className="w-1/2 mx-auto bg-input h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[9px] text-muted block">Parsed 4 semantic sections, 1,280 tokens extracted</span>
                  </div>
                </div>
              )}

              {activeTutorialTab === 'chat' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2 bg-input border border-border rounded-lg text-foreground">
                    <span className="text-primary font-bold block text-[10px] mb-0.5">User request:</span>
                    Explain microservices and generate a layout diagram
                  </div>
                  <div className="p-3 bg-secondary border border-border rounded-lg text-foreground space-y-2">
                    <span className="text-accent font-bold block text-[10px]">StudySphere AI response:</span>
                    <p className="text-[10.5px] leading-relaxed typing-caret">
                      {chatDemoText || 'Thinking...'}
                    </p>
                    {chatDemoText.length > 30 && (
                      <div className="bg-input p-2.5 rounded border border-border text-[9px] text-muted animate-fade-in-up">
                        graph TD;<br />
                        &nbsp;&nbsp;API_Gateway --&gt; Auth_Service;<br />
                        &nbsp;&nbsp;API_Gateway --&gt; Study_Service;
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTutorialTab === 'srs' && (
                <div className="space-y-4 max-w-xs mx-auto w-full text-center">
                  <span className="text-[10px] text-muted block">Click card below to test interactive flip</span>
                  <div 
                    onClick={() => {
                      setTutorialCardFlipped(!tutorialCardFlipped);
                      playSoundEffect('flip');
                    }}
                    className="w-full h-36 cursor-pointer perspective-1000 group"
                  >
                    <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${tutorialCardFlipped ? 'rotate-y-180' : ''}`}>
                      {/* Front Side */}
                      <div className="absolute inset-0 w-full h-full backface-hidden bg-secondary border border-border rounded-xl flex flex-col justify-between p-4 shadow-lg text-left">
                        <span className="text-[9px] uppercase font-bold text-primary tracking-wider">Active Recall Prompt</span>
                        <p className="text-xs font-semibold text-foreground leading-relaxed mt-1">What is the space complexity of binary search?</p>
                        <span className="text-[8px] text-muted text-center block w-full mt-1">Click to reveal answer</span>
                      </div>
                      {/* Back Side */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-input border border-border rounded-xl flex flex-col justify-between p-4 shadow-xl text-left">
                        <span className="text-[9px] uppercase font-bold text-accent tracking-wider">Solution / Details</span>
                        <p className="text-xs font-semibold text-foreground leading-relaxed mt-1">O(1) auxiliary space, as it only requires pointers regardless of input size.</p>
                        <span className="text-[8px] text-muted text-center block w-full mt-1">Click to show question</span>
                      </div>
                    </div>
                  </div>
                  {tutorialCardFlipped && (
                    <div className="grid grid-cols-3 gap-2 animate-fade-in-up">
                      <button onClick={(e) => { e.stopPropagation(); playSoundEffect('click'); }} className="py-1 bg-red-950/20 border border-red-900/30 rounded-lg text-[9px] text-red-400 hover:bg-red-900/40 transition">Forgot (0)</button>
                      <button onClick={(e) => { e.stopPropagation(); playSoundEffect('click'); }} className="py-1 bg-yellow-950/20 border border-yellow-900/30 rounded-lg text-[9px] text-yellow-400 hover:bg-yellow-900/40 transition">Hard (2)</button>
                      <button onClick={(e) => { e.stopPropagation(); playSoundEffect('click'); }} className="py-1 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-[9px] text-emerald-400 hover:bg-emerald-900/40 transition">Good (3)</button>
                    </div>
                  )}
                </div>
              )}

              {activeTutorialTab === 'exams' && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-input p-2.5 rounded-lg border border-border">
                    <span className="font-semibold text-foreground">Evaluating Responses...</span>
                    <span className="text-accent font-bold text-xs">{examScoreProgress}%</span>
                  </div>
                  
                  {/* Score Progress Bar */}
                  <div className="w-full bg-input h-2 rounded-full overflow-hidden border border-border">
                    <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-100" style={{ width: `${examScoreProgress}%` }} />
                  </div>

                  {examScoreProgress === 80 && (
                    <div className="bg-secondary border border-border rounded-lg p-3 space-y-1 animate-fade-in-up">
                      <span className="font-semibold text-accent block text-[10px]">Adaptive Gap Review:</span>
                      <p className="text-[10px] text-muted leading-normal">You correctly answered memory allocations, but showed confusion over heap vs stack data references in pointers.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Real Student Reviews Grid */}
        <section className="py-12 px-6 max-w-4xl mx-auto w-full space-y-6 z-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Loved by Students</h2>
            <p className="text-xs text-muted">See how students across disciplines optimize their exam prep and research pipelines.</p>
            
            {/* Category Filters */}
            <div className="flex justify-center gap-1.5 pt-2 flex-wrap">
              {['all', 'stem', 'humanities', 'law'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedReviewCategory(cat as any); playSoundEffect('click'); }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-semibold capitalize transition ${
                    selectedReviewCategory === cat
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'bg-input border border-border text-muted hover:text-foreground'
                  }`}
                >
                  {cat === 'all' ? 'All Reviews' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTestimonials.map((test, index) => (
              <div key={index} className="bg-secondary/40 border border-border p-4 rounded-xl space-y-2.5 flex flex-col justify-between hover:border-primary transition">
                <p className="text-[11px] text-muted leading-relaxed italic">"{test.text}"</p>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="text-[10.5px]">
                    <span className="font-bold text-foreground block">{test.name}</span>
                    <span className="text-[9.5px] text-muted">{test.role}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product Comparison Matrix */}
        <section className="py-12 bg-secondary/20 border-t border-border px-6 max-w-5xl mx-auto w-full space-y-6 z-10">
          <div className="text-center space-y-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Zenith AI vs. Best Study Tools</h2>
            <p className="text-xs text-muted">Why Zenith AI is the ultimate choice for stateful study synthesis.</p>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full border-collapse text-left text-xs text-muted">
              <thead>
                <tr className="bg-input border-b border-border">
                  <th className="p-3 font-semibold text-foreground">Features</th>
                  <th className="p-3 font-semibold text-primary">Zenith AI (StudySphere)</th>
                  <th className="p-3 font-semibold text-muted">NotebookLM</th>
                  <th className="p-3 font-semibold text-muted">Mindgrasp AI</th>
                  <th className="p-3 font-semibold text-muted">Quizlet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="p-3 text-foreground/90 font-medium">Multi-file RAG Indexing</td>
                  <td className="p-3 text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> 50MB Binder + Web Crawler</td>
                  <td className="p-3 text-muted">Multi-doc files (No URL crawler)</td>
                  <td className="p-3 text-muted">Basic single file summarization</td>
                  <td className="p-3 text-muted">Manual flashcard sets only</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/90 font-medium">Active Recall (SM-2 Cards)</td>
                  <td className="p-3 text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Relational Postgres DB Sync</td>
                  <td className="p-3 text-muted">No database sync or recall engine</td>
                  <td className="p-3 text-muted">Static summaries per document</td>
                  <td className="p-3 text-muted">Standard flashcards (No AI prompts)</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/90 font-medium">Organic Conversational Review</td>
                  <td className="p-3 text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Interactive Voice Pods</td>
                  <td className="p-3 text-muted">Studio Audio Pods (Static)</td>
                  <td className="p-3 text-muted">Simple TTS reading (no interaction)</td>
                  <td className="p-3 text-muted">No speech synthesis or reviews</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/90 font-medium">Adaptive Mock Exam Engine</td>
                  <td className="p-3 text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Gap Reviews & Weakness Tracking</td>
                  <td className="p-3 text-muted">No practice exams or grading stats</td>
                  <td className="p-3 text-muted">Static multiple-choice questions</td>
                  <td className="p-3 text-muted">Basic practice tests (no doc analysis)</td>
                </tr>
                <tr>
                  <td className="p-3 text-foreground/90 font-medium">HTTP-only Session Security</td>
                  <td className="p-3 text-emerald-500 font-semibold flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Hardened OAuth & Cookies</td>
                  <td className="p-3 text-muted">Standard Google accounts</td>
                  <td className="p-3 text-muted">Local-storage JWT cookies (Vuln)</td>
                  <td className="p-3 text-muted">Basic web session trackers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-border text-center text-[10px] text-muted">
          <p>© 2026 StudySphere AI. Production workspace active. Powered by Zenith Generative AI.</p>
        </footer>

      </div>
    );
  }

  // ========================================================
  // Simplified Three-Column Study Workspace (Authenticated View)
  // ========================================================
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      
      {/* Top Banner Header */}
      <header className="h-20 border-b border-border/30 bg-secondary/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 flex justify-between items-center shadow-lg shadow-black/2 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3.5">
          {/* Left panel menu toggler */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-input border border-border/45 rounded-2xl text-muted hover:text-foreground transition transform hover:scale-105 active:scale-95 duration-200"
            title="Toggle Binders Panel"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <StudySphereLogo size="medium" />
            <h1 className="hidden sm:inline font-extrabold text-base tracking-tight text-foreground">StudySphere <span className="text-primary font-light">AI</span></h1>
          </div>
        </div>

        {/* Focus & Streak Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Theme switcher */}
          <button
            onClick={() => {
              setTheme(prev => prev === 'light' ? 'dark' : 'light');
              playSoundEffect('click');
            }}
            className="p-2 hover:bg-input border border-border/40 rounded-xl text-muted hover:text-foreground transition transform hover:scale-105 active:scale-95 duration-200"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="h-4.5 w-4.5 text-accent" /> : <Sun className="h-4.5 w-4.5 text-accent" />}
          </button>

          {/* Lofi Study Music Synth */}
          <button
            onClick={() => {
              setStudyMusicPlaying(prev => {
                const next = !prev;
                if (next) {
                  startLofiMusic();
                } else {
                  stopLofiMusic();
                }
                return next;
              });
              playSoundEffect('click');
            }}
            className={`hidden sm:flex p-2 border rounded-xl transition transform hover:scale-105 active:scale-95 duration-200 items-center gap-1.5 ${
              studyMusicPlaying
                ? 'bg-[#6366f1]/15 border-[#6366f1] text-[#6366f1]'
                : 'hover:bg-input border-border/40 text-muted hover:text-foreground'
            }`}
            title="Study Lofi Ambient Synth"
          >
            <Headphones className={`h-4.5 w-4.5 ${studyMusicPlaying ? 'animate-bounce' : ''}`} />
            {studyMusicPlaying && (
              <div className="flex items-center gap-0.5 h-3 ml-0.5">
                <span className="wave-bar" style={{ animationDuration: '0.6s' }}></span>
                <span className="wave-bar" style={{ animationDuration: '0.9s' }}></span>
                <span className="wave-bar" style={{ animationDuration: '0.7s' }}></span>
              </div>
            )}
          </button>

          {/* Pomodoro Focus Timer */}
          <div className="hidden sm:flex items-center bg-input border border-border/45 rounded-xl px-3 py-1.5 text-xs gap-2.5 shadow-inner">
            <Clock className="h-4 w-4 text-primary animate-pulse" />
            <span className="font-mono text-foreground font-medium">{formatTimer(pomodoroTime)}</span>
            <div className="flex items-center gap-1.5 border-l border-border/40 pl-2.5 ml-1.5">
              <button
                onClick={() => setPomodoroActive(!pomodoroActive)}
                className="text-muted hover:text-foreground transition transform hover:scale-110 active:scale-90"
              >
                {pomodoroActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setPomodoroTime(25 * 60)}
                className="text-muted hover:text-foreground transition transform hover:scale-110 active:scale-90"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="text-muted hover:text-foreground transition transform hover:scale-110 active:scale-90"
              >
                {soundOn ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Session Study Time Timer */}
          <div className="hidden sm:flex items-center bg-input border border-border/45 rounded-xl px-3 py-1.5 text-xs gap-2 shadow-inner" title="Active Study Session Time">
            <Clock className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
            <span className="font-mono text-foreground font-medium">
              {formatStudyTime(sessionStudyTime)}
            </span>
          </div>

          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 bg-input border border-border/45 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-purple-400 shadow-inner">
            <span>🔥</span>
            <span>{streak}d</span>
          </div>

          {/* Tour Trigger */}
          <button
            onClick={() => { setTourStep(1); playSoundEffect('click'); }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-input hover:bg-secondary text-primary border border-border/45 rounded-xl text-xs font-semibold transition transform hover:scale-105 active:scale-95 duration-200"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Guided Tour</span>
          </button>

          <button
            onClick={() => { setShowMemoryModal(true); playSoundEffect('click'); }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-input hover:bg-secondary text-accent border border-border/45 rounded-xl text-xs font-semibold transition transform hover:scale-105 active:scale-95 duration-200"
            title="Configure Personal AI Memory"
          >
            <Brain className="h-4 w-4 text-accent" />
            <span className="hidden md:inline">AI Memory</span>
          </button>

          {/* Admin Dashboard Switcher */}
          {user?.email === 'epicarkplayerpt@gmail.com' && (
            <button
              onClick={() => {
                setActiveTab(activeTab === 'admin' ? 'chat' : 'admin');
                playSoundEffect('click');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 border rounded-xl text-xs font-semibold transition transform hover:scale-105 active:scale-95 duration-200 ${
                activeTab === 'admin'
                  ? 'bg-primary/15 border-primary text-primary shadow-glow'
                  : 'bg-input hover:bg-secondary border-border/45 text-muted hover:text-foreground'
              }`}
              title="Toggle Dashboard Metrics & Prompts"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Admin View</span>
            </button>
          )}

          {/* Right Sidebar toggle */}
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="p-2 hover:bg-input border border-border/40 rounded-xl text-muted hover:text-foreground transition transform hover:scale-105 active:scale-95 duration-200"
            title="Toggle Document Viewer & Stats"
          >
            <History className="h-4.5 w-4.5" />
          </button>

          {/* Quick Start Tour */}
          <button
            onClick={() => { setTourStep(1); playSoundEffect('click'); }}
            className="hidden md:flex p-2 hover:bg-input border border-border/40 rounded-xl text-muted hover:text-foreground transition transform hover:scale-105 active:scale-95 duration-200"
            title="Start Onboarding Tour"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-input/10 hover:bg-red-500/10 border border-border/40 hover:border-red-500/30 rounded-xl text-muted hover:text-red-500 transition transform hover:scale-105 active:scale-95 duration-200"
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ======================================================== */}
        {/* COLUMN 1: LEFT SIDEBAR (Binders, Dropzone, SRS navigation) */}
        {/* ======================================================== */}
        <aside className={`fixed inset-y-0 left-0 w-72 bg-secondary border-r border-border flex flex-col transform transition-all duration-300 ease-out lg:relative lg:translate-x-0 ${
          (tourStep === 2 || tourStep === 3) ? 'z-[9991] translate-x-0' : 'z-50'
        } ${sidebarOpen ? 'translate-x-0 lg:w-72 lg:border-r' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0 lg:overflow-hidden'}`}>
          
          {/* Study Chats Header */}
          <div className="p-3 border-b border-border flex justify-between items-center flex-shrink-0 bg-input/20">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Study Chats</span>
            <div className="flex items-center gap-1.5">
              <button
                id="tour-step-binders"
                onClick={() => setShowAddBinder(!showAddBinder)}
                className={`p-1 hover:bg-input border border-border rounded text-muted hover:text-primary transition ${tourStep === 2 ? 'tour-pulse-active border-primary relative z-[9992] bg-secondary' : ''}`}
                title="New Chat Session"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              {/* Close sidebar button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-input border border-border rounded text-muted hover:text-foreground transition lg:hidden"
                title="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add Chat Session form inline */}
          {showAddBinder && (
            <form onSubmit={handleCreateBinder} className="p-3 border-b border-border space-y-2 bg-input/40 animate-fade-in-up">
              <input
                type="text"
                value={newBinderName}
                onChange={(e) => setNewBinderName(e.target.value)}
                placeholder="Chat Session Name (e.g. Biology Quiz)..."
                required
                className="w-full bg-input border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end gap-1.5 text-[10px]">
                <button type="button" onClick={() => setShowAddBinder(false)} className="px-2 py-1 text-muted hover:text-foreground">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-primary text-primary-foreground rounded font-bold transition">Start Chat</button>
              </div>
            </form>
          )}

          {/* Chat Session Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1 max-h-[35vh] border-b border-border">
            {binders.length === 0 ? (
              <div className="text-center py-4 text-xs text-muted">No chats. Start one to begin.</div>
            ) : (
              binders.map(binder => (
                <div
                  key={binder.id}
                  onClick={() => setSelectedBinderId(binder.id)}
                  className={`group relative flex items-center justify-between p-2 pl-3.5 rounded-xl cursor-pointer transition ${
                    selectedBinderId === binder.id
                      ? 'bg-primary/10 border border-primary/20 text-foreground font-semibold shadow-glow-sm'
                      : 'border border-transparent hover:bg-input text-muted hover:text-foreground'
                  }`}
                >
                  {selectedBinderId === binder.id && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gradient-to-b from-primary to-accent rounded-r" />
                  )}
                  <div className="flex items-center gap-2 truncate pr-2">
                    <MessageSquare className={`h-4 w-4 flex-shrink-0 ${selectedBinderId === binder.id ? 'text-primary' : 'text-muted'}`} />
                    <span className="text-xs truncate">{binder.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 bg-input border border-border rounded text-muted font-normal">
                      {binder._count?.documents || 0}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteBinder(binder.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-input text-muted hover:text-red-500 rounded transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Context Files Ingestion & Manager */}
          <div className="flex-[1.5] flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-input/20 flex items-center justify-between flex-shrink-0">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Study Files</span>
              {selectedBinderId && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 hover:bg-input border border-border rounded text-muted hover:text-primary transition flex items-center gap-1 text-[9px]"
                  title="Upload context files"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add File</span>
                </button>
              )}
            </div>

            <div className="p-3 flex-1 flex flex-col overflow-y-auto space-y-3">
              {/* Uploading progress status list */}
              {Object.keys(uploads).length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {Object.values(uploads).map((up) => {
                    const pct = up.total > 0 ? Math.round((up.loaded / up.total) * 100) : 0;
                    return (
                      <div key={up.name} className="bg-input border border-border p-2 rounded-lg space-y-1 relative">
                        <button onClick={() => clearUploadProgressItem(up.name)} className="absolute top-1 right-1 text-muted hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                        <div className="flex items-center gap-1 pr-3 truncate">
                          <FileText className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          <span className="text-[9.5px] font-medium text-foreground truncate" title={up.name}>{up.name}</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between items-center text-[7.5px] text-muted">
                            <span>
                              {up.status === 'uploading' && `Uploading: ${pct}%`}
                              {up.status === 'extracting' && 'Extracting...'}
                              {up.status === 'completed' && 'Ingested'}
                              {up.status === 'failed' && <span className="text-red-400">Failed</span>}
                            </span>
                            <span>{Math.round(up.loaded / 1024)} KB</span>
                          </div>
                          {up.status === 'uploading' && (
                            <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                              <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ingested Documents List */}
              {selectedBinderId ? (
                <div className="space-y-1 flex-1">
                  {documents.length === 0 ? (
                    <div className="text-center py-6 text-[10px] text-muted border border-dashed border-border/60 rounded-xl p-4 space-y-2">
                      <FileText className="h-8 w-8 text-muted/30 mx-auto" />
                      <p>No documents in this session.</p>
                      <p className="text-[9px] text-muted-foreground leading-normal">
                        Click the paperclip button in the chat or drag & drop files here to upload.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-input/40 border border-border hover:bg-input transition text-xs text-muted hover:text-foreground">
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            <FileText className={`h-3.5 w-3.5 ${getFileIconColor(doc.name)} flex-shrink-0`} />
                            <span className="truncate text-[10px]" title={doc.name}>{doc.name}</span>
                          </div>
                          <div className="flex items-center gap-1 relative">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTranslationDropdown(activeTranslationDropdown === doc.id ? null : doc.id);
                                }}
                                className="p-0.5 hover:bg-secondary text-muted hover:text-emerald-500 rounded transition flex items-center justify-center"
                                title="Translate Document"
                                disabled={translatingDocId === doc.id}
                              >
                                {translatingDocId === doc.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                                ) : (
                                  <Languages className="h-3 w-3" />
                                )}
                              </button>
                              
                              {activeTranslationDropdown === doc.id && (
                                <div className="absolute right-0 bottom-6 bg-secondary border border-border rounded-lg shadow-xl p-1 z-50 flex flex-col gap-0.5 min-w-[100px] animate-scale-in">
                                  {['English', 'Spanish', 'French', 'German', 'Chinese'].map(lang => (
                                    <button
                                      key={lang}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTranslateDocument(doc.id, doc.name, lang);
                                        setActiveTranslationDropdown(null);
                                      }}
                                      className="px-2 py-1 hover:bg-input rounded text-[10px] text-left text-muted hover:text-foreground font-semibold"
                                    >
                                      {lang}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewDocumentText(doc.id, doc.name); }}
                              className="p-0.5 hover:bg-secondary text-muted hover:text-primary rounded transition"
                              title="Read File"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}
                              className="p-0.5 hover:bg-secondary text-muted hover:text-red-500 rounded transition"
                              title="Delete File"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-border rounded-xl p-3 text-center text-xs text-muted bg-input/20">
                  Select or start a chat session to upload files.
                </div>
              )}
            </div>
          </div>

          {/* Spaced Repetition Card Navigation */}
          {/* Smart Study Cards Navigation */}
          <div className="p-3 bg-input/10 border-t border-border flex-shrink-0">
            <div className="bg-secondary border border-border p-3 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-foreground">Smart Study Cards</span>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${dueCardsCount > 0 ? 'bg-red-950/20 border border-red-900/35 text-red-400' : 'bg-input border border-border text-muted'}`}>
                  {dueCardsCount} due
                </span>
              </div>
              <button
                onClick={() => { 
                  setActiveRightTab('srs'); 
                  setRightSidebarOpen(true); 
                  playSoundEffect('click'); 
                  if (window.innerWidth < 1024) setSidebarOpen(false); 
                }}
                className="w-full py-1.5 bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] text-[11px] font-bold rounded-lg transition shadow flex items-center justify-center gap-1"
              >
                <span>Review Smart Study Cards</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Study Weakness Finder Navigation */}
          <div className="p-3 bg-input/10 border-t border-border flex-shrink-0">
            <div className="bg-secondary border border-border p-3 rounded-xl flex flex-col gap-2">
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Study Weakness Finder
              </span>
              <button
                onClick={handleRunGapAnalysis}
                disabled={!selectedBinderId || documentLoading}
                className="w-full py-1.5 bg-secondary hover:bg-input border border-border text-foreground text-[11px] font-bold rounded-lg transition active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {documentLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : (
                  <Zap className="h-3.5 w-3.5 text-primary" />
                )}
                <span>Find Study Weaknesses</span>
              </button>
            </div>
          </div>

          {/* Mobile Quick Actions (only visible on mobile/tablet viewports) */}
          <div className="p-3 bg-input/20 border-t border-border flex-shrink-0 sm:hidden space-y-2.5">
            <span className="text-[9px] font-bold text-muted uppercase tracking-widest block pl-1">Mobile Quick Actions</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setShowMemoryModal(true); playSoundEffect('click'); setSidebarOpen(false); }}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-secondary hover:bg-input text-accent border border-border/45 rounded-xl text-[10.5px] font-bold transition duration-200"
                title="Configure Personal AI Memory"
              >
                <Brain className="h-3.5 w-3.5 text-accent" />
                <span>AI Memory</span>
              </button>

              <button
                onClick={() => { setTourStep(1); playSoundEffect('click'); setSidebarOpen(false); }}
                className="flex items-center justify-center gap-1.5 py-2 px-2 bg-secondary hover:bg-input text-primary border border-border/45 rounded-xl text-[10.5px] font-bold transition duration-200"
              >
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                <span>Guided Tour</span>
              </button>

              <button
                onClick={() => {
                  setStudyMusicPlaying(prev => {
                    const next = !prev;
                    if (next) startLofiMusic();
                    else stopLofiMusic();
                    return next;
                  });
                  playSoundEffect('click');
                }}
                className={`col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 border rounded-xl text-[10.5px] font-bold transition duration-200 ${
                  studyMusicPlaying
                    ? 'bg-[#6366f1]/15 border-[#6366f1] text-[#6366f1]'
                    : 'bg-secondary hover:bg-input border-border/45 text-muted hover:text-foreground'
                }`}
              >
                <Headphones className={`h-3.5 w-3.5 ${studyMusicPlaying ? 'animate-bounce' : ''}`} />
                <span>{studyMusicPlaying ? 'Stop Lofi Music' : 'Start Lofi Music'}</span>
              </button>

              {user?.email === 'epicarkplayerpt@gmail.com' && (
                <button
                  onClick={() => {
                    setActiveTab(activeTab === 'admin' ? 'chat' : 'admin');
                    playSoundEffect('click');
                    setSidebarOpen(false);
                  }}
                  className={`col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 border rounded-xl text-[10.5px] font-bold transition duration-200 ${
                    activeTab === 'admin'
                      ? 'bg-primary/15 border-primary text-primary shadow-glow'
                      : 'bg-secondary hover:bg-input border-border/45 text-muted hover:text-foreground'
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Admin View</span>
                </button>
              )}
            </div>
          </div>

        </aside>

        {/* Sidebar overlay backdrop on mobile screens */}
        <div 
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-all duration-300 ease-out ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />

        {/* ======================================================== */}
        {/* COLUMN 2: CENTRAL WORKSPACE (Active Tab view)           */}
        {/* ======================================================== */}
        <main className={`flex-1 flex-col overflow-hidden bg-background border-r border-border/40 ${mobileTab === 'workbench' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Mobile Workspace Tabs Switcher */}
          <div className="flex lg:hidden bg-secondary border-b border-border p-2 flex-shrink-0 gap-2">
            <button
              onClick={() => { setMobileTab('workbench'); playSoundEffect('click'); }}
              type="button"
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mobileTab === 'workbench'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted hover:bg-input hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Source Workbench</span>
            </button>
            <button
              onClick={() => { setMobileTab('chat'); playSoundEffect('click'); }}
              type="button"
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mobileTab === 'chat'
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted hover:bg-input hover:text-foreground'
              }`}
            >
              <Sparkles className="h-4 w-4 animate-pulse text-accent" />
              <span>Zenith Chat</span>
            </button>
          </div>
          {activeTab === 'admin' && user?.email === 'epicarkplayerpt@gmail.com' ? (
            <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full h-full min-h-0 overflow-y-auto relative">
              <AdminMetricsView 
                metrics={adminMetrics}
                error={adminError}
                showToast={showToast}
                playSoundEffect={playSoundEffect}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Workbench Header & Tab Swapper */}
              <div className="border-b border-border bg-input/10 flex items-center justify-between p-3 flex-shrink-0">
                <div 
                  id="tour-step-tools"
                  className={`flex overflow-x-auto gap-1.5 scrollbar-none p-1 ${tourStep === 4 ? 'tour-pulse-active border border-primary p-1 rounded-lg relative z-[9992] bg-secondary' : ''}`}
                >
                  {[
                    { id: 'viewer', label: 'PDF/Content Reader', icon: FileText },
                    { id: 'guide', label: 'Study Syllabus', icon: BookMarked },
                    { id: 'podcast', label: 'Audio Briefing', icon: Headphones },
                    { id: 'srs', label: 'Active Recall Cards', icon: Layers },
                    { id: 'quiz', label: 'Practice Quiz', icon: Award },
                    { id: 'gaps', label: 'Weakness Finder', icon: TrendingUp },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeRightTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveRightTab(tab.id as any); playSoundEffect('click'); }}
                        className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap transform active:scale-95 duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10'
                            : 'text-muted hover:bg-input hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Right panel toggle in header */}
                <button
                  onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                  className="p-2 hover:bg-input border border-border/40 rounded-xl text-muted hover:text-foreground transition transform hover:scale-105 active:scale-95 duration-200 lg:hidden"
                  title="Toggle Chat sidebar"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Sandboxed Interactive App Container */}
              <div className="flex-1 overflow-y-auto flex flex-col min-h-0 bg-input/5">
                <SandboxedApp appName={activeRightTab}>
                  {/* 1. Document Reader */}
                  {activeRightTab === 'viewer' && (
                    <div className="flex-1 flex flex-col min-h-0 bg-input/5 animate-fade-in">
                      <div className="p-4 border-b border-border bg-input/10 flex items-center justify-between flex-shrink-0">
                        <span className="text-xs font-bold text-foreground truncate max-w-[280px] sm:max-w-[400px]">
                          {selectedDocumentName || 'Source Document'}
                        </span>
                        {selectedDocumentText && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedDocumentText);
                              playSoundEffect('correct');
                              showToast('Copied document text to clipboard!', 'success');
                            }}
                            className="text-[10px] px-3 py-1 bg-input border border-border hover:bg-secondary text-foreground rounded-lg font-semibold transition"
                          >
                            Copy All
                          </button>
                        )}
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap selection:bg-primary/20 select-text">
                        {documentLoading ? (
                          <div className="flex flex-col justify-center items-center py-32 gap-3 text-muted">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="text-xs uppercase tracking-widest font-semibold">Extracting text layout...</span>
                          </div>
                        ) : selectedDocumentText ? (
                          <div className="p-4 bg-input border border-border rounded-2xl font-mono text-xs max-h-[70vh] overflow-y-auto leading-normal">
                            {selectedDocumentText}
                          </div>
                        ) : (
                          <div className="text-center py-28 text-muted space-y-3 px-6 max-w-md mx-auto">
                            <FileText className="h-10 w-10 text-muted/50 mx-auto" />
                            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">No Document Selected</h4>
                            <p className="text-xs leading-normal">Select the preview icon next to any document in the sidebar to review its text chunks.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. Study Guide / Syllabus */}
                  {activeRightTab === 'guide' && (
                    <div className="p-6 space-y-5 animate-fade-in max-w-4xl mx-auto w-full">
                      <div className="flex justify-between items-center border-b border-border pb-3">
                        <span className="text-xs font-bold text-foreground">Binder Study Syllabus</span>
                        {selectedBinderId && documents.length > 0 && (
                          <button
                            onClick={handleGenerateStudyGuide}
                            disabled={sourceGuideLoading}
                            className="px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-bold disabled:bg-secondary disabled:text-muted transition flex items-center gap-1.5"
                          >
                            {sourceGuideLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                            <span>Generate Syllabus</span>
                          </button>
                        )}
                      </div>

                      {!selectedBinderId ? (
                        <div className="text-center py-16 bg-secondary/50 border border-border rounded-2xl">
                          <span className="text-xs text-muted">Select a Document Binder in the sidebar to compile syllabus.</span>
                        </div>
                      ) : documents.length === 0 ? (
                        <div className="text-center py-16 bg-secondary/50 border border-border rounded-2xl space-y-2">
                          <FileText className="h-8 w-8 text-muted mx-auto" />
                          <p className="text-xs text-muted">No documents in binder. Upload files to generate a syllabus.</p>
                        </div>
                      ) : sourceGuideLoading ? (
                        <div className="flex flex-col justify-center items-center py-20 gap-3 bg-secondary/35 border border-border rounded-2xl">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          <span className="text-xs text-foreground font-semibold">Analyzing binder files...</span>
                          <span className="text-[10px] text-muted text-center max-w-[280px]">Structuring core review guides, FAQS, glossaries and active recall landmarks</span>
                        </div>
                      ) : sourceGuideText ? (
                        <div className="space-y-4 animate-fade-in-up">
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(sourceGuideText);
                                playSoundEffect('correct');
                                showToast('Copied study syllabus to clipboard!', 'success');
                              }}
                              className="px-3 py-1.5 bg-input border border-border hover:bg-secondary text-xs text-foreground rounded-lg flex items-center gap-1.5 font-semibold transition"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy Markdown</span>
                            </button>
                          </div>
                          <div className="glass-panel p-6 rounded-2xl shadow-md academic-prose text-sm max-h-[70vh] overflow-y-auto bg-input/40 border border-border select-text">
                            <SafeErrorBoundary>
                              <ReactMarkdown components={renderMarkdownComponents} remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}>
                                {sourceGuideText}
                              </ReactMarkdown>
                            </SafeErrorBoundary>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-secondary/50 border border-border rounded-2xl space-y-3 max-w-sm mx-auto">
                          <BookMarked className="h-10 w-10 text-primary/45 mx-auto animate-pulse" />
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Generate Syllabus</h4>
                          <p className="text-xs text-muted leading-relaxed">
                            Generate core concept reviews, FAQs, and terminology glossaries from all files in this binder.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. AI Podcast / Audio Review */}
                  {activeRightTab === 'podcast' && (
                    <div className="p-6 space-y-5 animate-fade-in max-w-2xl mx-auto w-full">
                      <div className="flex justify-between items-center border-b border-border pb-3">
                        <span className="text-xs font-bold text-foreground">AI Audio Briefing</span>
                        {selectedBinderId && documents.length > 0 && (
                          <button
                            onClick={handleGeneratePodcast}
                            disabled={podcastLoading}
                            className="px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-bold disabled:bg-secondary disabled:text-muted transition flex items-center gap-1.5"
                          >
                            {podcastLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                            <span>Compile Briefing</span>
                          </button>
                        )}
                      </div>

                      {!selectedBinderId ? (
                        <div className="text-center py-16 bg-secondary/50 border border-border rounded-2xl">
                          <span className="text-xs text-muted">Select a Document Binder to generate podcast reviews.</span>
                        </div>
                      ) : documents.length === 0 ? (
                        <div className="text-center py-16 bg-secondary/50 border border-border rounded-2xl">
                          <span className="text-xs text-muted">No documents found in binder.</span>
                        </div>
                      ) : podcastLoading ? (
                        <div className="flex flex-col justify-center items-center py-20 gap-3 bg-secondary/35 border border-border rounded-2xl">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          <span className="text-xs text-foreground font-semibold">Compiling briefing audio script...</span>
                          <span className="text-[10px] text-muted">Zenith dialogue engine is preparing discussion channels</span>
                        </div>
                      ) : podcastTurns.length > 0 ? (
                        <div className="space-y-5 animate-fade-in-up">
                          {/* Pulsing Visualizer Media Widget */}
                          <div className="flex flex-col items-center justify-center p-6 bg-secondary border border-border rounded-2xl space-y-4 shadow-lg relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 pointer-events-none" />
                            
                            <div className="relative w-32 h-32 bg-input border border-border rounded-full flex items-center justify-center shadow-inner">
                              <div className={`w-28 h-28 border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center ${podcastPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '12s' }}>
                                <div className="w-12 h-12 bg-secondary border border-border rounded-full"></div>
                              </div>
                              {podcastPlaying && (
                                <div className="absolute flex items-center gap-1 h-4">
                                  <span className="w-0.5 h-full bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                  <span className="w-0.5 h-3/4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                  <span className="w-0.5 h-1/2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                              )}
                            </div>

                            <div className="text-center space-y-1">
                              <h4 className="text-xs font-bold text-foreground">Interactive Audio Briefing</h4>
                              <p className="text-[10px] text-muted">Alex & Taylor Co-hosts</p>
                            </div>

                            <div className="flex items-center gap-4">
                              {podcastPlaying ? (
                                <button
                                  onClick={pausePodcastPlayback}
                                  className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition transform active:scale-95 shadow-md shadow-primary/10"
                                >
                                  <Pause className="h-4.5 w-4.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={startPodcastPlayback}
                                  className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition transform active:scale-95 shadow-md shadow-primary/10"
                                >
                                  <Play className="h-4.5 w-4.5 fill-current" />
                                </button>
                              )}
                              <select
                                value={podcastSpeed}
                                onChange={(e) => {
                                  setPodcastSpeed(Number(e.target.value));
                                  if (podcastPlaying) speakDialogue(activePodcastIndex);
                                }}
                                className="bg-input border border-border rounded-xl px-2.5 py-1 text-xs text-foreground focus:outline-none transition hover:border-muted-foreground/30"
                              >
                                <option value={0.85}>0.85x Speed</option>
                                <option value={1}>1.0x Speed</option>
                                <option value={1.2}>1.2x Speed</option>
                                <option value={1.5}>1.5x Speed</option>
                              </select>
                            </div>
                          </div>

                          {/* Scrolling Script turns */}
                          <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-2 select-text">
                            {podcastTurns.map((turn, idx) => {
                              const isActive = idx === activePodcastIndex;
                              return (
                                <div
                                  key={idx}
                                  id={`podcast-turn-${idx}`}
                                  onClick={() => {
                                    speakDialogue(idx);
                                    if (!podcastPlaying) setPodcastPlaying(true);
                                  }}
                                  className={`p-3.5 border rounded-xl cursor-pointer text-xs transition-all duration-300 ${
                                    isActive
                                      ? 'bg-primary/10 border-primary/30 shadow-md scale-[1.01]'
                                      : 'bg-input/40 border-border hover:border-muted-foreground/20 text-muted hover:text-foreground'
                                  }`}
                                >
                                  <span className={`font-bold uppercase tracking-wider text-[9px] block mb-1 ${turn.speaker === 'Alex' ? 'text-primary' : 'text-accent'}`}>
                                    {turn.speaker}
                                  </span>
                                  <p className="leading-relaxed font-sans">{turn.text}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-secondary/50 border border-border rounded-2xl space-y-3 max-w-sm mx-auto">
                          <SpeakerIcon className="h-10 w-10 text-primary/45 mx-auto animate-pulse" />
                          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Audio podcast Briefing</h4>
                          <p className="text-xs text-muted leading-relaxed">
                            Generate a full text-to-speech discussion overview of your binder files.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Active Recall Cards (SRS) */}
                  {activeRightTab === 'srs' && (
                    <div className="p-6 flex-1 flex flex-col min-h-0 animate-fade-in max-w-4xl mx-auto w-full">
                      <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">Recall Flashcards Deck</span>
                        <span className="text-[10px] font-bold bg-input border border-border px-3 py-1 rounded-lg text-muted">
                          {dueCardsCount} cards due
                        </span>
                      </div>
                      <div className="flex-1 overflow-y-auto min-h-0">
                        <FlashcardSRS soundOn={soundOn} binderId={selectedBinderId} />
                      </div>
                    </div>
                  )}

                  {/* 5. Practice Exam / Quiz */}
                  {activeRightTab === 'quiz' && (
                    <div className="p-6 flex-1 flex flex-col min-h-0 animate-fade-in max-w-4xl mx-auto w-full">
                      <div className="border-b border-border pb-3 mb-4">
                        <span className="text-xs font-bold text-foreground">Practice Mock Exams</span>
                      </div>
                      <div className="flex-1 overflow-y-auto min-h-0">
                        <MockExamEngine onGradeCompleted={handleExamGradeCompleted} />
                      </div>
                    </div>
                  )}

                  {/* 6. Weakness Finder (Stats/Gaps) */}
                  {activeRightTab === 'gaps' && (
                    <div className="flex-1 flex flex-col min-h-0 animate-fade-in max-w-4xl mx-auto w-full p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                        
                        {/* Section 1: History Log */}
                        <div className="flex flex-col bg-secondary/20 border border-border rounded-2xl overflow-hidden shadow-inner">
                          <div className="p-4 border-b border-border bg-input/10 flex items-center gap-2 flex-shrink-0">
                            <History className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Concept Query History</span>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text">
                            {studyHistory.length === 0 ? (
                              <div className="text-center py-10 text-xs text-muted">No query history found. Try asking a question!</div>
                            ) : (
                              studyHistory.map(item => (
                                <div
                                  key={item.id}
                                  onClick={() => handleLoadHistoryItem(item)}
                                  className="p-3 border border-border bg-input/30 hover:border-primary/40 hover:bg-input cursor-pointer transition text-left space-y-1.5 rounded-xl"
                                >
                                  <p className="text-xs font-semibold text-foreground truncate">{item.query}</p>
                                  <div className="flex justify-between items-center text-[10px] text-muted">
                                    <span>Response loaded</span>
                                    <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Section 2: Real-time Study Weakness Finder */}
                        <div className="flex flex-col bg-secondary/20 border border-border rounded-2xl overflow-hidden shadow-inner">
                          <div className="p-4 border-b border-border bg-input/10 flex items-center gap-2 flex-shrink-0 justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-accent" />
                              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Weakness Scanner</span>
                            </div>
                            <button
                              onClick={handleRunGapAnalysis}
                              disabled={documentLoading || !selectedBinderId}
                              className="px-3 py-1 bg-primary text-primary-foreground hover:opacity-90 rounded-md text-[10.5px] font-bold disabled:opacity-50 transition"
                            >
                              Scan
                            </button>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto p-4 space-y-3 select-text">
                            {gapAnalysis ? (
                              <div className="space-y-4">
                                <div className="bg-input border border-border rounded-xl p-3.5 space-y-2 shadow-inner">
                                  <div className="flex items-center gap-1.5 text-accent text-xs font-bold">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>WEAKNESSES DETECTED</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground leading-relaxed prose prose-invert max-w-none academic-prose">
                                    <ReactMarkdown components={renderMarkdownComponents} remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}>
                                      {gapAnalysis}
                                    </ReactMarkdown>
                                  </div>
                                </div>

                                {suggestedPathways.length > 0 && (
                                  <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Suggested Pathways</span>
                                    <div className="grid grid-cols-1 gap-2">
                                      {suggestedPathways.map((path, idx) => (
                                        <div key={idx} className="flex gap-2 p-2.5 bg-input border border-border rounded-xl text-xs text-foreground font-semibold items-start">
                                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                          <span>{path}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-full flex flex-col justify-center items-center text-center p-4 gap-2 py-10">
                                <TrendingUp className="h-8 w-8 text-muted/50" />
                                <span className="text-xs font-bold text-foreground">No weaknesses scanned yet</span>
                                <p className="text-xs text-muted leading-relaxed max-w-[200px]">
                                  Take a Practice Mock Exam or run a Scan to identify conceptual gaps.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </SandboxedApp>
              </div>
            </div>
          )}
        </main>

        {/* ======================================================== */}
        {/* COLUMN 3: RIGHT SIDEBAR (The Oracle - AI Chat Feed)     */}
        {/* ======================================================== */}
        <aside className={`inset-y-0 right-0 bg-secondary border-border flex flex-col transition-all duration-300 ease-out z-10 ${
          mobileTab === 'chat' ? 'flex fixed w-full' : 'hidden lg:flex lg:relative'
        } ${
          rightSidebarOpen ? 'lg:w-[460px] xl:w-[500px] lg:border-l' : 'lg:w-0 lg:overflow-hidden lg:border-l-0'
        }`}>
          
          {/* Header of Oracle Chat */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-input/10 flex-shrink-0 pr-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">Zenith AI Oracle</span>
            </div>
            
            <button
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileTab('workbench');
                } else {
                  setRightSidebarOpen(false);
                }
                playSoundEffect('click');
              }}
              className="p-1.5 hover:bg-input border border-border rounded text-muted hover:text-foreground transition"
              title="Close Chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Context Banner */}
          {selectedBinderId && (
            <div className="flex-shrink-0 bg-secondary/30 border-b border-border/40 px-4 py-2.5 flex items-center justify-between gap-2.5 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[10.5px]">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-muted truncate max-w-[220px]">
                  Context: <strong className="text-foreground font-semibold">{binders.find(b => b.id === selectedBinderId)?.name}</strong>
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span>Zenith Online</span>
              </div>
            </div>
          )}

          {/* Chat Feed Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-none relative animate-all duration-300"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {dragActive && (
              <div className="absolute inset-0 z-50 bg-secondary/90 backdrop-blur-md flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-primary/50 m-2 rounded-2xl animate-fade-in pointer-events-none">
                <Upload className="h-10 w-10 text-primary mb-3 animate-bounce" />
                <h3 className="text-xs font-bold text-foreground">Drop Context Files to Ingest</h3>
                <p className="text-[10px] text-muted max-w-[220px] mt-1">
                  Ingest PDFs, text documents, or code files directly into your active Study Chat.
                </p>
              </div>
            )}

            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 gap-3">
                <Sparkles className="h-8 w-8 text-primary/45 animate-spin" style={{ animationDuration: '3s' }} />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">StudySphere Chat</h3>
                <p className="text-[11px] text-muted max-w-[250px] leading-relaxed">
                  Ask Zenith AI questions. Upload documents or click any action below to trigger analysis.
                </p>
                
                <div className="mt-4 grid grid-cols-1 gap-2 w-full max-w-[280px]">
                  {[
                    { label: "Summarize concepts", text: "Summarize the key core concepts of this binder in a clear markdown bullet list." },
                    { label: "Draft review syllabus", text: "Suggest a 5-day structured study syllabus based on these notes." },
                    { label: "Find conceptual gaps", text: "Scan my notes to find conceptual gaps and weaknesses." }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setChatInput(chip.text);
                        playSoundEffect('click');
                      }}
                      className="p-3 bg-input/40 border border-border hover:border-primary/40 hover:bg-secondary rounded-xl text-left text-[11px] text-muted hover:text-foreground transition flex flex-col gap-0.5 shadow-sm"
                    >
                      <span className="font-semibold text-foreground">{chip.label}</span>
                      <span className="text-[9.5px] text-muted-foreground leading-tight truncate">{chip.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {chatMessages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  const isSystem = msg.role === 'system';
                  
                  if (isSystem) {
                    return (
                      <div key={index} className="flex justify-center my-2 animate-fade-in-up">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl px-3 py-1.5 text-[10px] text-primary flex items-center gap-1.5 shadow-sm max-w-[90%] text-center">
                          <Info className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{msg.content}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`flex gap-2.5 text-xs leading-relaxed animate-fade-in-up ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      } max-w-[92%]`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {isUser ? (
                          user?.picture ? (
                            <img src={user.picture} alt="User" className="w-8 h-8 rounded-full border border-primary/20 shadow-sm" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/25 border border-primary/30 flex items-center justify-center font-bold text-primary shadow-sm text-xs">
                              {user?.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                          )
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-extrabold text-primary-foreground shadow shadow-primary/20 text-xs select-none">
                            Z
                          </div>
                        )}
                      </div>

                      {/* Message Bubble Column */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className={`flex items-center gap-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] font-bold text-foreground">
                            {isUser ? 'You' : 'Zenith AI'}
                          </span>
                          {!isUser && (
                            <span className="text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded-full flex items-center gap-0.5 shadow-glow-sm select-none">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                              99.4% trust
                            </span>
                          )}
                          {!isUser && msg.content && (
                            <div className="flex items-center gap-1.5 ml-auto">
                              <button
                                onClick={() => handleOpenInlineCardModal(msg.content)}
                                className="text-[9px] text-accent hover:underline font-semibold transition"
                              >
                                Create Card
                              </button>
                              <span className="text-muted/40 text-[9px]">•</span>
                              <button
                                onClick={() => handleStartRefinement(index)}
                                className="text-[9px] text-primary hover:underline font-semibold transition animate-fade-in"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bubbly Card */}
                        <div
                          className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                            isUser
                              ? 'bg-primary/10 border-primary/20 rounded-tr-none text-foreground'
                              : 'bg-secondary/70 border-border rounded-tl-none text-foreground'
                          }`}
                        >
                          {/* Inline Edit/Refinement Form */}
                          {!isUser && msg.isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                value={msg.content}
                                onChange={(e) => handleUpdateMessageContent(index, e.target.value)}
                                className="w-full bg-input border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none"
                                rows={4}
                              />
                              <div className="flex justify-end gap-1.5 text-[9px]">
                                <button
                                  type="button"
                                  onClick={() => handleCancelRefinement(index)}
                                  className="px-2 py-1 text-muted hover:text-foreground transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveRefinement(index)}
                                  className="px-2.5 py-1 bg-primary text-primary-foreground rounded-md font-semibold transition"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 w-full text-left select-text">
                              {/* Thoughts display */}
                              {!isUser && msg.thoughts && msg.thoughts.length > 0 && (
                                <ModelThoughtsAccordion thoughts={msg.thoughts} isStreaming={chatStreaming && index === chatMessages.length - 1} />
                              )}

                              {parseMessageArtifacts(msg.content).map((part, pIdx) => {
                                if (part.type === 'artifact') {
                                  return (
                                    <SafeErrorBoundary key={pIdx}>
                                      {renderChatArtifact(part.artifactType || '', part.binderId, part.questionCount)}
                                    </SafeErrorBoundary>
                                  );
                                }
                                
                                return (
                                  <div key={pIdx} className="prose prose-invert prose-xs max-w-none chat-prose overflow-x-auto leading-relaxed">
                                    <SafeErrorBoundary>
                                      <ReactMarkdown
                                        components={renderMarkdownComponents}
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
                                      >
                                        {part.content || ''}
                                      </ReactMarkdown>
                                    </SafeErrorBoundary>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Chat error block */}
          {chatError && (
            <div className="mx-4 my-2 bg-red-950/20 border border-red-900/35 text-red-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
              <span className="truncate">{chatError}</span>
            </div>
          )}

          {/* Chat input controls */}
          <form onSubmit={handleChatSubmit} className="p-3 bg-secondary/80 border-t border-border flex-shrink-0 space-y-2">
            
            {/* Quick Actions Shortcuts Toolbar */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1.5">
              {[
                { label: "Practice Quiz", prompt: "Generate a custom quiz based on this binder's documents.", icon: Award, type: "quiz" },
                { label: "Recall Cards", prompt: "Generate a set of active recall study flashcards.", icon: Layers, type: "srs" },
                { label: "Audio Briefing", prompt: "Create an audio study podcast discussing the core material.", icon: Headphones, type: "podcast" },
                { label: "Study Syllabus", prompt: "Design a comprehensive study syllabus covering this topic.", icon: BookMarked, type: "guide" },
                { label: "Weakness Finder", prompt: "Scan my notes to find conceptual gaps and weaknesses.", icon: TrendingUp, type: "gaps" }
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.label}
                    type="button"
                    onClick={() => {
                      setChatInput(act.prompt);
                      setActiveRightTab(act.type as any);
                      playSoundEffect('click');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-input/40 border border-border/60 hover:bg-input text-[9.5px] font-bold text-muted hover:text-foreground rounded-lg transition whitespace-nowrap"
                  >
                    <Icon className="h-3 w-3 text-primary" />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-input/40 border border-border rounded-xl p-1 flex items-center gap-1.5 shadow-inner">
              {/* Paperclip upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload PDF, text, or code files"
                disabled={chatStreaming}
                className="p-2 text-muted hover:text-foreground hover:bg-input rounded-lg transition flex items-center justify-center flex-shrink-0"
              >
                <Paperclip className="h-4 w-4 text-primary" />
              </button>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={chatStreaming ? 'Zenith AI is thinking...' : 'Ask Zenith AI...'}
                disabled={chatStreaming}
                className="flex-1 bg-transparent border-0 outline-none focus:outline-none text-xs text-foreground placeholder-muted font-medium px-2.5"
              />

              <button
                type="submit"
                disabled={chatStreaming || !chatInput.trim()}
                className="p-2 bg-primary text-primary-foreground hover:opacity-95 rounded-xl font-bold transition disabled:opacity-40 shadow flex items-center justify-center flex-shrink-0"
              >
                {chatStreaming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </form>
        </aside>

        {/* Right Sidebar overlay backdrop on mobile screens */}
        {rightSidebarOpen && (
          <div 
            onClick={() => setRightSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

      </div>

      {/* Guided Tour Backdrop Spotlight Overlay */}
      {tourStep !== null && (
        <div 
          className="fixed inset-0 z-[9990] bg-black/70 backdrop-blur-[1.5px] transition-opacity duration-300 pointer-events-auto"
          onClick={() => setTourStep(null)}
        />
      )}

      {/* Guided Tour Tooltip Dialog Box Overlay */}
      {tourStep !== null && (
        <div className={`${getTourCardPosition()} bg-secondary border border-primary p-5 rounded-2xl shadow-2xl animate-fade-in-up space-y-3 z-[9995]`}>
          <div className="flex justify-between items-center border-b border-border pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-accent" />
              Onboarding Tour ({tourStep}/6)
            </span>
            <button onClick={() => setTourStep(null)} className="text-muted hover:text-foreground transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {tourStep === 1 && (
            <div className="text-center space-y-4 py-2">
              <div className="bg-primary/15 h-12 w-12 rounded-xl flex items-center justify-center mx-auto text-primary text-lg font-bold animate-bounce-subtle">
                S
              </div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Welcome to StudySphere AI!</h3>
              <p className="text-xs text-muted leading-relaxed">
                Let's take a quick 1-minute guided tour of your study workspace. You'll learn how to upload notes, synthesize files, build podcasts, and schedule spaced-repetition recalls.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setTourStep(null)}
                  className="px-3 py-1 hover:bg-input rounded-lg text-[10px] text-muted hover:text-foreground font-semibold"
                >
                  Skip
                </button>
                <button
                  onClick={() => { setTourStep(2); playSoundEffect('click'); }}
                  className="px-4 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition shadow shadow-primary/15 text-[10px]"
                >
                  Start Tour
                </button>
              </div>
            </div>
          )}

          {tourStep === 2 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FolderPlus className="h-3.5 w-3.5 text-primary" /> 1. Create a Study Binder
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Binders compile related lecture slides, PDF files, and source code. Click the "+" folder icon in the sidebar folder panel to create your first binder.
              </p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <button onClick={() => { setTourStep(1); playSoundEffect('click'); }} className="text-muted hover:text-foreground font-semibold">Back</button>
                <button onClick={() => { setTourStep(3); playSoundEffect('click'); }} className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded-lg">Next</button>
              </div>
            </div>
          )}

          {tourStep === 3 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5 text-primary" /> 2. Ingest Study Materials
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Drag slides or lecture files into the dashed ingestion zone in the sidebar. Our parser extracts all text layouts, math formulas, and code snippets.
              </p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <button onClick={() => { setTourStep(2); playSoundEffect('click'); }} className="text-muted hover:text-foreground font-semibold">Back</button>
                <button onClick={() => { setTourStep(4); playSoundEffect('click'); }} className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded-lg">Next</button>
              </div>
            </div>
          )}

          {tourStep === 4 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> 3. Toggle Cognitive Tools
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Switch tabs at the top to access the different cognitive study engines: interactive Chat, Master Study Syllabi, Audio Reviews, Smart Study Cards, and Practice Exams.
              </p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <button onClick={() => { setTourStep(3); playSoundEffect('click'); }} className="text-muted hover:text-foreground font-semibold">Back</button>
                <button onClick={() => { setTourStep(5); playSoundEffect('click'); }} className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded-lg">Next</button>
              </div>
            </div>
          )}

          {tourStep === 5 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-primary" /> 4. Ask anything to your notes
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Chat with your notes in real-time, generate mind maps, and translate slides. You can even click the "Create Card" link on assistant responses to save them to cards!
              </p>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <button onClick={() => { setTourStep(4); playSoundEffect('click'); }} className="text-muted hover:text-foreground font-semibold">Back</button>
                <button onClick={() => { setTourStep(6); playSoundEffect('click'); }} className="px-3 py-1 bg-primary text-primary-foreground font-bold rounded-lg">Next</button>
              </div>
            </div>
          )}

          {tourStep === 6 && (
            <div className="text-center space-y-4 py-2">
              <span className="text-3xl block animate-bounce">🎓🎉</span>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">You're study ready!</h3>
              <p className="text-xs text-muted leading-relaxed">
                Everything is configured. You can now use guest access or secure Google Sign-In to compile study trackers.
              </p>
              <div className="flex justify-between items-center text-[10px] pt-2 border-t border-border/40">
                <button onClick={() => { setTourStep(5); playSoundEffect('click'); }} className="text-muted hover:text-foreground font-semibold">Back</button>
                <button
                  onClick={() => {
                    setTourStep(null);
                    playSoundEffect('success');
                    showToast('Welcome to StudySphere AI! Enjoy learning.', 'success');
                  }}
                  className="px-4 py-1.5 bg-primary text-primary-foreground font-bold rounded-lg shadow shadow-primary/15"
                >
                  Enter Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sleek Custom Toast Notifications Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-center justify-between gap-3 animate-slide-in transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/35 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/35 text-red-200'
                : 'bg-secondary/95 border-border text-foreground'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <Check className="h-4 w-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-400" />}
              {toast.type === 'info' && <Info className="h-4 w-4 text-primary" />}
              <span className="text-xs font-medium leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-muted hover:text-foreground transition flex-shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Inline Flashcard Modal Overlay */}
      {showInlineCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleSaveInlineCard} className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Save AI Flashcards to Deck</span>
              <button type="button" onClick={() => setShowInlineCardModal(false)} className="text-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {generatingCards ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                  <p className="text-xs text-muted font-medium">StudySphere AI is distilling these concepts into active recall cards...</p>
                </div>
              ) : generatedCards.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted">
                  No flashcards could be generated from this message.
                </div>
              ) : (
                <div className="space-y-3.5">
                  <p className="text-[11px] text-muted leading-relaxed">
                    We synthesized the following cards from the study text. Review, edit, select, and add them directly to your deck.
                  </p>
                  {generatedCards.map((card, idx) => (
                    <div key={idx} className={`border p-3 rounded-xl space-y-2.5 transition duration-300 ${card.selected ? 'bg-input/20 border-primary/20' : 'bg-transparent border-border/40 opacity-55'}`}>
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/20">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={card.selected}
                            onChange={(e) => handleUpdateCard(idx, 'selected', e.target.checked)}
                            className="rounded border-border text-primary focus:ring-0 cursor-pointer h-4 w-4 bg-input"
                          />
                          <span className="text-[10px] font-bold text-foreground">Save Card #{idx + 1}</span>
                        </label>
                      </div>
                      {card.selected && (
                        <div className="space-y-2">
                          <div>
                            <label className="block text-[8px] text-muted uppercase tracking-wider mb-0.5">Front (Recall Prompt)</label>
                            <textarea
                              value={card.front}
                              onChange={(e) => handleUpdateCard(idx, 'front', e.target.value)}
                              className="w-full bg-input border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              rows={2}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] text-muted uppercase tracking-wider mb-0.5">Back (Explanation)</label>
                            <textarea
                              value={card.back}
                              onChange={(e) => handleUpdateCard(idx, 'back', e.target.value)}
                              className="w-full bg-input border border-border rounded-lg p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                              rows={2}
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!generatingCards && generatedCards.length > 0 && (
              <div className="flex justify-end gap-2 text-xs pt-2 border-t border-border/20">
                <button type="button" onClick={() => setShowInlineCardModal(false)} className="px-3 py-1.5 text-muted hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow transform active:scale-95 transition">Add Cards</button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* User Custom Memory Settings Modal Overlay */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form onSubmit={handleSaveMemory} className="glass-panel p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Personalize StudySphere Memory</span>
              <button type="button" onClick={() => setShowMemoryModal(false)} className="text-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Add context, instructions, or specific constraints that you want the AI assistant, podcast generators, study guides, and exams to know about you. The AI will personalize all outputs to fit your specific style.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-[9px] text-muted uppercase tracking-widest mb-1">Custom Memory / Instructions</label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. 'I am a first-year Computer Science student. Always explain concepts using Python code examples when applicable, keep explanations direct and clear, and add a brief summary section at the end.'"
                  className="w-full bg-input border border-border rounded-lg p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans leading-relaxed"
                  rows={6}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs pt-2">
              <button type="button" onClick={() => setShowMemoryModal(false)} className="px-3 py-1.5 text-muted hover:text-foreground">Cancel</button>
              <button type="submit" disabled={savingMemory} className="px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow flex items-center gap-1.5">
                {savingMemory ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Save Memory</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Sticky Navigation Bottom Tab Selector (lg hidden) */}
      <div className="lg:hidden h-14 bg-secondary border-t border-border flex items-center justify-around px-2 z-40">
        {[
          { id: 'chat', label: 'Chat', icon: MessageSquare },
          { id: 'guide', label: 'Syllabus', icon: BookMarked },
          { id: 'podcast', label: 'Audio Review', icon: SpeakerIcon },
          { id: 'srs', label: 'Study Cards', icon: Layers },
          { id: 'quiz', label: 'Practice Exam', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = tab.id === 'chat' 
            ? (!rightSidebarOpen && activeTab === 'chat') 
            : (rightSidebarOpen && activeRightTab === tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'chat') {
                  setRightSidebarOpen(false);
                  setActiveTab('chat');
                } else {
                  setActiveRightTab(tab.id as any);
                  setRightSidebarOpen(true);
                }
                playSoundEffect('click');
              }}
              className={`flex flex-col items-center justify-center p-1 transition-all ${isActive ? 'text-primary' : 'text-muted'}`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span className="text-[8.5px] font-semibold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>



    </div>
  );
}
