import { create } from 'zustand';

export interface NoteNode {
  id: string;
  title: string;
  group: string;
  path: string;
}

export interface NoteDetail extends NoteNode {
  content: string;
  frontmatter: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: NoteNode[];
  edges: GraphEdge[];
  links: GraphEdge[];
}

interface AppState {
  currentTab: 'graph' | 'note';
  activeNote: NoteDetail | null;
  isLoadingNote: boolean;
  isOverlayOpen: boolean;
  graphData: GraphData | null;
  nodesList: NoteNode[];
  
  // History navigation stack
  history: string[];
  historyIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  
  // Actions
  setTab: (tab: 'graph' | 'note') => void;
  setActiveNote: (notePath: string | null, isFromHistoryNav?: boolean) => Promise<void>;
  closeOverlay: () => void;
  setGraphData: (data: GraphData) => void;
  fetchNoteDetails: (notePath: string) => Promise<NoteDetail | null>;
  goBack: () => Promise<void>;
  goForward: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTab: 'graph',
  activeNote: null,
  isLoadingNote: false,
  isOverlayOpen: false,
  graphData: null,
  nodesList: [],
  
  // Initial history state
  history: [],
  historyIndex: -1,
  canGoBack: false,
  canGoForward: false,

  setTab: (tab) => set({ currentTab: tab }),
  
  closeOverlay: () => set({ isOverlayOpen: false }),
  
  setGraphData: (data) => set({ 
    graphData: data, 
    nodesList: data.nodes 
  }),

  fetchNoteDetails: async (notePath: string) => {
    try {
      const response = await fetch(`/api/notes?path=${encodeURIComponent(notePath)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch note details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching note details:', error);
      return null;
    }
  },

  setActiveNote: async (notePath, isFromHistoryNav = false) => {
    if (!notePath) {
      set({ activeNote: null, isOverlayOpen: false });
      return;
    }

    set({ isLoadingNote: true });
    try {
      const details = await get().fetchNoteDetails(notePath);
      if (details) {
        let newHistory = [...get().history];
        let newIndex = get().historyIndex;

        if (!isFromHistoryNav) {
          // Truncate any forward history if we were in the middle of the stack
          newHistory = newHistory.slice(0, newIndex + 1);
          
          // Avoid duplicate entries consecutively
          if (newHistory[newIndex] !== notePath) {
            newHistory.push(notePath);
            newIndex = newHistory.length - 1;
          }
        }

        set({ 
          activeNote: details, 
          currentTab: 'note', // Switch to Note View tab (brings note to middle/front)
          isOverlayOpen: false, // Close overlay since we are in full Note View
          isLoadingNote: false,
          history: newHistory,
          historyIndex: newIndex,
          canGoBack: newIndex > 0,
          canGoForward: newIndex < newHistory.length - 1
        });
      } else {
        set({ isLoadingNote: false });
      }
    } catch (error) {
      console.error('Error in setActiveNote:', error);
      set({ isLoadingNote: false });
    }
  },

  goBack: async () => {
    const { history, historyIndex, canGoBack, setActiveNote } = get();
    if (!canGoBack || historyIndex <= 0) return;
    
    const prevIndex = historyIndex - 1;
    const prevPath = history[prevIndex];
    
    await setActiveNote(prevPath, true);
    set({
      historyIndex: prevIndex,
      canGoBack: prevIndex > 0,
      canGoForward: prevIndex < history.length - 1
    });
  },

  goForward: async () => {
    const { history, historyIndex, canGoForward, setActiveNote } = get();
    if (!canGoForward || historyIndex >= history.length - 1) return;
    
    const nextIndex = historyIndex + 1;
    const nextPath = history[nextIndex];
    
    await setActiveNote(nextPath, true);
    set({
      historyIndex: nextIndex,
      canGoBack: nextIndex > 0,
      canGoForward: nextIndex < history.length - 1
    });
  }
}));

