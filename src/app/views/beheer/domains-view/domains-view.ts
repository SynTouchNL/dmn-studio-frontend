import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { map, of, switchMap } from 'rxjs';
import { DMNDomainInterface } from '../../../interfaces/domain-interface';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
  selector: 'app-domains-view',
  imports: [DatePipe, RouterLink, NgbPagination],
  templateUrl: './domains-view.html'
})
export class DomainsView implements OnInit {
  domains: DMNDomainInterface[] = [];
  isLoading = true;
  loadError = false;
  page = 1;
  pageSize = 10;
  hasNext = false;
  collectionSize = 0;

  constructor(
    private readonly httpService: HttpService,
    private readonly titleService: Title
  ) {
    titleService.setTitle('DMNStudio - Domeinen');
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    if (page < 1) return;

    this.page = page;
    this.domains = [];
    this.hasNext = false;
    this.isLoading = true;
    this.loadError = false;

    this.httpService.getDomainsPage(page - 1, this.pageSize).pipe(
      switchMap(domains => domains.length === this.pageSize
        ? this.httpService.getDomainsPage(page, this.pageSize).pipe(
            map(nextPage => ({ domains, hasNext: nextPage.length > 0 }))
          )
        : of({ domains, hasNext: false })
      )
    ).subscribe({
      next: ({ domains, hasNext }) => {
        this.domains = domains;
        this.hasNext = hasNext;
        this.collectionSize = (page - 1) * this.pageSize + domains.length + (hasNext ? 1 : 0);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }

  changePageSize(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.loadPage(1);
  }
}
