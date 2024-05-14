import {
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }),
    };
    baseUrl: string;
    constructor(
        public http: HttpClient,
    ) {
        this.baseUrl = "http://localhost:5054";
    }
    httpFormDataOptions = {
        headers: new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
        }),
    };

    getFromPublicApi<T>(url: string): Observable<T> {
        const fullUrl = this.baseUrl + url;
        return this.http.get<T>(fullUrl, this.httpOptions);
    }
    postToPublicApi<T>(url: string, params?: any): Observable<T> {
        const postData = JSON.stringify(params || {});
        const fullUrl = this.baseUrl + url;
        return this.http
            .post<T>(fullUrl, postData, this.httpOptions)
            .pipe();
    }
    putToPublicApi<T>(url: string, params?: any): Observable<T> {
        const postData = JSON.stringify(params || {});
        const fullUrl = this.baseUrl + url;
        return this.http
            .put<T>(fullUrl, postData, this.httpOptions)
            .pipe();
    }

    deleteToPublicApi<T>(url: string): Observable<T> {
        const fullUrl = this.baseUrl + url;
        return this.http.delete<T>(fullUrl, this.httpOptions).pipe();
    }

    postFormDataToPublicApi<T>(url: string, formData: FormData): Observable<T> {
        const fullUrl = this.baseUrl + url;
        return this.http
            .post<T>(fullUrl, formData, this.httpFormDataOptions)
            .pipe();
    }

    putFormDataToPublicApi<T>(url: string, formData: FormData): Observable<T> {
        const fullUrl = this.baseUrl + url;
        return this.http
            .put<T>(fullUrl, formData, this.httpFormDataOptions)
            .pipe();
    }
}
