import { CommonModule, DatePipe } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/services/common.service';
// import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enter-url',
  templateUrl: './enter-url.page.html',
  styleUrls: ['./enter-url.page.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule],
  providers:[DatePipe]
})
export class EnterUrlPage implements OnInit,OnDestroy {

  Url:any=''
  ur:string='http://'
  CompleteUrl:string=''
 
  storedUrl: string | null =null;

  constructor(
    private comser:CommonService,
    private router:Router
  
  ) {
    this.CheckEmployeeAlreadyLogined()
   }

  ngOnInit() {
  }

  AddUrl() {
    if (this.Url && this.comser.isUrlOrIp(this.Url)) {
      let compurl = this.ur+this.Url
      this.CompleteUrl = compurl
      localStorage.setItem('tedtrackurl', compurl);
      this.router.navigate(['login'])
      // reload()
    } else {
      Swal.fire(
        this.CompleteUrl ? 'Enter a Valid Url or IP' : 'Please enter a valid URL to confirm',
        '',
        'warning'
      );
    }
  }


 
  checkUrlInLocalStorage() {
    if(localStorage.getItem('tedtrackurl'))
    {

      this.storedUrl = localStorage.getItem('tedtrackurl'); 
    }// Check if there's a URL in localStorage
  
    if (this.storedUrl) {
      // If URL exists in localStorage, prompt the user
      Swal.fire({
        title: 'Stored URL Found',
        text: `Do you want to continue with the saved URL (${this.storedUrl}) or change it?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: 'Change URL',
        backdrop:false
      }).then((result) => {
        if (result.isConfirmed) {
          // Safely call continueWithUrl with a non-null string
          this.continueWithUrl(this.storedUrl); 
        } else {
          // If user chooses to change, prompt to enter a new URL
          // this.promptForNewUrl();
          // this.CompleteUrl = (this.storedUrl)?.toString()
          if(this.storedUrl!=null)
          {
            this.Url=this.extractIPWithPort(this.storedUrl)
            
            let ur = (this.extractProtocol(this.storedUrl)==null?'http://':this.extractProtocol(this.storedUrl)+'://')
            // if(ur!=null)
            // {
              this.ur = ur

            // }


          }
        }
      });
    }else
    {

    }
  }

  extractProtocol(url: string): string | null {
    const match = url.match(/^(https?):\/\//);
    return match ? match[1] : null;
}
  
extractIPWithPort(url: string): string | null {
  const match = url.match(/((?:\d{1,3}\.){3}\d{1,3}|\blocalhost\b|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d+)?/);
  return match ? match[0] : null;
}

  continueWithUrl(url: any) {
    console.log(`Continuing with the URL: ${url}`);
    // Proceed with the stored URL (implement as needed)
    this.router.navigate(['login'])
    
  }

  promptForNewUrl() {
    Swal.fire({
      title: 'Enter New URL',
      input: 'url',
      inputLabel: 'URL',
      inputPlaceholder: 'Enter the new URL here',
      showCancelButton: true
    }).then((result) => {
      if (result.value) {
        const newUrl = result.value;
        localStorage.setItem('tedtrackurl', newUrl); // Save the new URL to localStorage
        Swal.fire('URL Saved!', `New URL (${newUrl}) has been saved.`, 'success');
      }
    });
  }


  CheckEmployeeAlreadyLogined(){
    if(localStorage.getItem('user'))
    {
      this.router.navigate(['home/dashboard'])
      
    }
    else
    {
      
    this.checkUrlInLocalStorage()
    }
    
  }




  ngOnDestroy(){
    window.location.reload()
  }

 


}
