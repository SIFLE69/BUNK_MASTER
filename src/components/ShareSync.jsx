import React, { useState } from 'react';

const ShareSync = ({ subjects, timetable, onImport }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [importCode, setImportCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [status, setStatus] = useState('');

    const generateCode = () => {
        try {
            const payload = {
                s: subjects.map(s => ({ n: s.name, t: s.type })),
                tt: timetable
            };
            const code = btoa(JSON.stringify(payload));
            setGeneratedCode(code);
            setStatus('Code Generated!');
            setTimeout(() => setStatus(''), 2000);
        } catch (err) {
            setStatus('Generation Fault');
        }
    };

    const handleImport = () => {
        if (!importCode) return;
        try {
            const decoded = JSON.parse(atob(importCode));
            if (!decoded.s || !decoded.tt) throw new Error('Invalid Schema');

            // Clean subjects for the new user (0/0 attendance)
            const cleanSubjects = decoded.s.map(sub => ({
                name: sub.n,
                type: sub.t,
                attended: 0,
                total: 0
            }));

            onImport(cleanSubjects, decoded.tt);
            setImportCode('');
            setStatus('Strategy Synchronized!');
            setTimeout(() => setStatus(''), 2000);
        } catch (err) {
            setStatus('Invalid Code');
        }
    };

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-500">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)] animat-pulse"></div>
                    <h2 className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase italic tracking-widest leading-none">Collaborative Sync Hub</h2>
                </div>
                <div className="flex items-center gap-4">
                    {status && <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase italic animate-bounce">{status}</span>}
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{isExpanded ? 'Minimize' : 'Open Sync Terminal'}</span>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6 border-t border-slate-50 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Generation Silo */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase italic">Export Current Strategy</h3>
                                <p className="text-[7px] font-black text-slate-400 uppercase mt-1 leading-none">Share your subjects and timetable with others</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                {generatedCode && (
                                    <textarea
                                        readOnly
                                        value={generatedCode}
                                        className="w-full h-20 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-[8px] font-mono text-blue-600 dark:text-blue-400 break-all resize-none focus:outline-none"
                                    />
                                )}
                                <button
                                    onClick={generateCode}
                                    className="w-full py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest italic rounded-lg hover:bg-black dark:hover:bg-blue-700 transition-all active:scale-95"
                                >
                                    {generatedCode ? 'Regenerate New Code' : 'Generate Shared Strategy Code'}
                                </button>
                            </div>
                        </div>

                        {/* Import Silo */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[9px] font-black text-slate-900 dark:text-white uppercase italic">Import Shared Strategy</h3>
                                <p className="text-[7px] font-black text-slate-400 uppercase mt-1 leading-none">Paste a code to instantly setup your tracker</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <textarea
                                    placeholder="PASTE SYNC CODE HERE..."
                                    value={importCode}
                                    onChange={(e) => setImportCode(e.target.value)}
                                    className="w-full h-20 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-3 text-[8px] font-mono text-slate-800 dark:text-slate-100 break-all resize-none focus:outline-none placeholder:text-slate-200 dark:placeholder:text-slate-800"
                                />
                                <button
                                    onClick={handleImport}
                                    className="w-full py-2.5 bg-blue-600 dark:bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest italic rounded-lg hover:bg-blue-700 dark:hover:bg-slate-700 transition-all active:scale-95"
                                >
                                    Synchronize Strategy
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        <p className="text-[6px] font-black text-slate-400 uppercase italic">Importing will clear current subjects and timetable data but reset attendance to zero.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareSync;
