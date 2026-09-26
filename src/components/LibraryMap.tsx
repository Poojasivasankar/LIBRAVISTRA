import { useState, useRef, useCallback } from 'react';
import { useStore } from '@/store';
import { shelves } from '@/data';
import { BookOpen, MapPin, X, QrCode, ArrowRight, Search, Layers } from 'lucide-react';
import type { Shelf } from '@/types';

interface Props {
  compact?: boolean;
  highlightShelfId?: string | null;
  onShelfClick?: (shelf: Shelf) => void;
  showRoute?: boolean;
  routeShelfId?: string | null;
}

export function LibraryMap({ compact = false, highlightShelfId, onShelfClick, showRoute = false, routeShelfId }: Props) {
  const { navigate, setHighlightedShelfId } = useStore();
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [filterDept, setFilterDept] = useState<string>('all');

  const activeHighlight = highlightShelfId ?? null;

  const handleShelfClick = useCallback(
    (shelf: Shelf) => {
      setSelectedShelf(shelf);
      onShelfClick?.(shelf);
    },
    [onShelfClick],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const filteredShelves = filterDept === 'all' ? shelves : shelves.filter((s) => s.department === filterDept);

  return (
    <div className={`relative w-full ${compact ? 'h-[420px]' : 'h-[600px]'} rounded-3xl overflow-hidden glass-card border-2 border-emerald-500/20`}>
      {/* Map controls */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          <button onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))} className="w-10 h-10 rounded-xl glass-light text-emerald-100 hover:bg-emerald-500/20 transition-all flex items-center justify-center text-xl font-bold">+</button>
          <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))} className="w-10 h-10 rounded-xl glass-light text-emerald-100 hover:bg-emerald-500/20 transition-all flex items-center justify-center text-xl font-bold">−</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="w-10 h-10 rounded-xl glass-light text-emerald-100 hover:bg-emerald-500/20 transition-all flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </button>
        </div>

      {/* Department filter */}
      {!compact && (
        <div className="absolute top-4 left-4 z-30">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-xl glass-light text-emerald-100 text-sm border border-emerald-500/20 focus:outline-none focus:border-emerald-400/50 cursor-pointer"
          >
            <option value="all" className="bg-forest-800">All Departments</option>
            {[...new Set(shelves.map((s) => s.department))].map((d) => (
              <option key={d} value={d} className="bg-forest-800">{d}</option>
            ))}
          </select>
        </div>
      )}

      {/* The map canvas */}
      <div
        className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(16,185,129,0.06) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(52,211,153,0.05) 0%, transparent 40%),
            linear-gradient(135deg, #052e23 0%, #021712 100%)
          `,
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
            <defs>
              <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(16,185,129,0.05)" strokeWidth="0.2" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#064E3B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#022C22" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Floor background */}
            <rect x="8" y="8" width="84" height="84" rx="2" fill="url(#floorGrad)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.3" />
            <rect x="8" y="8" width="84" height="84" rx="2" fill="url(#grid)" />

            {/* Doodle paths connecting areas */}
            <g stroke="rgba(16,185,129,0.2)" strokeWidth="0.4" fill="none" strokeDasharray="0.8 0.6">
              <path d="M 14 14 L 14 50 L 30 50 L 30 52" />
              <path d="M 14 50 L 52 50" />
              <path d="M 52 50 L 52 28" />
              <path d="M 52 50 L 68 50" />
              <path d="M 52 50 L 52 66" />
              <path d="M 68 50 L 68 28" />
              <path d="M 68 50 L 68 52" />
              <path d="M 14 50 L 14 90" />
            </g>

            {/* Entrance */}
            <g>
              <rect x="10" y="6" width="12" height="6" rx="0.5" fill="#065F46" stroke="#10B981" strokeWidth="0.3" />
              <text x="16" y="10.5" textAnchor="middle" fill="#6EE7B7" fontSize="1.8" fontWeight="600">ENTRANCE</text>
              <circle cx="16" cy="14" r="1.5" fill="#10B981" className="animate-pulse-marker" />
              <text x="16" y="17" textAnchor="middle" fill="#34D399" fontSize="1.2">You are here</text>
            </g>

            {/* Barcode Scanner Gate */}
            <g>
              <rect x="24" y="6" width="6" height="6" rx="0.3" fill="#022C22" stroke="#34D399" strokeWidth="0.2" />
              <text x="27" y="10" textAnchor="middle" fill="#6EE7B7" fontSize="1.2">Scan</text>
            </g>

            {/* Reception */}
            <g>
              <rect x="10" y="16" width="10" height="5" rx="0.5" fill="#047857" stroke="#10B981" strokeWidth="0.2" opacity="0.8" />
              <text x="15" y="19.5" textAnchor="middle" fill="#D1FAE5" fontSize="1.3" fontWeight="500">Reception</text>
            </g>

            {/* Librarian Desk */}
            <g>
              <rect x="22" y="16" width="8" height="5" rx="0.5" fill="#065F46" stroke="#34D399" strokeWidth="0.2" opacity="0.8" />
              <text x="26" y="19.5" textAnchor="middle" fill="#D1FAE5" fontSize="1.2" fontWeight="500">Librarian</text>
            </g>

            {/* Book Return Area */}
            <g>
              <rect x="32" y="16" width="8" height="5" rx="0.5" fill="#022C22" stroke="#10B981" strokeWidth="0.2" opacity="0.7" />
              <text x="36" y="19.5" textAnchor="middle" fill="#6EE7B7" fontSize="1.2" fontWeight="500">Returns</text>
            </g>

            {/* Main Reading Area */}
            <g>
              <rect x="10" y="24" width="18" height="10" rx="0.5" fill="rgba(6,95,70,0.15)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.2" strokeDasharray="0.5 0.3" />
              <text x="19" y="29" textAnchor="middle" fill="#6EE7B7" fontSize="1.4" fontWeight="600">Reading Area</text>
              {/* Reading tables */}
              {[0, 1].map((row) =>
                [0, 1, 2].map((col) => (
                  <rect key={`t-${row}-${col}`} x={12 + col * 5} y={31 + row * 2} width="3" height="1.2" rx="0.2" fill="#047857" opacity="0.5" />
                )),
              )}
            </g>

            {/* Computer Section */}
            <g>
              <rect x="10" y="36" width="18" height="6" rx="0.5" fill="rgba(4,120,87,0.2)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.2" />
              <text x="19" y="40" textAnchor="middle" fill="#6EE7B7" fontSize="1.3" fontWeight="600">Computer Lab</text>
              {[0, 1, 2, 3].map((i) => (
                <rect key={`pc-${i}`} x={12 + i * 4} y="41" width="2" height="0.8" rx="0.1" fill="#10B981" opacity="0.6" />
              ))}
            </g>

            {/* Study Zones */}
            <g>
              <rect x="10" y="44" width="18" height="6" rx="0.5" fill="rgba(6,78,59,0.15)" stroke="rgba(16,185,129,0.15)" strokeWidth="0.2" strokeDasharray="0.4 0.3" />
              <text x="19" y="48" textAnchor="middle" fill="#6EE7B7" fontSize="1.3" fontWeight="600">Study Zone</text>
            </g>

            {/* Decorative trees/plants */}
            <g opacity="0.4">
              <circle cx="12" cy="22" r="0.8" fill="#047857" />
              <circle cx="26" cy="22" r="0.6" fill="#059669" />
              <circle cx="44" cy="14" r="0.7" fill="#047857" />
              <circle cx="88" cy="88" r="0.8" fill="#059669" />
              <circle cx="92" cy="84" r="0.6" fill="#047857" />
            </g>

            {/* Decorative student character blocks */}
            <g opacity="0.5">
              <rect x="13" y="33" width="1" height="1.5" fill="#34D399" rx="0.1" />
              <rect x="17" y="33" width="1" height="1.5" fill="#10B981" rx="0.1" />
              <rect x="21" y="33" width="1" height="1.5" fill="#6EE7B7" rx="0.1" />
            </g>

            {/* Shelves */}
            {shelves.map((shelf) => {
              const isFiltered = filterDept !== 'all' && shelf.department !== filterDept;
              const isHighlighted = activeHighlight === shelf.id || routeShelfId === shelf.id;
              const isDimmed = isFiltered;
              return (
                <g
                  key={shelf.id}
                  className="cursor-pointer transition-all duration-200"
                  opacity={isDimmed ? 0.2 : 1}
                  onClick={() => handleShelfClick(shelf)}
                >
                  {/* Shelf block */}
                  <rect
                    x={shelf.mapX}
                    y={shelf.mapY}
                    width={shelf.mapW}
                    height={shelf.mapH}
                    rx="0.5"
                    fill={isHighlighted ? shelf.color : `${shelf.color}40`}
                    stroke={isHighlighted ? '#6EE7B7' : shelf.color}
                    strokeWidth={isHighlighted ? '0.5' : '0.3'}
                    filter={isHighlighted ? 'url(#glow)' : undefined}
                    className="transition-all duration-300"
                  />
                  {/* Book spines on shelf */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <rect
                      key={i}
                      x={shelf.mapX + 1 + i * 2.2}
                      y={shelf.mapY + 1}
                      width="1.2"
                      height={shelf.mapH - 2}
                      rx="0.1"
                      fill={isHighlighted ? '#6EE7B7' : shelf.color}
                      opacity={isDimmed ? 0.1 : 0.6}
                    />
                  ))}
                  {/* Shelf label */}
                  <text
                    x={shelf.mapX + shelf.mapW / 2}
                    y={shelf.mapY + shelf.mapH / 2 + 0.5}
                    textAnchor="middle"
                    fill={isHighlighted ? '#021712' : '#D1FAE5'}
                    fontSize="1.4"
                    fontWeight="700"
                  >
                    {shelf.id}
                  </text>
                  {/* Pulse marker for highlighted shelf */}
                  {isHighlighted && (
                    <circle
                      cx={shelf.mapX + shelf.mapW / 2}
                      cy={shelf.mapY - 1}
                      r="1"
                      fill="#10B981"
                      className="animate-pulse-marker"
                    />
                  )}
                </g>
              );
            })}

            {/* Route path */}
            {showRoute && routeShelfId && (
              <g>
                {(() => {
                  const shelf = shelves.find((s) => s.id === routeShelfId);
                  if (!shelf) return null;
                  return (
                    <g>
                      <path
                        d={`M 16 14 L 16 50 L ${shelf.mapX + shelf.mapW / 2} 50 L ${shelf.mapX + shelf.mapW / 2} ${shelf.mapY + shelf.mapH / 2}`}
                        stroke="#34D399"
                        strokeWidth="0.5"
                        fill="none"
                        strokeDasharray="1 0.5"
                        className="animate-pulse-marker"
                      />
                      <circle cx="16" cy="14" r="1" fill="#10B981" className="animate-pulse-marker" />
                      <circle cx={shelf.mapX + shelf.mapW / 2} cy={shelf.mapY + shelf.mapH / 2} r="1.5" fill="#6EE7B7" className="animate-pulse-marker" />
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-30 glass-light rounded-xl px-3 py-2 flex flex-wrap gap-2 text-xs text-emerald-100 max-w-[60%]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-300"></span>Available</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Few</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span>Borrowed</span>
      </div>

      {/* Shelf detail popover */}
      {selectedShelf && (
        <div className="absolute bottom-4 right-4 z-40 w-72 glass-card rounded-2xl p-4 animate-scale-in border-2 border-emerald-500/30 shadow-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-display font-bold text-white text-lg">{selectedShelf.id}</h3>
              <p className="text-sm text-emerald-200">{selectedShelf.name}</p>
            </div>
            <button onClick={() => setSelectedShelf(null)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-gray-300 mb-3">
            <div className="flex justify-between"><span className="text-gray-400">Genre:</span><span>{selectedShelf.genre}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Department:</span><span>{selectedShelf.department}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Floor:</span><span>{selectedShelf.floor}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Books:</span><span>{selectedShelf.bookCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Available:</span><span className="text-emerald-300 font-semibold">{selectedShelf.availableCount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Occupied:</span><span className="text-amber-300">{selectedShelf.bookCount - selectedShelf.availableCount}</span></div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setHighlightedShelfId(selectedShelf.id);
                navigate({ name: 'shelf', shelfId: selectedShelf.id });
                setSelectedShelf(null);
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" /> View Books
            </button>
            <button
              onClick={() => {
                setHighlightedShelfId(selectedShelf.id);
                setSelectedShelf(null);
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-forest-700/40 hover:bg-forest-600/40 text-emerald-100 text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" /> Scan QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
