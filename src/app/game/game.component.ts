import { Component, OnInit } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Game, Status} from './game.model';
import {Observable} from 'rxjs';

import * as firebase from 'firebase/app';
import {GameService} from '../services/game.service';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  joined_game = false;
  statusEnum = Status;

  game$: Observable<Game>;

  // Icons



  background_colors = [
    '#6565c3',
    '#cd4e52',
    '#448f2d',
    '#ee6c30',
  ];

  prompts = [
    'You have to do a massive dance or you literally die drink twice',
    'Twerk to Anaconda by Nicki Minaj',
    'Name the full real name of "Tones and I" singer of acclaimed song, Dance Monkey. God I hope Grace get\'s this. Get it right give 3 drinks, get em wrong and they are yours'
  ];

  color = this.getRandomColor();
  prompt = this.getRandomPrompt();

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

  getRandomColor() {
    return this.background_colors[Math.floor(Math.random() * this.background_colors.length)];
  }

  getRandomPrompt() {
    return this.prompts[Math.floor(Math.random() * this.prompts.length)];

  }


  newPrompt() {
    this.gameService.nextRound();
    this.color = this.getRandomColor();
  }

  goBack() {
    this.gameService.previousRound();
    this.color = this.getRandomColor();

  }


  subscribeToGame(gameId: string) {
    this.gameService.subscribeToGame(gameId);

    // this.game$ = this.gameService.game$;
    // this.joined_game = true
  }

}
