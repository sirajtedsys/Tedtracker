import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { CommonService } from 'src/services/common.service';
// import { EmployeeService } from 'src/services/employee.service';
// import { LocationService } from 'src/services/location.service';
// import { TaskService } from 'src/services/task.service';
import Swal from 'sweetalert2';
// import { TaskStatusUpdatePage } from '../task-status-update/task-status-update.page';
// import { ViewTaskDetailsPage } from '../view-task-details/view-task-details.page';
// import { Tasks } from 'src/class/Tasks';

import { Location } from '@angular/common'; // Import Location
import { FormsModule } from '@angular/forms';
import { CommonModalPage } from 'src/app/shared/common-modal/common-modal.page';
import { DailyWorkSheet } from 'src/class/DailyWorkSheet';
import { AppConfig } from 'src/class/AppConfig';
declare var bootstrap: any;

@Component({
  selector: 'app-employee-task-list',
  templateUrl: './employee-task-list.page.html',
  styleUrls: ['./employee-task-list.page.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule]
})
export class EmployeeTaskListPage implements OnInit {

 appconfig = new AppConfig()
  viewtype:string='table'

  AttachList:any[]=[]
  ProjectList:any[]=[]
  ClientList:any[]=[]
  ModuleList:any[]=[]
  CallTypeList:any[]=[]
  StatusList:any[]=[]
  ErrorTypeList:any[]=[]
  EmergencyList:any[]=[]
  ErrorList: any[]=[];
  CustomerList: any[]=[];
 

  SelectedProject:number=0
  SelectedClient:number=0
  Selectedmodule:number=0
  SelectedCallType:number=0
  SelectedStatus:number=0
  SelectedEmergency:number=0
 SelectedErrorType:number=0

 SelectedProjectName:string=''
 SelectedClientName:string=''
 SelectedmoduleName:string=''
 SelectedCallTypeName:string=''
 SelectedStatusName:string=''
 SelectedEmergencyName:string=''
SelectedErrorTypeName:string=''

  Employeelist:any[]=[]

  TaskList:any[]=[]
 
  ProjectId:any
  UserTypeList: any;
  EmpCode:string=''
  EmpName:string=''
  EmpId:number=0
 
  Today:any
  fromdate:any
  todate:any
  CurrentDateTime: any;
  AttendenceBreakDetails:any
  TaskStatusList: any;

  TaskStatusFilter:number=0
  TaskListDup: any[]=[];
  Departmentlist: any;
// 
  // Tasks = new Tasks()
  // ClientList: any;
  
  subscription: any;

  
  specificPages = ['/login', '/home/dashboard'];
  EmpData: any[]=[];

  constructor(private comser:CommonService,
    private loader:LoadingController,
    // private tser:TaskService,
    // private empser:EmployeeService,
    private router:Router,
    private platform: Platform,
    private location: Location,
    
  private datePipe:DatePipe,
  // private locser:LocationService,
  private modalController: ModalController,
    // private Commstr:CommonMasterService,
  private loading:LoadingController)
   {

    this.comser.CheckUserActivetabs()
    this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fromdate=this.Today
    this.todate=this.Today
    this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');

    
    
this.checkScreenSize()
    this.LOaders()
    // this.locationanmre()
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      const currentUrl = this.router.url;

      // Check if current page is in the specific pages list
      
        // Navigate to the previous page if it's not a specific page
        if(this.viewtype=='form')
        {
          this.viewtype='table'
        }
        else
        {
          this.location.back();
        }
      
    });

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

    // listenToResize() {
    //   fromEvent(window, 'resize')
    //     .pipe(debounceTime(200)) // Wait 200ms after user stops resizing
    //     .subscribe(() => {
    //       this.checkScreenSize();
    //     });
    // }

    NavigateTo(route:any)
    {
      this.router.navigate([route])
    }

    async GetActiveProjects(){
      const loading = await this.loader.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
          // console.log(this.clientId)
          await loading.present();
          this.comser.GetActiveProjects1().subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              //console.log(this.call.CustomerId)
              console.log(data);
              this.ProjectList = data.Data
            }
          },(error:any)=>{
            loading.dismiss()
          }
        )
  
    }
    async GetCallTypes(){
      const loading = await this.loader.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
          
          await loading.present();
          this.comser.GetCallTypes().subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              console.log(data);
              this.CallTypeList = data.Data
            }
          },(error:any)=>{
            loading.dismiss()
          }
        )
  
    }
    async GetEmergency(){
      const loading = await this.loader.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
          
          await loading.present();
          this.comser.GetEmergency().subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              console.log(data);
              this.EmergencyList = data.Data
            }
          },(error:any)=>{
            loading.dismiss()
          }
        )
  
    }
    async GetModule(){
      const loading = await this.loader.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
          
          await loading.present();
          this.comser.GetModules().subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              console.log(data);
              this.ModuleList = data.Data
            }
          },(error:any)=>{
            loading.dismiss()
          }
        )
  
    }
    async GetError(){
      const loading = await this.loader.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
          
          await loading.present();
          this.comser.GetError().subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              console.log(data);
              this.ErrorTypeList = data.Data
            }
          },(error:any)=>{
            loading.dismiss()
          }
        )
  
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
  
    async GetClients(ProjectId:any){
      const loading = await this.loader.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
          
          await loading.present();
          this.comser.GetClients(ProjectId).subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              console.log(data);
              this.ClientList = data.Data
            }
          },(error:any)=>{
            loading.dismiss()
          }
        )
  
    }


  ngOnInit() {
  }

  AddTasksMaster(){
    this.viewtype='form'
  }

  LOaders(){
    this.getUserDetails()

    // this.GetAllClients()
    this.GetCallTypes()
    // this.GetClients()
    this.GetActiveProjects()
    this.GetEmergency()
    this.GetEmployee()
    this.GetError()
    this.GetModule()
    // this.GetAllTaskStatus

    // this.GetAllTaskStatus()
    // this.GetAllClients(0)
    // this.GetUserCurretDayAttendecneDetails()
    // this.getEmployeeAssignedTaskDetails()
    // this.GetAllDepartmentMaster()
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
    
        this.EmpData=data.Data

        this.EmpId = this.EmpData[0].EMP_ID
        this.EmpName = this.EmpData[0].EMP_NAME
        this.EmpCode = this.EmpData[0].EMP_CODE

        // this.GetEmployeePunchcDetails(this.EmpId,this.Today)
        this.getEmployeeAssignedTaskDetails(this.EmpId)
        
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

  ClearFilters(){
      this.SelectedCallType=0
      this.SelectedClient=0
      this.SelectedProject=0
      this.Selectedmodule=0
      this.SelectedEmergency=0
      // this.SelectedStatus=0
      this.SelectedErrorType=0
      // this.selectedE
  }

  onCustomerChange(event: any) {
    console.log('Selected Customer:', event.target.value);
    // this.clientId=event.;
    // this.GetActiveProjects(event.target.value)
    this.GetActiveProjects()
  }
  onProjectChange(event: any) {
    console.log('Selected ProjectId:', event);
    this.ProjectId=event;
     this.GetClients(this.ProjectId)
    // this.GetActiveProjects(this.clientId)
  }

  // async GetAllDepartmentMaster(){
  //   const loading = await this.loading.create({
  //     cssClass: 'custom-loading', 
  //     message: 'Loading...', 
  //     spinner: 'dots', 
  //   });
  //   loading.present();
  //   this.comser.GetAllDepartmentMaster(3).subscribe((data:any)=>{
  //     console.log(data);
      
  //     loading.dismiss()
  //     if(data && data!=null)
  //     {
  //       this.Departmentlist=data

  //     }
  //     else
  //     {
  //       this.Departmentlist=[]
  //     }
  //   }),(error:any)=>{
  //     console.log(error);
  //     loading.dismiss()
      
  //   }
  // }



  async getEmployeeAssignedTaskDetails(empid:any){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();
    this.comser.GetWorkAssignments(empid).subscribe((data:any)=>{
      loading.dismiss()
      console.log(data);
      
      // this.comser.dismissLoading();
      if(data.Status==200)
      {
        if(data.Data.length>0)
        {

          this.TaskList=data.Data
          this.TaskListDup=data.Data
        }
        else
        {
          this.TaskList=[]
          this.TaskListDup=[]
        }
    
      
        
      }
      else
      {
        Swal.fire(data.Message,'','error')
        // console.log('ddd');
        this.TaskList=[]
        this.TaskListDup=[]
        
      }
    },
  (error:any)=>{
    // this.comser.dismissLoading()
    loading.dismiss()
  })
  }

  async GetAllClients(id:any){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', 
      message: 'Loading...', 
      spinner: 'dots', 
    });
    loading.present();
    // this.comser.getAllClients(id).subscribe((data:any)=>{
    //   console.log(data);
      
    //   loading.dismiss()
    //   if(data && data!=null)
    //   {
    //     this.ClientList=data

    //   }
    //   else
    //   {
    //     this.ClientList=[]
    //   }
    // }),(error:any)=>{
    //   console.log(error);
    //   loading.dismiss()
      
    // }
  }

  async GetAllTaskStatus(){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', 
      message: 'Loading...', 
      spinner: 'dots', 
    });
    // loading.present();
    // this.comser.GetALLCommonMastersBytypeID(4).subscribe((data:any)=>{
    //   loading.dismiss()
    //   console.log(data);
      
    //   if(data && data!=null)
    //   {
    //     this.TaskStatusList=data

    //   }
    //   else
    //   {
    //     this.TaskStatusList=[]
    //   }
    // }),(error:any)=>{
    //   console.log(error);
    //   loading.dismiss()
      
    // }
  }



