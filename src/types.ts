export type Attendance = {
  date: string;
  subject: string;
  status: "Present" | "Absent" | "Other";
  time: string;
  type: "Lab" | "Theory" | "Workshop" | "Other";
  faculty: string;
  firstDiscovered: Date;
}[];
