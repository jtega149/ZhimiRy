/** Small trash-can glyph for Google Maps Marker `icon.url` (reads well on dark map tiles). */
export function getTrashCanMarkerIconDataUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect x="12" y="6" width="24" height="7" rx="2" fill="#cbd5e1"/>
  <rect x="10" y="12" width="28" height="30" rx="3" fill="#64748b" stroke="#1e293b" stroke-width="2"/>
  <rect x="15" y="18" width="18" height="16" rx="1" fill="#475569" opacity="0.45"/>
  <path d="M18 8h12" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
  <path d="M19 22h10M19 28h10" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
