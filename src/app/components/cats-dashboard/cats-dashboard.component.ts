import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  concatMap,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
  tap,
} from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-cats-dashboard',
  templateUrl: './cats-dashboard.component.html',
  styleUrls: ['./cats-dashboard.component.scss'],
})
export class CatsDashboardComponent implements OnInit {
  catsFacts$!: Observable<string>;
  factsArray: string[] = [];
  warning = false;
  destroy = new Subject<void>();

  Arr = Array;
  factsArrayNumber: number = 12;
  cardIncNumber: number = 12;
  totalNumberOfCards = 90;

  private fetchAdditionalFact: Subject<void> = new Subject<void>();
  fetchAdditionalFact$: Observable<void> =
    this.fetchAdditionalFact.asObservable();

  private subscription: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    @Inject('Window') private window: Window,
    private dialog: MatDialog
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    if (
      this.window.innerHeight + this.window.scrollY >=
        document.body.scrollHeight - 20 &&
      this.factsArray.length < this.totalNumberOfCards
    ) {
      this.factsArrayNumber += this.cardIncNumber;
    }
  }

  ngOnInit(): void {
    this.catsFacts$ = this.getCatsFacts().pipe(takeUntil(this.destroy));

    this.subscription.add(
      this.fetchAdditionalFact$
        .pipe(
          concatMap((_) => this.getCatsFacts()),
          takeUntil(this.destroy)
        )
        .subscribe()
    );
  }

  private getCatsFacts(): Observable<string> {
    return this.dataService.getMeowFacts().pipe(
      map((fact) => fact.data[0]),
      tap((data) =>
        this.factsArray.filter((factsArrayFact) => factsArrayFact == data)
          .length == 0
          ? this.factsArray.push(data)
          : this.checkFetchingCondition()
      )
    );
  }

  private checkFetchingCondition(): void {
    this.warning = this.factsArray.length >= this.totalNumberOfCards;
    this.factsArray.length >= this.totalNumberOfCards
      ? this.destroy.next()
      : this.fetchAdditionalFact.next();
  }

  openDialog(data: string): void {
    this.dialog.open(ModalComponent, {
      data: {
        message: data,
      },
      width: '1000px',
      panelClass: 'custom-modaldialog',
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
