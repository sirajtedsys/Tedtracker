import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonService } from 'src/services/common.service';
import { Router } from '@angular/router';

import { LoadingController, ModalController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { DailyWorkSheet } from 'src/class/DailyWorkSheet';
import { CommonModalPage } from 'src/app/shared/common-modal/common-modal.page';
import { CallInformation } from 'src/class/CallInformation';
import { AppConfig } from 'src/class/AppConfig';
declare var bootstrap: any;
@Component({
  selector: 'app-call-list',
  templateUrl: './call-list.page.html',
  styleUrls: ['./call-list.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class CallListPage implements OnInit {
  appconfig = new AppConfig()
WhereCondition:string='W.WORK_STATUS_ID IN (1)'

  viewtype:string='table'

  ProjectList:any[]=[]
  ClientList:any[]=[]
  ModuleList:any[]=[]
  CallTypeList:any[]=[]
  StatusList:any[]=[]
  ErrorTypeList:any[]=[]
  EmergencyList:any[]=[]
  ErrorList: any[]=[];
  CustomerList: any[]=[];
  AttachList:any[]=[];

  Information = new CallInformation()
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


  UserTypeList: any;
  EmpCode:string=''
  EmpName:string=''
  EmpId:number=0
  wId:any=0;

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
  ProjectId:any

  specificPages = ['/login', '/home/dashboard'];
  EmpData: any[]=[];

  constructor(private comser:CommonService,
    private loader:LoadingController,
    // private tser:TaskService,
    // private empser:EmployeeService,
    private router:Router,
    // private platform: Platform,
    // private location: Location,

  private datePipe:DatePipe,
  // private locser:LocationService,
  private modalController: ModalController,
    // private Commstr:CommonMasterService,
  private loading:LoadingController)
   {

    this.comser.CheckUserActivetabs()
    this.checkScreenSize()
    this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fromdate=this.Today
    this.todate=this.Today
    this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
    // let where  = 'W.WORK_STATUS_ID IN (1)'




    this.LOaders()
    // this.locationanmre()
    // this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
    //   const currentUrl = this.router.url;

    //   // Check if current page is in the specific pages list

    //     // Navigate to the previous page if it's not a specific page
    //     if(this.viewtype=='form')
    //     {
    //       this.viewtype='table'
    //     }
    //     else
    //     {
    //       this.location.back();
    //     }

    // });

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
    this.GetActiveProjects()
    // this.GetClients()
    this.GetEmergency()
    this.GetEmployee()
    this.GetError()
    this.GetModule()

    this.getEmployeeAssignedTaskDetails(this.WhereCondition)
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


  async GetAssingedWorks(empid: any): Promise<any> {
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
    });
    await loading.present();

    return new Promise((resolve, reject) => {
      this.comser.GetWorkAssignments(empid).subscribe(
        (data: any) => {
          loading.dismiss();
          console.log(data);

          if (data.Status == 200) {
            if (data.Data.length > 0) {
              // this.TaskList = data.Data;
              // this.TaskListDup = data.Data;
              resolve(data.Data); // Resolve the data here
            } else {
              // this.TaskList = [];
              // this.TaskListDup = [];
              resolve([]); // Resolve with an empty array if no data
            }
          } else {
            Swal.fire(data.Message, '', 'error');
            // this.TaskList = [];
            // this.TaskListDup = [];
            resolve([]); // Resolve with an empty array in case of error message
          }
        },
        (error: any) => {
          loading.dismiss();
          Swal.fire('Error', 'Something went wrong', 'error');
          reject(error); // Reject the promise in case of error
        }
      );
    });
  }





  async getEmployeeAssignedTaskDetails(where:any){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();
    this.comser.GetWorkDetailsAsync(where).subscribe((data:any)=>{
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




  async ChangetaskStatus(task:any){

    // {
    //   const modal = await this.modalController.create({
    //     component: TaskStatusUpdatePage,
    //     componentProps: {
    //       task: task,
    //       // taskDescription: task.description
    //     }
    //   });

    //   return await modal.present();
    // }
  }
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
      if(this.SelectedStatusId==4)
      {
        if(this.ProgressFormValidation())
          {
            loading.present()
            this.comser.CloseCallFromCAllList(this.dws).subscribe((data:any)=>{
              loading.dismiss()
              if(data.Status==200)
              {
                console.log(data);
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
      else if(this.SelectedStatusId==2)
      {

        if(this.SelectedAssignTo!='')
        {
          
          this.ASsignToEmployee()
        }
        else
        {
          Swal.fire('Select a Employee to Assign','','warning')
        }
      }
      // else if(this.SelectedStatusId==3)
      // {








  }


  OPenCAllBySelf(items:any,stId:any)
  {
    Swal.fire({
      title: 'Do you want to Open the call?',
      text: "Opening Call will Assign call to self!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Open!'
  }).then(async (result) => {
      if (result.isConfirmed) {
          // Call your delete service here
          // this.authser.LogOutMethod()
          if(!await this.CheckCallOPenedAlreadyinInbox())
          {
            this.SubmitOpenCallBySelf(items.WORK_ID)

          }
          else
          {
            Swal.fire('Another project is already opened','pause or close existing opened project to open new project','warning')
          }


      }
  });

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
        SelectedItems:this.Selectedmodule>0?this.ModuleList.filter((x:any)=>x.ModuleId==this.Selectedmodule):[]

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


async  ChangeTaskStatus(items:any,Status:number)
 {

  let workid = items.WORK_ID
  let workdtlsid=items.WORK_DTLS_ID
  if(Status==3)//open
  {

  // loading.present();
  // this.comser.
      this.TaskStatusChangeFn(workdtlsid,workid,Status)
  }
  else
  {

    // this.TaskStatusChangeFn(workdtlsid,workid,Status)
  }

  console.log(items);

    // this.comser.UpdateWorkStatus()
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

 async SaveAppDailyWorkSheetAsync(dta:any){
  const loading = await this.loading.create({
    cssClass: 'custom-loading',
    message: 'Loading...',
    spinner: 'dots',
  });
  await loading.dismiss()
  this.comser.SaveAppDailyWorkSheetAsync(dta).subscribe((data:any)=>{
    loading.dismiss()
    console.log(data);

    if(data.Status==200)
    {
      // this.LOaders()
      Swal.fire(data.Message,'','success')
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

 dws = new DailyWorkSheet()
 SelectedAssignTo:string=''
SelectedbtnStatusName:string=''
SelectedStatusId:number=0
 SelectedbtnStatus(items:any,ID:any)
 {
  this.SelectedbtnStatusName=ID==2?'Assign Task':ID==4?'Close Task':''
  this.SelectedStatusId=ID
  this.dws.StatusId=ID
  let d  = this.datePipe.transform(new Date(),'yyyy-MM-dd')
  this.dws.WorkDate = d
  this.dws.WorkId = items.WORK_ID
  this.dws.WorkDtlsId='0'

 }

 async CheckCallOPenedAlreadyinInbox(){
  const data = await this.GetAssingedWorks(this.EmpId);
  console.log(data.filter((x:any)=>x.WORK_STATUS_ID == 3 || x.WORK_STATUS_ID==7));

    let d  = data.some((x:any)=> x.WORK_STATUS_ID == 3 || x.WORK_STATUS_ID == 7)
    console.log(d);

    return d;
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
        this.dws = new DailyWorkSheet()
        // this.closeModal()
    }
});
 }
 Clear()
 {
  this.Information = new CallInformation()
  this.InfoRemarks=""
  this.InfoSelectEmployee=0
  this.InfoCallStatus=''
 }

 async ASsignToEmployee(){
  const loading = await this.loader.create({
    cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
    message: 'Loading...', // Optional: Custom message
    spinner: 'dots', // Optional: Choose a spinner
    // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
  })
// for(let i =0 ;i<this.SelectedEmployeeId.length;i++)
// {
  await loading.present();

  this.comser.SaveWorkAssignmentFromCallList(this.dws.WorkId,this.SelectedAssignTo).subscribe((data:any)=>{
    loading.dismiss()
    if(data.Status==200)
    {
    //  if(this.SelectedEmployeeId.length-1 == i)
    //  {
      Swal.fire(data.Message,'','success')
      this.dws = new DailyWorkSheet()
      this.SelectedAssignTo=''
      this.LOaders()
      this.closeModal()
    //  }
    }
    else
    {
      Swal.fire(data.Message,'','error')
    }
  },(error:any)=>{
    loading.dismiss()
  }
)

// }
    

}

async SubmitOpenCallBySelf(workId:any){
  const loading = await this.loader.create({
    cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
    message: 'Loading...', // Optional: Custom message
    spinner: 'dots', // Optional: Choose a spinner
    // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
  })

      await loading.present();
      this.comser.OpenCallBySelfFromCAllList(workId).subscribe((data:any)=>{
        loading.dismiss()
        if(data.Status==200)
        {
          Swal.fire(data.Message,'','success')
          this.dws = new DailyWorkSheet()
          this.SelectedAssignTo=''
          this.LOaders()
          this.closeModal()
        }
        else
        {
          Swal.fire(data.Message,'','error')
        }
      },(error:any)=>{
        loading.dismiss()
      }
    )

}


//  @ViewChild('modalElement') modalElement!: ElementRef;
 closeModal() {
  const modal = document.getElementById('exampleModal'); // Get modal element
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
    modalInstance?.hide(); // Hide modal
  }
}
closeModal1() {
  const modal = document.getElementById('exampleModal1'); // Get modal element
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
    modalInstance?.hide(); // Hide modal
  }
}



//#region Information Button

EmployeeWorkList:any[]=[]

InfoCallStatus:string=''
InfoSelectEmployee:number=0
InfoRemarks:string=''

closeInformationModal() {
  const modal = document.getElementById('exampleModal1'); // Get modal element
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
    modalInstance?.hide(); // Hide modal
  }
}

ClearInformationform(){
  this.InfoCallStatus=''
  this.InfoRemarks=''
  this.InfoSelectEmployee=0
  this.EmployeeWorkList=[]
}


OnInfoChangeEmployee(event:any)
{
  let val  = event.target.value
  console.log(event.target.value)
  this.GetOpenedWorkOfEmpkoyee(event.target.value)
}

async GetOpenedWorkOfEmpkoyee(empid:any){
  const loading = await this.loader.create({
    cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
    message: 'Loading...', // Optional: Custom message
    spinner: 'dots', // Optional: Choose a spinner
    // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
  })
console.log(empid)
// empid=this.EmpId
// console.log(empid)
      await loading.present();
      this.comser.GetOpenedWorkOfEmpkoyee11(empid).subscribe((data:any)=>{
        loading.dismiss()
        console.log(data)
        
        // console.log(this.wId)
        if(data.Status==200)
        {
          console.log(data.Data.length)
          if(data.Data.length>0)
          {
          this.wId = data.Data[0].WORK_ID; 
          console.log(this.wId)
          // Swal.fire(data.Message,'','success')
          this.EmployeeWorkList=data.Data;
          // this.ClearInformationform()
          
          // this.LOaders()
          // this.closeInformationModal()
          }
          else
          {
            this.EmployeeWorkList.length=0;
          }
        }
        else
        {
          Swal.fire(data.Message,'','error')
        }
      },(error:any)=>{
        loading.dismiss()
      }
    )

}


async Submit1(){
  // console.log(employeeForm.valid);
    // this.Tasks.EmployeeId = this.EmpId
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
  
    // if(this.SelectedStatusId==4)
    // {
    //   if(this.ProgressFormValidation())
    //     {
  
    this.Information.P_CALL_ID=this.InfoCallStatus
    this.Information.P_EMP_ID = String(this.InfoSelectEmployee);
    // this.Information.P_EMP_ID=(this.InfoSelectEmployee)
    this.Information.P_CALL_NOTE=this.InfoRemarks
     this.Information.P_WORK_ID=this.wId


          // loading.present()
          this.comser.SaveCallInform(this.Information).subscribe((data:any)=>{
            // loading.dismiss()
            console.log(this.InfoCallStatus)
            console.log(this.InfoSelectEmployee)
            console.log(this.InfoRemarks)
             console.log(data)
           
            if(data.Status==200)
            {

              Swal.fire(data.Message,'','success')
              this.closeModal1()
                this.LOaders()
            }
            else
            {
              Swal.fire(data.Message,'','error')
            }
          },(error:any)=>{
            loading.dismiss()
          })

      //   }
      // }
   
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
       this.comser.GetAttach1(WORK_ID).subscribe((data:any)=>{
         loading.dismiss()
         if(data.Status==200)
         {
           //console.log(this.call.CustomerId) Attachment
           console.log(data);
            this.AttachList = data.Data
           

         }
       },(error:any)=>{
         loading.dismiss()
       }
     )

 }

 isImage(filePath: string): boolean {
  return (
    filePath.toLowerCase().endsWith('.jpg') ||
    filePath.toLowerCase().endsWith('.jpeg') ||
    filePath.toLowerCase().endsWith('.png') ||
    filePath.toLowerCase().endsWith('.gif')
  );
}

//#endregion Information Button

SelectedEmployeeName:string=''
SelectedEmployeeId:any[]=[]

async OpenEmployeeModal(){
  const modal = await this.modalController.create({
    component: CommonModalPage,
    componentProps: {
      DropDownData:this.Employeelist,
      Headers:['Employee'],
      Fields:['EmployeeName'],
      ModalHeader:'Employee List',
      CheckType:'check',
      UniqueField:'EmployeeId',
      SelectedItems:this.SelectedEmployeeId.length>0?this.Employeelist.filter((x:any)=> this.SelectedEmployeeId.includes(x.EmployeeId)):[]
      
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

        console.log(data.selected.join(',').EmployeeName);
        this.SelectedEmployeeName = data.selected.map((emp:any) => emp.EmployeeName).join(', ');
        this.SelectedEmployeeId=[]
        for(let i=0;i<data.selected.length;i++)
        {
          this.SelectedEmployeeId.push(data.selected[i].EmployeeId)
          console.log(this.SelectedEmployeeId);
          
        }

        // this.call.CustomerId=data.selected[0].CustomerId
        // this.call.CustomerName=data.selected[0].CustomerName
        // console.log(values);
        // this.onCustomerChange(this.call.CustomerId)

      }
      else
      {
        this.SelectedEmployeeName=''
      // this.call.CustomerId=0
      // this.call.CustomerName=''
      // console.log(values);
      // this.ProjectList=[]
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
      // this.call.CustomerName=this.call.CustomerId>0?this.call.CustomerName:''
    }
}

}
