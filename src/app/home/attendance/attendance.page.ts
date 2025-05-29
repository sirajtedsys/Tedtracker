import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Attendence } from 'src/class/Attendence';
// import { Attendence } from 'src/class/Attendence';
// import { AttendenceBreak } from 'src/class/AttendenceBreak';
// import { Tasks } from 'src/class/Tasks';
import { CommonService } from 'src/services/common.service';
// import { EmployeeService } from 'src/services/employee.service';
// import { LocationService } from 'src/services/location.service';
// import { TaskService } from 'src/services/task.service';
import Swal from 'sweetalert2';
// import { DailyWorkReportPage } from '../daily-work-report/daily-work-report.page';
import { CommonModalPage } from 'src/app/shared/common-modal/common-modal.page';
import { Calldet } from 'src/class/Calldet';

declare  var bootstrap:any;
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule]
})
export class AttendancePage implements OnInit {

EmpData:any[]=[]

TimeNo:any

AttendenceData:any[]=[]
ProjectList:any[]=[]
call = new Calldet()
ProjectId:any
 
  viewtype:string='table'


  TasksList:any[]=[]
  TasksListDup:any[]=[]
  // Tasks = new Tasks()
  MenuGroupList:any

  Departmentlist:any

  Employeelist:any[]=[]


 

  UserTypeList: any;
  EmpCode:string=''
  EmpName:string=''
  EmpId:number=0
  Today:any
  fromdate:any
  todate:any
  Attendence=new Attendence()
  // AttendenceBreak = new AttendenceBreak()
  CurrentDateTime: any;
  AttendenceBreakDetails:any
  groupedAttendanceData: any[]=[];
  TimeZone: string | undefined;
  FormattedTimeNow: string | null = null;
  FormattedTimeOnly: string | null = null;

  constructor(private comser:CommonService,
    // private tser:TaskService,
    // private empser:EmployeeService,
    private router:Router,
    
  private datePipe:DatePipe,
  // private locser:LocationService,
  private modalController:ModalController,
    // private Commstr:CommonMasterService,
  private loading:LoadingController)
   {

    this.comser.CheckUserActivetabs()
    // let v  = await this.GetCurrentDbTime()
    // this.Today = this.datePipe.transform(this.GetCurrentDbTime(), 'yyyy-MM-dd');

    // this.CurrentDateTime = this.GetCurrentDbTime();

    
    // 
    this.GetCurrentDbTime()
    this.inetrvel()
    // this.startLoopingFunction(this.GetCurrentDbTime)
    // this.callAtInterval(this.GetCurrentDbTime,60000)
    console.log(this.Today);
    
    this.fromdate=this.Today
    this.todate=this.Today
    this.LOaders()

    // this.locationanmre()

    }


  
 Dateparse(dates:any){
  const isoString = dates;
let TimeNo = isoString;

// Extract timezone offset
const offsetMatch = isoString.match(/([+-]\d{2}):?(\d{2})/);
if (offsetMatch) {
  const hours = offsetMatch[1]; // e.g. +03
  const minutes = offsetMatch[2]; // e.g. 00
  this.TimeZone = `UTC${hours}:${minutes}`; // e.g. UTC+03:00
} else {
  this.TimeZone = 'UTC'; // fallback
}

// this.FormattedTimeNow = this.datePipe.transform(this.TimeNo, 'yyyy-MM-dd', this.TimeZone);
// this.FormattedTimeOnly = this.datePipe.transform(this.TimeNo, 'hh:mm a', this.TimeZone);


return this.datePipe.transform(TimeNo, 'yyyy-MM-dd hh:mm:ss a', this.TimeZone)

// Format as 'yyyy-MM-dd' using extracted timezone

 }


  // toggleSidebar() {
  //   this.comser.toggleSidebar();
  // }

  // togglemobSidebar() {
  //   this.comser.togglemobSidebar();
  // }

  ngOnInit() {
  }

  AddTasksMaster(){
    this.viewtype='form'
  }

  LOaders(){
    this.getUserDetails()
    this.GetActiveProjects()
    // this.GetUserCurretDayAttendecneDetails()
  }

