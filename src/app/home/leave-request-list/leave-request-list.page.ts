import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { LeaveRequest } from 'src/class/LeaveRequest';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-leave-request-list',
  templateUrl: './leave-request-list.page.html',
  styleUrls: ['./leave-request-list.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule]

})



export class LeaveRequestListPage implements OnInit {

  lr = new LeaveRequest();
  LeaveRequestList: any[] = [];
  StatusList: any[] = [];
  EmpolyeeNameList: any[] = [];
  ActiveLeaveRequestList: any[] = [];
  ModalStatusList: any[] = [];

  RequestDate: any;
  RequestNumber: any;
  fromdate: any;
  todate: any;
  LeaveReason: any;
  EmpolyeeName: string = '';
  LeaveStatus: string = '';
  CreatedDate: any;

  Ws_Status: string = '';
  Ws_Remarks: string = '';


  constructor(private router: Router,
    private loading: LoadingController,
    private datePipe: DatePipe,
    private comser: CommonService
  ) {
    this.loader()
  }

  ngOnInit() {
  }

  NavigateTo(route: any) {
    this.router.navigate([route])
  }


  loader() {
    let fmd = this.comser.getFirstDayOfMonth(new Date())
    let lsd = this.comser.getLastDateOfMonth(new Date())

    this.fromdate = this.datePipe.transform(fmd, 'yyyy-MM-dd')
    this.todate = this.datePipe.transform(lsd, 'yyyy-MM-dd')
    this.RequestDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    this.checkScreenSize();
    this.GetEmployee();
    this.GetStatus();
    this.GetModalStatus();
    // this.Submit();

  }

  ismobile: boolean = true
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.ismobile = window.innerWidth < 992;
    // console.log('Is Mobile:', this.isMobile);

    // let v = { mob: this.isMobile };
    // localStorage.setItem('viewsize', JSON.stringify(v));
  }


  async GetEmployee() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })

    await loading.present();
    this.comser.GetEmployee().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        console.log(data);
        this.EmpolyeeNameList = data.Data
      }
    }, (error: any) => {
      loading.dismiss()
    }
    )

  }



  async GetStatus() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })

    await loading.present();
    this.comser.GetAllLeaveStatuses().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        console.log(data);
        this.StatusList = data.Data
        this.LeaveStatus = data.Data[0].LeaveStatusId
        this.Submit()

      }
    }, (error: any) => {
      loading.dismiss()
    }
    )

  }



  async Submit() {

    if (this.fromdate <= this.todate ) {

      const loading = await this.loading.create({
        cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
        message: 'Loading...', // Optional: Custom message
        spinner: 'dots', // Optional: Choose a spinner
        // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
      })
      await loading.present();
      this.comser.GetLeaveRequestAsync(this.fromdate, this.todate, this.EmpolyeeName, this.LeaveStatus).subscribe((data: any) => {
        loading.dismiss();
        console.log(data);
        if (data.Status == 200) {

          this.ActiveLeaveRequestList = data.Data
          // this.Clear();
        }
      }, (error: any) => {
        loading.dismiss()
      }
      )
    }
    else {
      Swal.fire('Enter a valid from and to date', '', 'warning')
    }



  }



  Clear() {

    this.fromdate = '';
    this.todate = '';
    this.EmpolyeeName = '';
    this.LeaveStatus = '';

  }

  ClearList() {
    this.Ws_Remarks = '';
    this.Ws_Status = '';
    this.leaveRequestId = '';
  }


  leaveRequestId: string = ''

  OnEditLeave(items: any) {
    console.log(items);
    this.leaveRequestId = items.LeaveRequestId;
  }




  async GetModalStatus() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
      message: 'Loading...', // Optional: Custom message
      spinner: 'dots', // Optional: Choose a spinner
      // duration: 2000 // Optional: Set a duration after which the loader will automatically dismiss
    })

    await loading.present();
    this.comser.GetActiveLeaveStatuses().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        console.log(data);
        this.ModalStatusList = data.Data
      }
    }, (error: any) => {
      loading.dismiss()
    }
    )

  }


  async SubmitTaskStatus() {
    console.log(this.Ws_Remarks, this.Ws_Status);

    if (this.Ws_Status != '') {
      if (this.Ws_Remarks != '') {
        const loading = await this.loading.create({
          cssClass: 'custom-loading', // Optional: Apply custom CSS class for styling
          message: 'Loading...', // Optional: Custom message
          spinner: 'dots', // Optional: Choose a spinner
        })
        // console.log(this.clientId)
        await loading.present();
        this.comser.ChangeLeaveRequestStatus(this.leaveRequestId, this.datePipe.transform(new Date(), 'yyyy-MM-dd'), this.Ws_Status, this.Ws_Remarks)
          .subscribe((data: any) => {
            loading.dismiss()
            console.log(data);
            if (data.Status == 200) {
              Swal.fire(data.Message, '', 'success')

              //   this.ClearWorkStatus()
              //   this.Getprojectclientlist()
              this.closeModal()
              this.Submit()
              this.ClearList()

            }
            else {
              Swal.fire(data.Message, '', 'error')
            }

          }, (error: any) => {
            loading.dismiss()
          })
      }
      else {
        Swal.fire('Enter remark', '', 'warning')
      }
    }
    else {
      Swal.fire('Select Status', '', 'warning')
    }

  }

  closeModal() {
    const modal = document.getElementById('AttachmentModal1'); // Get modal element
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal); // Get Bootstrap modal instance
      modalInstance?.hide(); // Hide modal
    }
  }

}


