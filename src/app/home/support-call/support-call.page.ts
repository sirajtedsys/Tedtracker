import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import {LoadingController,ModalController} from '@ionic/angular'
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
// import {  SupportCalldet } from 'src/class/ SupportCalldet';
import { CommonModalPage } from 'src/app/shared/common-modal/common-modal.page';
import { Router } from '@angular/router';
import { SupportCalldet } from 'src/class/SupportCallDet';

@Component({
  selector: 'app-support-call',
  templateUrl: './support-call.page.html',
  styleUrls: ['./support-call.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class SupportCallPage implements OnInit {
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  Today:any
  clientId:any
  projectId:any
  SelectedDate:any
  EmpData:any[]=[]
  ProjectList:any[]=[]
  CallTypeList:any[]=[]
  EmergencyList:any[]=[]
  ModuleList:any[]=[]
  ErrorList:any[]=[]
  CustomerList:any[]=[]
  EmployeeList:any[]=[]
  call = new  SupportCalldet()


  constructor(
    private loader:LoadingController,
    private router:Router,
    private modalController:ModalController,
    private comser:CommonService,  private datepipe:DatePipe
  ) {
    this.comser.CheckUserActivetabs()
       this.OnPageLoad()
   }
   OnPageLoad(){
     this.Today = this.datepipe.transform(new Date(),'yyyy-MM-dd')
     this.SelectedDate=this.Today
     this.call.WorkAssignDate=this.Today
    // this.empex.ExpDate=this.Today
    let tod = this.datepipe.transform(new Date(),'dd/MM/yyyy')
    // this.GetCompanySettingsAsync()
    this.GetCallTypes()
    this.GetEmergency()
    this.GetModule()
    this.GetError()
    this.GetActiveProjects()
    //  this.GetClients()
   
    this.GetEmployee()
    this.GetSupportRefNo(tod)
  }


  ngOnInit() {
  }
  onCustomerChange(event: any) {
    console.log('Selected Customer:', event);
    this.clientId=event;
    // this.GetActiveProjects(this.clientId)
  }
  onProjectChange(event: any) {
    console.log('Selected ProjectId:', event);
    this.projectId=event;
     this.GetClients(this.projectId)
    // this.GetActiveProjects(this.clientId)
  }



  WorkAssignDateCahnge(event:any){
    console.log(event.target.value);
    
    let date = this.datepipe.transform(event.target.value,'dd/MM/yyyy')
    this.GetSupportRefNo(date)
  }

  ErrorTypeCahnge(){

  }

  checkErrorType(){
    if(this.call.ErrorTypeId!=0)
    {
      // if(this.call.)
      let val  = this.ErrorList.filter((x:any)=>x.ErrorTypeId == this.call.ErrorTypeId)[0].EmpAssignSts
      // return false
      if(val=='N')
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
      return true
    }
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

  // onProjectChange(event: any) {
  //   console.log('Selected ProjectId:', event);
  //   this.ProjectId=event;
  //    this.GetClients(this.ProjectId)
  //   // this.GetActiveProjects(this.clientId)
  // }
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
            this.ErrorList = data.Data
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
            this.EmployeeList = data.Data
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

  async GetClients(projectId:any){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetClients(projectId).subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            this.CustomerList = data.Data
            if(this.CustomerList.length==1)
              {
                  this.call.CustomerId=data.Data[0].CustomerId
                  
                this.call.CustomerName=data.Data[0].CustomerName
                this.onCustomerChange(this.call.CustomerId)
              }
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }
  // async GetSupportRefNo(D:any){
  //   const loading = await this.loader.create({
  //     cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
  //     message: 'Loading...', // Optional: Custom message
  //     spinner: 'dots', // Optional: Choose a spinner
  //     // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
  //   })
        
  //       await loading.present();
  //       this.comser.GetSupportRefNo(D).subscribe((data:any)=>{
  //         loading.dismiss()
  //         if(data.Status==200)
  //         {
  //           console.log(data);
  //           this.call.WorkRefNo = data.Data
  //         }
  //       },(error:any)=>{
  //         loading.dismiss()
  //       }
  //     )

  // }

  CheckMandatory(){
    if(this.call.WorkRefNo!=null && this.call.WorkRefNo!='')
    {
      if(this.call.WorkAssignDate!=null && this.call.WorkAssignDate!='')
        {

            // if(this.call.CustomerId!=null && this.call.CustomerId!=0)
            if(this.call.ProjectId!=null && this.call.ProjectId!=0)
            {
              if(this.call.CustomerId!=null && this.call.CustomerId!=0)
                {

                  // if(this.call.ProjectId!=null && this.call.ProjectId!=0)
                  if(this.call.ModuleId!=null && this.call.ModuleId!=0)
                  {
                    if(this.call.CallTypeId!=null && this.call.CallTypeId!=0)
                    {
                      if(this.call.EmergencyId!=null && this.call.EmergencyId!=0)
                      {
                        if(this.call.ErrorTypeId!=null && this.call.ErrorTypeId!=0)
                        {
                          if(this.call.CalledDesc!='')
                          {
                            
                              return true
                          }
                          else
                          {
                            Swal.fire('Please Ener Description to continue','','warning')
                            return false
                          }
                        }
                        else
                        {
                          Swal.fire('Please select a Error Type to Continue','','warning')
                          return false

                        }
                      }
                      else
                      {
                        Swal.fire('Please select a Emergency  Type to continue','','warning')
                        return false
                      }
                    }
                    else
                    {
                      Swal.fire('Please selecet a Call Type to continue','','warning')
                      return false
                    }
                  }
                  else
                  {
                    Swal.fire('Please select a Module to continue','','warning')
                    // Swal.fire('Please select a Project to continue','','warning')
                    return false
                  }
            }
            else
            {
              Swal.fire('Please select a Customer to continue','','warning')
              return false
            }
            }
            else
            {
              // Swal.fire('Please select a Client to continue','','warning')
              Swal.fire('Please select a Project to continue','','warning')
              return false
            }
          }
          else
          {
            Swal.fire('Please select a Date to continue','warning')
            return false
          }
    }
    else
    {
      Swal.fire('Work Ref no not found','','warning')
      return false
    }
  }

  async Submit(){


    if(this.CheckMandatory())
    {
      const loading = await this.loader.create({
        cssClass: 'custom-loading',
        message: 'Loading...',
        spinner: 'dots',
      });
          await loading.present();
          this.comser.SaveSupportCall(this.call).subscribe((data:any)=>{
            console.log(data,"dta");
  
            loading.dismiss()
            if(data.Status==200)
            {
              Swal.fire(data.Message,'','success')
              
              this.onUploadFiles(data.Data)
              this.Clear();
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
  Clear(){
    this.call = new  SupportCalldet()
    this.EmpData=[]
    this.ProjectList=[]
    this.CallTypeList=[]
    this.EmergencyList=[]
    this.ModuleList=[]
    this.ErrorList=[]
    this.CustomerList=[]
    this.EmployeeList=[]

 this.call.CalledBy='';
 this.call.CalledDesc='';
 this.selectedFiles=[]
 this.resetFileInput()
 this.OnPageLoad()
  }


  async OpencustomerModal(){
    const modal = await this.modalController.create({
      component: CommonModalPage,
      componentProps: {
        DropDownData:this.CustomerList,
        Headers:['Client'],
        Fields:['CustomerName'],
        ModalHeader:'Client List',
        CheckType:'radio',
        UniqueField:'CustomerId',
        SelectedItems:this.call.CustomerId>0?this.CustomerList.filter((x:any)=>x.CustomerId==this.call.CustomerId):[]
        
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
          this.call.CustomerId=data.selected[0].CustomerId
          this.call.CustomerName=data.selected[0].CustomerName
          console.log(values);
          this.onCustomerChange(this.call.CustomerId)

        }
        else
        {
          
        this.call.CustomerId=0
        this.call.CustomerName=''
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
        this.call.CustomerName=this.call.CustomerId>0?this.call.CustomerName:''
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
        SelectedItems:this.call.ModuleId>0?this.ModuleList.filter((x:any)=>x.ModuleId==this.call.ModuleId):[]
        
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
          this.call.ModuleId=data.selected[0].ModuleId
          this.call.ModuleName=data.selected[0].ModuleName
          console.log(values);

        }
        else
        {
          
        this.call.ModuleId=0
        this.call.ModuleName=''
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
        this.call.ModuleName=this.call.ModuleId>0?this.call.ModuleName:''
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

     await modal.present();
    const { data, role } = await modal.onWillDismiss(); // You can also use onDidDismiss()

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
        this.CustomerList=[]
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
        this.call.ProjectName=this.call.ProjectId>0?this.call.ProjectName:''
      }
  }

  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }


  wrefno:any
  workid:any
async GetSupportRefNo(D:any){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetSupportRefNo(D).subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            this.call.WorkRefNo = data.Data
            this.wrefno=data.Data
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }
selectedFiles:any[]=[]
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


  onUploadFiles(workid:any) {
    // Ensure that files are selected before proceeding with the upload
    if (this.selectedFiles.length > 0) {
      // You can loop through the selected files and upload each file with its data
      this.selectedFiles.forEach(file => {
        const dailyData = {
          task: 'Upload daily task',
          date: new Date().toISOString()
        };
console.log(this.wrefno)
        // Call the service to upload each file
        this.comser.uploadFilesSupport(dailyData, file,this.wrefno,workid).subscribe(
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


  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = "";
    }
  }
}
