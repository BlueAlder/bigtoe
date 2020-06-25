import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';
import {Game, Status} from '../game.model';
import {GameService} from '../../services/game.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {

  games_collection: AngularFirestoreCollection<Game>;
  joined_game: (Game & {id: string})[];

  game_code = '';

  @Output()
  gameId = new EventEmitter<string>();

  constructor(private afs: AngularFirestore,
              private gameService: GameService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    // this.joinGame()

  }

  async joinGame() {
    this.games_collection = this.afs.collection('games', ref => {
      return ref
        .where('code', '==', this.game_code.toUpperCase())
        .where('status', 'in', [Status.STARTED, Status.OPEN]);
    });
    this.joined_game = await this.games_collection.valueChanges({idField: 'id'})
      .pipe(take(1)).toPromise();

    // Only 1 Game should be availble
    if (this.joined_game.length === 1) {
      this.gameService.subscribeToGame(this.joined_game[0].id);
      // this.gameId.emit(this.joined_game[0].id)
      // Emit game ID and subscribe
      // game.id
    } else {
      // TODO Show error saying could not join game
      this.toastr.error('Couldn\'t Find a game to join :(', 'Error', {positionClass: 'toast-top-center'});
    }
  }

}



