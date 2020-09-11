import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { FullscreenComponent } from './utilities/fullscreen/fullscreen.component';
import {AngularFireStorageModule} from '@angular/fire/storage';
import { ChromecastComponent } from './chromecast/chromecast.component';

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
    ChromecastComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
