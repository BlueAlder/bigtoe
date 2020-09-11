import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs';
import {Game} from '../game.model';
import {GameService} from '../../services/game.service';
import {ToastrService} from 'ngx-toastr';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import {AngularFireStorage} from '@angular/fire/storage';
import {ChromecastService} from '../../services/chromecast.service';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {

  @Input()
  players: string[];

  newPlayer = '';
  minPlayers = 3;

  gameRounds = 30;
  roundIncrementer = 10;

  // Icons
  faPlus = faPlus;
  faMinus = faMinus;


  constructor(public gameService: GameService,
              private toastr: ToastrService,
              private ngCastService: ChromecastService,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {

  }




  addPlayerToGame() {
    this.gameService.addNewPlayer(this.newPlayer);
    this.newPlayer = '';
  }

  startGame() {
    if (this.players.length >= this.minPlayers) {
      this.gameService.startGame(this.players, this.gameRounds);
    } else {
    //  TODO throw error becuase not enough people
      this.toastr.error(`Need at least ${this.minPlayers} people to start`, 'Error', {positionClass: 'toast-top-center'});
    }

    // this.startGame$.emit();
  }

  increaseGameRounds() {
    // this.castSplashScreen()
    if (this.gameRounds + this.roundIncrementer <= environment.game_settings.max_num_rounds) {
      this.gameService.changeTotalRounds(10);
    } else {
      this.toastr.error(`Max number of rounds is ${environment.game_settings.max_num_rounds}`, 'Error', {positionClass: 'toast-top-center'})
    }
  }

  decreaseGameRounds() {
    if (this.gameRounds - this.roundIncrementer >= environment.game_settings.min_num_rounds) {
      this.gameService.changeTotalRounds(-10);
    } else {
      this.toastr.error(`Min number of rounds is ${environment.game_settings.min_num_rounds}`, 'Error', {positionClass: 'toast-top-center'})
    }
  }
}
