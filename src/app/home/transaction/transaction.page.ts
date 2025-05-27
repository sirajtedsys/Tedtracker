import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LoadingController} from '@ionic/angular'
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class TransactionPage implements OnInit {
  Today:any
  SelectedDate:any

  EmpData:any[]=[]

  TransactionList:any[]=[]

  constructor(
    private loader:LoadingController,
    private comser:CommonService,
    private datepipe:DatePipe,
    private authser:AuthService,
    private router:Router
  ) {

    this.comser.CheckUserActivetabs()
    this.OnPageLoad()
   }

  ngOnInit() {
  }
  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }


  OnPageLoad(){
    this.Today = this.datepipe.transform(new Date(),'yyyy-MM-dd')
    this.GetEmployeeDetails()
    this.SelectedDate=this.Today
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
            this.EmpData = data.Data

            let d = this.datepipe.transform(new Date,'dd/MM/yyyy')
          this.GetEmployeeExpensesAsync(this.EmpData[0].ACC_MASTER_ID,d,d)
         
           
            
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

  async  GetEmployeeExpensesAsync(aId:any,from:any,To:any){
    
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetEmployeeExpensesAsync(aId,from,To).subscribe((data:any)=>{
          loading.dismiss()
          if(data)
          {
            if(data.Status==200)
            {
              // this.TransactionList=data.Data
const seenRefNos = new Set();

              for (const item of data.Data) {
                if (!seenRefNos.has(item.EMP_EXP_REF_NO)) {
                  seenRefNos.add(item.EMP_EXP_REF_NO);
                  this.TransactionList.push(item);
                }
              }
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

  Datechange(event:any){
    let val  = event.target.value
    console.log(val);
    let d = this.datepipe.transform(val,'dd/MM/yyyy')
    this.GetEmployeeExpensesAsync(this.EmpData[0].ACC_MASTER_ID,d,d)

  }


  ExpenseDetails(items:any)
  {
    console.log(items);
    // EMP_EXP_ID
    
  let encryptedParam = this.authser.Encrypt(items);

  if (encryptedParam) {
    // Navigate to the route with the encrypted parameter
    this.router.navigate(['home/expence-cancel', encryptedParam]);
  } else {
    console.error('Failed to encrypt the parameter.');
  }
    
  }

}
