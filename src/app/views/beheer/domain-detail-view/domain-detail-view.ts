import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DMNDomainInterface } from '../../../interfaces/dmn-interface';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
  selector: 'app-domain-detail-view',
  imports: [DatePipe, RouterLink],
  templateUrl: './domain-detail-view.html'
})
export class DomainDetailView implements OnInit {
  domain: DMNDomainInterface | null = null;
  isLoading = true;
  loadError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly httpService: HttpService,
    private readonly titleService: Title
  ) {
    this.titleService.setTitle('DMNStudio - Domein');
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id <= 0) {
      this.isLoading = false;
      this.loadError = true;
      return;
    }

    this.httpService.getDomain(id).subscribe({
      next: domain => {
        this.domain = domain;
        this.titleService.setTitle(`DMNStudio - ${domain.name}`);
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }
}
