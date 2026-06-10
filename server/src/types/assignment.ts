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
