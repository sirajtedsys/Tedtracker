import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/services/common.service';
// import { EmployeeService } from 'src/services/employee.service';
// import { ReportService } from 'src/services/report.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee-attendance-report',
  templateUrl: './employee-attendance-report.page.html',
  styleUrls: ['./employee-attendance-report.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class EmployeeAttendanceReportPage implements OnInit {

  Today:any
  fromdate:any
  todate:any
  CurrentDateTime: any;
  strFDate:any
  strTDate:any
 
  viewtype:string='table'
  Empid:number=0


  EmpList:any[]=[]
  EmpListDup:any[]=[]
  // Emp = new Employee()
  MenuGroupList:any
  // maritalStatusOptions:any
  // genderOptions:any
  Designationlist:any
  Departmentlist:any
  salutationlist:any

  ReportData:any[]=[]


  genderOptions: { id: number, name: string }[] = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];

  maritalStatusOptions: { id: number, name: string }[] = [
    { id: 1, name: 'Single' },
    { id: 2, name: 'Married' }
  ]; 
  UserTypeList: any;
  ReportDataDup: any;
  Employeelist: any[]=[];
  // datePipe: any;


  constructor(private comser:CommonService,
    // private empser:EmployeeService,
    // private repser:ReportService,
    private datePipe:DatePipe,
    private router:Router,
    // private Commstr:CommonMasterService,
    private loading:LoadingController)
   {
    
    this.comser.CheckUserActivetabs()
    this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.strFDate=this.Today
    this.strTDate=this.Today
    this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss ');

    this.LOaders()
    this.checkScreenSize()

    }

    ismobile:boolean=true
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.checkScreenSize();
    }
  
    checkScreenSize() {
      this.ismobile =   window.innerWidth < 768;
      // console.log('Is Mobile:', this.isMobile);
    
      // let v = { mob: this.isMobile };
      // localStorage.setItem('viewsize', JSON.stringify(v));
    }

    
  fileName: string = 'Employees_Attendance_Report.xlsx';

  exportToExcel(): void {
    // Map your data for export
    const exportData = this.ReportData.map((item, index) => ({
      'Sl.No': index + 1,
      'Department': item.SCT_NAME,
      'Date': item.DT ? new Date(item.DT) : '',
      'Employee': item.EMP_NAME,
      'In': item.PUNCH_IN ? new Date(item.PUNCH_IN) : '',
      'Out': item.PUNCH_OUT ? new Date(item.PUNCH_OUT) : '',
      'Total Hours': item.TOT_WORK_HRS_STR,
      'Total Break Hours': item.TOT_BREAK_HRS_STR,
      'Total Work Hours': item.DUR_STR
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Optional: apply formatting (e.g., date format)
    const dateFormat = 'dd-mmm-yyyy';
    const timeFormat = 'hh:mm AM/PM';

    const dateColumns = ['C', 'E', 'F']; // columns for Date, In, Out
    dateColumns.forEach(col => {
      for (let i = 2; i <= this.ReportData.length + 1; i++) {
        if (worksheet[`${col}${i}`]) {
          worksheet[`${col}${i}`].z = col === 'C' ? dateFormat : timeFormat;
        }
      }
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { Report: worksheet },
      SheetNames: ['Report']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellDates: true
    });

    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    FileSaver.saveAs(data, this.fileName);
  }

  

    // async AttendenceReport(id:any){
    //   const loading = await this.loading.create({
    //     cssClass: 'custom-loading', 
    //     message: 'Loading...', 
    //     spinner: 'dots', 
    //   });
    //   loading.present();
    //   this.comser.AttendenceReport(id).subscribe((data:any)=>{
    //     console.log(data);
        
    //     loading.dismiss()
    //     if(data && data!=null)
    //     {
    //       this.Employeelist=data
  
    //     }
    //     else
    //     {
    //       this.Employeelist=[]
    //     }
    //   }),(error:any)=>{
    //     console.log(error);
    //     loading.dismiss()
        
    //   }
    // }

 

  // toggleSidebar() {
  //   this.comser.toggleSidebar();
  // }

  // togglemobSidebar() {
  //   this.comser.togglemobSidebar();
  // }

  ngOnInit() {
  }



  LOaders(){
    // this.GetAllEmployees(0)
    this.GetReport()
  }

  calculateTotalWorkingTime(entry: any): string {
    console.log("Entry received:", entry);

    if (typeof entry !== 'object' || !entry.CheckIn || !entry.CheckOut || !Array.isArray(entry.BreakTime)) {
        console.error("Invalid entry format");
        return "Pending to checkOut";
    }

    let totalTime = 0; // Total working time in milliseconds
    let totalBreakTime = 0; // Total break time in milliseconds

    // Calculate working time for this entry
    const checkedIn = new Date(entry.CheckIn).getTime();
    const checkedOut = new Date(entry.CheckOut).getTime();
    totalTime = checkedOut - checkedIn;

    // Calculate break time for this entry
    entry.BreakTime.forEach((brk: any) => {
        const BreakOut = new Date(brk.BreakOut).getTime();
        const BreakIn = new Date(brk.BreakIn).getTime();
        totalBreakTime += BreakIn - BreakOut;
    });

    // Calculate effective working time (subtracting break time from working time)
    const effectiveWorkingTime = totalTime - totalBreakTime;

    // Convert to hours, minutes, seconds
    const hours = Math.floor(effectiveWorkingTime / (1000 * 60 * 60));
    const minutes = Math.floor((effectiveWorkingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((effectiveWorkingTime % (1000 * 60)) / 1000);

    return ` ${hours} : ${minutes} : ${seconds} `;
}

calculateTotalWorkingTime1(entry: any): string {
  console.log("Entry received:", entry);

  if (typeof entry !== 'object' || !entry.PUNCH_IN || !entry.PUNCH_OUT) {
      console.error("Invalid entry format");
      return "Pending to PUNCH_OUT";
  }

  let totalTime = 0; // Total working time in milliseconds
  let totalBreakTime = 0; // Total break time in milliseconds

  // Calculate working time for this entry
  const checkedIn = new Date(entry.PUNCH_IN).getTime();
  const checkedOut = new Date(entry.PUNCH_OUT).getTime();
  totalTime = checkedOut - checkedIn;

  // Calculate break time for this entry
  // entry.BreakTime.forEach((brk: any) => {
  //     const BreakOut = new Date(brk.BreakOut).getTime();
  //     const BreakIn = new Date(brk.BreakIn).getTime();
  //     totalBreakTime += BreakIn - BreakOut;
  // });
  totalBreakTime=entry.TOT_BREAK_HRS_MIN
  // Calculate effective working time (subtracting break time from working time)
  const effectiveWorkingTime = totalTime ;

  // Convert to hours, minutes, seconds
  const hours = Math.floor(effectiveWorkingTime / (1000 * 60 * 60));
  const minutes = Math.floor((effectiveWorkingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((effectiveWorkingTime % (1000 * 60)) / 1000);

  return ` ${hours} : ${minutes} : ${seconds} `;
}

calculateTotalWorkingTime2(entry: any): string {
  console.log("Entry received:", entry);

  if (typeof entry !== 'object' || !entry.PUNCH_IN || !entry.PUNCH_OUT) {
      console.error("Invalid entry format");
      return "Pending to PUNCH_OUT";
  }

  let totalTime = 0; // Total working time in milliseconds
  let totalBreakTime = 0; // Total break time in milliseconds

  // Calculate working time for this entry
  const checkedIn = new Date(entry.PUNCH_IN).getTime();
  const checkedOut = new Date(entry.PUNCH_OUT).getTime();
  totalTime = checkedOut - checkedIn;

  // Calculate break time for this entry
  // entry.BreakTime.forEach((brk: any) => {
  //     const BreakOut = new Date(brk.BreakOut).getTime();
  //     const BreakIn = new Date(brk.BreakIn).getTime();
  //     totalBreakTime += BreakIn - BreakOut;
  // });
  totalBreakTime=entry.TOT_BREAK_HRS_MIN
  // Calculate effective working time (subtracting break time from working time)
  const effectiveWorkingTime = totalTime - totalBreakTime;
console.log(totalTime)
console.log(totalBreakTime)
  // Convert to hours, minutes, seconds
  const hours = Math.floor(effectiveWorkingTime / (1000 * 60 * 60));
  const minutes = Math.floor((effectiveWorkingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((effectiveWorkingTime % (1000 * 60)) / 1000);

  return ` ${hours} : ${minutes} : ${seconds} `;
}

NavigateTo(route:any)
{
  this.router.navigate([route])
}

  async GetReport(){
    if(this.strFDate!='' && this.strFDate!=null)
      {
        if(this.strTDate!='' && this.strTDate!=null)
        {
          if(this.strTDate>=this.strFDate)
            {
    const loading = await this.loading.create({
      cssClass: 'custom-loading', 
      message: 'Loading...', 
      spinner: 'dots', 
    });
    loading.present();
    this.comser.AttendenceReport(this.strFDate,this.strTDate,this.Empid).subscribe((data:any)=>{
      loading.dismiss()
      console.log(data);
      
      if(data.Status==200)
      {
        this.ReportData=data.Data
        this.ReportDataDup=data.Data

      }
      else
      {
        Swal.fire(data.Message,'','error')
      }
    }),(error:any)=>{
      console.log(error);
      loading.dismiss()
      
    }
  }
  else
  {
    Swal.fire('Select Correct Dates','','warning')
  }

}
else
{
Swal.fire('select To date','','warning')
}

}
else
{
Swal.fire('select from date','','warning')
}
  }


  async ViewReport(items:any)
  {
     console.log(items);
 
     let d = this.datePipe.transform(items.PUNCH_IN,'yyyy-MM-dd')
     console.log(d);
     
      this.GetBreakDet(d,d,items.EMP_ID)
     
  }

  BreakDet:any[]=[]
  async GetBreakDet(fromd:any,tod:any,eid:any){
   const loading = await this.loading.create({
     cssClass: 'custom-loading', 
     message: 'Loading...', 
     spinner: 'dots', 
   });
       // console.log(this.clientId)
       await loading.present();
       this.comser.GetBreakDet(fromd,tod,eid).subscribe((data:any)=>{
         loading.dismiss()
         if(data.Status==200)
         {
           //console.log(this.call.CustomerId)
           console.log(data);
           this.BreakDet = data.Data
         }
       },(error:any)=>{
         loading.dismiss()
       }
     )
 
 }
 

  search(event: any) {
    let searchTerm = event?.target.value.toLowerCase().trim(); // Convert searchTerm to lowercase and trim whitespace
  
    if (searchTerm !== '') {
      this.ReportData = this.ReportDataDup.filter((item: any) => {
        // Filter BreakTime for breakIn and BreakOut to match search term
        let breakInMatch = item.BreakTime.some((brin: any) => 
          brin.breakIn?.toString().toLowerCase().includes(searchTerm)
        );
        let breakOutMatch = item.BreakTime.some((brin: any) => 
          brin.BreakOut?.toString().toLowerCase().includes(searchTerm)
        );
  
        // Check for matches in other item properties
        return (
          item.CheckIn?.toString().toLowerCase().includes(searchTerm) ||
          item.EmployeeName?.toString().toLowerCase().includes(searchTerm) ||
          item.CheckOut?.toString().toLowerCase().includes(searchTerm) ||
          item.LogDate?.toString().toLowerCase().includes(searchTerm) ||
          item.CheckInPlace?.toString().toLowerCase().includes(searchTerm) ||
          item.CheckOutPlace?.toString().toLowerCase().includes(searchTerm) ||
          breakInMatch || 
          breakOutMatch
        );
      });
    } else {
      this.ReportData = this.ReportDataDup;
    }
  }
  search1(event: any) {
    let searchTerm = event?.target.value.toLowerCase().trim(); // Convert searchTerm to lowercase and trim whitespace
  
    if (searchTerm !== '') {
      this.ReportData = this.ReportDataDup.filter((item: any) => {
        // Filter BreakTime for breakIn and BreakOut to match search term
        let breakInMatch = item.BreakTime.some((brin: any) => 
          brin.breakIn?.toString().toLowerCase().includes(searchTerm)
        );
        let breakOutMatch = item.BreakTime.some((brin: any) => 
          brin.BreakOut?.toString().toLowerCase().includes(searchTerm)
        );
  
        // Check for matches in other item properties
        return (
          item.PUNCH_IN?.toString().toLowerCase().includes(searchTerm) ||
          item.EmployeeName?.toString().toLowerCase().includes(searchTerm) ||
          item.PUNCH_OUT?.toString().toLowerCase().includes(searchTerm) ||
          item.LogDate?.toString().toLowerCase().includes(searchTerm) ||
          // item.CheckInPlace?.toString().toLowerCase().includes(searchTerm) ||
          // item.CheckOutPlace?.toString().toLowerCase().includes(searchTerm) ||
          breakInMatch || 
          breakOutMatch
        );
      });
    } else {
      this.ReportData = this.ReportDataDup;
    }
  }
 
   


}