  async GetActiveProjects(){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
    })
        // console.log(this.clientId)
        await loading.present();
        this.comser.GetActiveProjects1().subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            this.ProjectList = data.Data
            if(this.ProjectList.length==1)
            {
              
              this.call.ProjectId=data.Data[0].ProjectId
              this.call.ProjectName=data.Data[0].ProjectName

            }
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )
  }

  async getUserDetails(){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();
    this.comser.GetEmployeeDetails().subscribe(async (data:any)=>{
      loading.dismiss()
      console.log(data);
      
      // this.comser.dismissLoading();
      if(data.Status==200)
      {
    
        this.EmpData=data.Data

        this.EmpId = this.EmpData[0].EMP_ID
        this.EmpName = this.EmpData[0].EMP_NAME
        this.EmpCode = this.EmpData[0].EMP_CODE
        await this.GetCurrentDbTime()
        this.GetEmployeePunchcDetails(this.EmpId,this.Today)
        
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

  async GetEmployeePunchcDetails(empid:any,date:any){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();
    this.comser.GetEmployeePunchDetails(empid,date).subscribe((data:any)=>{
      loading.dismiss()
      console.log(data);
      
      // this.comser.dismissLoading();
      if(data.Status==200)
      {
    
        if(data.Data.length>0)
        {

          this.AttendenceData=data.Data
          this.AttendenceData.sort((a, b) => new Date(a.PUNCH_DATE).getTime() - new Date(b.PUNCH_DATE).getTime());
    
          this.groupAttendanceData()
        }
        else
        {

          this.groupedAttendanceData.push({
            checkIn: null,
            breaks: [],
            checkOut: null
          });
        }
        
  // this.pairBreaks()
        
      }
      else
      {
        // console.log(s);
        Swal.fire(data.Message,'','error')
        
      }
    },
  (error:any)=>{
    // this.comser.dismissLoading()
    loading.dismiss()
  })
  }


  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }



 async  GetPunchDetails(d:any){

    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    
    await loading.present();
    this.comser.GetPunchDetails(d).subscribe((data:any)=>{
      console.log(data);
      
      loading.dismiss()
      if(data.Status=200)
      {
        this.GetEmployeePunchcDetails(this.EmpId,this.Today)
        if(data.Data[0]["1"]==1)
        {
          let type = d.PunchType==0?'Check In':d.PunchType==1?'Check Out':d.PunchType==2?'Break In':d.PunchType==3?'Break Out':''
          Swal.fire(type+' Added Successfully','','success')
          this.closeModal()
        }
        else
        {
          Swal.fire("Error while insertions",'','error')
        }
      }
      else
      {
        Swal.fire(data.Message,'','error')
      }
    },(error:any)=>{
      loading.dismiss()
    })
  }

  async CheckIn() {
        console.log('checkin');
        
    let time = await this.GetCurrentDbTime()
    this.CurrentDateTime = this.Dateparse(time)
    // this.CurrentDateTime =  this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a');
    // this.Attendence.CheckIn = this.Today;
    let att = new Attendence()
    att.P_OPR_ID = 3
    att.Hdr =0
    att.EmpId = this.EmpData[0].EMP_ID
    att.PunchType = 0
    att.PunchDate = this.CurrentDateTime
   att.PunchFrom=this.PunchLocation
   att.ProjectId=this.ProjectId;
      this.GetPunchDetails(att)
  }

  startLoopingFunction(callback: () => void) {
    // Call the callback immediately once
    callback();
  
    // Set an interval to run the function every minute (60,000 ms)
    setInterval(() => {
      callback();
    }, 60000); // 60,000 milliseconds = 1 minute
  }
 
PunchLocation:number | null  = null



  CountbyFouroFAttendenceData() {
    if (this.AttendenceData.length === 0) {
        return [];
    } else {
        const count = Math.ceil(this.AttendenceData.length / 4);
        return Array.from({ length: count }, (_, i) => i);
    }
}






  async BreakOut() {
    
    // this.Attendence.CheckIn = this.Today;
  
    let time = await this.GetCurrentDbTime()
    this.CurrentDateTime = this.Dateparse(time)
   // this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd hh:mm:ss a');
    console.log(this.CurrentDateTime);
    
    // log
    // this.Attendence.CheckIn = this.Today;
    let att = new Attendence()
    att.P_OPR_ID = 3
    att.Hdr =0
    att.EmpId = this.EmpData[0].EMP_ID
    att.PunchType = 3
    att.PunchDate = this.CurrentDateTime
      this.GetPunchDetails(att)
  }

  async CheckOut() {
    
    let time = await this.GetCurrentDbTime()
    this.CurrentDateTime = this.Dateparse(time)
    // this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a');
    // this.Attendence.CheckIn = this.Today;
    let att = new Attendence()
    att.P_OPR_ID = 3
    att.Hdr =0
    att.EmpId = this.EmpData[0].EMP_ID
    att.PunchType = 1
    att.PunchDate = this.CurrentDateTime
      this.GetPunchDetails(att)
  }

  async BreakIn() {
    let time = await this.GetCurrentDbTime()
    this.CurrentDateTime = this.Dateparse(time)
    // this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss a');
    // this.Attendence.CheckIn = this.Today;
    let att = new Attendence()
    att.P_OPR_ID = 3
    att.Hdr =0
    att.EmpId = this.EmpData[0].EMP_ID
    att.PunchType = 2
    att.PunchDate = this.CurrentDateTime
      this.GetPunchDetails(att)
  }
  
  

async Submit1()
{
  console.log(this.PunchLocation);
  if(this.PunchLocation==null)
  {
    Swal.fire('','Please select Punching Location','warning')
  }
  else
  {
    console.log(this.call.ProjectId)
    if(this.PunchLocation==2 && this.call.ProjectId==0)
    {
      Swal.fire('','Please select Project','warning')
    }
    else
    {
      this.CheckIn();
    }


  }
  
  // this.CheckIn()

}


  edit(it:any){

    let item  = JSON.parse(JSON.stringify(it))
    // console.log(item);
    
    this.viewtype='form'
    // this.Tasks = item
    // // this.Tasks.patidob = this.comser.formatDate(item.patidob)
    // console.log(this.Tasks);
    

    
  }
inetrvel(){
  this.safeGetCurrentDbTime();

  // Repeat every 60 seconds
  setInterval(() => {
    this.safeGetCurrentDbTime();
  }, 60000);
}

// Wrapper to handle errors
async safeGetCurrentDbTime() {
  try {
    await this.GetCurrentDbTime();
  } catch (error) {
    console.error('Failed to fetch DB time:', error);
  }
}
  async GetCurrentDbTime(): Promise<any> {
    // const loading = await this.loading.create({
    //   cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
    //   message: 'Loading...', // Optional: Custom message
    //   spinner: 'dots', // Optional: Choose a spinner
    // });
  
    // await loading.pjjresent();
  
    return new Promise((resolve, reject) => {
      this.comser.GetOracleTimeAsync().subscribe(
        (data: any) => {
          // loading.dismiss();
          console.log(data);
  
          if (data.Status === 200) {
            this.TimeNo = this.Dateparse(data.Data.Date)
            console.log(this.TimeNo,"timeeeeeeeeeeeeeenowwwww");
            
            this.Today = this.datePipe.transform(data.Data.Date,'yyyy-MM-dd')
            this.CurrentDateTime = this.datePipe.transform(data.Data.Date,'yyyy-MM-dd hh:mm:ss a')
            resolve(data.Data.Date); // Return data on success
          } else {
            Swal.fire(data.Message, '', 'error');
            reject(data.Message); // Reject with error message
          }
        },
        (error: any) => {
          // loading.dismiss();
          // Swal.fire('Error fetching time', '', 'error');
          reject(error); // Reject on API error
        }
      );
    });
  }

  getBackendTimeFormat(dateStr: string): string {
    // You could parse it and avoid time zone conversion
    const rawDate = new Date(dateStr);
    const userTimeZoneOffset = rawDate.getTimezoneOffset(); // in minutes
    const backendOffsetMinutes = -180; // +03:00 = -180 mins
  
    const diff = backendOffsetMinutes - userTimeZoneOffset;
    const adjustedDate = new Date(rawDate.getTime() + diff * 60000);
  
    return this.datePipe.transform(adjustedDate, 'dd-MMM-yyyy hh:mm a')!;
  }
  

  

  search(event:any) {

    let searchTerm = event?.target.value.toLowerCase().trim(); // Convert searchTerm to lowercase and trim whitespace
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

 close(){
  this.viewtype='table'
  // this.Tasks = new Tasks()
 }
 Delete(item:any){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
}).then((result) => {
    if (result.isConfirmed) {
        // Call your delete service here
        // this.DeleteMethod(item)
        
    }
});

}

groupAttendanceData() {
  this.groupedAttendanceData = [];
  let currentCycle: any = null;
  let breakEvents: any[] = []; // Track break events for matching breakIn and breakOut

  // Sort the data by PUNCH_DATE to ensure they're in chronological order
  this.AttendenceData.sort((a, b) => new Date(a.PUNCH_DATE).getTime() - new Date(b.PUNCH_DATE).getTime());
  // console.log(this.AttendenceData);

  this.AttendenceData.forEach(punch => {
    // console.log('Processing Punch:', punch); // Log to inspect the data
    
    if (punch.PUMCH_TYPE === 0) {
      // New Check In - Start a new cycle
      if (currentCycle) {
        this.groupedAttendanceData.push(currentCycle); // Push previous cycle if exists
      }
      currentCycle = {
        checkIn: punch,
        breaks: [],
        checkOut: null
      };
    } else if (punch.PUMCH_TYPE === 1) {
      // Check Out - End current cycle
      if (currentCycle) {
        currentCycle.checkOut = punch; // Set Check Out
        this.groupedAttendanceData.push(currentCycle); // Add the current cycle
        currentCycle = null; // Reset the cycle
      }
    } else if (punch.PUMCH_TYPE === 2 || punch.PUMCH_TYPE === 3) {
      // Handle Break In / Break Out events
      if (currentCycle) {
        if (punch.PUMCH_TYPE === 3) {
          // Add Break Out event to breaks (Note: you seem to add breakOut here which might be a mistake)
          currentCycle.breaks.push({ breakIn: null, breakOut: punch });
          console.log('Added breakOut:', punch);
        }

        // Pair Break In with the most recent Break Out
        if (punch.PUMCH_TYPE === 2) {
          // Find the latest unpaired breakIn and pair it with this breakOut
          let lastBreakIn = currentCycle.breaks.find((b: any) => b.breakIn === null);
          if (lastBreakIn) {
            lastBreakIn.breakIn = punch; // Pair Break Out with Break In
            console.log('Paired breakOut with breakIn:', lastBreakIn);
          }
        }
      }
    }
  });

  // If there's any leftover cycle (no CheckOut), add it to grouped data
  if (currentCycle) {
    this.groupedAttendanceData.push(currentCycle);
  }

  if(this.groupedAttendanceData[this.groupedAttendanceData.length-1].checkOut!=null)
  {
          this.groupedAttendanceData.push({
            checkIn: null,
            breaks: [],
            checkOut: null
          });
  }

  // Add a dummy object with all values null after all cycles have been processed
  // for(let i=0;i<this.groupedAttendanceData.length;i++)
  // {
  //   if(this.groupedAttendanceData[i].checkOut!=null)
  //   {
  //     this.groupedAttendanceData.push({
  //       checkIn: null,
  //       breaks: [],
  //       checkOut: null
  //     });
  //     break;
  //   }
  // }

  console.log('Grouped Attendance Data:', this.groupedAttendanceData);
}












statuscheck():boolean{
  // if(this.Tasks.EntryActive==0)
  //   {
  //     return true
  //   }
  //   else
  //   {
  //     // this.statuscheck=false
  //     return false
  //   }

  return true
}

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
closeModal() {
  const modal = document.getElementById('exampleModal'); // Get modal element
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
    modalInstance?.hide(); // Hide modal
  }

  
}
OpenModal() {
  const modal = document.getElementById('exampleModal'); // Get modal element
  if (modal) {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modal); // Create or get Bootstrap modal instance
    modalInstance.show(); // Show modal
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
      SelectedItems:this.call.ProjectId>0?this.ProjectList.filter((x:any)=>x.ProjectId==this.call.ProjectId):[]
      
      // AttendenceData: this.Attendence,
      // taskDescription: task.description
    }
  });
  // setTimeout(() => {
  //   console.log(document.activeElement);
  // }, 100);
  this.closeModal()
  
   await modal.present();
  const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()

  this.OpenModal()
    // `data` contains the output data from the modal
    // `role` contains the role (e.g., "cancel", "confirm")
    if (role === 'confirm') {
      console.log('Selected Data:', data); // Handle the returned data
      let values = data.selected
      if(data.selected.length>0)
      {
        this.call.ProjectId=data.selected[0].ProjectId
        this.call.ProjectName=data.selected[0].ProjectName
        console.log(values);
        this.onProjectChange(this.call.ProjectId)
       
      }
      else
      {
        
      this.call.ProjectId=0
      this.call.ProjectName=''
      console.log(values);
      }
    } else {
      console.log('Modal dismissed without selection');
      // this.call.ProjectName=this.call.ProjectId>0?this.call.ProjectName:''
    }
}

onProjectChange(event: any) {
  console.log('Selected ProjectId:', event);
  this.ProjectId=event;
}
CheckOutCOndition(cycle:any):boolean{
  // console.log(cycle);
  
    let len = cycle.breaks.length
  if(cycle.checkIn!=null)
  {
    if(cycle.breaks.length>0)
    {
      if(cycle.breaks[len-1].breakOut!=null )
        {
          if(cycle.breaks[len-1].breakIn!=null )
          {
            if(cycle.checkOut==null)
            {
              return true
            } 
            else
            {
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
    return false
  }


  

  // return true
  
  
// *ngIf="Attendence.CheckIn!=''  && (Attendence.CheckOut=='' || Attendence.CheckOut==null)"

}



Clearproj(){

this.call.ProjectId=0;
this.call.ProjectName=''

}

}

