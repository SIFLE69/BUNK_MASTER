import React from 'react';

const OverallStats = ({ subjects }) => {
    const totalAttended = subjects.reduce((sum, s) => sum + (s.attended || 0), 0);
    const totalConducted = subjects.reduce((sum, s) => sum + (s.total || 0), 0);
    const overallPercentage = totalConducted === 0 ? 0 : ((totalAttended / totalConducted) * 100).toFixed(1);

    const classesToAttend = Math.max(0, Math.ceil(3 * totalConducted - 4 * totalAttended));
    const safeBunks = totalConducted === 0 ? 0 : Math.floor((totalAttended / 0.75) - totalConducted);
    const bunksLeft = Math.max(0, safeBunks);

    const isSafe = overallPercentage >= 75;

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 px-4 py-3 rounded-2xl shadow-sm flex items-center justify-between gap-4 sticky top-[56px] z-40 transition-colors duration-500">
            <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-10 h-10 -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" fill="transparent" />
                        <circle cx="50" cy="50" r="40" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset={251.2 - (overallPercentage / 100) * 251.2} strokeLinecap="round" className={`transition-all duration-1000 ${isSafe ? 'stroke-blue-600' : 'stroke-rose-600'}`} fill="transparent" />
                    </svg>
                    <span className="absolute text-[8px] font-black italic tracking-tighter text-slate-800 dark:text-slate-100">{overallPercentage}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[7px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest leading-none mb-0.5">Overall</span>
                    <span className={`text-xs font-black italic leading-none ${isSafe ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isSafe ? 'SAFE ZONE' : 'LOW ATTENDANCE'}
                    </span>
                </div>
            </div>

            <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>

            <div className="flex-1 flex justify-center gap-4 sm:gap-8 px-2 overflow-hidden">
                <div className="flex flex-col items-center">
                    <span className="text-[6px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Classes Done</span>
                    <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 italic leading-none">{totalAttended}/{totalConducted}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className={`text-[6px] font-black uppercase tracking-widest leading-none mb-1 ${isSafe ? 'text-blue-400' : 'text-rose-400'}`}>
                        {isSafe ? 'Total Bunks Left' : 'Need to Attend'}
                    </span>
                    <span className={`text-[10px] font-black italic leading-none ${isSafe ? 'text-slate-800 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isSafe ? <b>{bunksLeft} bunks available</b> : <b>Attend {classesToAttend} classes</b>}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OverallStats;