//   async ChangetaskStatus(){
//     const loading = await this.loading.create({
//       cssClass: 'custom-loading', 
//       message: 'Loading...', 
//       spinner: 'dots', 
//     });
//     // loading.present();
//     // loading.dismiss();
//     // let inputOptions = {};
//    // Define inputOptions as an object with number keys and string values
// let inputOptions: { [key: number]: string } = {};

// this.TaskStatusList.forEach((item: { commstrid: number; commstrnam: string }) => {
//   inputOptions[item.commstrid] = item.commstrnam;
// });

    
//     const { value: taskStatus } = await Swal.fire({
//       title: "Select Task Status",
//       input: "select",
//       inputOptions: inputOptions,
//       inputPlaceholder: "Select a task status",
//       showCancelButton: true,
//       inputValidator: (value) => {
//         return new Promise((resolve) => {
//           if (value) {
//             console.log(value);
            
//             resolve();
//           } else {
//             resolve("You need to select a task status.");
//           }
//         });
//       }
//     });
    
//     // if (taskStatus) {
//     //   const selectedStatus = this.TaskStatusList.find((status:any) => status.commstrid == taskStatus);
//     //   Swal.fire(`You selected: ${selectedStatus.commstrnam}`);
//     // }
    

//   }


  ChangeTaskiListing(event:any)
  {
    let val = event.target.value
    console.log(val);
    
    if(val!=0)
    {
      this.TaskList = this.TaskListDup.filter((x:any)=>x.TaskStatus == val)
    }
    else
    {
      this.TaskList = this.TaskListDup
    }

    // let searchTerm = event?.target.value.toLowerCase().trim(); // Convert searchTerm to lowercase and trim whitespace
    //   if(searchTerm!='')
    //    {
    //    this.TasksList = this.TasksListDup.filter((item:any) =>
    //    {
    //     let gender = item.patigender==1?'male':item.patigender==2?'female':''
    //     let status = item.patistatus==0?'active':item.patistatus==1?'inactive':item.patistatus==2?'deleted':''
    //     return(
    //       item.patiname?.toString().toLowerCase().includes(searchTerm) ||     
    //       item.patino?.toString().toLowerCase().includes(searchTerm) ||        
    //      //  item.pa.toLowerCase().includes(searchTerm) ||        
    //       item.patimobile?.toString().toLowerCase().includes(searchTerm) ||
    //       gender.includes(searchTerm) ||
    //       status.includes(searchTerm)
    //       // earch by item description
    //           // Add more conditions for other properties if needed
    //       );
  
       
    //    }
    //   )
         
    //  }
    //  else
    //  {
    //    this.TasksList =this.TasksListDup
    //  }
  }

  async ViewTaskStatus(task:any){

    // {
    //   const modal = await this.modalController.create({
    //     component: ViewTaskDetailsPage,
    //     componentProps: {
    //       task: task,
    //       // taskDescription: task.description
    //     }
    //   });
  
    //   return await modal.present();
    // }
  }
  search(event: any) {
    let searchTerm = event?.target.value.toString().toLowerCase().trim(); // Convert search input to lowercase and trim whitespace

    if (searchTerm !== '') {
        this.TaskList = this.TaskListDup.filter((item: any) => {
            let d = (this.datePipe.transform(item.WORK_DATE, 'dd/MMM/yyyy') || '').toLowerCase(); // Ensure it's lowercase

            return (
                item.WORK_REFNO?.toString().toLowerCase().includes(searchTerm) ||     
                item.CUST_NAME?.toString().toLowerCase().includes(searchTerm) ||        
                item.PROJECT_NAME?.toString().toLowerCase().includes(searchTerm) ||
                item.MODULE_NAME?.toString().toLowerCase().includes(searchTerm) ||
                item.CALL_TYPE?.toString().toLowerCase().includes(searchTerm) ||
                item.ERROR_TYPE?.toString().toLowerCase().includes(searchTerm) ||
                item.WORK_STATUS?.toString().toLowerCase().includes(searchTerm) ||
                item.CALLED_DESCRIPTION?.toString().toLowerCase().includes(searchTerm) ||
                item.EMP_NAME?.toString().toLowerCase().includes(searchTerm) ||
                d.includes(searchTerm) ||  // Now safe and matches lowercase input
                item.EMERGENCY_TYPE?.toString().toLowerCase().includes(searchTerm)
            );
        });
    } else {
        this.TaskList = this.TaskListDup;
    }
}



  // statuscheck():boolean{
    // if(this.Tasks.EntryActive==0)
    //   {
    //     return true
    //   }
    //   else
    //   {
    //     // this.statuscheck=false
    //     return false
    //   }
  
  // }
  
  ENtryActiveCheck(event:any){
    console.log(event.target.checked);
    let ev  = event.target.checked
  
    // if(ev == true)
    // {
    //   this.Tasks.EntryActive=0
    // }
    // else
    // {
    //   this.Tasks.EntryActive=1
    // }
    
  
  }

  isValidNumber(input: string): boolean {
    const regex = /^(100|[1-9][0-9]?)$/; // Matches numbers from 1 to 100 (no zero, no decimals)
    return regex.test(input);
  }
  isValidPositiveNumber(input: string): boolean {
    if (input === null || input === '0') {
      return true;  // Allow null and '0'
    }
    
  const regex = /^[1-9][0-9]*$/; // Matches numbers greater than 0 (no decimals)
    return regex.test(input);
  }

  isValidNumber2(input: string | null): boolean {
    if (input === null || input === '0') {
      return true;  // Allow null and '0'
    }
  
    const regex = /^(60|[0-5]?[0-9])$/; // Matches numbers from 0 to 60
    return regex.test(input);
  }


  CheckWhetherNumberORHourEnters() {
    // Check if TotalWorkHours is provided and valid
    if (this.dws.TotalWorkHours != null && this.dws.TotalWorkHours !== '') {
      if (this.isValidPositiveNumber(this.dws.TotalWorkHours)) {
        return true;
      } else {
        Swal.fire('Entered Invalid Total Work Hour Value', 'Enter a value greater than 0 and without decimal points', 'warning');
        return false;
      }
    }
  
    // Check if TotalWorkMinutes is provided and valid
    if (this.dws.TotalWorkMinutes != null && this.dws.TotalWorkMinutes !== '') {
      if (this.isValidNumber2(this.dws.TotalWorkMinutes)) {
        return true;
      } else {
        Swal.fire('Entered Invalid Total Work Minute', 'Enter a number within range of 0 to 60 without decimal points', 'warning');
        return false;
      }
    }
  
    // If neither field is provided, show a warning that at least one field is required
    Swal.fire('Missing Total Work Hours or Minutes', 'At least one of the fields (Total Work Hours or Total Work Minutes) is required', 'warning');
    return false;
  }

  CheckWhetherEMployeeIsSelectedORNotInReassignCase(){
    if(this.dws.StatusId=='2')
    {
      if(this.dws.EmpId!=0 && this.dws.EmpId!=null)
      {
        return true
      }
      else
      {
        Swal.fire('Select A Employee To Continue','','warning')
        return false
      }
    }
    else
    {
      return true
    }
  }
  
