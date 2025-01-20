import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiResponse } from './response.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isSmallScreen: boolean = false;
  mediaQueryList!: MediaQueryList;

  call: string = '';
  submitted: boolean = false;
  checked: boolean = false;
  serviced: boolean = false;
  apiResponse: ApiResponse[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit(form: any) {
    console.log('Form submitted:', form.value);
    this.submitted = true;
    this.checkCall(this.call);


  }

  resetSubmitted(): void {
    console.log('Resetting Form');
    this.submitted = false;
  }

  checkCall(callValue: string) {
    const url = `/qsl/is-call-serviced?call=${callValue}`;
    this.loading = true;
    this.http.get<boolean>(url).subscribe(
      response => {
        this.checked = true;
        this.serviced = response;
        this.loading = false;
        console.log('Check serviced response:', response);

        if (response) {
          this.toPickup(callValue);
        }
      },
      error => {
        this.loading = false;
        console.error('API error:', error);
      }
    );
  }

  toPickup(callValue: string) {
    const url = `/qsl/to-pickup?call=${callValue}`;
    this.loading = true;
    this.http.get<ApiResponse[]>(url).subscribe(
      response => {
        this.apiResponse = response;
        this.loading = false;
        console.log('To pickup response:', response);
      },
      error => {
        this.loading = false;
        console.error('API error:', error);
      }
    );
  }

  ngOnInit(): void {
    this.mediaQueryList = window.matchMedia('(max-width: 800px)');
    this.isSmallScreen = this.mediaQueryList.matches;
    this.mediaQueryList.addEventListener('change', this.handleScreenChange);

  }

  ngOnDestroy(): void {
    this.mediaQueryList.removeEventListener('change', this.handleScreenChange);
  }

  handleScreenChange = (event: MediaQueryListEvent): void => {
    this.isSmallScreen = event.matches;
  };

}
