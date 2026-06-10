import { builder } from "../libraries/builder.ts";

export type TeacherAssignmentInfo = {
  id: string;
  courseName: string;
  assignmentName: string;
  assignmentDescription: string;
  creationDate: string;
  dueDate: string | null;
  totalSubmission: number;
  isPublished: boolean;
};

export const TeacherAssignmentInfoObject = builder
  .objectRef<TeacherAssignmentInfo>("TeacherAssignmentInfo")
  .implement({
    fields: (t) => ({
      id: t.exposeString("id"),
      courseName: t.exposeString("courseName"),
      assignmentName: t.exposeString("assignmentName"),
      assignmentDescription: t.exposeString("assignmentDescription"),
      creationDate: t.exposeString("creationDate"),
      dueDate: t.exposeString("dueDate", { nullable: true }),
      totalSubmission: t.exposeInt("totalSubmission"),
      isPublished: t.exposeBoolean("isPublished"),
    }),
  });

export type GetTeacherAssignmentsResponse = {
  success: boolean;
  message: string;
  data: TeacherAssignmentInfo[] | null;
};

export const GetTeacherAssignmentsResponseObject = builder
  .objectRef<GetTeacherAssignmentsResponse>("GetTeacherAssignmentsResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [TeacherAssignmentInfoObject],
        nullable: true,
      }),
    }),
  });

export type AssignmentStudentDetail = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string | null;
  studentPhoneCountryCode: number | null;
  status: string;
  score: number;
};

export const AssignmentStudentDetailObject = builder
  .objectRef<AssignmentStudentDetail>("AssignmentStudentDetail")
  .implement({
    fields: (t) => ({
      studentId: t.exposeString("studentId"),
      studentName: t.exposeString("studentName"),
      studentEmail: t.exposeString("studentEmail"),
      studentPhone: t.exposeString("studentPhone", { nullable: true }),
      studentPhoneCountryCode: t.exposeInt("studentPhoneCountryCode", { nullable: true }),
      status: t.exposeString("status"),
      score: t.exposeInt("score"),
    }),
  });

export type GetAssignmentSubmissionsResponse = {
  success: boolean;
  message: string;
  data: AssignmentStudentDetail[] | null;
};

export const GetAssignmentSubmissionsResponseObject = builder
  .objectRef<GetAssignmentSubmissionsResponse>("GetAssignmentSubmissionsResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [AssignmentStudentDetailObject],
        nullable: true,
      }),
    }),
  });

export type StudentAssignmentInfo = {
  courseName: string;
  assignmentTitle: string;
  assignmentDescription: string;
  creationDate: string;
  dueDate: string | null;
  status: string;
};

export const StudentAssignmentInfoObject = builder
  .objectRef<StudentAssignmentInfo>("StudentAssignmentInfo")
  .implement({
    fields: (t) => ({
      courseName: t.exposeString("courseName"),
      assignmentTitle: t.exposeString("assignmentTitle"),
      assignmentDescription: t.exposeString("assignmentDescription"),
      creationDate: t.exposeString("creationDate"),
      dueDate: t.exposeString("dueDate", { nullable: true }),
      status: t.exposeString("status"),
    }),
  });

export type GetStudentAssignmentsResponse = {
  success: boolean;
  message: string;
  data: StudentAssignmentInfo[] | null;
};

export const GetStudentAssignmentsResponseObject = builder
  .objectRef<GetStudentAssignmentsResponse>("GetStudentAssignmentsResponse")
  .implement({
    fields: (t) => ({
      success: t.exposeBoolean("success"),
      message: t.exposeString("message"),
      data: t.expose("data", {
        type: [StudentAssignmentInfoObject],
        nullable: true,
      }),
    }),
  });
