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
import { Router } from '@angular/router';
import { Attendence } from 'src/class/Attendence';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-attendence-report',
  templateUrl: './attendence-report.page.html',
  styleUrls: ['./attendence-report.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class AttendenceReportPage implements OnInit {

  Today:any
  fromdate:any
  todate:any
  CurrentDateTime: any;
  strFDate:any
  strTDate:any
  bltype:any='true'
 
  viewtype:string='summary'     //report // summary
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
  ReportData1:any[]=[]
  BreakDet:any[]=[]

  attend = new Attendence()
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
  ReportDataDup1: any;
  Employeelist: any[]=[];
  PunchRemarks:any;
  // EmpId: any;
  // datePipe: any;


  constructor(private comser:CommonService,
    // private empser:EmployeeService,
    // private repser:ReportService,
    private loader:LoadingController,
    private router:Router,
    private datePipe:DatePipe,
    // private Commstr:CommonMasterService,
  private loading:LoadingController)
   {
    this.checkScreenSize()
    this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let d = this.comser.getFirstDayOfMonth(this.Today)
    this.strFDate=this.datePipe.transform(d,'yyyy-MM-dd')
    this.strTDate=this.Today
    this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss ');

    this.LOaders()

    }


    fileName: string = 'Attendance_Report.xlsx';

    exportToExcel(): void {
      // Map your data for export
      const exportData = this.ReportData1.map((item, index) => ({
        'Sl.No': index + 1,
        'Date': item.DT ? new Date(item.DT) : '',
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
  
      const dateColumns = ['B', 'C', 'D']; // columns for Date, In, Out
      dateColumns.forEach(col => {
        for (let i = 2; i <= this.ReportData1.length + 1; i++) {
          if (worksheet[`${col}${i}`]) {
            worksheet[`${col}${i}`].z = col === 'B' ? dateFormat : timeFormat;
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


    NavigateTo(route:any)
    {
      this.router.navigate([route])
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


  LOaders(){
    // this.GetAllEmployees(0)
    this.getUserDetails()
    this.GetReport1(true)
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
console.log(effectiveWorkingTime)
  // Convert to hours, minutes, seconds
  const hours = Math.floor(effectiveWorkingTime / (1000 * 60 * 60));
  const minutes = Math.floor((effectiveWorkingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((effectiveWorkingTime % (1000 * 60)) / 1000);

  return ` ${hours} : ${minutes} : ${seconds} `;
}

  async GetReport(bltype:any){
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
    this.bltype='false'
    this.comser.GetAttenReport(this.strFDate,this.strTDate,this.Empid,this.bltype).subscribe((data:any)=>{
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
    
     this.GetBreakDet(d,d)
    
 }
 async ViewPunch(items:any)
 {
    console.log(items);
  
    this.attend.PunchId=items.PUNCH_ID
    console.log(this.attend.PunchId)
    this.attend.PunchRemarks=items.PUNCH_RMKS

    // let d = this.datePipe.transform(items.PUNCH_IN,'yyyy-MM-dd')
    // console.log(d);
    
    //  this.GetBreakDet(d,d)
    
 }
 async getUserDetails(){
  const loading = await this.loading.create({
    cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
    message: 'Loading...', // Optional: Custom message
    spinner: 'dots', // Optional: Choose a spinner
    // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
  });
  await loading.present();
  this.comser.GetEmployeeDetails().subscribe((data:any)=>{
    loading.dismiss()
    console.log(data);
    
    // this.comser.dismissLoading();
    if(data.Status==200)
    {
  
      // this.EmpData=data.Data

      this.Empid = data.Data[0].EMP_ID
      // this.EmpName = this.EmpData[0].EMP_NAME
      // this.EmpCode = this.EmpData[0].EMP_CODE

      // this.GetEmployeePunchcDetails(this.EmpId,this.Today)
      // this.getEmployeeAssignedTaskDetails(this.EmpId)
      
    }
    else
    {
      // console.log(s);
      Swal.fire(data.Message,'','error')
      
      // console.log('ddd');
      this.router.navigate(['login'])
      localStorage.removeItem('extrtype')
      
    }
  },
(error:any)=>{
  // this.comser.dismissLoading()
  loading.dismiss()
})
}
 async GetBreakDet(fromd:any,tod:any){
  const loading = await this.loading.create({
    cssClass: 'custom-loading', 
    message: 'Loading...', 
    spinner: 'dots', 
  });
      // console.log(this.clientId)
      await loading.present();
      this.comser.GetBreakDet(fromd,tod,this.Empid).subscribe((data:any)=>{
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


  
  async GetReport1(bltype:any){
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
    this.bltype='true'
    this.comser.GetAttenReport(this.strFDate,this.strTDate,this.Empid,this.bltype).subscribe((data:any)=>{
      loading.dismiss()
      console.log(data);
      
      if(data.Status==200)
      {
        this.ReportData1=data.Data
        this.ReportDataDup1=data.Data

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


  async Submit1(){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
console.log(this.attend)
    await loading.present();
    this.comser.SaveRemarks(this.attend).subscribe((data:any)=>{
      console.log(data,"dta");

      loading.dismiss()
      if(data.Status==200)
      {
        Swal.fire(data.Message,'','success')
      }
      else{
        Swal.fire(data.Message,'','warning')
      }

    },(error:any)=>{
      loading.dismiss()
      console.log(error,"error");
      
    })

   

  }
 

 

}

