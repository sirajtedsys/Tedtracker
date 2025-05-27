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

@Component({
  selector: 'app-employee-work-dashboard',
  templateUrl: './employee-work-dashboard.page.html',
  styleUrls: ['./employee-work-dashboard.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class EmployeeWorkDashboardPage implements OnInit {

  ReportData:any[]=[]
  SelectedStatusId:number=0
  DepartmentList:any[]=[]
  DepartmentId:number=0
  EmployeeId:number=0;

  // SelectedDepartment:number=0

  constructor(private comser:CommonService,
    private datePipe:DatePipe,
    private router:Router,
    // private Commstr:CommonMasterService,
    private loading:LoadingController)
   {
    
    this.comser.CheckUserActivetabs()
    this.checkScreenSize()
    this.LOaders()

    }
    LOaders(){
      // this.GetAllEmployees(0)

      this.GetDepartment()
      // this.GetReport()
    }
    NavigateTo(route:any)
    {
      this.router.navigate([route])
    }
    GetDepworkReport(event: any) {
      let val  = event.target.value
      console.log('Selected DepartmentId:', val);
  
      this.DepartmentId=val;
      this.GetReport(this.DepartmentId)
      //  this.GetClients(this.ProjectId)
      // this.GetActiveProjects(this.clientId)
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

    async GetReport(DepartmentId:any){
      // this.ReportData=[]
      const loading = await this.loading.create({
        cssClass: 'custom-loading', 
        message: 'Loading...', 
        spinner: 'dots', 
      });
      loading.present();
      // this.EmployeeId=0;
      let v = 0
      this.comser.GetWorkStatus(DepartmentId,v).subscribe((data:any)=>{
        loading.dismiss()
        console.log(data);
        if (data.Data.length > 0) {
          this.ReportData=data.Data
        }
        else
        {
          this.ReportData=[]
        }
       
      }),(error:any)=>{
        console.log(error);
        loading.dismiss()
        this.ReportData=[]
        
      }
    }
    async ViewReport(items:any,ID:any)
    {
      this.SelectedStatusId=ID
      console.log(this.SelectedStatusId)
      console.log(items);
       console.log(items.EmpId);
   
      //  let d = this.datePipe.transform(items.PUNCH_IN,'yyyy-MM-dd')
      //  console.log(d);
       
         this.GetempworkDet(items.EmpId,this.SelectedStatusId)
       
    }
   empworkDet:any[]=[]
   empworkDetDup:any[]=[]
    async GetempworkDet(empid:any,id:any){
      this.empworkDet=[]
      this.empworkDetDup=[]
     const loading = await this.loading.create({
       cssClass: 'custom-loading', 
       message: 'Loading...', 
       spinner: 'dots', 
     });
         // console.log(this.clientId)
         await loading.present();
         this.comser.GetempworkDet(empid,id).subscribe((data:any)=>{
           loading.dismiss()
           if(data.Status==200)
           {
            if(data.Data.length>0)
              {
             console.log(data);
             this.empworkDet = data.Data
             this.empworkDetDup = data.Data;
              }
              else {
                this.empworkDet = [];
                this.empworkDetDup = [];
              }
           }
         },(error:any)=>{
           loading.dismiss()
         }
       )
   
   }
   async GetDepartment(){
    const loading = await this.loading.create({
      cssClass: 'custom-loading', 
      message: 'Loading...', 
      spinner: 'dots', 
    });
        
        await loading.present();
        this.comser.GetDepartment().subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            console.log(data);
            this.DepartmentList = data.Data
            this.DepartmentId = data.Data[0].DepartmentId
            this.GetReport(this.DepartmentId)
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

  // FilterByDepartment(event:any)
  // {
  //   let val  = event.target.value
  //   console.log(event.target.value)
  //   this.empworkDet = this.empworkDetDup.filter((x:any)=>x.DepartmentName == val)
  // }
  ngOnInit() {
  }

}
