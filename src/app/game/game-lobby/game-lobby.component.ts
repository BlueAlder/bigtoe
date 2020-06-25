import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Game} from '../game.model';
import {GameService} from '../../services/game.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {

  @Input()
  players: string[];

  newPlayer = 'joe';
  minPlayers = 2;


  constructor(public gameService: GameService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
  }



  addPlayerToGame() {
    this.gameService.addNewPlayer(this.newPlayer);
    this.newPlayer = '';
  }

  startGame() {
    if (this.players.length >= this.minPlayers) {
      this.gameService.startGame(this.players);
    } else {
    //  TODO throw error becuase not enough people
      this.toastr.error(`Need at least ${this.minPlayers} people to start`, 'Error', {positionClass: 'toast-top-center'});
    }

    // this.startGame$.emit();
  }
}
