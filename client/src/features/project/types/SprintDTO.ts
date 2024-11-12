export interface SprintDTO {
  sprintId : number;
  state : "active" | "closed";
  name : string;
  startDate : Date;
  endDate : Date;
  completeDate : Date;
  createdDate : Date;
  goal : string;
}