import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ChromecastService {
  private castSession;
  private cast;
  public status = {
    casting: false
  };

  constructor(private storage: AngularFireStorage) {}

  initializeCastApi() {
    // @ts-ignore
    this.cast = window.chrome.cast;
    const sessionRequest = new this.cast.SessionRequest(this.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
    const apiConfig = new this.cast.ApiConfig(sessionRequest,
      s => { },
      status => { if (status === this.cast.ReceiverAvailability.AVAILABLE) { } }
    );
    const x = this.cast.initialize(apiConfig, this.onInitSuccess, this.onError);
  }

  onInitSuccess = (e) => {
    console.log('GCast initialization success');
    // this.castSplashScreen();
  };

  onError = (err) => {
    console.log('GCast initialization failed', err);
  };

  discoverDevices = () => {
    const self = this;
    const subj = new Subject();
    this.cast.requestSession((s) => {
      this.castSession = s;
      this.setCasting(true);
      subj.next('CONNECTED');
    }, (err) => {
      self.setCasting(false);
      if (err.code === 'cancel') {
        this.castSession = undefined;
        subj.next('CANCEL');
      } else {
        console.error('Error selecting a cast device', err);
      }
    });
    return subj;
  }

  launchMedia =  (media) => {
    const mediaInfo = new this.cast.media.MediaInfo(media);
    const request = new this.cast.media.LoadRequest(mediaInfo);
    console.log('launch media with session', this.castSession);

    if (!this.castSession) {
      // window.open(media);
      return false;
    }
    this.castSession.loadMedia(request, this.onMediaDiscovered.bind(this, 'loadMedia'), this.onMediaError);
    return true;
  }

  onMediaDiscovered = function(how, media) {
    this.currentMedia = media;
  };

  play = function() {
    this.currentMedia.play(null);
  };

  pause = function() {
    this.currentMedia.pause(null);
  };

  stop = function() {
    this.currentMedia.stop(null);
  };

  onMediaError = (err) => {
    console.error('Error launching media', err);
  };

  setCasting(value) {
    this.status.casting = value;
  }

  getStatus() {
    return this.status;
  }



}
