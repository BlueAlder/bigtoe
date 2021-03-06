import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Game, Status} from '../game/game.model';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {PromptsService} from './prompts.service';
import {environment} from '../../environments/environment';
import {AngularFireFunctions} from '@angular/fire/functions';
import {ChromecastService} from './chromecast.service';
import {AngularFireStorage} from '@angular/fire/storage';
import Storage = firebase.storage.Storage;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  ccBucket: Storage;
  constructor(private afs: AngularFirestore,
              private promptsService: PromptsService,
              private functions: AngularFireFunctions,
              private chromecastService: ChromecastService,
              private storage: AngularFireStorage) {
    // functions.useFunctionsEmulator('http://localhost:5001')
    this.ccBucket = this.storage.storage.app.storage('big-toe-game-cc-pic');

  }

  gameCollection: AngularFirestoreCollection<Game>;
  currentGameCollection: AngularFirestoreCollection<Game>;

  gameDocument: AngularFirestoreDocument<Game>;
  public game$: Observable<Game>;

  public isJoinedGame = false;
  public gameStatus: Status;

  private static selectRandomElementFromArray(array: any[] | string) {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static generateRandomCode(): string {
    const codeLength = 4;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      code += GameService.selectRandomElementFromArray(alphabet);
    }
    return code;
  }

  private static replacePlaceholderPrompt(prompt: string, players: string[]) {
    if (prompt.includes('$NAME')) {
      while (prompt.includes('$NAME')) {
        const selectedPlayer = this.selectRandomElementFromArray(players);
        prompt = prompt.replace('$NAME', selectedPlayer);
        players.splice(players.indexOf(selectedPlayer), 1);
      }
    } else {
      prompt = this.selectRandomElementFromArray(players) + ', ' + prompt;
    }

    return prompt;
  }


  subscribeToGame(gameId: string) {
    this.gameDocument = this.afs.doc(`games/${gameId}`);
    this.game$ = this.gameDocument.valueChanges();
    this.isJoinedGame = true;
    this.game$.subscribe(data => this.gameStatus = data.status);
    // return this.game$;
  }


  addNewPlayer(playerName: string) {
    const arrUnion = this.gameDocument.update({
      players: firebase.firestore.FieldValue.arrayUnion(playerName)
    });
  }

  async startGame(players: string[], totalRounds: number) {
    // Pull 20 prompts regex replace the names
    let prompts = await this.promptsService.getRandomPrompts(totalRounds);
    console.log(prompts);

    prompts = prompts.map(prompt => GameService.replacePlaceholderPrompt(prompt, Array.from(players)));

    // Call Cloud function to generate images
    if (this.chromecastService.status) {  this.generateChromecastImages(prompts, this.gameDocument.ref.id); }

    // await Promise.all(promptPromises);
    // prompts.forEach(prompt => console.log(prompt.));
    // const rand_prompt =  ;
    // rand_prompt.forEach(doc => console.log(doc.data()));


    this.gameDocument.update({status: Status.STARTED, prompts, total_rounds: totalRounds});
  }

  currentGameState() {
    return this.gameDocument.ref.get()
      .then(data => data.data());
  }

  createGame() {
    const defaultGame: Game = {
      code: GameService.generateRandomCode(),
      players: [],
      active_prompt: 'Now this... is epic',
      prompts: [],
      round: 1,
      status: Status.OPEN,
      total_rounds: environment.game_settings.default_num_rounds, // environment.game_settings.num_rounds,
      type: 'picante'
    };

    this.gameCollection = this.afs.collection('games');
    this.gameCollection.add(defaultGame)
      .then(doc => {
        console.log('created game with id' + doc.id);
        this.subscribeToGame(doc.id);
        console.log('subscribed');
      });
  }

  disconnect() {
    this.isJoinedGame = false;
    this.gameStatus = undefined;
  }

  async nextRound() {
    // If game hasn't already ended
    if (this.gameStatus === Status.ENDED) {
      return;
    }

    // Check rounds if game has ended
    const gameState = await this.currentGameState();

    // end game
    if (gameState.round >= gameState.total_rounds) {
      this.gameDocument.update({status: Status.ENDED});

      if (this.chromecastService.status) { this.chromecastService.launchMedia('https://storage.googleapis.com/big-toe-game.appspot.com/gameover.png')}
    } else {
      const increment = firebase.firestore.FieldValue.increment(1) as any;
      this.gameDocument.update({round: increment});

      this.updateChromecastImage(this.gameDocument.ref.id, gameState.round );

    }
  }

  async previousRound() {
    const gameState = await this.currentGameState();

    if (gameState.round > 1) {
      const increment = firebase.firestore.FieldValue.increment(-1) as any;
      this.gameDocument.update({round: increment});
      this.updateChromecastImage(this.gameDocument.ref.id, gameState.round - 2);
    }
  }

  changeTotalRounds(incrementValue: number) {
    const increment = firebase.firestore.FieldValue.increment(incrementValue) as any;
    this.gameDocument.update({total_rounds: increment});
  }

  private generateChromecastImages(prompts, gameId) {
    const createImage = this.functions.httpsCallable('createImage');
    createImage({
      prompts, gameId
    })
      .subscribe(res => {
        this.updateChromecastImage(gameId, 0);
      });
  }

  updateChromecastImage(gameId, round) {

    if (this.chromecastService.status) {
      this.ccBucket.ref(`${gameId}/${gameId}-${round}.jpg`).getDownloadURL()
        .then(url => {
          console.log(url);
          this.chromecastService.launchMedia(url);
        });
    }

  }



}
