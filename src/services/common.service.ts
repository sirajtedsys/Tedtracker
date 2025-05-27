import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, retry, throwError } from 'rxjs';
// import { AppConfig } from 'src/Class/AppConfig';
import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { AppConfig } from 'src/class/AppConfig';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  appconfig =new AppConfig()
  decryptiondata:any

  

  constructor(private http:HttpClient,private authser:AuthService,private loadingCtrl:LoadingController,
    private datePipe:DatePipe,private router:Router) { }
  isLoading:boolean=false
  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    });
    await loading.present();

    // Uncomment below line to auto-hide the loader after 2 seconds (duration)
    // setTimeout(() => loading.dismiss(), 2000);
  }

  


  CheckForUnAuthorised(error:any){
    if(error.status==401)
    {
      // window.location.reload()
      this.authser.LogOutMethod()
      this.router.navigate(['login'])
    }

  }

  CheckFor404(error:any){
    if(error.status==404)
    {
      // window.location.reload()
      Swal.fire("Oops! The requested resource was not found.",'','error')
      // this.authser.LogOutMethod()
      // this.router.navigate(['login'])
    }

  }

  CheckForSt0(error:any){
    if(error.status==0)
    {
      // window.location.reload()
      Swal.fire("Request failed! The server may be down or unavailable",'','error')
      // this.authser.LogOutMethod()
      // this.router.navigate(['login'])
    }

  }

  //  "Request failed! The server may be down or unavailable."

  async dismissLoading() {
    this.isLoading = false;
    await this.loadingCtrl.dismiss();
  }

  formatDate(date: string): string {
    const transformedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return transformedDate ? transformedDate : ''; // Handle null case
  }

  getFirstDayOfMonth(date: Date): Date {
    // Create a new date object based on the provided date
    const firstDay = new Date(date);
    
    // Set the date to 1, which will automatically adjust the month
    firstDay.setDate(1);
    
    // Return the first day of the month
    return firstDay;
  }


  getLastDateOfMonth(date: string | Date): Date {
    const inputDate = new Date(date);
    return new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);
  }
  


  GetDecryptedData(){
    this.decryptiondata= this.authser.DecryptToken()
    }

    calculateAge(dob: string): number {
      const birthDate = new Date(dob);
      // console.log(birthDate);
      
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
  
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      // console.log(age);
      
      return age;
    }

    isValidEmail(email: string): boolean {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    isUrlOrIp(input: string): boolean {
      // Updated regular expression for URLs, including localhost and optional port numbers
      const urlRegex = /^(https?:\/\/)?((localhost|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63})|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/;

      // Regular expression for IPv4 addresses
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
      // Check if the input matches either the updated URL regex or the IP regex
      return urlRegex.test(input) || ipRegex.test(input);
    }


    getSumByKey<T>(arr: T[], key: keyof T): number {
      return arr.reduce((sum, obj) => sum + (Number(obj[key]) || 0), 0);
    }
    // SaveOrUpdateDevice(string deviceId, string fcmToken, string name, string dispLocationId


    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
      this.checkScreenSize();
    }
  
    checkScreenSize() {
      return  window.innerWidth < 767;
      // console.log('Is Mobile:', this.isMobile);
    
      // let v = { mob: this.isMobile };
      // localStorage.setItem('viewsize', JSON.stringify(v));
    }

  SaveRemarks(attend:any) 
  {

    this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/Attendence/SavePunchRemarks', attend,options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in Save remarks:', error);
      return throwError(error); // Rethrow the error
    })
  );
  
   
  }


    async getUserDetails(){
    
      this.GetEmployeeDetails().subscribe((data:any)=>{
  
        console.log(data);
        
        // this.comser.dismissLoading();
        if(data.Status==200)
        {
      
          this.GetAllTabs(data.Data[0].EMP_ID,1)
    
          
        }
        else
        {
          // console.log(s);
          Swal.fire(data.Message,'','error')
        
          
        }
      },
    (error:any)=>{
      // this.comser.dismissLoading()
      // loading.dismiss()
    })
    }
  
    async GetAllTabs(empid:any,mduleid:any){

      this.GetTabs(empid,mduleid).subscribe((data:any)=>{
        // loading.dismiss()
        console.log(data);
        
        // this.comser.dismissLoading();
        if(data.Status==200)
        {
          
          // let url = this.getCurrentFullUrl()
          let linkname  = this.getLastSegment()
          console.log(linkname);
          
          let v = data.Data.filter((x:any)=>x.Link==linkname)
          console.log(v);
          
          if(v.length==0)
          {
            this.authser.LogOutMethod()
            
            Swal.fire('Contact Administrator for page right','','error')
          }
          else
          {
          }
          // this.TabsList=data.Data
          // console.log('ddddd');
          
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
      // loading.dismiss()
    })
    }

    async CheckUserActivetabs(){
      await this.getUserDetails()
    }
    getCurrentFullUrl(): string {
      return window.location.href;
    }
   
    getLastSegment(): string {
      const segments = this.router.url.split('/');
      return segments.pop() || '';
    }


PageRightCheck(){
  this.getUserDetails()

}








  LoginCheck(Username:string,password:string) 
  {
  let cred={
      UserName:Username,
      Password:password

    }
    let headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');
    // headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
    let options ={ headers: headers };
    return this.http.post(this.appconfig.url + '/ExpenseTracker/CheckLogin',cred, options)
    .pipe(
        
      catchError((error: any) => {
        // alert(error)
        // Handle the error here or rethrow it as needed
        console.error('Error in LoginCheck:', error);
        return throwError(error); // Rethrow the error
      })
    );
}


GetEmployeeDetails() 
{
this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetUserDetails', options)
  .pipe(
      
    catchError((error: any) => {
      
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // alert(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployeeDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



GetAccountMastersAsync() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetAccountMastersAsync', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetAccountMastersAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



GetActiveProjects() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetActiveProjects', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetActiveProjects:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetEmployeeExpensesAsync(strAccountId:any,strFrom:any,strTo:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetEmployeeExpensesAsync?strAccountId='+strAccountId+'&strFrom='+strFrom+'&strTo='+strTo, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployeeExpensesAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetEmployeeExpenseDetailsAsync(strExpId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetEmployeeExpenseDetailsAsync?strExpId='+strExpId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployeeExpenseDetailsAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



// UpdateEmployeeExpense(string strUserId, string strRemarks, int expId)

AddEmployeeExpence(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/ExpenseTracker/AddEmployeeExpence',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in AddEmployeeExpence:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


UpdateEmployeeExpense(strRemarks:any,expId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/UpdateEmployeeExpense?strRemarks='+strRemarks+'&expId='+expId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in UpdateEmployeeExpense:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



GetPunchDetails(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/Attendence/GetPunchDetails',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetPunchDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



GetEmployeePunchDetails(empid:any ,datee:any){
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetEmployeePunchDetails?empid='+empid+'&datee='+datee, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployeePunchDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetWorkAssignments(empid:any){
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetWorkAssignments?empid='+empid, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetWorkAssignments:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetCallTypes() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetCallTypes', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetActiveProjects:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetActiveProjects1() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetActiveProjects', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetActiveProjects:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

// GetActiveProjects1(clientId:any) 
// {
// console.log(clientId);

//   this.GetDecryptedData()
//   let headers = new HttpHeaders();
//   headers.set("Accept", 'application/json');
//   headers.set('Content-Type', 'application/json');
//   headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
//   let options ={ headers: headers };
//   return this.http.get(this.appconfig.url + '/AddCall/GetActiveProjects?clientId='+clientId, options)
//   .pipe(
    
//     catchError((error: any) => {
//       this.CheckForUnAuthorised(error)
// this.CheckFor404(error)
// this.CheckForSt0(error)
//       // Handle the error here or rethrow it as needed
//       console.error('Error in GetActiveProjects:', error);
//       return throwError(error); // Rethrow the error
//     })
//   );
// }

GetError() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetErrorTypes', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetErrorTypes:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetModules() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetModules', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetModules:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetEmergency() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetEmergency', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmergency:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetEmployee() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetEmployee', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployee:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetClients(ProjectId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetClients?ProjectId='+ProjectId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetClients:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetRefNo(ondate:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/GetRefNo?ondate='+ondate, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetRefNo:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
SaveAddCall(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/AddCall/SaveAddCall?',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveAddCall:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetAccountBalances(tdate:any,YearID:any,CompId:any,AcMasterId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetAccountBalances?tdate='+tdate+'&YearID='+YearID+'&CompId='+CompId+'&AcMasterId='+AcMasterId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetAccountBalances:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetCompanySettingsAsync() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetCompanySettingsAsync', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetSettings:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetTabs(empid:any ,moduleId:any){
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetTabs?empId='+empid+'&moduleId='+moduleId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployeePunchDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

AttendenceReport(strFDate:any,strTDate:any,Empid:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetAttendenceReport?strFDate='+strFDate+'&strTDate='+strTDate+'&Empid='+Empid, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in AttendenceReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

// GetAttenReport(strFDate:any,strTDate:any,Empid:any) 
// {

//   this.GetDecryptedData()
//   let headers = new HttpHeaders();
//   headers.set("Accept", 'application/json');
//   headers.set('Content-Type', 'application/json');
//   headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
//   let options ={ headers: headers };
//   return this.http.get(this.appconfig.url + '/Attendence/GetAttenReport?strFDate='+strFDate+'&strTDate='+strTDate+'&Empid='+Empid, options)
//   .pipe(
    
//     catchError((error: any) => {
//       this.CheckForUnAuthorised(error)
// this.CheckFor404(error)
// this.CheckForSt0(error)
      
//       // Handle the error here or AttendenceReport it as needed
//       console.error('Error in AttendenceReport:', error);
//       return throwError(error); // Rethrow the error
//     })
//   );
// }

GetCompayId() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetCompayId', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetActiveProjects:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

SaveSupportCall(exp:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/SupportCall/SaveSupportCall?',exp, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveSupportCall:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetSupportRefNo(ondate:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/SupportCall/GetSupportRefNo?ondate='+ondate, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetSupportRefNo:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

UpdateWorkStatus(workDtlsId:any,workId:any,workStatusId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/UpdateWorkStatus?workDtlsId='+workDtlsId+'&workId='+workId+'&workStatusId='+workStatusId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in UpdateWorkStatus:', error);
      return throwError(error); // Rethrow the error
    })
  );
}




SaveAppDailyWorkSheetAsync(daily:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/Attendence/SaveAppDailyWorkSheetAsync',daily, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveAppDailyWorkSheetAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

ReassignTonewEmployeeFromInbox(daily:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/Attendence/ReassignTonewEmployeeFromInbox',daily, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveAppDailyWorkSheetAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetDailyWorkSheet(WorkDate:any,WorkDate1:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetDailyWorkSheet?WorkDate='+WorkDate+'&WorkDate1='+WorkDate1, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetDailyWorkSheet:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetAllWorkSheet(workDateF:any, workDateT:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetAllWorkSheet?workDateF='+workDateF+'&workDateT='+workDateT, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetAllWorkSheet:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetBreakDet(strFDate:any,strTDate:any,Empid:any) 
  {
  
    this.GetDecryptedData()
    let headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
    let options ={ headers: headers };
    return this.http.get(this.appconfig.url + '/Attendence/GetEmployeePunchDet?punchStartDate='+strFDate+'&punchEndDate='+strTDate+'&Empid='+Empid, options)
    .pipe(
      
      catchError((error: any) => {
        this.CheckForUnAuthorised(error)
  this.CheckFor404(error)
  this.CheckForSt0(error)
        
        // Handle the error here or AttendenceReport it as needed
        console.error('Error in AttendenceReport:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }


GetAttenReport(strFDate:any,strTDate:any,Empid:any,bltype:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetAttenReport?strFDate='+strFDate+'&strTDate='+strTDate+'&Empid='+Empid+'&bltype='+bltype, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in AttendenceReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetWorkDetailsAsync(whereClause:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
return this.http.get(this.appconfig.url + '/AddCall/GetWorkDetailsAsync?whereClause='+whereClause, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetDailyWorkSheet:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

DeleteDailyWorkSheetAsync(WorkSheetId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/DeleteDailyWorkSheetAsync?WorkSheetId='+WorkSheetId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in DeleteDailyWorkSheetAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

SaveWorkAssignmentFromCallList(WorkId:any, empId:any){
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/SaveWorkAssignmentFromCallList?WorkId='+WorkId+'&empId='+empId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in GetEmployeePunchDetails:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


uploadFiles(daily: any, file: File,wrefno:any,workid:any) {
  this.GetDecryptedData(); // Fetch decrypted data (e.g., token)

  // Create a FormData object to send both the file and other data
  const formData: FormData = new FormData();
  formData.append('daily', JSON.stringify(daily)); // Send the daily data as a string
  formData.append('file', file); // Append the file to the form data
  formData.append('wrefno', JSON.stringify(wrefno)); 
  formData.append('workid', JSON.stringify(workid)); 
  // Set headers
  let headers = new HttpHeaders().set("Accept", 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata)

  // Setup options with headers
  let options = { headers: headers };

  // Send the request with the file and data as FormData
  return this.http.post(this.appconfig.url + '/SupportCall/FileUpload', formData, options)
    .pipe(
      catchError((error: any) => {
        // Handle errors
        this.CheckForUnAuthorised(error);
        this.CheckFor404(error);
        this.CheckForSt0(error);

        console.error('Error in FileUpload:', error);
        return throwError(error);
      })
    );
}
uploadFilesSupport(daily: any, file: File,wrefno:any,workid:any) {
  this.GetDecryptedData(); // Fetch decrypted data (e.g., token)

  // Create a FormData object to send both the file and other data
  const formData: FormData = new FormData();
  formData.append('daily', JSON.stringify(daily)); // Send the daily data as a string
  formData.append('file', file); // Append the file to the form data
  formData.append('wrefno', JSON.stringify(wrefno)); 
  formData.append('workid', JSON.stringify(workid)); 
  // Set headers
  let headers = new HttpHeaders().set("Accept", 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata)

  // Setup options with headers
  let options = { headers: headers };

  // Send the request with the file and data as FormData
  return this.http.post(this.appconfig.url + '/SupportCall/FileUpload', formData, options)
    .pipe(
      catchError((error: any) => {
        // Handle errors
        this.CheckForUnAuthorised(error);
        this.CheckFor404(error);
        this.CheckForSt0(error);

        console.error('Error in FileUpload:', error);
        return throwError(error);
      })
    );
}

SaveLeaveRequestAsync(leav:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/ExpenseTracker/SaveLeaveRequestAsync',leav, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in CloseCallFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

CloseCallFromCAllList(daily:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/Attendence/CloseCallFromCAllList',daily, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in CloseCallFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

OpenCallBySelfFromCAllList(WorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/OpenCallBySelfFromCAllList?WorkId='+WorkId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetAttach(WorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetAttach?workid='+WorkId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetAttach1(WorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetAttach?workid='+WorkId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetOpenedWorkOfEmpkoyee(empid:any) 
{
  console.log(empid)
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetOpenedWorkOfEmpkoyee?empid='+empid, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetOpenedWorkOfEmpkoyee11(empid:any) 
{
  console.log(empid)

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetOpenedWorkOfEmpkoyee?empid='+empid, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetOracleTimeAsync() 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetOracleTimeAsync', options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetOracleTimeAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetLeaveRequestsByUserAsync() 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetLeaveRequestsByUserAsync', options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetLeaveRequestsByUserAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetActiveClientWorkStatuses() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetActiveClientWorkStatuses', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in GetActiveClientWorkStatuses:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

SaveProjectWorkStatus( projectWorkId:any,  clientWorkStatusId:any,  remarks:any,P_WORK_STATUS_DATE:any,ex_remarks:any)
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/SaveProjectWorkStatus?projectWorkId='+ projectWorkId+'&clientWorkStatusId='+clientWorkStatusId+'&remarks='+remarks+'&P_WORK_STATUS_DATE='+P_WORK_STATUS_DATE+'&ex_remarks='+ex_remarks, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in EmployeeWorkReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}



GetPhoto(name: any) {
  let headers = new HttpHeaders();
  headers = headers.set("Accept", "application/json");
  headers = headers.set("Content-Type", "application/json");

  // Ensure responseType is set to 'blob' explicitly
  let options: any = { headers: headers, responseType: 'blob' as 'blob' };

  return this.http.get(this.appconfig.url + "/TvToken/GetPhoto?fileName=" + name, options).pipe(
    catchError((error: any) => {
      // this.CheckForUnAuthorised(error);
      // this.CheckFor404(error);
      // this.CheckForSt0(error);
      console.error("Error in GetPhoto:", error);
      return throwError(error);
    })
  );
}



SaveCallInform(daily:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.post(this.appconfig.url + '/AddCall/SaveCallInform',daily, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in SaveCallInform:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetClientWorkStatusByProjectIdAsync(projectWorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetClientWorkStatusByProjectIdAsync?projectWorkId='+ projectWorkId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
      this.CheckFor404(error)
      this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in GetClientWorkStatusByProjectIdAsync:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

// GetWorkStatus(DepartmentId:any) 
// {

//   this.GetDecryptedData()
//   let headers = new HttpHeaders();
//   headers.set("Accept", 'application/json');
//   headers.set('Content-Type', 'application/json');
//   headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
//   let options ={ headers: headers };
//   return this.http.get(this.appconfig.url + '/Attendence/GetEmployeeWorkdasboard?DepartmentId='+ DepartmentId, options)
//   .pipe(
    
//     catchError((error: any) => {
//       this.CheckForUnAuthorised(error)
// this.CheckFor404(error)
// this.CheckForSt0(error)
      
//       // Handle the error here or AttendenceReport it as needed
//       console.error('Error in AttendenceReport:', error);
//       return throwError(error); // Rethrow the error
//     })
//   );
// }

GetempworkDet(empid:any,id:any) 
  {
  
    this.GetDecryptedData()
    let headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
    let options ={ headers: headers };
    return this.http.get(this.appconfig.url + '/Attendence/GetEmployeeWorkdasboarddet?empid='+empid+'&id='+id, options)
    .pipe(
      
      catchError((error: any) => {
        this.CheckForUnAuthorised(error)
  this.CheckFor404(error)
  this.CheckForSt0(error)
        
        // Handle the error here or AttendenceReport it as needed
        console.error('Error in AttendenceReport:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

  GetDepartment() 
  {
  
    this.GetDecryptedData()
    let headers = new HttpHeaders();
    headers.set("Accept", 'application/json');
    headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
    let options ={ headers: headers };
    return this.http.get(this.appconfig.url + '/Attendence/GetDepartment', options)
    .pipe(
      
      catchError((error: any) => {
        this.CheckForUnAuthorised(error)
  this.CheckFor404(error)
  this.CheckForSt0(error)
        // Handle the error here or rethrow it as needed
        console.error('Error in GetDepartment:', error);
        return throwError(error); // Rethrow the error
      })
    );
  }

  GetEmpWorkDetails(EmployeeId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetEmployeeWorkdetails?EmployeeId='+ EmployeeId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in EmployeeWorkReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetEmployeeWorkdetailsEmp(EmployeeId:any,empid:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetEmployeeWorkdetailsEmp?EmployeeId='+ EmployeeId+'&empid='+empid, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in EmployeeWorkReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetEmployeeWorkdetailsEmpStatus(EmployeeId:any,empid:any,workstatusid:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetEmployeeWorkdetailsEmpStatus?EmployeeId='+ EmployeeId+'&empid='+empid+'&workstatusid='+workstatusid, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in EmployeeWorkReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}
GetWorkStatus(DepartmentId:any, EmployeeId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetEmployeeWorkdasboard?DepartmentId='+ DepartmentId+'&empid='+EmployeeId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in AttendenceReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


  RejectTask(WorkId:any,WorkdtlsId:any) 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/AddCall/RejectASsignedWork?WorkId='+WorkId+'&WorkdtlsId='+WorkdtlsId, options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or rethrow it as needed
      console.error('Error in RejectTask:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetWorkStatus1() 
{

  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetWorkStatus', options)
  .pipe(
    
    catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      
      // Handle the error here or AttendenceReport it as needed
      console.error('Error in AttendenceReport:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

Getprojectclientlist() 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/Getprojectclientlist', options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Getprojectclientlist:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetProjectClientAttach(ProjectWorkId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetAttachProject?WorkId='+ProjectWorkId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


GetWorkStatusUpAttach(P_CLNT_WORK_STATUS_ID:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/Attendence/GetWorkStatusUpAttach?P_CLNT_WORK_STATUS_ID='+P_CLNT_WORK_STATUS_ID, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in OpenCallBySelfFromCAllList:', error);
      return throwError(error); // Rethrow the error
    })
  );
}


uploadFilesOnWorkStatusUpdate(daily: any, file: File,CLNT_WORK_STATUS_ID:any) {
  this.GetDecryptedData(); // Fetch decrypted data (e.g., token)

  // Create a FormData object to send both the file and other data
  const formData: FormData = new FormData();
  formData.append('daily', JSON.stringify(daily)); // Send the daily data as a string
  formData.append('file', file); // Append the file to the form data
  // formData.append('wrefno', JSON.stringify(wrefno)); 
  formData.append('CLNT_WORK_STATUS_ID', JSON.stringify(CLNT_WORK_STATUS_ID)); 
  // Set headers
  let headers = new HttpHeaders().set("Accept", 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata)

  // Setup options with headers
  let options = { headers: headers };

  // Send the request with the file and data as FormData
  return this.http.post(this.appconfig.url + '/SupportCall/uploadFilesOnWorkStatusUpdate', formData, options)
    .pipe(
      catchError((error: any) => {
        // Handle errors
        this.CheckForUnAuthorised(error);
        this.CheckFor404(error);
        this.CheckForSt0(error);

        console.error('Error in FileUpload:', error);
        return throwError(error);
      })
    );
}

DeleteLeaveRequest(leaveRequestId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/DeleteLeaveRequest?LeaveRequestId='+leaveRequestId, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in DeleteLeaveRequest:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

UpdateLeaveRequest(leaveRequestId:any,fromDate:any,toDate:any,leaveReason:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/UpdateLeaveRequest?LeaveRequestId='+ leaveRequestId + 
    '&FromDate=' + fromDate + '&ToDate=' + toDate + '&LeaveReason=' + leaveReason, options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in UpdateLeaveRequest:', error);
      return throwError(error); // Rethrow the error
    })
  );
}




GetActiveLeaveStatuses() 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetActiveLeaveStatuses' ,options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Getting Active Leave Status:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetLeaveRequestAsync(dateFrom:any,dateTo:any,EmpId:any,StatusId:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetLeaveRequestsAsync?dateFrom='
     + dateFrom + '&dateTo=' + dateTo + '&EmpId=' + EmpId + '&StatusId=' + StatusId,options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Getting LeaveRequest :', error);
      return throwError(error); // Rethrow the error
    })
  );
}


ChangeLeaveRequestStatus(leaveRequestId:any,approvedDate:any,statusId:any,remarks:any) 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/ChangeLeaveRequeststatus?leaveRequestId=' + leaveRequestId
     + '&approvedDate=' +  approvedDate + '&statusId=' + statusId + '&remarks=' + remarks ,options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Changing LeaveRequest status:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

GetAllLeaveStatuses() 
{
  this.GetDecryptedData()
  let headers = new HttpHeaders();
  headers.set("Accept", 'application/json');
  headers.set('Content-Type', 'application/json');
  headers = headers.set('Authorization', 'Bearer ' + this.decryptiondata); 
  let options ={ headers: headers };
  return this.http.get(this.appconfig.url + '/ExpenseTracker/GetAllLeaveStatuses' , options)
  .pipe(
        catchError((error: any) => {
      this.CheckForUnAuthorised(error)
this.CheckFor404(error)
this.CheckForSt0(error)
      // Handle the error here or rethrow it as needed
      console.error('Error in Getting Active Leave Status:', error);
      return throwError(error); // Rethrow the error
    })
  );
}

}
