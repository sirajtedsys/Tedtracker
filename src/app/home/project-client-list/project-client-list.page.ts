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
import { Calldet } from 'src/class/Calldet';
import { AppConfig } from 'src/class/AppConfig';
@Component({
  selector: 'app-project-client-list',
  templateUrl: './project-client-list.page.html',
  styleUrls: ['./project-client-list.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class ProjectClientListPage implements OnInit {

  appconfig = new AppConfig()
  WhereCondition:string='W.WORK_STATUS_ID IN (1)'

    viewtype:string='table'
  
      ModuleList:any[]=[]
  
    AttachList:any[]=[];
  
    Information = new CallInformation()
  
    Selectedmodule:number=0
   
    ClientWorkStatusListReport:any[]=[]
  
   SelectedmoduleName:string=''
  
  // call = new Addwork()
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
    projId: any;
    specificPages = ['/login', '/home/dashboard'];
    EmpData: any[]=[];

    ProjectList:any[]=[]
call = new Calldet()
SelectedProject:number=0
 SelectedProjectName:string=''

 ClientWorkStatusList:any[]=[]
 ClientWorkStatusList2:any[]=[]
 Ws_Date:any
Ws_Status:string=''
Ws_Remarks:string=''
Ws_ProjectId:string=''
Ws_Remarks_exter:string=''
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
      this.checkScreenSize()
      this.Today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.fromdate=this.Today
      this.todate=this.Today
      this.CurrentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss');
      // let where  = 'W.WORK_STATUS_ID IN (1)'
      this.LOaders()
      }
  
      NavigateTo(route:any)
      {
        this.router.navigate([route])
      }
      AddTasksMaster(){
        this.viewtype='form'
      }
    
      LOaders(){
        
        this.GetActiveClientWorkStatuses()
        // this.getUserDetails()
    
        // this.GetModule()
        this.GetActiveProjects()
        this.Getprojectclientlist();
       
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
    
      
  ngOnInit() {
  }


  async GetActiveClientWorkStatuses()
  {
     const loading = await this.loader.create({
       cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
       message: 'Loading...', // Optional: Custom message
       spinner: 'dots', // Optional: Choose a spinner
       // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
     })
        //  console.log(PROJECT_WORK_ID)
         await loading.present();
         this.comser.GetActiveClientWorkStatuses().subscribe((data:any)=>{
           loading.dismiss()
           if(data.Status==200)
           {
             //console.log(this.call.CustomerId) Attachment
             console.log(data);
              this.ClientWorkStatusList = data.Data.filter((x:any)=>x.CLIENT_WORK_STATUS_ID!=1)
              this.ClientWorkStatusList2 = data.Data
              this.SelectedStatus.push(data.Data[0])
              this.SelectedStatusNames = data.Data[0].CLIENT_WORK_STATUS
             
  
           }
         },(error:any)=>{
           loading.dismiss()
         }
       )
  
   }
      async Getprojectclientlist() {
        // Show loading indicator
        const loading = await this.loader.create({
          cssClass: 'custom-loading',
          message: 'Loading...',
          spinner: 'dots',
        });
        
        await loading.present();
      
        this.comser.Getprojectclientlist().subscribe(
          (data: any) => {
            loading.dismiss();
      
            console.log(data);
      
            if (data.Status === 200) {
              this.TaskList = data.Data.length > 0 ? data.Data:[]
              this.TaskListDup = data.Data.length > 0 ? data.Data : [];
              this.StatusandProjectFilter()
            } else {
              Swal.fire(data.Message, '', 'error');
              // this.TaskList = [];
              // this.TaskListDup = [];
            }
          },
          (error: any) => {
            console.error('Error fetching task list', error);
            loading.dismiss();
            // this.TaskList = [];
            //   this.TaskListDup = [];
          }
        );
      }

      async GetProjectClientAttach(PROJECT_WORK_ID:any)
      {
         const loading = await this.loader.create({
           cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
           message: 'Loading...', // Optional: Custom message
           spinner: 'dots', // Optional: Choose a spinner
           // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
         })
             console.log(PROJECT_WORK_ID)
             await loading.present();
             this.comser.GetProjectClientAttach(PROJECT_WORK_ID).subscribe((data:any)=>{
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
        }
      });
  
       await modal.present();
      const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()
  
        if (role === 'confirm') {
          console.log('Selected Data:', data); // Handle the returned data
          let values = data.selected
          if(data.selected.length>0)
          {
            this.SelectedProject=data.selected[0].ProjectId
            this.SelectedProjectName=data.selected[0].ProjectName
            console.log(values);
            
        this.StatusandProjectFilter()
            
  
          }
          else
          {
            this.TaskList = this.TaskListDup
          this.SelectedProject=0
          this.SelectedProjectName=''
          console.log(values);
          
        this.StatusandProjectFilter()
          }
        } else {
          console.log('Modal dismissed without selection');
          this.SelectedProjectName=this.SelectedProject>0?this.SelectedProjectName:''
          
        this.StatusandProjectFilter()
        }
    }

    StatusandProjectFilter(){
      
      console.log(this.SelectedStatus);
      
      this.TaskList = this.TaskListDup.filter((x: any) =>
        (this.SelectedProject > 0 ? x.PROJECT_ID == this.SelectedProject : true) &&
        (this.SelectedStatus.length > 0
          ? this.SelectedStatus.some((status: any) => status.CLIENT_WORK_STATUS_ID === x.PROJECT_WORK_STATUS_ID)
          : true)
      );
      
      
      
      
    }

    SelectedStatus:any[]=[]
    SelectedStatusNames:string=''
    // SelectedStatusIds:string=
    async OpenStatusModal(){
      console.log(this.ClientWorkStatusList2);
      
      const modal = await this.modalController.create({
        component: CommonModalPage,
        componentProps: {
          DropDownData:this.ClientWorkStatusList2,
          Headers:['Status'],
          Fields:['CLIENT_WORK_STATUS'],
          ModalHeader:'Status List',
          CheckType:'check',
          UniqueField:'CLIENT_WORK_STATUS_ID',
          SelectedItems:this.SelectedStatus
        }
      });

       await modal.present();
      const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()
  
      if (role === 'confirm') {
        console.log('Selected Data:', data); // Handle the returned data
        let values = data.selected
        this.SelectedStatus=data.selected
        console.log(values);
        // this.CustomersName = values['Customer Name'];

        this.SelectedStatusNames = values.map((item:any) => item.CLIENT_WORK_STATUS).join(', ');
        console.log(this.SelectedStatusNames);
        // let custid  = values.map((item: any) => `${item.CUST_ID}`).join(',');

        // let scid = this.SectionData.SCT_ID
        // await this.GetAppCustFlexFill(scid,custid)
    
      
        this.StatusandProjectFilter()
        
        // console.log(custid,'custids');
      } else {
        
      this.StatusandProjectFilter()
        console.log('Modal dismissed without selection');
      }
      
    }


    closeModal() {
      const modal = document.getElementById('AttachmentModal1'); // Get modal element
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
        modalInstance?.hide(); // Hide modal
      }
    }


   async  SubmitTaskStatus(){
    if(this.Ws_Date!=null && this.Ws_Date!=undefined)
    {
      if(this.Ws_Status!='')
        {
    
          if(this.Ws_Remarks!='')
          {
            const loading = await this.loading.create({
              cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
              message: 'Loading...', // Optional: Custom message
              spinner: 'dots', // Optional: Choose a spinner
            })
                // console.log(this.clientId)
                await loading.present();
                this.comser.SaveProjectWorkStatus(this.Ws_ProjectId,this.Ws_Status,this.Ws_Remarks,this.Ws_Date,this.Ws_Remarks_exter).subscribe((data:any)=>{
                  loading.dismiss()
                  console.log(data);
                  if(data.Status==200)
                  {
                    Swal.fire(data.Message,'','success')
                    this.ClearWorkStatus()
                    this.Getprojectclientlist()
                    this.closeModal()
                    this.onUploadFiles(data.Data)
                  }
                  else
                  {
                    Swal.fire(data.Message,'','error')
                  }
                  
                },(error:any)=>{
                  loading.dismiss()
                })
          }
          else
          {
            Swal.fire('Enter Internal remark','','warning')
          }
        }
        else
        {
          Swal.fire('Select a work Status','','warning')
        }
    }
    else
    {
      Swal.fire('Please select date','','warning')
    }
   
     

    }


   async  OnInfoView(projid:any)
    {
      const loading = await this.loader.create({
        cssClass: 'custom-loading',
        message: 'Loading...',
        spinner: 'dots',
      });
      
      await loading.present();
    
      this.comser.GetClientWorkStatusByProjectIdAsync(projid).subscribe(
        (data: any) => {
          loading.dismiss();
    
          console.log(data);
    
          if (data.Status === 200) {
            this.ClientWorkStatusListReport = data.Data.length > 0 ? data.Data : [];
            // this.TaskListDup = data.Data.length > 0 ? data.Data : [];
          } else {
            Swal.fire(data.Message, '', 'error');
            this.ClientWorkStatusListReport = [];
            this.ClientWorkStatusListReport = [];
          }
        },
        (error: any) => {
          console.error('Error fetching task list', error);
          loading.dismiss();
          this.ClientWorkStatusListReport = [];
            this.ClientWorkStatusListReport = [];
        }
      );
    }


    OnStatusEdition(items:any)
    {
      console.log(items);
      this.Ws_ProjectId=items.PROJECT_WORK_ID
      this.workrefno =items.PROJECT_WORK_REFNO
      this.Ws_Date = this.datePipe.transform(new Date(),'yyyy-MM-dd')
      
    }

    ClearWorkStatus(){
      this.Ws_Remarks=''
      this.Ws_Status=''
      this.Ws_Remarks_exter =''
      this.Ws_Date = this.datePipe.transform(new Date(),'yyyy-MM-dd')
    }


    // SelectedStatus:string=''
    OnStatusSelectFilter(event:any){
      if(event.target.value=='')
      {
        this.TaskList= this.TaskListDup
      }
      else
      {
      this.TaskList = this.TaskListDup.filter((x:any)=>x.PROJECT_WORK_STATUS_ID == event.target.value)
      }
    }


    selectedFiles:any[]=[]
    workrefno:string=''
  uploadFiles(event: any) {
    // Get the selected files from the input
    const files: FileList = event.target.files;

    // Clear the existing files in case of re-selection
    this.selectedFiles = [];

    // Loop through all selected files and push them to the array
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }

    console.log('Selected files:', this.selectedFiles); // Log the selected files
  }


  onUploadFiles(CLNT_WORK_STATUS_ID:any) {
    // Ensure that files are selected before proceeding with the upload
    if (this.selectedFiles.length > 0) {
      // You can loop through the selected files and upload each file with its data
      this.selectedFiles.forEach(file => {
        const dailyData = {
          task: 'Upload daily task',
          date: new Date().toISOString()
        };
// console.log(this.wrefno)
        // Call the service to upload each file
        this.comser.uploadFilesOnWorkStatusUpdate(dailyData, file,CLNT_WORK_STATUS_ID).subscribe(
          response => {
            console.log('File uploaded successfully:', response);
          },
          error => {
            console.error('Error occurred while uploading file:', error);
          }
        );
      });
    } else {
      console.error('No files selected');
    }
  }

  WorkstatusupdateAttachList:any[]=[]

  async GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID:any)
  {
     const loading = await this.loader.create({
       cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
       message: 'Loading...', // Optional: Custom message
       spinner: 'dots', // Optional: Choose a spinner
       // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
     })
         console.log(P_CLNT_WORK_STATUS_ID)
         await loading.present();
         this.comser.GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID).subscribe((data:any)=>{
           loading.dismiss()
           if(data.Status==200)
           {
             //console.log(this.call.CustomerId) Attachment
             console.log(data);
              this.WorkstatusupdateAttachList = data.Data
             
  
           }
         },(error:any)=>{
           loading.dismiss()
         }
       )
  
   }
}

declare var bootstrap:any