ProgressFormValidation(){
  if(this.isValidNumber(this.dws.TotalWorkPercentage))
  {
    if(this.CheckWhetherNumberORHourEnters())
    {
 
      if(this.dws.ProgressNote!='' && this.dws.ProgressNote!=null)
        {
          return true
        }
        else
        {
          Swal.fire('Enter any remarks to submit','','warning')
          return false
        }
    }
    else
    {
      return false
    }
     
    

   

  }
  else
  {
    Swal.fire('Entered Invalid Percentage Value','Enter a value from 0 to 100 without decimal points','warning')
    return false
  }

}
  //assign employeeid while submiossion````````
  async Submit(){
    // console.log(employeeForm.valid);
      // this.Tasks.EmployeeId = this.EmpId
      const loading = await this.loading.create({
        cssClass: 'custom-loading', 
        message: 'Loading...', 
        spinner: 'dots', 
      });
      if(this.dws.StatusId=='2')
      {
        if(this.CheckWhetherEMployeeIsSelectedORNotInReassignCase())
          {
            this.ReassignToAnotherEmployeeSubmit()
          }
      }
      else
      {
        if(this.ProgressFormValidation())
          {
            if(this.dws.TotalWorkHours=='')
            {
              this.dws.TotalWorkHours='0'
            }
              loading.present()
              this.comser.SaveAppDailyWorkSheetAsync(this.dws).subscribe((data:any)=>{
                loading.dismiss()
                if(data.Status==200)
                {
                  
                  Swal.fire(data.Message,'','success')
                  this.closeModal()
                  this.dws=new DailyWorkSheet()
                  this.LOaders()
                }
                else
                {
                  Swal.fire(data.Message,'','error')
                }
              },(error:any)=>{
                loading.dismiss()
              })
           
           
           
            
          }
      }
 
    
        

    
   

  }


 async ReassignToAnotherEmployeeSubmit(){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', 
      message: 'Loading...', 
      spinner: 'dots', 
    });
    await loading.dismiss()
    this.comser.ReassignTonewEmployeeFromInbox(this.dws).subscribe((data:any)=>{
      loading.dismiss()
      console.log(data);
      
      if(data.Status==200)
      {
        // this.LOaders()
        Swal.fire(data.Message,'','success')
        this.dws = new DailyWorkSheet()
        this.closeModal()
        this.LOaders()

      }
      else
      {
        Swal.fire(data.Messge,'','warning')
      }
    },(error:any)=>{
      loading.dismiss()
    })
  }

  totalWorkPercentageError: string | null = null;
  totalWorkHoursError: string | null = null;
  totalWorkMinutesError: string | null = null;

  onTotalWorkPercentageChange(value: any) {
    // Validate the TotalWorkPercentage
    if (!this.isValidNumber(value)) {
      this.totalWorkPercentageError = 'Enter a value from 0 to 100 without decimal points';
    } else {
      this.totalWorkPercentageError = null; // No error
    }
  }

  // onTotalWorkHoursChange(value: any) {
  //   // Validate the TotalWorkHours
  //   if (value !== null && value !== '') {
  //     if (!this.isValidPositiveNumber(value)) {
  //       this.totalWorkHoursError = 'Enter a value greater than 0 and without decimal points';
  //     } else {
  //       this.totalWorkHoursError = null; // No error
  //     }
  //   } else {
  //     this.totalWorkHoursError = null; // No error if empty or null
  //   }
  // }

  onTotalWorkHoursChange(value: any) {
    // Ensure the value is not null or empty
    if (value !== null && value !== '') {
      // Validate that the value is a positive integer and greater than 0
      if (!this.isValidPositiveNumber(value)) {
        this.totalWorkHoursError = 'Enter a value greater than 0 and without decimal points';
      } else {
        this.totalWorkHoursError = null; // No error
      }
    } else {
      this.totalWorkHoursError = null; // No error if empty or null
    }
  }

  onTotalWorkMinutesChange(value: any) {
    // Validate the TotalWorkMinutes
    if (value !== null && value !== '') {
      if (!this.isValidNumber2(value)) {
        this.totalWorkMinutesError = 'Enter a number within range of 0 to 60 without decimal points';
      } else {
        this.totalWorkMinutesError = null; // No error
      }
    } else {
      this.totalWorkMinutesError = null; // No error if empty or null
    }
  }
  


 

   ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }


  async OpencustomerModal(){
    const modal = await this.modalController.create({
      component: CommonModalPage,
      componentProps: {
        DropDownData:this.ClientList,
        Headers:['Client'],
        Fields:['CustomerName'],
        ModalHeader:'Client List',
        CheckType:'radio',
        UniqueField:'CustomerId',
        SelectedItems:this.SelectedClient>0?this.ClientList.filter((x:any)=>x.CustomerId==this.SelectedClient):[]
        
        // AttendenceData: this.Attendence,
        // taskDescription: task.description
      }
    });

     await modal.present();
    const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()

      // `data` contains the output data from the modal
      // `role` contains the role (e.g., "cancel", "confirm")
      if (role === 'confirm') {
        console.log('Selected Data:', data); // Handle the returned data
        let values = data.selected
        if(data.selected.length>0)
        {
          this.SelectedClient=data.selected[0].CustomerId
          this.SelectedClientName=data.selected[0].CustomerName
          console.log(values);
          this.onCustomerChange(this.SelectedClient)

        }
        else
        {
          
        this.SelectedClient=0
        this.SelectedClientName=''
        console.log(values);
        this.ProjectList=[]
        }
        // this.SelectedBranchCustomers=data.selected
        // this.CustomersName = values['Customer Name'];

        // this.BranchCustomersName = values.map((item:any) => item.CUST_NAME).join(', ');
        // console.log(this.BranchCustomersName);
        // let custid  = values.map((item: any) => `${item.CUST_ID}`).join(',');

        // let scid = this.SectionData.SCT_ID
        // await this.GetAppCustFlexFill(scid,custid)
    
      
        
        // console.log(custid,'custids');
      } else {
        console.log('Modal dismissed without selection');
        this.SelectedClientName=this.SelectedClient>0?this.SelectedClientName:''
      }
  }


  async OpenModuleModal(){
    const modal = await this.modalController.create({
      component: CommonModalPage,
      componentProps: {
        DropDownData:this.ModuleList,
        Headers:['Module'],
        Fields:['ModuleName'],
        ModalHeader:'Module List',
        CheckType:'radio',
        UniqueField:'ModuleId',
        SelectedItems:this.Selectedmodule>0?this.ModuleList.filter((x:any)=>x.Module==this.Selectedmodule):[]
        
        // AttendenceData: this.Attendence,
        // taskDescription: task.description
      }
    });

     await modal.present();
    const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()

      // `data` contains the output data from the modal
      // `role` contains the role (e.g., "cancel", "confirm")
      if (role === 'confirm') {
        console.log('Selected Data:', data); // Handle the returned data
        let values = data.selected
        if(data.selected.length>0)
        {
          this.Selectedmodule=data.selected[0].ModuleId
          this.SelectedmoduleName=data.selected[0].ModuleName
          console.log(values);

        }
        else
        {
          
        this.Selectedmodule=0
        this.SelectedmoduleName=''
        console.log(values);
        }
        // this.SelectedBranchCustomers=data.selected
        // this.CustomersName = values['Customer Name'];

        // this.BranchCustomersName = values.map((item:any) => item.CUST_NAME).join(', ');
        // console.log(this.BranchCustomersName);
        // let custid  = values.map((item: any) => `${item.CUST_ID}`).join(',');

        // let scid = this.SectionData.SCT_ID
        // await this.GetAppCustFlexFill(scid,custid)
    
      
        
        // console.log(custid,'custids');
      } else {
        console.log('Modal dismissed without selection');
        this.SelectedmoduleName=this.Selectedmodule>0?this.SelectedmoduleName:''
      }
  }


  async OpenProjectModal(){
    const modal = await this.modalController.create({
      component: CommonModalPage,
      componentProps: {
        DropDownData:this.ProjectList,
        Headers:['Project'],
        Fields:['ProjectName'],
        ModalHeader:'Project List',
        CheckType:'radio',
        UniqueField:'ProjectId',
        SelectedItems:this.SelectedProject>0?this.ProjectList.filter((x:any)=>x.ProjectId==this.SelectedProject):[]
        
        // AttendenceData: this.Attendence,
        // taskDescription: task.description
      }
    });

     await modal.present();
    const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()

      // `data` contains the output data from the modal
      // `role` contains the role (e.g., "cancel", "confirm")
      if (role === 'confirm') {
        console.log('Selected Data:', data); // Handle the returned data
        let values = data.selected
        if(data.selected.length>0)
        {
          this.SelectedProject=data.selected[0].ProjectId
          this.SelectedProjectName=data.selected[0].ProjectName
          console.log(values);

        }
        else
        {
          
        this.SelectedProject=0
        this.SelectedProjectName=''
        console.log(values);
        }
        // this.SelectedBranchCustomers=data.selected
        // this.CustomersName = values['Customer Name'];

        // this.BranchCustomersName = values.map((item:any) => item.CUST_NAME).join(', ');
        // console.log(this.BranchCustomersName);
        // let custid  = values.map((item: any) => `${item.CUST_ID}`).join(',');

        // let scid = this.SectionData.SCT_ID
        // await this.GetAppCustFlexFill(scid,custid)
    
      
        
        // console.log(custid,'custids');
      } else {
        console.log('Modal dismissed without selection');
        this.SelectedProjectName=this.SelectedProject>0?this.SelectedProjectName:''
      }
  }

  async checkExistingPRojectOPenOrInProgress(){
    if(this.TaskList.length>0)
    {
      console.log(this.TaskList.filter((x:any)=> x.WORK_STATUS_ID == 3 || x.WORK_STATUS_ID == 7));
      
      let d  = this.TaskList.some((x:any)=> x.WORK_STATUS_ID == 3 || x.WORK_STATUS_ID == 7)
      console.log(d);
      
      return d
    }else
    {
      return true
    }
 
  }
 

