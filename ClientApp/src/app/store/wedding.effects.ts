import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { partyByAuth, partyByAuthSuccess } from './wedding.actions';

@Injectable()
export class WeddingEffects {

  constructor(private actions$: Actions, private dataService: DataService) { }

  getPartyByAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(partyByAuth),
      switchMap(payload =>
        this.dataService.getPartyMembers().pipe(map(teams =>
          partyByAuthSuccess({ partyMembers: teams })
        ))
        )
    )
  );

  // getAllTeams$ = createEffect(() => this.actions$.pipe(
  //   ofType(round1AllTeams),
  //   switchMap(payload =>
  //     this.dataService.getRound1IntroTeamList(payload.yEvent).pipe(map(teams =>
  //       round1AllTeamsSuccess({ allTeams: teams }) // todo: add catchError
  //     )))));

  // getRound1AllQuestions$ = createEffect(() => this.actions$.pipe(
  //   ofType(round1AllQuestions),
  //   switchMap(payload =>
  //     this.dataService.getAllRound1QuestionsAndAnswers(payload.yEvent).pipe(map(allQuestions =>
  //       round1AllQuestionsSuccess({ allQuestions: allQuestions }) // todo: add catchError
  //     )))));

  // // List<round1QDisplay>
  // getRound1BigDisplay$ = createEffect(() => this.actions$.pipe(
  //   ofType(round1BigDisplay),
  //   switchMap(payload =>
  //     this.dataService.getRound1BigDisplay(payload.yEvent).pipe(map(allQuestions =>
  //       round1BigDisplaySuccess({ allQuestions: allQuestions }) // todo: add catchError
  //     )))));
}
