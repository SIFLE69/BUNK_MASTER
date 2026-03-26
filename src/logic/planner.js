/**
 * Rules for Bunk Planning
 */

export const calculateSafeBunks = (attended, total) => {
    if (total === 0) return 0;
    const currentAttendance = (attended / total) * 100;
    if (currentAttendance < 75) return 0;

    // x <= (attended / 0.75) - total
    const x = (attended / 0.75) - total;
    return Math.max(0, Math.floor(x));
};

export const simulateDay = (subjects, timetable, day) => {
    const daySchedule = timetable[day] || { slot1: [], slot2: [], slot3: [] };

    // Map of slot labels
    const SLOTS = {
        slot1: '08:30 - 10:30',
        slot2: '10:45 - 12:45',
        slot3: '01:30 - 03:30'
    };

    const results = {};

    Object.keys(SLOTS).forEach(slotId => {
        const subjectsInSlot = daySchedule[slotId] || [];
        results[slotId] = {
            label: SLOTS[slotId],
            classes: subjectsInSlot.map(subjectName => {
                const subject = subjects.find(s => s.name === subjectName);
                if (!subject) return { name: subjectName, status: 'unknown' };

                const { attended, total } = subject;
                // (attended) / (total + 1) >= 0.75
                const canBunk = (attended / (total + 1)) >= 0.75;

                return {
                    name: subjectName,
                    canBunk: canBunk,
                    status: canBunk ? 'SAFE TO BUNK' : 'ATTEND'
                };
            })
        };
    });

    return results;
};

export const getSubjectStatus = (attended, total) => {
    if (total === 0) return 'Safe';
    const percentage = (attended / total) * 100;
    if (percentage < 75) return 'Danger';
    if (percentage < 80) return 'Warning';
    return 'Safe';
};

export const getNextBunkRisk = (subject, bunkCount) => {
    const newTotal = subject.total + bunkCount;
    const newPercentage = (subject.attended / newTotal) * 100;
    return newPercentage.toFixed(1);
};
