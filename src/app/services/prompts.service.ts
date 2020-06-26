import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference
} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {firestore} from "firebase";
import CollectionReference = firebase.firestore.CollectionReference;
import {switchMap} from "rxjs/operators";
import {pipe} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PromptsService {

  promptsCollection: CollectionReference

  constructor(private afs: AngularFirestore) {
  }

  async addPrompt(promptString: string) {



    const stats = await this.getRealStatsSnapshot()

    const newPrompt: Prompt = {
      prompt: promptString
    }

    const increment = firebase.firestore.FieldValue.increment(1);

    const promptRef: DocumentReference = this.afs.doc(`prompts/${stats.count}`).ref //.add({prompt: promptString})
    const statsRef: DocumentReference = this.afs.doc('prompts/--stats--').ref

    const batch = this.afs.firestore.batch();

    batch.set(promptRef, newPrompt)
    console.log(stats.count);
    batch.set(statsRef, {count: increment}, {merge: true});
    batch.commit();
  }

  getStats() {
    const statsDocument = this.afs.doc('prompts/--stats--');
    return statsDocument.valueChanges();
  }

  getStatsSnapshot() {
    // CHANGE ME WHEN ITS REAL
    const statsDocument = this.afs.doc('prompts/--stats--');
    return statsDocument.ref.get().then(data => data.data())
  }

  getRealStatsSnapshot() {
    const statsDocument = this.afs.doc('prompts/--stats--');
    return statsDocument.ref.get().then(data => data.data());
  }


  async getRandomPrompts(amount: number) {
    const stats = await this.getStatsSnapshot()
    const promptIds = []

    for (let i = 0; i < amount; i++) {
      let rand = Math.floor(Math.random() * stats.count);
      while (promptIds.includes(rand)) {
        rand = Math.floor(Math.random() * stats.count);
      }
      promptIds.push(rand)
    }


    const promptPromises = await promptIds.map(id => {
      // CHANGE ME WHEN ITS REAL
      return this.afs.doc(`prompts/${id}`).ref.get()
        .then(data => {
          // console.log(data.data())
          return data.data().prompt;
        })
    })
    // console.log(promptPromises)
    // console.log(promptPromises)
    return await Promise.all(promptPromises)
    // console.log(promptPromises)
  }

}

export interface Prompt {
  prompt: string;
}
