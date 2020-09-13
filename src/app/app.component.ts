import {Component, Directive, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as screenfull from 'screenfull';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'big-toe';
  elem;
  isFullScreen = false;




  constructor(private router: Router) {
  }


  ngOnInit() {
    this.elem = document.body;
    document.onfullscreenchange  = (event) => {
      console.log(event);
    };
    // this.checkOrientation()
    // document.body.requestFullscreen();
    // alert(screen.orientation.type);
    // this.openFullscreen();

    // screen.orientation.lock('landscape-primary');
  }


  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

}

