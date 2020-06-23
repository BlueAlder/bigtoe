import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/firestore";
import {Game} from "../game/game.model";
import {Observable} from "rxjs";
import * as firebase from "firebase";
import {take} from "rxjs/operators";
import {PromptsService} from "./prompts.service";
import {environment} from "../../environments/environment";
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameCollection: AngularFirestoreCollection<Game>
  currentGameCollection: AngularFirestoreCollection<Game>

  gameDocument: AngularFirestoreDocument<Game>;
  public game$: Observable<Game>

  public isJoinedGame = false;

  constructor(private afs: AngularFirestore,
              private promptsService: PromptsService) {
  }



  subscribeToGame(gameId: string) {
    this.gameDocument = this.afs.doc(`games/${gameId}`);
    this.game$ = this.gameDocument.valueChanges()
    this.isJoinedGame = true;
    // return this.game$;
  }


  addNewPlayer(playerName: string) {
    let arrUnion = this.gameDocument.update({
      players: firebase.firestore.FieldValue.arrayUnion(playerName)
    });
  }

  async startGame(players: string[]) {
    // Pull 20 prompts regex replace the names
    let prompts = await this.promptsService.getRandomPrompts(environment.game_settings.num_rounds);
    console.log(prompts)

    prompts = prompts.map(prompt => GameService.replacePlaceholderPrompt(prompt, Array.from(players)));
    console.log(prompts);

    // await Promise.all(promptPromises);
    // prompts.forEach(prompt => console.log(prompt.));
    // const rand_prompt =  ;
    // rand_prompt.forEach(doc => console.log(doc.data()));


    this.gameDocument.update({started: true, prompts: prompts})
  }



  createGame() {
    const defaultGame : Game = {
      code: GameService.generateRandomCode(),
      players: [],
      active_prompt: "Now this... is epic",
      prompts: [],
      round: 0 ,
      started: false,
      total_rounds: environment.game_settings.num_rounds, //environment.game_settings.num_rounds,
      type: 'picante'
    }

    this.gameCollection = this.afs.collection('games')
    this.gameCollection.add(defaultGame)
      .then(doc => {
        console.log("created game with id" + doc.id)
        this.subscribeToGame(doc.id);
        console.log("subscribed")
      });
  }

  nextRound() {
    // TODO stop on final round

    const increment = <any>firebase.firestore.FieldValue.increment(1);
    this.gameDocument.update({round: increment})
  }

  private static selectRandomElementFromArray(array: any[] | string) {
    return array[Math.floor(Math.random() * array.length)]
  }

  private static generateRandomCode() : string {
    const codeLength = 4;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let code = '';

    for (let i = 0; i < codeLength; i ++) {
      code += GameService.selectRandomElementFromArray(alphabet)
    }
    return code;
  }

  private static replacePlaceholderPrompt(prompt: string, players: string[]) {
    if (prompt.includes("$NAME")) {
      while (prompt.includes("$NAME")) {
        const selectedPlayer = this.selectRandomElementFromArray(players)
        prompt = prompt.replace("$NAME", selectedPlayer)
        players.splice(players.indexOf(selectedPlayer), 1)
      }
    } else {
      prompt = this.selectRandomElementFromArray(players) + ", " + prompt;
    }

    return prompt;
  }
}
