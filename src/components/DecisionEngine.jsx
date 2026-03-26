import React from 'react';
import { simulateDay } from '../logic/planner';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DecisionEngine = ({ subjects, timetable }) => {
    return (
        <div className="notion-card p-16 bg-white/40 backdrop-blur-[120px] border-2 border-white/80 shadow-[0_120px_120px_-60px_rgba(37,99,235,0.1)] rounded-[5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                <svg className="w-64 h-64 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 border-b-2 border-slate-100 pb-12">
                <div>
                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter uppercase italic leading-none mb-4">Strategic Decision Engine</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-500">Real-time Bunk Simulation Matrix • v8.0</p>
                </div>
                <div className="flex bg-slate-900 rounded-[2.5rem] px-12 py-5 items-center gap-6 mt-8 md:mt-0 shadow-3xl border-2 border-blue-500/20">
                    <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping"></span>
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Critical Threshold: 75%</span>
                </div>
            </div>

            <div className="space-y-32">
                {DAYS.map(day => {
                    const slotResults = simulateDay(subjects, timetable, day);
                    const hasClasses = Object.values(slotResults).some(slot => slot.classes.length > 0);

                    return (
                        <div key={day} className={`group/day relative animate-in fade-in slide-in-from-bottom-4 duration-1000 ${hasClasses ? '' : 'opacity-20'}`}>
                            <div className="flex items-center gap-8 mb-12">
                                <span className="text-5xl font-black text-slate-800 uppercase italic tracking-tighter shrink-0">{day}</span>
                                <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                                {!hasClasses && <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Operation Idle</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {Object.entries(slotResults).map(([slotId, slot]) => {
                                    const hasSlotClasses = slot.classes.length > 0;
                                    return (
                                        <div key={slotId} className={`p-10 rounded-[3rem] border-2 transition-all duration-700 ${hasSlotClasses ? 'bg-white/80 border-white shadow-xl hover:-translate-y-2' : 'bg-slate-50/50 border-dashed border-slate-100 grayscale'}`}>
                                            <div className="mb-10 flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{slotId.replace('slot', 'BLOCK ')}</p>
                                                    <p className="text-xl font-black text-slate-800 italic tracking-tighter">{slot.label}</p>
                                                </div>
                                                {hasSlotClasses && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                                            </div>

                                            <div className="space-y-6">
                                                {slot.classes.map((cls, idx) => (
                                                    <div key={idx} className={`p-6 rounded-[1.5rem] border-2 transition-all duration-700 relative overflow-hidden ${cls.canBunk ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}>
                                                        <div className="flex justify-between items-center mb-4 z-10">
                                                            <span className="font-black text-slate-800 text-lg uppercase italic tracking-tighter leading-tight">{cls.name}</span>
                                                        </div>
                                                        <div className={`inline-block px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${cls.canBunk ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white'}`}>
                                                            {cls.canBunk ? 'TARGET: SAFE TO BUNK' : 'TARGET: MUST ATTEND'}
                                                        </div>
                                                    </div>
                                                ))}
                                                {!hasSlotClasses && (
                                                    <div className="py-12 border-2 border-dashed border-slate-100 rounded-[1.5rem] flex items-center justify-center opacity-20">
                                                        <span className="text-[9px] font-black uppercase tracking-widest">NO ASSETS LOADED</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-32 p-2 bg-slate-900 rounded-[3rem] shadow-3xl">
                <div className="bg-slate-800 px-12 py-8 rounded-[2.5rem] flex flex-col items-center sm:flex-row justify-between gap-10 border border-slate-700/50">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-slate-100 font-black text-xs uppercase tracking-[0.2em] italic">Operational strategy synchronized via multi-dimensional payload metrics</p>
                    </div>
                    <div className="flex gap-12 whitespace-nowrap">
                        <span className="flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></span> Optimal Path
                        </span>
                        <span className="flex items-center gap-3 text-[10px] font-black text-rose-400 uppercase tracking-widest">
                            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"></span> Critical Path
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecisionEngine;
