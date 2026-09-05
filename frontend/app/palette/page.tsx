export const metadata = { title: "Command Palette" };

export default function CommandPalettePage() {
  return (
    <div className="h-full bg-[#0c0e11] text-zinc-300 antialiased relative overflow-hidden flex flex-col justify-between select-none">


  {/* Background App Mockup (dimmed/frosted for true overlay feel) */}
  <div className="absolute inset-0 z-0 filter blur-[2px] opacity-25 pointer-events-none p-6 flex flex-col space-y-4">
    {/* Mock Topbar */}
    <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-4">
      <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
        <span className="text-teal-brand font-semibold">TunnelSight</span>
        <span>/</span>
        <span>IPsecXray</span>
        <span className="text-emerald-500 ml-4 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ENGINE ONLINE</span>
      </div>
      <div className="h-7 w-64 bg-zinc-900 border border-zinc-800 rounded px-2 text-xs flex items-center justify-between text-zinc-500 font-mono">
        <span>Search packets/SPI/tunnels</span>
        <kbd className="border border-zinc-700 px-1 py-0.5 text-[10px] rounded">⌘K</kbd>
      </div>
    </header>
    {/* Mock Workspace Content */}
    <div className="grid grid-cols-4 gap-4 flex-1">
      <div className="col-span-1 border border-zinc-800/80 bg-zinc-900/40 rounded p-4 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-24"></div>
        <div className="h-3 bg-zinc-800/50 rounded w-40"></div>
        <div className="mt-6 space-y-2">
          <div className="h-8 bg-zinc-800/60 rounded"></div>
          <div className="h-8 bg-zinc-800/40 rounded"></div>
          <div className="h-8 bg-zinc-800/40 rounded"></div>
        </div>
      </div>
      <div className="col-span-3 border border-zinc-800/80 bg-zinc-900/40 rounded p-4 space-y-4">
        <div className="h-6 bg-zinc-800 rounded w-64"></div>
        <div className="h-48 bg-zinc-800/30 rounded border border-zinc-800/50"></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-zinc-800/40 rounded"></div>
          <div className="h-24 bg-zinc-800/40 rounded"></div>
          <div className="h-24 bg-zinc-800/40 rounded"></div>
        </div>
      </div>
    </div>
  </div>

  {/* Backdrop Modal Overlay */}
  <div className="absolute inset-0 z-10 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
    
    {/* Command Palette Dialog Container */}
    <div className="w-full max-w-[620px] bg-[#111317] border border-zinc-800 rounded-lg shadow-2xl shadow-black/80 overflow-hidden flex flex-col transition-all">
      
      {/* Search Input Area */}
      <div className="relative flex items-center px-4 py-3.5 border-b border-zinc-800/90 bg-[#14171c]">
        {/* Terminal Command Glyph (No AI sparkle icon) */}
        <div className="flex items-center justify-center text-teal-brand mr-3 font-mono-code text-sm font-semibold">
          <svg className="w-4 h-4 text-teal-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"  />
          </svg>
        </div>
        
        {/* Input Field */}
        <input 
          id="cmd-input"
          type="text" 
          defaultValue="" 
          placeholder="Type a command or jump to tool..." 
          className="flex-1 bg-transparent border-0 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans font-normal"
          autoComplete="off" 
          spellCheck="false"
          autoFocus
         />

        {/* Shortcut Indicator Badge */}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-mono-code font-medium text-zinc-400 bg-zinc-800/80 border border-zinc-700/70 rounded">
            ESC
          </span>
        </div>
      </div>

      {/* Quick Category Filter Bar / Breadcrumb Pills (Optional rapid filtering) */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#0e1014] border-b border-zinc-800/60 text-[11px] font-mono-code text-zinc-400 overflow-x-auto">
        <span className="text-zinc-500 uppercase tracking-wider text-[10px] mr-1">Scope:</span>
        <button className="px-2 py-0.5 rounded bg-zinc-800 text-teal-bright border border-zinc-700/60 font-medium">All Commands</button>
        <button className="px-2 py-0.5 rounded bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40">Ingestion</button>
        <button className="px-2 py-0.5 rounded bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40">Analysis</button>
        <button className="px-2 py-0.5 rounded bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40">Navigation</button>
      </div>

      {/* Commands List Container */}
      <div className="max-h-[380px] overflow-y-auto py-2 divide-y divide-transparent text-xs" id="command-list">
        
        {/* Group: Forensic Ingestion & Actions */}
        <div className="px-2 pt-1 pb-1">
          <div className="px-2.5 py-1 text-[10px] font-mono-code uppercase tracking-wider text-zinc-500 font-semibold flex items-center justify-between">
            <span>Actions & Pipelines</span>
            <span className="text-[9px] text-zinc-600">ENTER TO RUN</span>
          </div>

          {/* Command: Analyze PCAP (Active / Focused state) */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md bg-[#1d222b] border border-teal-brand/30 text-zinc-100 cursor-pointer transition-colors" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-teal-brand/15 border border-teal-brand/30 flex items-center justify-center text-teal-bright flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-[13px]">Analyze PCAP</span>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.2 bg-teal-950/60 border border-teal-800/50 text-teal-300 rounded">INGEST</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-normal">Upload or ingest trace for cryptographic inspection</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-400">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">U</kbd>
            </div>
          </div>

          {/* Command: Start Live Analysis */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors mt-0.5" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[13px]">Start Live Analysis</span>
                  <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>dpdk0
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Attach ring buffer & monitor live interface</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">L</kbd>
            </div>
          </div>

          {/* Command: Generate Report */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors mt-0.5" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[13px]">Generate Report</span>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Export PDF executive summary or JSON forensic artifact</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">R</kbd>
            </div>
          </div>
        </div>

        {/* Group: Navigation & Exploration */}
        <div className="px-2 pt-2 pb-1 border-t border-zinc-800/70">
          <div className="px-2.5 py-1 text-[10px] font-mono-code uppercase tracking-wider text-zinc-500 font-semibold">
            <span>Navigation & Investigation</span>
          </div>

          {/* Command: Search Captures */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[13px]">Search Captures</span>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Filter ingested traces, SPI keys, and tunnel endpoints</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">F</kbd>
            </div>
          </div>

          {/* Command: Open History */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors mt-0.5" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[13px]">Open History</span>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Session ledger and previously analyzed captures</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">H</kbd>
            </div>
          </div>

          {/* Command: Open Findings */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors mt-0.5" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[13px]">Open Findings</span>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.2 bg-red-950/60 border border-red-800/50 text-red-400 rounded">3 HIGH RISK</span>
                </div>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Prioritized cryptographic vulnerabilities and RFC violations</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">G</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">F</kbd>
            </div>
          </div>

          {/* Command: Compare VPNs */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors mt-0.5" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[13px]">Compare VPNs</span>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Side-by-side posture diff between gateways & policies</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">D</kbd>
            </div>
          </div>
        </div>

        {/* Group: System & Configuration */}
        <div className="px-2 pt-2 pb-1 border-t border-zinc-800/70">
          <div className="px-2.5 py-1 text-[10px] font-mono-code uppercase tracking-wider text-zinc-500 font-semibold">
            <span>Configuration</span>
          </div>

          {/* Command: Open Settings */}
          <div className="group flex items-center justify-between px-2.5 py-2 rounded-md hover:bg-zinc-800/60 text-zinc-300 hover:text-white cursor-pointer transition-colors" tabIndex={0}>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-400 group-hover:text-teal-bright group-hover:border-teal-brand/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[13px]">Open Settings</span>
                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400">Pipeline tuning, ML threshold configuration & DPDK core mask</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 font-mono-code text-[11px] text-zinc-500">
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">⌘</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-800/70 border border-zinc-700/70 rounded text-[10px] text-zinc-400">,</kbd>
            </div>
          </div>
        </div>

      </div>

      {/* Command Palette Technical Footer */}
      <div className="px-4 py-2.5 bg-[#0d0f12] border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono-code text-zinc-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">↑</kbd>
            <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">↓</kbd>
            <span className="text-zinc-400">Navigate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">↵</kbd>
            <span className="text-zinc-400">Execute</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-300">ESC</kbd>
            <span className="text-zinc-400">Close</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-brand"></span>
          <span>v2.4.1-rc3</span>
        </div>
      </div>

    </div>
  </div>


    </div>
  );
}
