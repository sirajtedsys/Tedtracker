import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    children:[
      {
        path: 'AddExpense',
        loadComponent: () => import('./home/add-expense/add-expense.page').then( m => m.AddExpensePage)
      },
      {
        path: 'Transaction',
        loadComponent: () => import('./home/transaction/transaction.page').then( m => m.TransactionPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./home/profile/profile.page').then( m => m.ProfilePage)
      },
      {
        path: 'expence-cancel/:ExpId',
        loadComponent: () => import('./home/expence-cancel/expence-cancel.page').then( m => m.ExpenceCancelPage)
      },
      {
        path: 'Attendance',
        loadComponent: () => import('./home/attendance/attendance.page').then( m => m.AttendancePage)
      },
      {
        path: 'menu',
        loadComponent: () => import('./home/menu/menu.page').then( m => m.MenuPage)
      },
      {
        path: 'Inbox',
        loadComponent: () => import('./home/employee-task-list/employee-task-list.page').then( m => m.EmployeeTaskListPage)
      },
       {
        path: 'AddCall',
        loadComponent: () => import('./home/add-call/add-call.page').then( m => m.AddCallPage)
      },
      {
        path: 'employee-attendance-report',
        loadComponent: () => import('./home/employee-attendance-report/employee-attendance-report.page').then( m => m.EmployeeAttendanceReportPage)
      },

      {
        path: 'attendance-report',
        loadComponent: () => import('./home/attendence-report/attendence-report.page').then( m => m.AttendenceReportPage)
      },  
       
       {
        path: 'SupportCall',
        loadComponent: () => import('./home/support-call/support-call.page').then( m => m.SupportCallPage)
      },
      {
        path: 'daily-work-report',
        loadComponent: () => import('./home/daily-work-report/daily-work-report.page').then( m => m.DailyWorkReportPage)
      },
      {
        path: 'call-list',
        loadComponent: () => import('./home/call-list/call-list.page').then( m => m.CallListPage)
      },

      {
        path: 'all-work-report',
        loadComponent: () => import('./home/all-work-report/all-work-report.page').then( m => m.AllWorkReportPage)
      },

      {
        path: 'employee-work-dashboard',
        loadComponent: () => import('./home/employee-work-dashboard/employee-work-dashboard.page').then( m => m.EmployeeWorkDashboardPage)
      },
      {
        path: 'employee-work-details',
        loadComponent: () => import('./home/employee-work-details/employee-work-details.page').then( m => m.EmployeeWorkDetailsPage)
      },
      {
        path: 'project-client-list',
        loadComponent: () => import('./home/project-client-list/project-client-list.page').then( m => m.ProjectClientListPage)
      },
      {
        path: 'leave-request',
        loadComponent: () => import('./home/leave-request/leave-request.page').then( m => m.LeaveRequestPage)
      },
      {
        path: 'leave-request-list',
        loadComponent: () => import('./home/leave-request-list/leave-request-list.page').then( m => m.LeaveRequestListPage)
      },

    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./shared/login/login.page').then( m => m.LoginPage),
  
  },

  {
    path: 'config',
    loadComponent: () => import('./shared/enter-url/enter-url.page').then( m => m.EnterUrlPage)
  },
 

 





];
