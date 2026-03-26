import React, { useState } from 'react';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableInput = ({ subjects, timetable, onTimetableUpdate }) => {
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [subjectToAdd, setSubjectToAdd] = useState("");

    const handleAddSubjectToDay = (day) => {
        if (!subjectToAdd || !subjects.find(s => s.name === subjectToAdd)) return;

        const currentSubjects = timetable[day] || [];
        if (currentSubjects.includes(subjectToAdd)) return;

        onTimetableUpdate({
            ...timetable,
            [day]: [...currentSubjects, subjectToAdd]
        });
        setSubjectToAdd("");
    };

    const handleRemoveSubjectFromDay = (day, subjectName) => {
        const currentSubjects = timetable[day] || [];
        onTimetableUpdate({
            ...timetable,
            [day]: currentSubjects.filter(s => s !== subjectName)
        });
    };

    return (
        <div className="notion-card p-6 bg-white shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Weekly Timetable</h2>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-wrap justify-center shadow-inner">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${selectedDay === day ? 'bg-white text-blue-600 shadow-lg scale-105' : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
                                }`}
                        >
                            {day.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100 min-h-[300px] flex flex-col transition-all duration-500">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                        <span className="bg-blue-600 w-2 h-2 rounded-full inline-block"></span>
                        Classes for {selectedDay}
                    </h3>
                    <div className="flex gap-2">
                        <select
                            value={subjectToAdd}
                            onChange={(e) => setSubjectToAdd(e.target.value)}
                            className="px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none shadow-sm font-medium"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleAddSubjectToDay(selectedDay)}
                            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!subjectToAdd}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {(timetable[selectedDay] || []).length > 0 ? (
                        (timetable[selectedDay] || []).map((subject, idx) => (
                            <div
                                key={idx}
                                className="group flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-md border border-blue-100 hover:border-blue-400 transition-all duration-300 hover:scale-105"
                            >
                                <span className="font-bold text-gray-700">{subject}</span>
                                <button
                                    onClick={() => handleRemoveSubjectFromDay(selectedDay, subject)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12 text-gray-400">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-semibold italic">No classes scheduled for this day</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {DAYS.map(day => (
                    <div key={day} className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{day.slice(0, 3)}</p>
                        <div className={`h-1.5 rounded-full mx-2 ${(timetable[day] || []).length > 0 ? 'bg-blue-500' : 'bg-gray-100'
                            }`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetableInput;
