import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {LoadingController} from '@ionic/angular'
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';
import { EmpExpenceDetails } from 'src/class/EmpExpenceDetails';
import { EmpExpence } from 'src/class/EmpExpence';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.page.html',
  styleUrls: ['./add-expense.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class AddExpensePage implements OnInit {
  Today:any

  SettingsData:any
  CurrentBalance:number=0

  SelectedDate:any
  EmpData:any[]=[]
  empex = new EmpExpence()
  empexdet = new EmpExpenceDetails()
  FormList:EmpExpenceDetails[]=[]
  ProjectList:any[]=[]

  Questions:any[]=[]

  constructor(
    private loader:LoadingController,
    private comser:CommonService,
    private datepipe:DatePipe,
    private router:Router
  ) { 
    
    this.comser.CheckUserActivetabs()
    this.OnPageLoad()
    
  }

  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }

  OnPageLoad(){
    this.Today = this.datepipe.transform(new Date(),'yyyy-MM-dd')
    // this.GetCompanySettingsAsync()
    this.GetEmployeeDetails()
    this.empex.ExpDate=this.Today
    this.GetActiveProjects()
    
   
  }

  ngOnInit() {
    
    this.GetQuestions()
  
  }

  async GetActiveProjects(){
    
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetActiveProjects().subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            
            console.log(data);
            this.ProjectList = data.Data
         
           
            
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

  async GetEmployeeDetails(){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetEmployeeDetails().subscribe(async (data:any)=>{
          loading.dismiss()
          if(data)
          {
            
            console.log(data);
            this.EmpData = data.Data

            let compid = await this.GetCompanyId()
            
             await this.GetCompanySettingsAsync()
            console.log(compid.CompId);
            
          
          
            this.GetAccountBalance(this.Today,this.SettingsData?.FinancialYearId,compid.CompId,this.EmpData[0].ACC_MASTER_ID)
  
            
          }
        },(error:any)=>{
          loading.dismiss()
        }
      )

  }

  async  GetQuestions(){
    
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetAccountMastersAsync().subscribe((data:any)=>{
          loading.dismiss()
          if(data)
          {
            if(data.Status==200)
            {
              this.Questions=data.Data
              this.MakeTheInitialForm(data.Data)
              
            //   {
            //     "ACC_MASTER_ID": "1010000699",
            //     "ACC_MASTER_NAME": "Food Expenses",
            //     "G_TYPE_SECTION": "1"
            // }
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


  MakeTheInitialForm(data:any){
    this.FormList=[]
    for(let i = 0 ;i<data.length;i++)
    {
      let exd = new EmpExpenceDetails()
      exd.AccMasterId = data[i].ACC_MASTER_ID
      exd.ExpDtlSlno = (i+1).toString()
      exd.ActiveStatus = 'A'
      exd.ExpDtlRemark=''
      exd.ExpDtlAmt= ''
      exd.ACC_MASTER_NAME = data[i].ACC_MASTER_NAME
      this.FormList.push(exd)

    }

  }

  async  GetAccountBalance(date:any,finId:any,compid:any,AcMasterId:any){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
    await loading.present()
    this.comser.GetAccountBalances(date,finId,compid,AcMasterId).subscribe((data:any)=>{
      loading.dismiss();
      if(data.Status==200)
      {
        console.log(data);
        this.CurrentBalance = data.Data[0].CurrentBalance
      }
      else
      {
        Swal.fire(data.Message,'','error')
      }
    },(error:any)=>{
      loading.dismiss()
    })
  }
  
  async GetCompanySettingsAsync(): Promise<void> {
    const loading = await this.loader.create({
      cssClass: 'custom-loading', 
      message: 'Loading...',
      spinner: 'dots',
    });
    
    await loading.present();
  
    try {
      const data: any = await lastValueFrom(this.comser.GetCompanySettingsAsync());
  
      loading.dismiss();
  
      if (data.Status === 200) {
        console.log(data);
        this.SettingsData = data.Data;
      } else {
        Swal.fire(data.Message, '', 'error');
      }
    } catch (error) {
      loading.dismiss();
      console.error('Error:', error);
      Swal.fire('Failed to fetch company settings', '', 'error');
    }
  }

  async GetCompanyId(): Promise<any> {
    const loading = await this.loader.create({
      cssClass: 'custom-loading', 
      message: 'Loading...',
      spinner: 'dots',
    });
  
    await loading.present();
  
    try {
      const data: any = await lastValueFrom(this.comser.GetCompayId());
      loading.dismiss();
  
      if (data.Status === 200) {
        console.log(data);
        this.SettingsData = data.Data;
        return data.Data; // ✅ Return the fetched data
      } else {
        Swal.fire(data.Message, '', 'error');
        return null; // ✅ Return null on failure
      }
    } catch (error) {
      loading.dismiss();
      console.error('Error:', error);
      Swal.fire('Failed to fetch company settings', '', 'error');
      return null; // ✅ Return null on error
    }
  }
  
  


  EnterField(event: any, Index: number, Field: 'ExpDtlAmt'|'ExpDtlRemark') {
    let val = event.target.value;
    console.log(val);
    // console.log((Number(val)).toFixed(2));
    
    
    this.FormList[Index][Field] = val;
  }


  GetTotalAmt()
  {
    return (this.comser.getSumByKey(this.FormList,'ExpDtlAmt')).toFixed(2)
  }


  ClearForm(){
    Swal.fire({
      title: 'Are you sure?',
      text: "Entered data will be lost!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Clear!'
  }).then((result) => {
      if (result.isConfirmed) {
          // Call your delete service here
          // this.authser.LogOutMethod()/
          this.Clearfn()
       
         
          
      }
  });

  }

  Clearfn(){
    this.empex = new EmpExpence()
    this.FormList=[]
    this.OnPageLoad()
    this.GetQuestions()
  }


  // async filterValuesENtered(){
  //   if(this.FormList.length>0)
  //   { 
  

  //   }
  //   else
  //   {
  //     return false
  //   }

  // }


 async Submit(){
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })

    this.empex.TotalAmt = this.GetTotalAmt()
    if(this.empex.ProjectId!='')
    {
      if(Number(this.empex.TotalAmt)>0)
        {
          this.empex.accMasterId = this.EmpData[0].ACC_MASTER_ID
          for(let i = 0 ;i<this.FormList.length;i++)
          {
            if(this.FormList[i].ExpDtlAmt=='')
            {
              this.FormList.splice(i,1)
            }
          }
          this.empex.EmpExpenceDetails=this.FormList
          await loading.present()
          this.comser.AddEmployeeExpence(this.empex).subscribe((data:any)=>{
            loading.dismiss()
            if(data.Status==200)
            {
              Swal.fire(data.Message,'','success')
              this.Clearfn()
              // this.OnPageLoad()
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
          Swal.fire('Enter Any Expence to continue','','warning')
        }

    }
    else
    {
      Swal.fire('Select a project to continue','','warning')
    }
   

  }
  
}
