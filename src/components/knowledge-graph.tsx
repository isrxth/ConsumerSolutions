'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '../app/store';
import { Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { forceX, forceY } from 'd3-force';

// Dynamically import force graph to prevent SSR errors
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      <span className="text-sm">Loading graph canvas...</span>
    </div>
  )
});

// Subtle colors for groups
const GROUP_COLORS: Record<string, string> = {
  'definition': '#10b981', // Emerald - Definitions
  'Notes': '#6366f1',      // Indigo - Study Notes
  'System': '#f59e0b',     // Amber - System Rules
  'default': '#3b82f6'     // Blue - Other
};

export function KnowledgeGraph() {
  const { graphData, setGraphData, activeNote, setActiveNote } = useAppStore();
  const [loading, setLoading] = useState(true);
  const graphRef = useRef<any>(null);

  // Highlight state for hovers
  const [hoverNode, setHoverNode] = useState<any | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<any>>(new Set());

  // Load graph data on mount
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch('/graph.json');
        if (response.ok) {
          const data = await response.json();
          setGraphData(data);
        }
      } catch (err) {
        console.error('Failed to load graph data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraph();
  }, [setGraphData]);

  // Map links to facilitate highlights search
  const linkRelations = useMemo(() => {
    const relations: Record<string, string[]> = {};
    if (!graphData) return relations;

    graphData.links.forEach((link) => {
      const source = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const target = typeof link.target === 'object' ? (link.target as any).id : link.target;

      if (!relations[source]) relations[source] = [];
      if (!relations[target]) relations[target] = [];

      relations[source].push(target);
      relations[target].push(source);
    });

    return relations;
  }, [graphData]);

  // Handle node hover to highlight connections
  const handleNodeHover = (node: any) => {
    const hlNodes = new Set<string>();
    const hlLinks = new Set<any>();

    if (node) {
      hlNodes.add(node.id);
      if (linkRelations[node.id]) {
        linkRelations[node.id].forEach(nbr => hlNodes.add(nbr));
      }
      if (graphData) {
        graphData.links.forEach((link) => {
          const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
          const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
          if (sourceId === node.id || targetId === node.id) {
            hlLinks.add(link);
          }
        });
      }
    }

    setHoverNode(node);
    setHighlightNodes(hlNodes);
    setHighlightLinks(hlLinks);
  };

  // Node rendering function on Canvas
  const drawNode = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = hoverNode && hoverNode.id === node.id;
    const isHighlighted = highlightNodes.size > 0 && highlightNodes.has(node.id);
    const isActive = activeNote && activeNote.id === node.id;

    // Determine opacity based on hover state
    let opacity = 1;
    if (hoverNode && !isHighlighted) {
      opacity = 0.25;
    }

    const color = GROUP_COLORS[node.group] || GROUP_COLORS.default;

    // Outer highlight circle for hover / active node
    if (isActive) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else if (isHovered) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 9, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'; // emerald
      ctx.fill();
    }

    // Core circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, isActive ? 6 : 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = hexToRgba(color, opacity);
    ctx.fill();

    // Node Title text rendering (hide if zoomed out too far, unless highlighted)
    const shouldDrawLabel = globalScale > 0.8 || isHighlighted || isActive;
    if (shouldDrawLabel) {
      const label = node.title || node.id;
      const fontSize = Math.max(10 / globalScale, 6);
      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Label color
      let textOpacity = isHighlighted || isActive ? 1.0 : 0.6;
      if (hoverNode && !isHighlighted) textOpacity = 0.15;

      ctx.fillStyle = hexToRgba(isActive ? '#10b981' : '#f4f4f5', textOpacity);
      ctx.fillText(label, node.x, node.y + (isActive ? 12 : 11));
    }
  };

  // Link styling function
  const getLinkColor = (link: any) => {
    const isHighlighted = highlightLinks.size > 0 && highlightLinks.has(link);
    if (highlightLinks.size > 0) {
      return isHighlighted ? '#10b981' : '#18181b'; // Highlight color vs faded link color
    }
    return '#27272a'; // Default link color (zinc-800)
  };

  const getLinkWidth = (link: any) => {
    return highlightLinks.has(link) ? 2 : 1;
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Center & Reset Zoom actions
  const handleZoomIn = () => graphRef.current?.zoom(graphRef.current.zoom() * 1.3, 400);
  const handleZoomOut = () => graphRef.current?.zoom(graphRef.current.zoom() / 1.3, 400);
  const handleResetZoom = () => {
    graphRef.current?.zoomToFit(400);
    graphRef.current?.centerAt(0, 0, 400);
  };

  // Zoom to fit and configure forces on initial load once nodes are generated
  useEffect(() => {
    if (graphRef.current && graphData) {
      // Moderate repulsion so unconnected nodes don't drift away
      graphRef.current.d3Force('charge').strength(-30);
      // Large link distance so connected nodes are nicely spaced out
      graphRef.current.d3Force('link').distance(200);

      // Add gentle attraction forces pulling nodes back to the center (0, 0)
      graphRef.current.d3Force('x', forceX(0).strength(0.08));
      graphRef.current.d3Force('y', forceY(0).strength(0.08));

      setTimeout(() => {
        graphRef.current.zoomToFit(600);
      }, 500);
    }
  }, [graphData]);

  if (loading || !graphData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm">Loading garden nodes...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#181818] overflow-hidden select-none">
      {/* Graph Legend Overlay */}
      <div className="absolute md:top-6 top-16 left-6 z-10 p-3 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md rounded-xl shadow-lg flex flex-col gap-2 max-w-[200px]">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 border-b border-zinc-800/20 pb-1.5 mb-0.5 select-none">
          Graph Legend
        </h4>
        <div className="flex items-center gap-2 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0" />
          <span className="text-[11px] text-zinc-300 font-medium">Definitions</span>
        </div>
        <div className="flex items-center gap-2 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shrink-0" />
          <span className="text-[11px] text-zinc-300 font-medium">Study Notes</span>
        </div>
        <div className="flex items-center gap-2 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
          <span className="text-[11px] text-zinc-300 font-medium">System Rules</span>
        </div>
      </div>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={(node: any) => node.title || node.id}
        nodeCanvasObject={drawNode}
        onNodeClick={(node: any) => setActiveNote(node.path)}
        onNodeHover={handleNodeHover}
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        d3VelocityDecay={0.4} // Smooth out physics movements
        cooldownTicks={100} // stop simulations after load to prevent shaking
      />

      {/* Floating Canvas Zoom Controls */}
      <div className="absolute bottom-20 sm:bottom-6 right-4 sm:right-6 flex flex-col gap-2 p-1.5 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md rounded-xl shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          title="Recenter Graph"
        >
          <Maximize2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
export default KnowledgeGraph;
