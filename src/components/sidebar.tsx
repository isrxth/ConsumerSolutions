'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore, NoteNode } from '../app/store';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  X,
  Compass,
  FileCode
} from 'lucide-react';

interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children: Record<string, TreeNode>;
}

export function Sidebar() {
  const { nodesList, activeNote, setActiveNote, setTab } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'definition': true, // Keep definitions expanded by default
  });

  // Construct tree structure from nodesList
  const tree = useMemo(() => {
    const root: Record<string, TreeNode> = {};

    nodesList.forEach((node) => {
      const parts = node.path.split('/');
      let currentLevel = root;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === parts.length - 1;

        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part.replace('.md', ''),
            path: isFile ? node.path : currentPath,
            isFile,
            children: {},
          };
        }
        currentLevel = currentLevel[part].children;
      });
    });

    return root;
  }, [nodesList]);

  // Handle folder expansion toggle
  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  // Render tree node recursively
  const renderTree = (nodes: Record<string, TreeNode>, depth = 0) => {
    // Sort directories first, then files
    const sortedKeys = Object.keys(nodes).sort((a, b) => {
      if (nodes[a].isFile && !nodes[b].isFile) return 1;
      if (!nodes[a].isFile && nodes[b].isFile) return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((key) => {
      const node = nodes[key];
      const isSelected = activeNote?.path === node.path;

      if (node.isFile) {
        return (
          <div
            key={node.path}
            onClick={() => setActiveNote(node.path)}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-md cursor-pointer transition-all duration-200 group text-sm ${
              isSelected
                ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border-l-2 border-transparent'
            }`}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <FileText className={`w-4 h-4 shrink-0 transition-colors ${
              isSelected ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
            }`} />
            <span className="truncate">{node.name}</span>
          </div>
        );
      } else {
        const isExpanded = !!expandedFolders[node.path];
        return (
          <div key={node.path}>
            <div
              onClick={() => toggleFolder(node.path)}
              className="flex items-center justify-between py-1.5 px-3 rounded-md cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 text-sm group"
              style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
              <div className="flex items-center gap-2 truncate">
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Folder className="w-4 h-4 text-zinc-600 shrink-0" />
                )}
                <span className="font-semibold text-zinc-300 group-hover:text-zinc-100 truncate">
                  {node.name}
                </span>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </div>
            {isExpanded && (
              <div className="mt-0.5 border-l border-zinc-800/40 ml-4">
                {renderTree(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      }
    });
  };

  // Flattened and filtered list for search results
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return nodesList.filter(
      (node) =>
        node.title.toLowerCase().includes(query) ||
        node.id.toLowerCase().includes(query)
    );
  }, [searchQuery, nodesList]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white backdrop-blur-md shadow-lg"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        id="sidebar-explorer"
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#181818]/90 border-r border-zinc-800/40 backdrop-blur-md flex flex-col transition-all duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Logo */}
        <button
          onClick={() => setTab('graph')}
          className="h-16 border-b border-zinc-800/40 flex items-center px-6 gap-3 w-full hover:bg-zinc-800/20 transition-colors cursor-pointer text-left group"
          title="Back to Knowledge Graph"
        >
          <Compass className="w-6 h-6 text-emerald-500 animate-pulse group-hover:scale-110 transition-transform" />
          <div>
            <h1 className="font-bold text-zinc-200 tracking-wide text-sm group-hover:text-emerald-400 transition-colors">Consumer Solution</h1>
            <p className="text-[10px] text-zinc-500">Guide</p>
          </div>
        </button>

        {/* Search Box */}
        <div className="p-4 border-b border-zinc-800/20">
          <div className="relative flex items-center bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3 py-1.5 focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-4 h-4 text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-zinc-200 placeholder-zinc-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notes Tree List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {searchQuery ? (
            /* Search Results Flat List */
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 px-3 uppercase tracking-wider mb-2">Search Results</p>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((node) => {
                  const isSelected = activeNote?.path === node.path;
                  return (
                    <div
                      key={node.path}
                      onClick={() => setActiveNote(node.path)}
                      className={`flex items-center gap-2 py-1.5 px-3 rounded-md cursor-pointer transition-all duration-200 text-sm ${
                        isSelected
                          ? 'bg-emerald-950/40 text-emerald-400 border-l-2 border-emerald-500 font-medium'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border-l-2 border-transparent'
                      }`}
                    >
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <span className="block font-medium truncate">{node.title}</span>
                        <span className="block text-[10px] text-zinc-500 truncate">{node.path}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-zinc-600 text-xs text-center py-8">
                  No notes found matching your search.
                </div>
              )}
            </div>
          ) : (
            /* Standard Tree Render */
            <div>
              <p className="text-[10px] text-zinc-500 px-3 uppercase tracking-wider mb-2">Workspace Notes</p>
              {renderTree(tree)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800/40 bg-[#181818]/40 flex items-center justify-between text-xs text-zinc-500">
          <span>Notes Count: {nodesList.length}</span>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
