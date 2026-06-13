import { useState, useEffect } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  thoughts?: string[];
  isEditing?: boolean;
}

export interface Binder {
  id: string;
  name: string;
  description?: string | null;
  _count?: {
    documents: number;
  };
}

export interface Document {
  id: string;
  name: string;
  fileType: string;
  content?: string;
  createdAt?: string;
}

export interface UploadProgress {
  name: string;
  loaded: number;
  total: number;
  status: 'pending' | 'uploading' | 'extracting' | 'completed' | 'failed';
  error?: string;
}

export interface AppState {
  user: any;
  binders: Binder[];
  selectedBinderId: string;
  documents: Document[];
  chatMessages: ChatMessage[];
  activeRightTab: 'viewer' | 'guide' | 'podcast' | 'srs' | 'quiz' | 'gaps';
  theme: 'light' | 'dark';
  pomodoroTime: number;
  pomodoroActive: boolean;
  soundOn: boolean;
  studyMusicPlaying: boolean;
  streak: number;
  viewingWorkspace: boolean;
  documentLoading: boolean;
  chatStreaming: boolean;
  chatError: string | null;
  urlToIngest: string;
  scrapingUrl: boolean;
  uploads: Record<string, UploadProgress>;
  selectedDocumentText: string;
  selectedDocumentName: string;
  generatingCards: boolean;
  dueCardsCount: number;
  podcastTurns: any[];
  podcastLoading: boolean;
  sourceGuideText: string;
  sourceGuideLoading: boolean;
  gapAnalysis: string;
}

const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('studysphere-theme') as 'light' | 'dark') || 'dark';
  }
  return 'dark';
};

const initialState: AppState = {
  user: null,
  binders: [],
  selectedBinderId: '',
  documents: [],
  chatMessages: [],
  activeRightTab: 'viewer',
  theme: getInitialTheme(),
  pomodoroTime: 25 * 60,
  pomodoroActive: false,
  soundOn: true,
  studyMusicPlaying: false,
  streak: 0,
  viewingWorkspace: false,
  documentLoading: false,
  chatStreaming: false,
  chatError: null,
  urlToIngest: '',
  scrapingUrl: false,
  uploads: {},
  selectedDocumentText: '',
  selectedDocumentName: '',
  generatingCards: false,
  dueCardsCount: 0,
  podcastTurns: [],
  podcastLoading: false,
  sourceGuideText: '',
  sourceGuideLoading: false,
  gapAnalysis: '',
};

type Listener = (state: AppState) => void;

class AppStore {
  private state: AppState;
  private listeners: Set<Listener> = new Set();

  constructor(initialState: AppState) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  setState(newState: Partial<AppState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const store = new AppStore(initialState);

// Event-driven Action Dispatcher
export const dispatchAction = async (action: string, payload: any) => {
  const state = store.getState();
  
  switch (action) {
    case 'SET_USER':
      store.setState({ user: payload });
      break;
    case 'SET_BINDERS':
      store.setState({ binders: payload });
      break;
    case 'SET_SELECTED_BINDER_ID':
      store.setState({ selectedBinderId: payload });
      break;
    case 'SET_DOCUMENTS':
      store.setState({ documents: payload });
      break;
    case 'SET_CHAT_MESSAGES':
      store.setState({ chatMessages: payload });
      break;
    case 'SET_ACTIVE_RIGHT_TAB':
      store.setState({ activeRightTab: payload });
      break;
    case 'SET_THEME':
      store.setState({ theme: payload });
      localStorage.setItem('studysphere-theme', payload);
      break;
    case 'SET_POMODORO_TIME':
      store.setState({ pomodoroTime: payload });
      break;
    case 'SET_POMODORO_ACTIVE':
      store.setState({ pomodoroActive: payload });
      break;
    case 'SET_SOUND_ON':
      store.setState({ soundOn: payload });
      break;
    case 'SET_STUDY_MUSIC_PLAYING':
      store.setState({ studyMusicPlaying: payload });
      break;
    case 'SET_STREAK':
      store.setState({ streak: payload });
      break;
    case 'SET_VIEWING_WORKSPACE':
      store.setState({ viewingWorkspace: payload });
      break;
    case 'SET_DOCUMENT_LOADING':
      store.setState({ documentLoading: payload });
      break;
    case 'SET_CHAT_STREAMING':
      store.setState({ chatStreaming: payload });
      break;
    case 'SET_CHAT_ERROR':
      store.setState({ chatError: payload });
      break;
    case 'SET_URL_TO_INGEST':
      store.setState({ urlToIngest: payload });
      break;
    case 'SET_SCRAPING_URL':
      store.setState({ scrapingUrl: payload });
      break;
    case 'SET_UPLOADS':
      store.setState({ uploads: payload });
      break;
    case 'UPDATE_UPLOAD_PROGRESS': {
      const { name, progress } = payload;
      const currentUploads = { ...state.uploads };
      currentUploads[name] = { ...currentUploads[name], ...progress };
      store.setState({ uploads: currentUploads });
      break;
    }
    case 'SELECT_DOCUMENT':
      store.setState({
        selectedDocumentText: payload.content,
        selectedDocumentName: payload.name,
        activeRightTab: 'viewer'
      });
      break;
    case 'ADD_CHAT_MESSAGE':
      store.setState({ chatMessages: [...state.chatMessages, payload] });
      break;
    case 'UPDATE_CHAT_MESSAGE_AT': {
      const { index, message } = payload;
      const updatedMessages = [...state.chatMessages];
      updatedMessages[index] = { ...updatedMessages[index], ...message };
      store.setState({ chatMessages: updatedMessages });
      break;
    }
    case 'TRIGGER_AI_SHORTCUT': {
      const { prompt, shortcutType } = payload;
      // Triggers chat query with special preset
      const userMsg: ChatMessage = { role: 'user', content: prompt };
      store.setState({
        chatMessages: [...state.chatMessages, userMsg],
        activeRightTab: shortcutType === 'quiz' ? 'quiz' : shortcutType === 'flashcards' ? 'srs' : state.activeRightTab
      });
      break;
    }
    default:
      console.warn(`Unhandled action type in store: ${action}`);
  }
};

// Custom React hook for selecting store state reactively
export function useAppStore<T>(selector: (state: AppState) => T): T {
  const [value, setValue] = useState(() => selector(store.getState()));
  
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setValue(selector(state));
    });
    return () => {
      unsubscribe();
    };
  }, [selector]);
  
  return value;
}
