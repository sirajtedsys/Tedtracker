import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LeaveRequest } from 'src/class/LeaveRequest';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/services/common.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.page.html',
  styleUrls: ['./leave-request.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LeaveRequestPage implements OnInit {

  lr = new LeaveRequest()

  fromdate: any
  todate: any
  RequestDate: any

  constructor(private router: Router, private loading: LoadingController,

    private datePipe: DatePipe, private comser: CommonService) { }

  ngOnInit() {

    this.comser.CheckUserActivetabs()
    this.loader()
  }

  loader() {

    this.fromdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.todate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.RequestDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    this.PreviousLeaveRequests()
    this.checkScreenSize()
  }


  NavigateTo(route: any) {
    this.router.navigate([route])
  }

  async Submit() {
    if (this.lr.LEAVE_REQUEST_ID == '') 
      {
      console.log(this.fromdate < this.todate);
      if (this.RequestDate != undefined && this.RequestDate != null) {

        if (this.fromdate <= this.todate) {
          this.lr.FromDate = this.datePipe.transform(this.fromdate, 'dd/MM/yyyy')
          this.lr.ToDate = this.datePipe.transform(this.todate, 'dd/MM/yyyy')
          this.lr.LeaveRequestDate = this.datePipe.transform(this.RequestDate, 'dd/MM/yyyy')
          if (this.lr.LeaveReason != '') {

            const loading = await this.loading.create({
              cssClass: 'custom-loading',
              message: 'Loading...',
              spinner: 'dots',
            });
            loading.present();
            this.comser.SaveLeaveRequestAsync(this.lr).subscribe((data: any) => {
              loading.dismiss()
              if (data.Status == 200) {
                Swal.fire(data.Message, '', 'success')
                this.Clear()
                this.loader()

              }
              else {
                Swal.fire(data.Message, '', 'error')
              }
            }, (error: any) => {
              loading.dismiss()
            })
          }
          else {
            Swal.fire('Enter leave reason', '', 'warning')
          }
        }
        else {
          Swal.fire('Enter a valid from and to date', '', 'warning')
        }

      }
      else {
        Swal.fire('Please Select Request Date', '', 'warning')
      }
    }
    else {
      // this.lr.FromDate = this.datePipe.transform(this.fromdate, 'dd/MM/yyyy')
      // this.lr.ToDate = this.datePipe.transform(this.todate, 'dd/MM/yyyy')
      // this.lr.LeaveRequestDate = this.datePipe.transform(this.RequestDate, 'dd/MM/yyyy')
      this.EditLevReq(this.lr.LEAVE_REQUEST_ID, this.lr.FromDate, this.lr.ToDate, this.lr.LeaveReason);
    }
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
  LeaveRequestList: any[] = []

  async PreviousLeaveRequests() {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    loading.present();
    this.comser.GetLeaveRequestsByUserAsync().subscribe((data: any) => {
      loading.dismiss()
      if (data.Status == 200) {
        // Swal.fire(data.Message,'','success')
        // this.Clear()
        // this.loader()
        this.LeaveRequestList = data.Data

      }
      else {
        Swal.fire(data.Message, '', 'error')
      }
    }, (error: any) => {
      loading.dismiss()
    })

  }

  Clear() {
    this.lr.FromDate = ''
    this.lr.ToDate = ''
    this.lr.LeaveReason = ''
    this.lr.LEAVE_REQUEST_ID = ''
  }

  OnEditLeave(items: any) {
    console.log(items);
    this.lr.LEAVE_REQUEST_ID = items.LEAVE_REQUEST_ID;
    this.lr.LeaveReason = items.LEAVE_REASON;
    this.todate = this.datePipe.transform(items.TO_DATE, 'yyyy-MM-dd');
    this.fromdate = this.datePipe.transform(items.FROM_DATE, 'yyyy-MM-dd');
    this.lr.ToDate = this.datePipe.transform(items.TO_DATE, 'yyyy-MM-dd');
    this.lr.FromDate = this.datePipe.transform(items.FROM_DATE, 'yyyy-MM-dd');
  }

  async EditLevReq(leaveRequestId: any, fromDate: any, toDate: any, leaveReason: any) {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    this.comser.UpdateLeaveRequest(leaveRequestId, fromDate, toDate, leaveReason).subscribe(
      (data: any) => {
        loading.dismiss();
        if (data.Status == 200) {
          Swal.fire(data.Message, '', 'success')
          this.PreviousLeaveRequests();
          this.Clear();
          this.loader();
        } else {
          Swal.fire(data.Message, '', 'error');
        }
      },
      (error: any) => {
        loading.dismiss();
      }
    );
  }

  OnDeleteLeave(items: any) {
    // leaverequestid
    console.log(items);

    Swal.fire({
      title: 'Do you want to Delete?',
      text: "Saved Data will be lost!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteLevReq(items.LEAVE_REQUEST_ID);
      }
    });
  }

  async DeleteLevReq(a: any) {
    const loading = await this.loading.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'dots',
    });
    await loading.present();
    this.comser.DeleteLeaveRequest(a).subscribe(
      (data: any) => {
        loading.dismiss();
        if (data.Status == 200) {
          Swal.fire(data.Message, '', 'success')
          this.PreviousLeaveRequests();
        } else {
          Swal.fire(data.Message, '', 'error');
        }
      },
      (error: any) => {
        loading.dismiss();
      }
    );
  }
}
