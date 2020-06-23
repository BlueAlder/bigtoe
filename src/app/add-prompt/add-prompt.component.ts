import { Component, OnInit } from '@angular/core';
import {PromptsService} from "../services/prompts.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-add-prompt',
  templateUrl: './add-prompt.component.html',
  styleUrls: ['./add-prompt.component.css']
})
export class AddPromptComponent implements OnInit {
  promptString = '';
  stats$ : Observable<any>;

  constructor(private promptsService: PromptsService) { }

  ngOnInit(): void {
    this.stats$ = this.promptsService.getStats();
  }

  addPromptToCollection() {
    this.promptsService.addPrompt(this.promptString);
    this.promptString = ''
  }

}
