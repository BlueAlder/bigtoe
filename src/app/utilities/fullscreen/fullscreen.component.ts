import {Component, Directive, HostListener, OnInit} from '@angular/core';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css']
})
export class FullscreenComponent implements OnInit {
  elem;
  constructor() { }

  faExpand = faExpand;

  ngOnInit(): void {
    this.elem = document.body;

  }

  openFullscreen() {
    console.log('gi');
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

  get isFullscreen() {
    // @ts-ignore
    return screenfull.isFullscreen;
  }
}

@Directive({
  selector: '[appToggleFullscreen]'
})
export class ToggleFullscreenDirective {
  @HostListener('click') onClick() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }
}

