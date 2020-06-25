import * as firebase from 'firebase/app';
import FieldValue = firebase.firestore.FieldValue;


export interface Game {
  // id: string;
  code: string;
  status: Status;
  players: string[] | firebase.firestore.FieldValue;
  active_prompt: string;
  prompts: string[];
  round: number ;
  total_rounds: number;
  type: string;
}

export enum Status {
  OPEN,
  STARTED,
  ENDED
}
