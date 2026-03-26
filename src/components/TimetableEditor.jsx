import React from 'react';

const TimetableEditor = ({ subjects, timetable, onSave }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const slots = ['slot1', 'slot2', 'slot3'];

    const VIRTUAL_FREE = { name: 'FREE', type: 'System' };
    const allOptions = [...subjects, VIRTUAL_FREE];

    const toggleSubject = (day, slot, subName) => {
        const newTT = { ...timetable };
        let currentArr = Array.isArray(newTT[day][slot]) ? newTT[day][slot] : [];

        if (currentArr.includes(subName)) {
            newTT[day][slot] = currentArr.filter(n => n !== subName);
        } else {
            if (currentArr.length < 2) {
                newTT[day][slot] = [...new Set([...currentArr, subName])];
            }
        }

        onSave(newTT);
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-700 transition-colors duration-500">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase italic leading-none">Weekly Timetable</h2>
                    <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2 italic">Set your academic sessions for MMIT</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                    <span className="text-[8px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Live Sync Active</span>
                </div>
            </div>

            <div className="overflow-x-auto scrollbar-none">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/30 dark:bg-slate-800/30">
                            <th className="px-6 py-4 text-left text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 border-b border-r border-slate-100 dark:border-slate-800">Day</th>
                            {slots.map((s, idx) => (
                                <th key={s} className="px-6 py-4 text-left text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                                    Slot {idx + 1} <span className="text-[6px] ml-2 text-slate-300 dark:text-slate-700">(Max 2 subjects)</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {days.map(day => (
                            <tr key={day} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10 group">
                                <td className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 shrink-0 min-w-[140px]">
                                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase italic tracking-tighter group-hover:text-blue-600 transition-colors">{day}</span>
                                </td>
                                {slots.map(slot => {
                                    const activeCount = (timetable[day]?.[slot] || []).length;
                                    return (
                                        <td key={slot} className="px-4 py-4 min-w-[300px]">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {allOptions.map(sub => {
                                                        const isActive = timetable[day]?.[slot]?.includes(sub.name);
                                                        const isDisabled = !isActive && activeCount >= 2;
                                                        const isFree = sub.name === 'FREE';

                                                        return (
                                                            <button
                                                                key={`${day}-${slot}-${sub.name}`}
                                                                disabled={isDisabled}
                                                                onClick={() => toggleSubject(day, slot, sub.name)}
                                                                className={`px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all border ${isActive ? (isFree ? 'bg-slate-400 dark:bg-slate-700 border-transparent text-white' : 'bg-slate-900 dark:bg-blue-600 border-transparent text-white shadow-md scale-105') : isDisabled ? 'opacity-20 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 border-transparent cursor-not-allowed' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-blue-300 dark:hover:border-blue-700'}`}
                                                            >
                                                                {sub.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-[6px] font-black text-slate-300 dark:text-slate-700 uppercase italic">Selected: {activeCount}/2</span>
                                                    {timetable[day]?.[slot]?.includes('FREE') && <span className="text-[6px] font-black text-emerald-500 dark:text-emerald-700 uppercase leading-none italic">Free Period</span>}
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">Personalizing the Week for MMIT MMIT COLLEGE ARCHIVE Operations</span>
            </div>
        </div>
    );
};

export default TimetableEditor;
