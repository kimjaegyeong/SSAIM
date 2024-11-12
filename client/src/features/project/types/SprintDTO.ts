export interface SprintCreateDTO {
  name : string;
  startDate : Date;
  endDate : Date;
  goals : string;
}

export interface SprintDTO extends SprintCreateDTO{
  sprintId : number;
  state : "active" | "closed";
  completeDate : Date;
  createdDate : Date;
  name : string;
  startDate : Date;
  endDate : Date;
  goal : string;
}