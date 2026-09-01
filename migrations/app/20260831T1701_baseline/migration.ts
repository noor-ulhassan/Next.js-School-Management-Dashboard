#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8619bc91f4f4397ac6e9ce755eac2b3a7d6663d0ae5bb1c0466f3e429d884e36/contract';
import endContract from '../../snapshots/8619bc91f4f4397ac6e9ce755eac2b3a7d6663d0ae5bb1c0466f3e429d884e36/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'admin',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'announcement',
        columns: [
          col('classId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('date', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'assignment',
        columns: [
          col('dueDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'attendance',
        columns: [
          col('date', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('present', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'class',
        columns: [
          col('capacity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('gradeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('supervisorId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'event',
        columns: [
          col('classId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'exam',
        columns: [
          col('endTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'grade',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('level', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'lesson',
        columns: [
          col('classId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('day', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('subjectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('teacherId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'lesson_day_check_87ff5c3a',
            "\"day\" IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'parent',
        columns: [
          col('address', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('surname', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'result',
        columns: [
          col('assignmentId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('examId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('score', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'student',
        columns: [
          col('address', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('bloodType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('classId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('gradeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('img', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('parentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sex', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('surname', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('student_sex_check_0c53a478', "\"sex\" IN ('MALE', 'FEMALE')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'subject',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'subjectTeacher',
        columns: [
          col('subjectId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('teacherId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['subjectId', 'teacherId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'teacher',
        columns: [
          col('address', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('bloodType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('img', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('sex', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('surname', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('teacher_sex_check_0c53a478', "\"sex\" IN ('MALE', 'FEMALE')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'admin',
        constraint: 'admin_username_key',
        columns: ['username'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'class',
        constraint: 'class_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'grade',
        constraint: 'grade_level_key',
        columns: ['level'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'parent',
        constraint: 'parent_username_key',
        columns: ['username'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'parent',
        constraint: 'parent_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'parent',
        constraint: 'parent_phone_key',
        columns: ['phone'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_username_key',
        columns: ['username'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'student',
        constraint: 'student_phone_key',
        columns: ['phone'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'subject',
        constraint: 'subject_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'teacher',
        constraint: 'teacher_username_key',
        columns: ['username'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'teacher',
        constraint: 'teacher_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'teacher',
        constraint: 'teacher_phone_key',
        columns: ['phone'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'announcement',
        index: 'announcement_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'assignment',
        index: 'assignment_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attendance',
        index: 'attendance_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attendance',
        index: 'attendance_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_gradeId_idx_624f4a73',
        columns: ['gradeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'class',
        index: 'class_supervisorId_idx_fe423ed5',
        columns: ['supervisorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'event',
        index: 'event_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'exam',
        index: 'exam_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lesson',
        index: 'lesson_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lesson',
        index: 'lesson_subjectId_idx_84df2a1d',
        columns: ['subjectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'lesson',
        index: 'lesson_teacherId_idx_bc266660',
        columns: ['teacherId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'result',
        index: 'result_assignmentId_idx_8cfb4ac4',
        columns: ['assignmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'result',
        index: 'result_examId_idx_a57bdadd',
        columns: ['examId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'result',
        index: 'result_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'student',
        index: 'student_classId_idx_0089e5e7',
        columns: ['classId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'student',
        index: 'student_gradeId_idx_624f4a73',
        columns: ['gradeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'student',
        index: 'student_parentId_idx_6a68f597',
        columns: ['parentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'subjectTeacher',
        index: 'subjectTeacher_subjectId_idx_84df2a1d',
        columns: ['subjectId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'subjectTeacher',
        index: 'subjectTeacher_teacherId_idx_bc266660',
        columns: ['teacherId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'announcement',
        foreignKey: {
          name: 'announcement_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'class', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'assignment',
        foreignKey: {
          name: 'assignment_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'lesson', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'attendance',
        foreignKey: {
          name: 'attendance_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'student', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'attendance',
        foreignKey: {
          name: 'attendance_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'lesson', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'class',
        foreignKey: {
          name: 'class_supervisorId_fkey',
          columns: ['supervisorId'],
          references: { schema: 'public', table: 'teacher', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'class',
        foreignKey: {
          name: 'class_gradeId_fkey',
          columns: ['gradeId'],
          references: { schema: 'public', table: 'grade', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'event',
        foreignKey: {
          name: 'event_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'class', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'exam',
        foreignKey: {
          name: 'exam_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'lesson', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lesson',
        foreignKey: {
          name: 'lesson_subjectId_fkey',
          columns: ['subjectId'],
          references: { schema: 'public', table: 'subject', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lesson',
        foreignKey: {
          name: 'lesson_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'class', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'lesson',
        foreignKey: {
          name: 'lesson_teacherId_fkey',
          columns: ['teacherId'],
          references: { schema: 'public', table: 'teacher', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'result',
        foreignKey: {
          name: 'result_examId_fkey',
          columns: ['examId'],
          references: { schema: 'public', table: 'exam', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'result',
        foreignKey: {
          name: 'result_assignmentId_fkey',
          columns: ['assignmentId'],
          references: { schema: 'public', table: 'assignment', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'result',
        foreignKey: {
          name: 'result_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'student', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'student',
        foreignKey: {
          name: 'student_parentId_fkey',
          columns: ['parentId'],
          references: { schema: 'public', table: 'parent', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'student',
        foreignKey: {
          name: 'student_classId_fkey',
          columns: ['classId'],
          references: { schema: 'public', table: 'class', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'student',
        foreignKey: {
          name: 'student_gradeId_fkey',
          columns: ['gradeId'],
          references: { schema: 'public', table: 'grade', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'subjectTeacher',
        foreignKey: {
          name: 'subjectTeacher_subjectId_fkey',
          columns: ['subjectId'],
          references: { schema: 'public', table: 'subject', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'subjectTeacher',
        foreignKey: {
          name: 'subjectTeacher_teacherId_fkey',
          columns: ['teacherId'],
          references: { schema: 'public', table: 'teacher', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
