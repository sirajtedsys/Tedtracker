import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular'

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),DatePipe,provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicModule.forRoot({}))
  ],
});


// bootstrapApplication(AppComponent, {  
//    providers: [   
//       { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },   
//         provideIonicAngular(),     provideRouter(routes, withPreloading(PreloadAllModules)),  
//            importProvidersFrom(IonicModule.forRoot({}))   ], });
