import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DMNDomainInterface } from '../../../interfaces/dmn-interface';
import { HttpService } from '../../../services/http-service/http-service';

@Component({
  selector: 'app-domains-view',
  imports: [DatePipe, RouterLink],
  templateUrl: './domains-view.html',
  styleUrl: './domains-view.css'
})
export class DomainsView implements OnInit {
  domains: DMNDomainInterface[] = [];
  isLoading = true;
  loadError = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly titleService: Title
  ) {
    titleService.setTitle('DMNStudio - Domeinen');
  }

  ngOnInit(): void {
    this.httpService.getDomains().subscribe({
      next: data => {
        this.domains = Array.isArray(data) ? data : [data];
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }
}
