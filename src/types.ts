export type Attendance = {
  date: Date;
  subject: string;
  status: "Present" | "Absent" | "Other";
  time: string;
  type: "Lab" | "Theory" | "Workshop" | "Other";
  faculty: string;
  firstDiscovered: Date;
}[];
