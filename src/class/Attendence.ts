export class Attendence{
    P_OPR_ID:number=0
    PunchId: number = 0;
    PunchDate?: Date;
    PunchType: number = 0;
    EmpId: string = "0";
    Where1?: string;
    Where?: string;
    Hdr: number = 0;
    StrSDate?: string;
    StrFDate?: string;
    PunchFrom?: number | null = null;
    ProjectId?: number| null = null; 
    PunchRemarks:string=''
   
}