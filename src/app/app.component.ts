import { CommonModule,DatePipe,Location } from '@angular/common';
import { Component, HostListener, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import Swal from 'sweetalert2';
// import { Location } from '@angular/common';


import { Platform } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, RouterOutlet,FormsModule,CommonModule],
})
export class AppComponent {
  subscription: any;
  networkStatus: string = 'Unknown';
  // connectSubscription: Subscription | undefined;
  // disconnectSubscription: Subscription | undefined;

  specificPages = ['/login',];

  constructor(
    // private network: Network,
    private platform: Platform,
    private router: Router,
    private location: Location, // Inject Location service
    // private statusBar: StatusBar,
    private renderer: Renderer2,
  ) {
  
    // this.checkScreenSize();
      // this.platform.ready().then(() => {
      //   this.splashScreen.hide();  // Hide splash screen immediately
      // });
      this.initializeKeyboardListeners();
    this.initializeApp();

    // this.updateNetworkStatus();
    this.subscription = this.platform.backButton.subscribeWithPriority(9999, () => {
      const currentUrl = this.router.url;

      // Check if current page is in the specific pages list
      if (this.specificPages.includes(currentUrl)) {
        Swal.fire({
          title: 'Are you sure?',
          text: "Do you want to exit?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Exit!',
        }).then((result) => {
          if (result.isConfirmed) {
            navigator['app'].exitApp();
          }
        });
      } 
      else {
        // Navigate to the previous page if it's not a specific page
        this.location.back();
      }
    });
  }

  isMobile: boolean = false;

  // constructor() { // check once at start
  // }


  

  ngOnInit() {

    // Check the current network status on load
    // Keyboard.addListener('keyboardWillShow', (info) => {
    //   console.log('Keyboard height:', info.keyboardHeight);
    // });

    // Keyboard.addListener('keyboardWillHide', () => {
    //   console.log('Keyboard closed');
    // });
    // Listen to network changes
    // this.connectSubscription = this.network.onConnect().subscribe(() => {
    //   this.updateNetworkStatus();
    // });

    // Subscribe to network disconnect event
    // this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   this.updateNetworkStatus();
    // });
  }

  // updateNetworkStatus() {
  //   const type = this.network.type;
  //   if (type === 'none') {
  //     this.networkStatus = 'No internet connection';
  //   } else if (type === 'wifi' || type === 'cellular') {
  //     this.networkStatus = `Connected via ${type}`;
  //   } else {
  //     this.networkStatus = 'Network status unknown';
  //   }
  // }

  // Cleanup subscription to avoid memory leaks
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // this.connectSubscription?.unsubscribe();
    // this.disconnectSubscription?.unsubscribe();
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    //   // Hide the status bar
    //   this.statusBar.hide();
    //   // Set overlay to true, allowing the web view to use the entire screen
    //   this.statusBar.overlaysWebView(true);
    // });
  }

  // #region Keyboard overlapp
  
  initializeKeyboardListeners() {
    window.addEventListener('keyboardDidShow', (event: any) => {
      this.handleKeyboardDidShow(event);
    });
  
    window.addEventListener('keyboardDidHide', () => {
      this.handleKeyboardDidHide();
    });
  }

  handleKeyboardDidShow(event: any) {
    document.body.classList.add('keyboard-open');
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      setTimeout(() => {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }
  
  handleKeyboardDidHide() {
    document.body.classList.remove('keyboard-open');
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    setTimeout(() => {
      window.scrollTo(0, currentScrollY); // Prevent scroll reset
    }, 100);
  }


  //#endregion keyboard overlapp

  //#region sidebar slide

  isSidebarVisible: boolean = false; // Tracks sidebar visibility
touchStartX: number = 0; // Initial X position of the touch event
touchEndX: number = 0; // Final X position of the touch event
screenWidth: number = window.innerWidth; // Get the width of the screen

// // Function to handle touch start
// @HostListener('window:touchstart', ['$event'])
// onTouchStart(event: TouchEvent): void {
//   this.touchStartX = event.touches[0].clientX; // Get the initial X coordinate
//   console.log('Touch Start:', this.touchStartX);
// }

// // Function to handle touch move
// @HostListener('window:touchmove', ['$event'])
// onTouchMove(event: TouchEvent): void {
//   this.touchEndX = event.touches[0].clientX; // Update the X coordinate as the touch moves
//   console.log('Touch Move:', this.touchEndX);
// }

// // Function to handle touch end
// @HostListener('window:touchend')
// onTouchEnd(): void {
//   const swipeDistance = this.touchEndX - this.touchStartX;
//   console.log('Touch End:', this.touchEndX);
//   console.log('Swipe Distance:', swipeDistance);

//   // Swipe from center to left (open sidebar)
//   if (
//     !this.isSidebarVisible &&
//     this.touchStartX > this.screenWidth * 0.3 && // Swipe starts in the center area
//     swipeDistance < -100 // Swipe distance is negative (center to left)
//   ) {
//     this.showSidebar();
//   }

//   // Swipe from left to center (close sidebar)
//   if (
//     this.isSidebarVisible &&
//     this.touchStartX < this.screenWidth * 0.2 && // Swipe starts on the left 20% of the screen
//     swipeDistance > 100 // Swipe distance is positive (left to center)
//   ) {
//     this.hideSidebar();
//   }
// }

// Show the sidebar
showSidebar(): void {
  this.isSidebarVisible = true;
  const sidebar = document.querySelector<HTMLElement>('.sidebar');
  const wrapper = document.querySelector<HTMLElement>('#wrapper');

  if (sidebar && wrapper) {
    sidebar.classList.add('show-sidebar');
    wrapper.classList.add('fullwidth');
  }
}

// Hide the sidebar
hideSidebar(): void {
  this.isSidebarVisible = false;
  const sidebar = document.querySelector<HTMLElement>('.sidebar');
  const wrapper = document.querySelector<HTMLElement>('#wrapper');

  if (sidebar && wrapper) {
    sidebar.classList.remove('show-sidebar');
    wrapper.classList.remove('fullwidth');
  }
}

//#endregion sidebar slide
  
}
declare var navigator: any;
