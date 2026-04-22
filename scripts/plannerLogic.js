/**
 * TIMEWISE Deterministic Planner Engine
 * Logic:
 * 1. Calculate total days until exam.
 * 2. Calculate daily slots based on priority.
 * 3. Rotate subjects each day to avoid repetition.
 */

export function generateStudyPlan(subjects, examDate, dailyHours) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(examDate);
    targetDate.setHours(0, 0, 0, 0);

    const timeDiff = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft <= 0) throw new Error("Exam date must be in the future!");
    if (subjects.length === 0) throw new Error("Add at least one subject!");

    const plan = [];
    const totalPriority = subjects.reduce((sum, s) => sum + parseInt(s.priority), 0);

    for (let i = 0; i < daysLeft; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        const dateStr = currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const blocks = [];

        // Rotate subjects each day to avoid starting with the same one
        const rotatedSubjects = [...subjects];
        for(let r = 0; r < (i % subjects.length); r++) {
            rotatedSubjects.push(rotatedSubjects.shift());
        }

        rotatedSubjects.forEach(sub => {
            // Allocate hours based on priority ratio
            const weight = parseInt(sub.priority) / totalPriority;
            let subHours = Math.round((weight * dailyHours) * 2) / 2; // Round to nearest 0.5
            
            if (subHours > 0) {
                blocks.push({
                    subject: sub.name,
                    hours: subHours,
                    topic: "Review Materials", // Default deterministic topic
                    peakFocus: sub.priority === "3" // High priority gets peak focus tag
                });
            }
        });

        // Ensure total hours don't exceed daily limit significantly due to rounding
        let currentTotal = blocks.reduce((s, b) => s + b.hours, 0);
        if (currentTotal > dailyHours && blocks.length > 0) {
            blocks[0].hours = Math.max(0.5, blocks[0].hours - (currentTotal - dailyHours));
        }

        plan.push({
            date: dateStr,
            blocks: blocks
        });
    }

    return plan;
}