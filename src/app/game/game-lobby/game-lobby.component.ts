import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {Game} from "../game.model";
import {GameService} from "../../services/game.service";

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {

  @Input()
  players: string[]

  newPlayer = "joe"


  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }


  addPlayerToGame() {
    this.gameService.addNewPlayer(this.newPlayer);
    this.newPlayer = ""
  }

  startGame() {
    if (this.players.length > -1) {
      this.gameService.startGame(this.players);
    } else {
    //  TODO throw error becuase not enough people
    }

    // this.startGame$.emit();
  }
}