async  ChangeTaskStatus(items:any,Status:number)
 {
 
  let workid = items.WORK_ID
  let workdtlsid=items.WORK_DTLS_ID
  if(Status==3)//open
  {
    
  // loading.present();
  // this.comser.
      // this.TaskStatusChangeFn(workdtlsid,workid,Status)
      if(! await this.checkExistingPRojectOPenOrInProgress())
      {
        this.TaskStatusChangeFn(workdtlsid,workid,Status)
      }
      else
      {
        Swal.fire('Another project is already opened','pause or close existing opened project to open new project','warning')
      }
  }
  else 
  {

    this.TaskStatusChangeFn(workdtlsid,workid,Status) 
  }

  console.log(items);
  
    // this.comser.UpdateWorkStatus()
 }

 async RejectWork(items:any)
 {
  const loading = await this.loading.create({
    cssClass: 'custom-loading', 
    message: 'Loading...', 
    spinner: 'dots', 
  });
  await loading.dismiss()
  this.comser.RejectTask(items.WORK_ID,items.WORK_DTLS_ID).subscribe((data:any)=>{
    loading.dismiss()
    console.log(data);
    
    if(data.Status==200)
    {
      Swal.fire(data.Messge,'','success')
      this.LOaders()
    }
    else
    {
      Swal.fire(data.Messge,'','warning')
    }
  },(error:any)=>{
    loading.dismiss()
  })
 }


 async TaskStatusChangeFn(dtlsid:any,workid:any,status:any){
  const loading = await this.loading.create({
    cssClass: 'custom-loading', 
    message: 'Loading...', 
    spinner: 'dots', 
  });
  await loading.dismiss()
  this.comser.UpdateWorkStatus(dtlsid,workid,status).subscribe((data:any)=>{
    loading.dismiss()
    console.log(data);
    
    if(data.Status==200)
    {
      this.LOaders()
    }
    else
    {
      Swal.fire(data.Messge,'','warning')
    }
  },(error:any)=>{
    loading.dismiss()
  })

 }

