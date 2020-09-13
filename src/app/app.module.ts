import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { PromptComponent } from './game/prompt/prompt.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { JoinGameComponent } from './game/join-game/join-game.component';
import {FormsModule} from '@angular/forms';
import { GameLobbyComponent } from './game/game-lobby/game-lobby.component';
import { AddPromptComponent } from './add-prompt/add-prompt.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BackButtonComponent } from './utilities/back-button/back-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FullscreenComponent, ToggleFullscreenDirective} from './utilities/fullscreen/fullscreen.component';
import {AngularFireStorageModule, BUCKET} from '@angular/fire/storage';
import { ChromecastComponent } from './chromecast/chromecast.component';
import {AngularFireFunctionsModule, ORIGIN, REGION} from '@angular/fire/functions';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    PromptComponent,
    JoinGameComponent,
    GameLobbyComponent,
    AddPromptComponent,
    BackButtonComponent,
    FullscreenComponent,
    ChromecastComponent,
    ToggleFullscreenDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [
    {provide: REGION, useValue: 'australia-southeast1'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
