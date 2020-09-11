import { Component, OnInit } from '@angular/core';
import {ChromecastService} from '../services/chromecast.service';
import {faChromecast} from '@fortawesome/free-brands-svg-icons';
import {AngularFireStorage} from '@angular/fire/storage';


@Component({
  selector: 'app-chromecast',
  templateUrl: './chromecast.component.html',
  styleUrls: [
    './chromecast.component.css'
  ]
})
export class ChromecastComponent implements OnInit {
  castingStatus;
  chromecast = faChromecast;

  constructor(
    private ngCastService: ChromecastService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {

    const script = window['document'].createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1');
    window['document'].body.appendChild(script);

    const ngCastService = this.ngCastService;
    window['__onGCastApiAvailable'] = function (isAvailable) {
      if (isAvailable) {
        ngCastService.initializeCastApi();
      }
    };

    this.castingStatus = this.ngCastService.getStatus();
  }

  openSession() {
    this.ngCastService.discoverDevices()
      .subscribe((data) => {
        console.log(data);
        this.castSplashScreen();
      });
  }

  closeSession() {
    this.ngCastService.stop();
  }

  async castSplashScreen() {
    this.storage.ref('sam.png').getDownloadURL()
      .subscribe(url => {
        console.log(url);
        this.ngCastService.launchMedia(url);
      });

  }

}
