import React from 'react';
import { calculateSafeBunks, getSubjectStatus } from '../logic/planner';

const SubjectList = ({ subjects, onRemove, onUpdate, onQuickAction }) => {
    const majors = subjects.filter(s => s.type === 'Major');
    const minors = subjects.filter(s => s.type === 'Minor');
    const practicals = subjects.filter(s => s.type === 'Practical');

    const renderRow = (subject) => {
        const percentage = subject.total === 0 ? 0 : ((subject.attended / subject.total) * 100).toFixed(1);
        const safeBunks = calculateSafeBunks(subject.attended, subject.total);
        const status = getSubjectStatus(subject.attended, subject.total);
        const attendanceDebt = Math.max(0, Math.ceil(3 * subject.total - 4 * subject.attended));

        const typeColors = {
            Major: 'text-blue-600 bg-blue-50/30 dark:text-blue-400 dark:bg-blue-900/20',
            Minor: 'text-indigo-600 bg-indigo-50/30 dark:text-indigo-400 dark:bg-indigo-900/20',
            Practical: 'text-emerald-600 bg-emerald-50/30 dark:text-emerald-400 dark:bg-emerald-900/20'
        };

        const statusColors = {
            Danger: 'text-rose-600 dark:text-rose-400',
            Warning: 'text-amber-600 dark:text-amber-400',
            Safe: 'text-emerald-600 dark:text-emerald-400'
        };

        const statusText = {
            Danger: 'LOW',
            Warning: 'CAUTION',
            Safe: 'SAFE'
        };

        return (
            <div key={subject._id || subject.id} className="group border-b border-slate-50 dark:border-slate-800 last:border-0 py-2 flex flex-col xl:flex-row items-center justify-between gap-3 px-3 hover:bg-slate-50/20 dark:hover:bg-slate-800/10 transition-all rounded-lg">

                {/* ID Column */}
                <div className="flex items-center justify-between xl:justify-start gap-4 w-full xl:w-64 shrink-0">
                    <div className="flex items-center gap-2 truncate">
                        <span className={`px-1.5 py-0.5 rounded text-[5px] font-black uppercase tracking-widest leading-none border border-current/10 ${typeColors[subject.type]}`}>
                            {subject.type}
                        </span>
                        <h3 className="text-[11px] font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase italic truncate leading-none group-hover:text-blue-600 transition-colors">
                            {subject.name}
                        </h3>
                    </div>
                    <div className="xl:hidden flex items-center gap-3">
                        <span className={`text-base font-black italic tracking-tighter tabular-nums leading-none ${statusColors[status]}`}>
                            {percentage}%
                        </span>
                    </div>
                </div>

                {/* Operations Column */}
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 w-full xl:w-auto">
                    <div className="hidden xl:flex flex-col items-center w-14">
                        <span className={`text-base font-black italic tracking-tighter tabular-nums leading-none ${statusColors[status]}`}>
                            {percentage}%
                        </span>
                        <span className="text-[5px] font-black uppercase text-slate-300 dark:text-slate-600 leading-none mt-1">{statusText[status]}</span>
                    </div>

                    <div className="flex items-center gap-1.5 scale-95 origin-center">
                        <button
                            onClick={() => onQuickAction(subject._id, 'present')}
                            className="w-10 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center font-black text-[8px] hover:bg-emerald-600 shadow-sm active:scale-90 transition-all"
                        >P+1</button>
                        <button
                            onClick={() => onQuickAction(subject._id, 'absent')}
                            className="w-10 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center font-black text-[8px] hover:bg-rose-600 shadow-sm active:scale-90 transition-all"
                        >A+1</button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-md border border-slate-100/50 dark:border-slate-800 scale-95 origin-center">
                        <div className="flex flex-col items-center">
                            <input
                                type="number"
                                value={subject.attended}
                                onChange={(e) => onUpdate({ ...subject, attended: parseInt(e.target.value) || 0 })}
                                className="w-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded py-0.5 text-[9px] font-black text-center focus:outline-none dark:text-white tabular-nums"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <input
                                type="number"
                                value={subject.total}
                                onChange={(e) => onUpdate({ ...subject, total: parseInt(e.target.value) || 0 })}
                                className="w-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded py-0.5 text-[9px] font-black text-center focus:outline-none dark:text-white tabular-nums"
                            />
                        </div>
                    </div>
                </div>

                {/* Analysis Column */}
                <div className="flex items-center justify-between xl:justify-end gap-5 w-full xl:w-auto xl:flex-1 pt-2 xl:pt-0 border-t xl:border-0 border-slate-50 dark:border-slate-900">
                    <div className="flex flex-col items-start xl:items-end">
                        {status === 'Danger' ? (
                            <span className="text-[9px] font-black italic tracking-tighter leading-none text-rose-600 dark:text-rose-400 animate-pulse">
                                <b>Attend {attendanceDebt} more</b>
                            </span>
                        ) : (
                            <span className={`text-[9px] font-black italic tracking-tighter leading-none ${safeBunks > 0 ? 'text-blue-500 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                {safeBunks > 0 ? <b>{safeBunks} bunks available</b> : <b>0 bunks available</b>}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => onQuickAction(subject._id, 'undo-present')} className="text-[6px] font-black text-slate-200 dark:text-slate-700 hover:text-blue-400 uppercase tracking-widest transition-colors leading-none">UNDO</button>
                        <button
                            onClick={() => onRemove(subject._id || subject.id)}
                            className="p-1.5 text-slate-200 dark:text-slate-700 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {[
                { data: majors, title: 'Major Subjects', color: 'bg-blue-600' },
                { data: minors, title: 'Minor Subjects', color: 'bg-indigo-600' },
                { data: practicals, title: 'Labs / Practicals', color: 'bg-emerald-600' }
            ].map(section => section.data.length > 0 && (
                <div key={section.title} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-500">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50/40 dark:bg-slate-800/40 border-b border-slate-100/50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${section.color}`}></span>
                            <h3 className="text-[8px] font-black text-slate-800 dark:text-slate-300 uppercase italic tracking-widest">{section.title}</h3>
                        </div>
                    </div>
                    <div className="flex flex-col p-1">
                        {section.data.map(renderRow)}
                    </div>
                </div>
            ))}
        </div>
    );
};

const TrashIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export default SubjectList;
