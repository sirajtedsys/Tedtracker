import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LoadingController} from '@ionic/angular'
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {


  Imagesrc:any=null
  EmpName:string=''
  EmpId:string=''
  MasterId:string=''

  constructor(
    private loader:LoadingController,
    private comser:CommonService,
    private authser:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    this.GetEmployeeDetails()
  }


  async GetEmployeeDetails(){
    
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetEmployeeDetails().subscribe((data:any)=>{
          loading.dismiss()
          if(data)
          {
            
            console.log(data);
            this.EmpName = data.Data[0].EMP_NAME
            this.EmpId = data.Data[0].EMP_ID
            this.MasterId = data.Data[0].ACC_MASTER_ID
         
           
            
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

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

  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }

}
