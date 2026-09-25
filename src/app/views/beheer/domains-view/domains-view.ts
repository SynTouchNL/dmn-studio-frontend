import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
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
    this.isLoading = true;
    this.loadError = false;

    this.httpService.getDomainsPage(page - 1, this.pageSize).subscribe({
      next: response => {
        this.domains = response.items;
        this.page = response.page + 1;
        this.pageSize = response.size;
        this.collectionSize = response.totalElements;
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