//  async SaveAppDailyWorkSheetAsync(dta:any){

//   const loading = await this.loading.create({
//     cssClass: 'custom-loading', 
//     message: 'Loading...', 
//     spinner: 'dots', 
//   });
//   await loading.dismiss()
//   this.comser.SaveAppDailyWorkSheetAsync(dta).subscribe((data:any)=>{
//     loading.dismiss()
//     console.log(data);
    
//     if(data.Status==200)
//     {
//       // this.LOaders()
//       Swal.fire(data.Message,'','success')
//       this.LOaders()
//     }
//     else
//     {
//       Swal.fire(data.Messge,'','warning')
//     }
//   },(error:any)=>{
//     loading.dismiss()
//   })

//  }

 dws = new DailyWorkSheet()
SelectedbtnStatusName:string=''
 SelectedbtnStatus(items:any,ID:any)
 {
  this.SelectedbtnStatusName=ID==5?'Pause Task':ID==7?'Progress Task':ID==4?'Close Task':ID==2?'Re Assign Task':''
  this.dws.StatusId=ID
  let d  = this.datePipe.transform(new Date(),'yyyy-MM-dd')
  this.dws.WorkDate = d
  this.dws.WorkId = items.WORK_ID
  this.dws.WorkDtlsId=items.WORK_DTLS_ID

 }



 ClearBtnStsData(){
  Swal.fire({
    title: 'Are you sure?',
    text: "Enterd Data Will be cleared!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Clear!'
}).then((result) => {
    if (result.isConfirmed) {
        // Call your delete service here
        // this.authser.LogOutMethod()
        this.totalWorkPercentageError = null;
        this.totalWorkHoursError = null;
        this.totalWorkMinutesError= null;
        this.dws.ProgressNote=''
        this.dws.TotalWorkHours=''
        this.dws.TotalWorkPercentage=''
        this.dws.TotalWorkMinutes=''
        // this.closeModal()
    }
});
 }

 
