import { Component, OnInit } from '@angular/core';
import {GameService} from '../services/game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private gameService: GameService,
              private router: Router) { }

  ngOnInit(): void {
    this.gameService.disconnect();
  }

  createGame() {
    this.gameService.createGame();
    this.gameService.isJoinedGame = true;
    this.router.navigate(['/game']);
  }
}
