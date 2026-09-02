import { db } from "./db";

// Prisma Next has no `prisma db seed`. This is a plain script:
//   npm run seed   (-> tsx src/prisma/seed.ts)
// It wipes every table, then re-inserts a fresh demo dataset, so it is safe
// to run repeatedly.

// TimestamptzString columns take ISO strings, not Date objects.
const iso = (d: Date) => d.toISOString();
const now = new Date();
const plusHours = (h: number) => iso(new Date(now.getTime() + h * 3600_000));
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;

async function main() {
  console.log("Clearing existing data...");
  const truncate = db.raw.sql`
    TRUNCATE TABLE
      "result", "attendance", "exam", "assignment", "lesson", "subjectTeacher",
      "announcement", "event", "student", "class", "subject", "teacher",
      "parent", "grade", "admin"
    RESTART IDENTITY CASCADE
  `.affectedCount().build();
  await db.runtime().execute(truncate);

  // ADMIN
  await db.orm.public.Admin.create({ id: "admin1", username: "admin1" });
  await db.orm.public.Admin.create({ id: "admin2", username: "admin2" });

  // GRADE (levels 1..6 -> ids 1..6)
  for (let i = 1; i <= 6; i++) {
    await db.orm.public.Grade.create({ level: i });
  }

  // CLASS (1A..6A -> ids 1..6)
  for (let i = 1; i <= 6; i++) {
    await db.orm.public.Class.create({
      name: `${i}A`,
      capacity: Math.floor(Math.random() * 6) + 15,
      gradeId: i,
    });
  }

  // SUBJECT (ids 1..10)
  const subjects = [
    "Mathematics", "Science", "English", "History", "Geography",
    "Physics", "Chemistry", "Biology", "Computer Science", "Art",
  ];
  for (const name of subjects) {
    await db.orm.public.Subject.create({ name });
  }

  // TEACHER (teacher1..teacher15)
  for (let i = 1; i <= 15; i++) {
    await db.orm.public.Teacher.create({
      id: `teacher${i}`,
      username: `teacher${i}`,
      name: `TName${i}`,
      surname: `TSurname${i}`,
      email: `teacher${i}@example.com`,
      phone: `011-100-${1000 + i}`,
      address: `Address line ${i}`,
      bloodType: i % 2 === 0 ? "A+" : "O-",
      sex: i % 2 === 0 ? "MALE" : "FEMALE",
    });
  }

  // Give classes 1..6 a supervisor.
  for (let i = 1; i <= 6; i++) {
    await db.orm.public.Class.where({ id: i }).update({ supervisorId: `teacher${i}` });
  }

  // SUBJECT <-> TEACHER (explicit join rows)
  for (let i = 1; i <= 15; i++) {
    await db.orm.public.SubjectTeacher.create({
      subjectId: (i % 10) + 1,
      teacherId: `teacher${i}`,
    });
  }

  // LESSON (ids 1..30)
  for (let i = 1; i <= 30; i++) {
    await db.orm.public.Lesson.create({
      name: `Lesson ${i}`,
      day: DAYS[i % DAYS.length],
      startTime: plusHours(i),
      endTime: plusHours(i + 1),
      subjectId: (i % 10) + 1,
      classId: (i % 6) + 1,
      teacherId: `teacher${(i % 15) + 1}`,
    });
  }

  // PARENT (parent1..parent25)
  for (let i = 1; i <= 25; i++) {
    await db.orm.public.Parent.create({
      id: `parent${i}`,
      username: `parent${i}`,
      name: `PName${i}`,
      surname: `PSurname${i}`,
      email: `parent${i}@example.com`,
      phone: `044-200-${2000 + i}`,
      address: `Address line ${i}`,
    });
  }

  // STUDENT (student1..student50)
  for (let i = 1; i <= 50; i++) {
    await db.orm.public.Student.create({
      id: `student${i}`,
      username: `student${i}`,
      name: `SName${i}`,
      surname: `SSurname${i}`,
      email: `student${i}@example.com`,
      phone: `077-300-${3000 + i}`,
      address: `Address line ${i}`,
      bloodType: i % 2 === 0 ? "B+" : "AB-",
      sex: i % 2 === 0 ? "MALE" : "FEMALE",
      parentId: `parent${Math.ceil(i / 2)}`,
      gradeId: (i % 6) + 1,
      classId: (i % 6) + 1,
    });
  }

  // EXAM (ids 1..10)
  for (let i = 1; i <= 10; i++) {
    await db.orm.public.Exam.create({
      title: `Exam ${i}`,
      startTime: plusHours(24 * i),
      endTime: plusHours(24 * i + 2),
      lessonId: (i % 30) + 1,
    });
  }

  // ASSIGNMENT (ids 1..10)
  for (let i = 1; i <= 10; i++) {
    await db.orm.public.Assignment.create({
      title: `Assignment ${i}`,
      startDate: plusHours(24 * i),
      dueDate: plusHours(24 * (i + 7)),
      lessonId: (i % 30) + 1,
    });
  }

  // RESULT (ids 1..10) - half tied to an exam, half to an assignment
  for (let i = 1; i <= 10; i++) {
    await db.orm.public.Result.create({
      score: 60 + Math.floor(Math.random() * 41),
      studentId: `student${i}`,
      ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
    });
  }

  // ATTENDANCE (ids 1..10)
  for (let i = 1; i <= 10; i++) {
    await db.orm.public.Attendance.create({
      date: iso(now),
      present: i % 3 !== 0,
      studentId: `student${i}`,
      lessonId: (i % 30) + 1,
    });
  }

  // EVENT (ids 1..5)
  for (let i = 1; i <= 5; i++) {
    await db.orm.public.Event.create({
      title: `Event ${i}`,
      description: `Description for event ${i}`,
      startTime: plusHours(24 * i),
      endTime: plusHours(24 * i + 3),
      classId: (i % 6) + 1,
    });
  }

  // ANNOUNCEMENT (ids 1..5)
  for (let i = 1; i <= 5; i++) {
    await db.orm.public.Announcement.create({
      title: `Announcement ${i}`,
      description: `Description for announcement ${i}`,
      date: iso(now),
      classId: (i % 6) + 1,
    });
  }

  console.log("Seeding finished.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