//  @ViewChild('modalElement') modalElement!: ElementRef;
 closeModal() {
  const modal = document.getElementById('exampleModal'); // Get modal element
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
    modalInstance?.hide(); // Hide modal
  }
}


isImage(filePath: string): boolean {
  return (
    filePath.toLowerCase().endsWith('.jpg') ||
    filePath.toLowerCase().endsWith('.jpeg') ||
    filePath.toLowerCase().endsWith('.png') ||
    filePath.toLowerCase().endsWith('.gif')
  );
}


async GetAttach(WORK_ID:any)
{
   const loading = await this.loader.create({
     cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
     message: 'Loading...', // Optional: Custom message
     spinner: 'dots', // Optional: Choose a spinner
     // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
   })
       console.log(WORK_ID)
       await loading.present();
       this.comser.GetAttach(WORK_ID).subscribe((data:any)=>{
         loading.dismiss()
         if(data.Status==200)
         {
           //console.log(this.call.CustomerId) Attachment
           console.log(data);
            this.AttachList = data.Data
           // if(this.AttachList.length>0)
           // {
           //   // console.log();
             
           //   this.Attachment=data.Data[0].ATTACH_FILE_PATH
           //   // this.call.ProjectName=data.Data[0].ProjectName

           // }

         }
       },(error:any)=>{
         loading.dismiss()
       }
     )

 }
 
}
