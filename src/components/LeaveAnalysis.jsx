import React from 'react';
import { calculateSafeBunks } from '../logic/planner';

const LeaveAnalysis = ({ subjects, timetable }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slots = ['slot1', 'slot2', 'slot3'];

    const analyzeDay = (day) => {
        const scheduledOnDay = [];
        slots.forEach(slot => {
            (timetable[day]?.[slot] || []).forEach(subName => {
                if (subName !== 'FREE') {
                    scheduledOnDay.push(subName);
                }
            });
        });

        const subCounts = {};
        scheduledOnDay.forEach(name => {
            const subject = subjects.find(s => s.name === name);
            if (subject) {
                const weight = 1; // Unified Session Protocol
                subCounts[name] = (subCounts[name] || 0) + weight;
            }
        });

        const problematicSubs = [];
        let totalDailyLoad = 0;

        Object.keys(subCounts).forEach(subName => {
            const subject = subjects.find(s => s.name === subName);
            if (subject) {
                const load = subCounts[subName];
                totalDailyLoad += load;
                const safeCredits = calculateSafeBunks(subject.attended, subject.total);

                if (safeCredits < load) {
                    problematicSubs.push({
                        name: subName,
                        load,
                        available: safeCredits,
                        deficit: load - safeCredits
                    });
                }
            }
        });

        return {
            isSafe: problematicSubs.length === 0,
            hasClasses: totalDailyLoad > 0,
            problematicSubs,
            totalDailyLoad
        };
    };

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-1000 transition-colors duration-500">
            <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.4)] dark:shadow-blue-500/20"></span>
                    <h2 className="text-[9px] font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase italic leading-none">Should I Bunk today?</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[6px] font-black text-slate-300 dark:text-slate-600 uppercase italic">Safe</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        <span className="text-[6px] font-black text-slate-300 dark:text-slate-600 uppercase italic">Don't Bunk</span>
                    </div>
                </div>
            </div>

            <div className="flex overflow-x-auto pb-2 -mb-2 scrollbar-none snap-x snap-mandatory">
                {days.map(day => {
                    const analysis = analyzeDay(day);
                    return (
                        <div key={day} className={`min-w-[140px] flex-shrink-0 snap-center p-4 flex flex-col justify-between transition-all duration-700 h-28 border-r last:border-0 border-slate-50 dark:border-slate-800 ${analysis.isSafe && analysis.hasClasses ? 'bg-emerald-50/10 dark:bg-emerald-900/5' : !analysis.isSafe ? 'bg-rose-50/10 dark:bg-rose-900/5' : 'bg-transparent'}`}>
                            <div className="flex justify-between items-start">
                                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">{day.slice(0, 3)}</span>
                                {analysis.hasClasses && (
                                    <span className="text-[7px] font-black text-slate-300 dark:text-slate-600 uppercase leading-none">{analysis.totalDailyLoad} Classes</span>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center text-center">
                                {!analysis.hasClasses ? (
                                    <div className="text-[7px] font-black text-slate-200 dark:text-slate-800 uppercase tracking-widest italic leading-none">Holiday Mode</div>
                                ) : analysis.isSafe ? (
                                    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-1 transition-colors">
                                            <CheckIcon />
                                        </div>
                                        <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Safe to bunk</span>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-500 flex flex-col items-center">
                                        <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-1 transition-colors">
                                            <XIcon />
                                        </div>
                                        <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest leading-none">Don't bunk!</span>
                                        <span className="text-[5px] font-black text-rose-400 mt-1 uppercase leading-none italic">Low Attendance</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="px-4 py-1.5 bg-slate-50/20 dark:bg-slate-900/20 border-t border-slate-50 dark:border-slate-800 flex justify-center items-center">
                <span className="text-[6px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.8em] italic">MMIT Academic Safety Simulator v19.0</span>
            </div>
        </div>
    );
};

const CheckIcon = () => (
    <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon = () => (
    <svg className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default LeaveAnalysis;
