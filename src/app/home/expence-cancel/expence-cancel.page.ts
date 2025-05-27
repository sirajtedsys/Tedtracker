import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController} from '@ionic/angular'
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonService } from 'src/services/common.service';
import { AuthService } from 'src/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expence-cancel',
  templateUrl: './expence-cancel.page.html',
  styleUrls: ['./expence-cancel.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]
})
export class ExpenceCancelPage implements OnInit {


  encrypteddata:string=''
  ExpenseList:any[]=[]

  RefDate:string=''
  Name:string=''
  TotalAmt:string=''
  RefNo:string=''
  PROJECT_NAME:string=''

  remarks:string=''
  ExpenseId:any


  constructor(
    private loader:LoadingController,
    private comser:CommonService,
    private authser:AuthService,
    private route:ActivatedRoute,
    private router:Router

  ) {
    this.getRouteParam()
   }

  ngOnInit() {
  }


  getRouteParam(): void {
    this.route.paramMap.subscribe((params) => {
      const d = params.get('ExpId'); // Replace 'd' with your parameter name
      console.log('Route Parameter:', d);
      if(d!=null)
      {

        this.encrypteddata=d
      }
      this.GetdecryptedData(d)
    });
  }

//   {
//     "CONFIRM_STATUS": "N",
//     "EXP_DTLS_SLNO": "1",
//     "ACC_MASTER_NAME": "Robin Raju - Advance",
//     "ACC_EXPENCE": "Food Expenses",
//     "EXP_DTLS_AMT": "200",
//     "EXP_DTLS_REMARK": "Lunch",
//     "EMP_EXP_ID": "121230000442",
//     "EMP_EXP_REF_NO": "29",
//     "EMP_EXP_DATE": "13/03/2025 01:40:22 PM",
//     "EXP_AMT": "230"
// }


  GetdecryptedData(val:any){
    let dat = this.authser.Decrypt(val)
    this.ExpenseId = dat.EMP_EXP_ID
    this.GetEmployeeExpenseDetailsAsync(dat.EMP_EXP_ID)
    // console.log(dat);
    // this.PatientName = dat.PATIENTNAME
    // this.OPNo = dat.PATI_OPNO
    // this.Age = dat.AGE
    // this.Gender = dat.GENDER=='F'?'Female':dat.GENDER=='M'?'Male':dat.GENDER
    //   this.pid = dat.Pid
    //   this.pEdocId=dat.DocId
    //   this.edocId=dat.DocId
    // this.GetuserDetails()  
    // this.getdoctorassessmentlist()
    // this.GetAllPatientVitals(dat.EMR_DOC_ID)+

    
  // this.router.navigate(['home/patient-test-report',this.encrypteddata,'vitals-list'])
    
  }


  async GetEmployeeExpenseDetailsAsync(expid:any){
    
    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.GetEmployeeExpenseDetailsAsync(expid).subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
            this.ExpenseList=data.Data
            if(data.Data.length>0)
            {
              this.Name=data.Data[0].ACC_MASTER_NAME
              this.RefDate=data.Data[0].EMP_EXP_DATE
              this.RefNo=data.Data[0].EMP_EXP_REF_NO
              this.TotalAmt=data.Data[0].EXP_AMT
              this.PROJECT_NAME=data.Data[0].PROJECT_NAME
            }
            
            console.log(data);
         
           
            
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


  Cancel(){
    if(this.remarks!='')
    {

      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to Cancel this expense!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'yes,Cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Call your delete service here
            // this.authser.LogOutMethod()
            this.CancelMethod()
            
        }
    });
    }
    else
    {
      Swal.fire('Please enter a remraks to Submit')
    }

  }


 async CancelMethod(){

    const loading = await this.loader.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })
        
        await loading.present();
        this.comser.UpdateEmployeeExpense(this.remarks,this.ExpenseId).subscribe((data:any)=>{
          loading.dismiss()
          if(data.Status==200)
          {
           
            Swal.fire(data.Message,'','success')
            console.log(data);
         


           
            
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


  NavigateTo(route:any)
  {
    this.router.navigate([route])
  }

}
