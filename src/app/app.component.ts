import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'big-toe';
  elem;
  isLandscape = false;

  constructor(private router: Router) {
  }


  ngOnInit() {
    this.elem = document.body;
    this.checkOrientation()
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
    screen.orientation.lock('landscape')
  }

  checkOrientation() {
    this.isLandscape = screen.orientation.type === 'landscape-primary' || this.router.url === '/add';
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event) {
   this.checkOrientation();
  }
}
