import React, { useState } from 'react';

const SubjectForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [attended, setAttended] = useState('');
    const [total, setTotal] = useState('');
    const [type, setType] = useState('Major');
    const [addLab, setAddLab] = useState(false);
    const [labAttended, setLabAttended] = useState('');
    const [labTotal, setLabTotal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || attended === '' || total === '') return;

        onAdd({
            name: name.toUpperCase(),
            attended: parseInt(attended),
            total: parseInt(total),
            type
        });

        if (type === 'Major' && addLab) {
            onAdd({
                name: `${name.toUpperCase()} LAB`,
                attended: parseInt(labAttended || attended),
                total: parseInt(labTotal || total),
                type: 'Practical'
            });
        }

        setName('');
        setAttended('');
        setTotal('');
        setLabAttended('');
        setLabTotal('');
        setAddLab(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800 px-4 py-3 rounded-2xl shadow-sm flex flex-col xl:flex-row items-center gap-6 group scale-95 origin-center transition-colors duration-500">
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="w-full md:w-64 relative flex flex-col justify-end min-h-[40px]">
                    <label className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 italic">Subject Name</label>
                    <input
                        type="text"
                        placeholder="E.G. OS / MATHS"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-b border-slate-100 dark:border-slate-800 py-1.5 text-xs font-black text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 placeholder:text-slate-100 dark:placeholder:text-slate-800 uppercase italic"
                    />
                </div>

                <div className="w-full md:w-auto relative flex flex-col justify-end min-h-[40px]">
                    <label className="text-[7px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 italic">Subject Type</label>
                    <div className="flex gap-1 p-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                        {['Major', 'Minor', 'Practical'].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => {
                                    setType(t);
                                    if (t !== 'Major') setAddLab(false);
                                }}
                                className={`py-1 px-3 rounded-md text-[7px] font-black uppercase tracking-widest transition-all ${type === t ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >{t === 'Practical' ? 'Lab' : t}</button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto self-end">
                    <div className="w-20 flex flex-col justify-end min-h-[40px]">
                        <label className="text-[6px] font-black text-slate-300 dark:text-slate-600 uppercase italic text-center mb-1">Presents</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={attended}
                            onChange={(e) => setAttended(e.target.value)}
                            className="w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-md px-3 py-1.5 text-xs font-black text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400 text-center placeholder:text-slate-200 dark:placeholder:text-slate-800"
                        />
                    </div>
                    <div className="w-20 flex flex-col justify-end min-h-[40px]">
                        <label className="text-[6px] font-black text-slate-300 dark:text-slate-600 uppercase italic text-center mb-1">Total</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={total}
                            onChange={(e) => setTotal(e.target.value)}
                            className="w-full bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-md px-3 py-1.5 text-xs font-black text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-600 dark:focus:border-rose-400 text-center placeholder:text-slate-200 dark:placeholder:text-slate-800"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 w-full xl:w-auto justify-end">
                {type === 'Major' && (
                    <label className="flex items-center gap-3 cursor-pointer group/lab bg-slate-50/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all">
                        <input type="checkbox" className="hidden" checked={addLab} onChange={(e) => setAddLab(e.target.checked)} />
                        <div className={`w-8 h-4 rounded-full transition-all duration-300 p-0.5 ${addLab ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${addLab ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                        <span className="text-[7px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300 italic leading-none shrink-0">Add its Lab too</span>
                    </label>
                )}

                <button
                    type="submit"
                    className="group/btn relative px-8 py-3 bg-slate-900 dark:bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest overflow-hidden italic hover:bg-black dark:hover:bg-blue-700 rounded-xl shadow-md active:scale-95 transition-all leading-none shrink-0"
                >
                    Add Subject
                </button>
            </div>

            {type === 'Major' && addLab && (
                <div className="w-full flex-center bg-blue-50/30 dark:bg-blue-900/10 px-4 py-1.5 rounded-lg border border-blue-100/50 dark:border-blue-900 flex flex-row gap-4 items-center mt-2">
                    <p className="text-[7px] font-black uppercase text-blue-900 dark:text-blue-200 shrink-0">Lab Initial Presence:</p>
                    <input
                        type="number"
                        placeholder={`P: ${attended || 0}`}
                        value={labAttended}
                        onChange={(e) => setLabAttended(e.target.value)}
                        className="w-16 bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 py-1 text-[10px] font-black text-slate-800 dark:text-slate-100 focus:outline-none text-center rounded-md"
                    />
                    <input
                        type="number"
                        placeholder={`T: ${total || 0}`}
                        value={labTotal}
                        onChange={(e) => setLabTotal(e.target.value)}
                        className="w-16 bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 py-1 text-[10px] font-black text-slate-800 dark:text-slate-100 focus:outline-none text-center rounded-md"
                    />
                </div>
            )}
        </form>
    );
};

export default SubjectForm;
