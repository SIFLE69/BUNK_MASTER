import React from 'react';
import { getNextBunkRisk } from '../logic/planner';

const FuturePrediction = ({ subjects }) => {
    return (
        <div className="notion-card p-16 bg-white/40 backdrop-blur-[120px] border-2 border-white/80 shadow-[0_120px_120px_-60px_rgba(0,0,0,0.1)] rounded-[5rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600"></div>

            <div className="relative z-10">
                <div className="flex flex-col items-center mb-24 text-center">
                    <div className="w-24 h-24 bg-blue-600/5 rounded-[2.5rem] flex items-center justify-center mb-10 border-2 border-blue-600/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
                        <svg className="w-12 h-12 text-blue-600 drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Strategic Projections</h2>
                    <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-[10px]">Future Matrix Risk Evaluation • v7.0</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {subjects.length === 0 ? (
                        <div className="col-span-full py-24 text-center">
                            <h3 className="text-3xl font-black text-slate-200 uppercase tracking-tighter italic opacity-30 select-none">Initialization Required...</h3>
                        </div>
                    ) : (
                        subjects.map(subject => {
                            const predictions = [1, 2, 3].map(bunkCount => {
                                const nextPercent = getNextBunkRisk(subject, bunkCount);
                                const isSafe = nextPercent >= 75;
                                return { bunkCount, nextPercent, isSafe };
                            });

                            return (
                                <div key={subject._id || subject.id} className="group/subject bg-white/60 p-10 rounded-[3rem] border-2 border-white shadow-sm hover:shadow-3xl hover:bg-white transition-all duration-700 hover:-translate-y-3 backdrop-blur-md">
                                    <div className="flex justify-between items-center mb-12 border-b-2 border-slate-50 pb-6">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tighter leading-none uppercase italic">{subject.name}</h3>
                                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    </div>

                                    <div className="space-y-8">
                                        {predictions.map((p, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-4 rounded-3xl hover:bg-slate-50 transition-all duration-500">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">If Class Gap =</span>
                                                    <span className="text-lg font-black text-slate-800 uppercase tracking-tighter">+{p.bunkCount} Missed</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`${p.isSafe ? 'text-emerald-500' : 'text-rose-500'} text-3xl font-black tracking-tighter italic tabular-nums`}>
                                                            {p.nextPercent}
                                                        </span>
                                                        <span className="text-[10px] font-black text-slate-300">%</span>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${p.isSafe ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}`}>
                                                        {p.isSafe ? 'STATUS: NOMINAL' : 'STATUS: BREACHED'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner p-0.5">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-full opacity-10"></div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default FuturePrediction;
