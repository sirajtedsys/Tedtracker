import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterOutlet],
})
export class HomePage {
  constructor(private router:Router) {}


  NavigateTo(route:any){
    this.router.navigate(['home/'+route])


  }
}
