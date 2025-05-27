import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import Swal from 'sweetalert2';
import {LoadingController} from '@ionic/angular'
import { CommonService } from 'src/services/common.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class MenuPage implements OnInit {

  EmpData:any[]=[]

  TabsList:any[]=[]

  constructor(
    private router:Router,
    private authser:AuthService,
    private loader:LoadingController,
    private comser:CommonService
  ) 
  { 
    this.getUserDetails()
  }

  ngOnInit() {
  }


  logout(){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Logout!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'LogOut!'
  }).then((result) => {
      if (result.isConfirmed) {
          // Call your delete service here
          this.authser.LogOutMethod()
          
      }
  });
  }
  NavigateTo(route:any){
    this.router.navigate(['home/'+route])


  }

  async getUserDetails(){
    const loading = await this.loader.create({
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
        this.GetAllTabs(this.EmpData[0].EMP_ID,1)
        // this.EmpId = this.EmpData[0].EMP_ID
        // this.EmpName = this.EmpData[0].EMP_NAME
        // this.EmpCode = this.EmpData[0].EMP_CODE

        // this.GetEmployeePunchcDetails(this.EmpId,this.Today)
        
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

  async GetAllTabs(empid:any,mduleid:any){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();
    this.comser.GetTabs(empid,mduleid).subscribe((data:any)=>{
      loading.dismiss()
      console.log(data);
      
      // this.comser.dismissLoading();
      if(data.Status==200)
      {
        
        this.TabsList=data.Data
        // this.EmpData=data.Data

        // this.EmpId = this.EmpData[0].EMP_ID
        // this.EmpName = this.EmpData[0].EMP_NAME
        // this.EmpCode = this.EmpData[0].EMP_CODE

        // this.GetEmployeePunchcDetails(this.EmpId,this.Today)
        
      }
      else
      {
        // console.log(s);
        Swal.fire(data.Message,'','error')
        
        // console.log('ddd');
        // this.router.navigate(['login'])
        // localStorage.removeItem('extrtype')
        
      }
    },
  (error:any)=>{
    // this.comser.dismissLoading()
    loading.dismiss()
  })
  }
}
