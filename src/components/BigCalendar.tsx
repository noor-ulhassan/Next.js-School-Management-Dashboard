"use client";

import { useState } from "react";

type Lesson = {
    subject: string;
    time: string;
    teacher: string;
    color: string;
};

// Weekly timetable data keyed by day -> ordered lessons.
const schedule: Record<string, Lesson[]> = {
    Monday: [
        { subject: "Mathematics", time: "8:00 - 8:45", teacher: "Mr. Smith", color: "bg-lamaSkyLight" },
        { subject: "English", time: "9:00 - 9:45", teacher: "Ms. Jones", color: "bg-lamaPurpleLight" },
        { subject: "Physics", time: "10:00 - 10:45", teacher: "Mr. Brown", color: "bg-lamaYellowLight" },
        { subject: "Biology", time: "11:00 - 11:45", teacher: "Ms. Davis", color: "bg-lamaSkyLight" },
    ],
    Tuesday: [
        { subject: "Chemistry", time: "8:00 - 8:45", teacher: "Mr. Wilson", color: "bg-lamaPurpleLight" },
        { subject: "History", time: "9:00 - 9:45", teacher: "Ms. Moore", color: "bg-lamaYellowLight" },
        { subject: "Mathematics", time: "10:00 - 10:45", teacher: "Mr. Smith", color: "bg-lamaSkyLight" },
        { subject: "Art", time: "11:00 - 11:45", teacher: "Ms. Taylor", color: "bg-lamaPurpleLight" },
    ],
    Wednesday: [
        { subject: "Geography", time: "8:00 - 8:45", teacher: "Mr. Clark", color: "bg-lamaYellowLight" },
        { subject: "English", time: "9:00 - 9:45", teacher: "Ms. Jones", color: "bg-lamaSkyLight" },
        { subject: "Physics", time: "10:00 - 10:45", teacher: "Mr. Brown", color: "bg-lamaPurpleLight" },
        { subject: "P.E.", time: "11:00 - 11:45", teacher: "Mr. Adams", color: "bg-lamaYellowLight" },
    ],
    Thursday: [
        { subject: "Mathematics", time: "8:00 - 8:45", teacher: "Mr. Smith", color: "bg-lamaSkyLight" },
        { subject: "Chemistry", time: "9:00 - 9:45", teacher: "Mr. Wilson", color: "bg-lamaPurpleLight" },
        { subject: "Biology", time: "10:00 - 10:45", teacher: "Ms. Davis", color: "bg-lamaYellowLight" },
        { subject: "Music", time: "11:00 - 11:45", teacher: "Ms. Hall", color: "bg-lamaSkyLight" },
    ],
    Friday: [
        { subject: "English", time: "8:00 - 8:45", teacher: "Ms. Jones", color: "bg-lamaPurpleLight" },
        { subject: "History", time: "9:00 - 9:45", teacher: "Ms. Moore", color: "bg-lamaYellowLight" },
        { subject: "Physics", time: "10:00 - 10:45", teacher: "Mr. Brown", color: "bg-lamaSkyLight" },
        { subject: "Computer Sci.", time: "11:00 - 11:45", teacher: "Mr. Lee", color: "bg-lamaPurpleLight" },
    ],
};

const days = Object.keys(schedule);

const BigCalendar = () => {
    const [activeDay, setActiveDay] = useState<string>(days[0]);

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Day tabs */}
            <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                            activeDay === day
                                ? "bg-lamaSky text-gray-700 font-medium"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Lessons for the active day */}
            <div className="flex flex-col gap-3 mt-2">
                {schedule[activeDay].map((lesson) => (
                    <div
                        key={`${activeDay}-${lesson.time}`}
                        className={`${lesson.color} rounded-md p-4 flex items-center gap-4`}
                    >
                        <div className="min-w-[90px] text-xs font-medium text-gray-500">
                            {lesson.time}
                        </div>
                        <div className="flex-1">
                            <h2 className="font-medium text-gray-700">{lesson.subject}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{lesson.teacher}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BigCalendar;
