/// <reference types="@angular/localize" />
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-VE';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideRouter } from '@angular/router';
import { caminos } from 'src/app/app-routing.module'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { OrderByPipe } from './servicios/orderBy.pipe.spec';
registerLocaleData(localeEs, 'es');
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, HttpClientModule,
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideMessaging(() => getMessaging()),
      provideDatabase(() => getDatabase()),
      NgbModule
    ),
    provideRouter(caminos),
  ],
}).catch(err => console.error(err));
/** Temporal para install */
/* platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

 */
