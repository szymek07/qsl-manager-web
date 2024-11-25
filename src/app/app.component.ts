import { Component } from '@angular/core';
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
export class AppComponent {
  call: string = '';
  submitted: boolean = false;
  apiResponse: ApiResponse[] = [];

  constructor(private http: HttpClient) {}

  onSubmit(form: any) {
    console.log('Form submitted:', form.value);
    this.submitted = true;

    this.makeApiCall(this.call);

  }

  makeApiCall(callValue: string) {
    const url = `http://localhost:8080/qsl/to-pickup?call=${callValue}`;
    this.http.get<ApiResponse[]>(url).subscribe(
      response => {
        this.apiResponse = response;
        console.log('API response:', response);
      },
      error => {
        console.error('API error:', error);
      }
    );
  }

  title = 'qsl-manager-web';
}
