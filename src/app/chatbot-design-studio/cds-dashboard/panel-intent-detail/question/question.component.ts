import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Intent } from 'app/models/intent-model';
import { LoggerService } from 'app/services/logger/logger.service';
// import { Question } from 'app/models/intent-model';

@Component({
  selector: 'appdashboard-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input() intentSelected: Intent;
  @Output() updateIntentSelected = new EventEmitter();

  question: string;
  questions_array: string[];
  newQuestion: string;

  constructor(
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  private initialize(){
    this.question = "";
    this.questions_array = [];
    this.newQuestion = "";
    try {
      this.question = this.intentSelected.question;
      this.questions_array = this.intentSelected.question.split(/\r?\n/).filter(element => element);
    } catch (error) {
      // error
    }
  }

  onAddQuestion() {
    this.questions_array.push(this.newQuestion);
    this.logger.log('[INTENT-QUESTION] ADD QUESTION questions_array ', this.questions_array);
    const questionArrayJoinedWithNewLine = this.questions_array.join('\n');
    this.question = questionArrayJoinedWithNewLine.toString();
    this.newQuestion = '';
    this.updateIntentSelected.emit(this.question);
  }

  onRemoveQuestion(questionindex: number) {
    this.questions_array.splice(questionindex, 1); 
    this.logger.log('[INTENT-QUESTION] REMOVE QUESTION questions_array ', this.questions_array);
    const questionArrayJoinedWithNewLine = this.questions_array.join('\n');
    this.question = questionArrayJoinedWithNewLine.toString();
    this.updateIntentSelected.emit(this.question);
  }

  onChangeText(_question: string, index: number) {
    this.logger.log('[INTENT-QUESTION] onChangeText _question', _question)
    this.logger.log('[INTENT-QUESTION] onChangeText index', index)
    this.logger.log('[INTENT-QUESTION] onChangeText  > question ', _question)
    this.logger.log('[INTENT-QUESTION] onChangeText questions_array ', this.questions_array)
    this.logger.log('[INTENT-QUESTION] onChangeText questions_array - question at index ', index, ': ', this.questions_array[index])
    this.questions_array[index] = _question;
    const questionArrayJoinedWithNewLine = this.questions_array.join('\n');
    this.logger.log('[INTENT-QUESTION] onChangeText EDITED questions_array ', this.questions_array)
    this.logger.log('[INTENT-QUESTION] onChangeText EDITED questions_array questionArrayJoinedWithNewLine', questionArrayJoinedWithNewLine)
    this.logger.log('[INTENT-QUESTION] onChangeText EDITED questions_array questionArrayJoinedWithNewLine TO STRING', questionArrayJoinedWithNewLine.toString())
    this.question = questionArrayJoinedWithNewLine.toString();
    this.updateIntentSelected.emit(this.question);
  }

  // serve per mantenere il focus nel campo input mentre si edita un valore
  trackByIndex(index: number, obj: any): any {
    return index;
  }

}
