import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
import { CommonService } from 'src/services/common.service';
import { Router } from '@angular/router';
import {LoadingController,ModalController} from '@ionic/angular'


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-all-work-report',
  templateUrl: './all-work-report.page.html',
  styleUrls: ['./all-work-report.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class AllWorkReportPage implements OnInit {

  viewtype: string = 'table';
  SelectedDate:any

  ProjectList: any[] = [];
  ClientList: any[] = [];
  ModuleList: any[] = [];
  CallTypeList: any[] = [];
  StatusList: any[] = [];
  ErrorTypeList: any[] = [];
  EmergencyList: any[] = [];
  ErrorList: any[] = [];
  CustomerList: any[] = [];

  SelectedProject: number = 0;
  SelectedClient: number = 0;
  Selectedmodule: number = 0;
  SelectedCallType: number = 0;
  SelectedStatus: number = 0;
  SelectedEmergency: number = 0;
  SelectedErrorType: number = 0;

  SelectedProjectName: string = '';
  SelectedClientName: string = '';
  SelectedmoduleName: string = '';
  SelectedCallTypeName: string = '';
  SelectedStatusName: string = '';
  SelectedEmergencyName: string = '';
  SelectedErrorTypeName: string = '';

  Employeelist: any[] = [];

  TaskList: any[] = [];
  TaskListDup: any[] = [];
  Departmentlist: any;

  EmpData: any[] = [];
  EmpCode: string = '';
  EmpName: string = '';
  EmpId: number = 0;

  Today: any;
  fromdate: any;
  todate: any;
  CurrentDateTime: any;

  constructor(
    private comser: CommonService,
    private loader: LoadingController,
    private router: Router,
    private datePipe: DatePipe,
    private modalController: ModalController,
    private loading: LoadingController
  ) {
    
    this.comser.CheckUserActivetabs()
    this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fromdate = this.Today;
    this.todate = this.Today;
    this.SelectedDate=this.Today
    this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    this.checkScreenSize()
    this.LOaders();
    this.getEmployeeAssignedTaskDetails()
  }

  Datechange(){
    // let val  = event.target.value
    // console.log(val);
    // let d = this.datePipe.transform(val,'yyyy-MM-dd')
    // this.SelectedDate=d
    this.getEmployeeAssignedTaskDetails()

  }

  calculateTotalWorkHours(tasks: any[]) {
    let totalHours = 0;
    let totalMinutes = 0;
  
    tasks.forEach(task => {
      totalHours += task.TOTAL_WORK_HOURS;
      totalMinutes += task.TOTAL_WORK_MINUTES;
    });
  
    // Convert minutes into hours if >= 60
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
  // console.log(totalHours+' Hour and '+totalMinutes+' Minutes');
  
     let v = totalHours+' Hour and '+totalMinutes+' Minutes';
    return v
  }


  ismobile:boolean=true
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.ismobile =   window.innerWidth < 992;
    // console.log('Is Mobile:', this.isMobile);
  
    // let v = { mob: this.isMobile };
    // localStorage.setItem('viewsize', JSON.stringify(v));
  }
  ngOnInit() { }

  AddTasksMaster() {
    this.viewtype = 'form';
  }

  LOaders() {
    this.getUserDetails();
    this.GetEmployee()
  }

  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }

  async getUserDetails() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    this.comser.GetEmployeeDetails().subscribe(
      (data: any) => {
        loading.dismiss();
        if (data.Status == 200) {
          this.EmpData = data.Data;
          this.EmpId = this.EmpData[0].EMP_ID;
          this.EmpName = this.EmpData[0].EMP_NAME;
          this.EmpCode = this.EmpData[0].EMP_CODE;
          // this.getEmployeeAssignedTaskDetails(this.EmpId);
        } else {
          Swal.fire(data.Message, '', 'error');
          this.router.navigate(['login']);
          localStorage.removeItem('extrtype');
        }
      },
      (error: any) => {
        loading.dismiss();
      }
    );
  }


  fileName: string = 'All_Work_Report.xlsx';

  exportToExcel(): void {
    // Map your data for export
    const exportData = this.TaskList.map((item, index) => ({
      'Sl.No': index + 1,
      'Work Ref': item.WORK_REFNO ,
      'Employee': item.EMP_NAME,
      'Date': item.WORK_DATE ? new Date(item.WORK_DATE) : '',
      'Project': item.PROJECT_NAME,
      'Module': item.MODULE_NAME,
      'Task Status': item.WORK_STATUS,
      'Description': item.CALLED_DESCRIPTION,
      'Completion Percentage': item.TOTAL_WORK_PERCENTAGE,
      'Total Work Time': item.TOTAL_WORK_HOURS==null?0:item.TOTAL_WORK_HOURS +':'+item.TOTAL_WORK_MINUTES==null?0:item.TOTAL_WORK_MINUTES,
      'Progress Note': item.PROGRESS_NOTE
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Optional: apply formatting (e.g., date format)
    const dateFormat = 'dd-mmm-yyyy';
    const timeFormat = 'hh:mm AM/PM';

    const dateColumns = ['D']; // columns for Date, In, Out
    dateColumns.forEach(col => {
      for (let i = 2; i <= this.TaskList.length + 1; i++) {
        if (worksheet[`${col}${i}`]) {
          worksheet[`${col}${i}`].z = col === 'D' ? dateFormat : timeFormat;
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

  async getEmployeeAssignedTaskDetails() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    this.comser.GetAllWorkSheet(this.fromdate,this.todate).subscribe(
      (data: any) => {
        console.log(data);
        
        loading.dismiss();
        if (data.Status == 200) {
          if (data.Data.length > 0) {
            this.TaskList = data.Data;
            this.TaskListDup = data.Data;
          } else {
            this.TaskList = [];
            this.TaskListDup = [];
          }
        } else {
          Swal.fire(data.Message, '', 'error');
          this.TaskList = [];
          this.TaskListDup = [];
        }
      },
      (error: any) => {
        loading.dismiss();
      }
    );
  }

  FilterByEmployee(event:any)
  {
    let val  = event.target.value

    this.TaskList = this.TaskListDup.filter((x:any)=>x.EMP_NAME == val)
  }

  search(event: any) {
    let searchTerm = event?.target.value.toLowerCase().trim();
    if (searchTerm != '') {
      this.TaskList = this.TaskListDup.filter((item: any) => {
        let d = this.datePipe.transform(item.WORK_DATE,'dd/MMM/yyyy')?.toString().toLowerCase()
        return (
          item.EMP_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.WORK_REFNO?.toString().toLowerCase().includes(searchTerm) ||
          item.CUST_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.PROJECT_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.MODULE_NAME?.toString().toLowerCase().includes(searchTerm) ||
          item.WORK_STATUS?.toString().toLowerCase().includes(searchTerm) ||
          item.CALLED_DESCRIPTION?.toString().toLowerCase().includes(searchTerm) ||
          item.TOTAL_WORK_PERCENTAGE?.toString().toLowerCase().includes(searchTerm) ||
          item.TOTAL_WORK_HOURS?.toString().toLowerCase().includes(searchTerm) ||
          d?.includes(searchTerm)||
          item.TOTAL_WORK_MINUTES?.toString().toLowerCase().includes(searchTerm) ||
          item.PROGRESS_NOTE?.toString().toLowerCase().includes(searchTerm)
        );
      });
    } else {
      this.TaskList = this.TaskListDup;
    }
  }

  ngOnDestroy() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
  }

  deleteTask(index: number, items:any) {
    // console.log(workId);
    
    Swal.fire({
      title: 'Do you want to Delete?',
      text: "Saved Data will be lost!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!'
  }).then((result) => {
      if (result.isConfirmed) {
          // Call your delete service here
          // this.authser.LogOutMethod()
          this.DeleteWorkSheet(items.WORK_SHEET_ID)
          
      }
  });
    
  }

  CheckWorkDateIsToday(workdate:any){
    let wd  = this.datePipe.transform(workdate,'yyyy-MM-dd')
    if(wd==this.Today)
    {
      return true
    }
    else
    {
      return false
    }
  }

  async DeleteWorkSheet(Id:any) {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    this.comser.DeleteDailyWorkSheetAsync(Id).subscribe(
      (data: any) => {
        loading.dismiss();
        if (data.Status == 200) {
          Swal.fire(data.Message,'','success')
          this.getEmployeeAssignedTaskDetails()
          // this.getEmployeeAssignedTaskDetails(this.EmpId);
        } else {
          Swal.fire(data.Message, '', 'error');
        }
      },
      (error: any) => {
        loading.dismiss();
      }
    );
  }

  async GetEmployee(){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetEmployee().subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            this.Employeelist = data.Data
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }
  
}
