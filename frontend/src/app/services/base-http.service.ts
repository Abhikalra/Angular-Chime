import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { tap } from 'rxjs/operators'
import { environment } from '../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
}

const baseUrl = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {

  constructor(private http: HttpClient) { }

  get(url: string, options: any = {}) {
    return this.http.get(baseUrl + url, {...httpOptions, ...options})
    .pipe(
      tap( // Log the result or error
        result => this.log(url, result),
        error => this.logError(url, error)
      )
    )
  }

  post(url: string, data: any, options: any = {}) {
    return this.http.post(baseUrl + url, data, {...httpOptions, ...options})
    .pipe(
      tap( // Log the result or error
        result => this.log(url, result),
        error => this.logError(url, error)
      )
    )
  }

  put(url: string, data: any, options: any = {}) {
    return this.http.put(baseUrl + url, data, {...httpOptions, ...options})
    .pipe(
      tap( // Log the result or error
        result => this.log(url, result),
        error => this.logError(url, error)
      )
    )
  }

  delete(url: string, options: any = {}) {
    return this.http.delete(baseUrl + url, { ...httpOptions, ...options })
      .pipe(
        tap( // Log the result or error
          result => this.log(url, result),
          error => this.logError(url, error)
        )
      )
  }

  log(name: string, data: any) {
    console.log('Log here: ', name, data)
  }

  logError(name: string, error: any) {
    console.error('Error here: ', name, error)
  }
}
