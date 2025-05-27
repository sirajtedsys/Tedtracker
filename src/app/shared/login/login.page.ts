import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonService } from 'src/services/common.service';
import {LoadingController} from "@ionic/angular"
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  UserName:string=''
  Password:string=''

  constructor(
    private router:Router,
    private comser:CommonService,
    private loader:LoadingController,
    private authser:AuthService
  ) { }

  ngOnInit() {
    this.AutoLogin()
  }


  NavigateTo(route:any){
    this.router.navigate([route])

  }


 async  Login(){
    
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    if(this.UserName!='')
    {
      if(this.Password!='')
      {
        
        await loading.present();
        this.comser.LoginCheck(this.UserName,this.Password).subscribe((data:any)=>{
          loading.dismiss()
          if(data)
          {
            if(data.Status==200)
            {
              this.authser.EncryptToken(data.Message)
              this.NavigateTo('home/menu')
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Signed in successfully"
              });
            }
            else
            {
              Swal.fire(data.Message,'','warning')
            }
            console.log(data);
            
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

      }
      else
      {
        Swal.fire('Please Enter Password','','warning')
      }
    }
    else
    {
      Swal.fire('Please Enter UserName','','warning')
    }
  }


  async AutoLogin(){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    // if(localStorage.getItem('tedtrackurl'))
    // {
      if(localStorage.getItem('extrtype'))
      {
        await loading.present()
        this.comser.GetEmployeeDetails().subscribe((data:any)=>{
           loading.dismiss()
          if(data.Status==200)
          {
            this.NavigateTo('home/menu')
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Signed in successfully"
            });
          }
        },(error:any)=>{
          loading.dismiss()
        })
      }
    // }
    // else
    // {
    //   this.NavigateTo('config')
    // }
  }

}
