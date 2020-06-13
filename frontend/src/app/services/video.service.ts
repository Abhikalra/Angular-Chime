import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';

const apiUrl = '/video-call/'

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: BaseHttpService) { }

  public async createVideoCall(data: any) {
    return this.http.post(apiUrl, data).toPromise()
  }

  public async getVideoCallInfo(meetingId: any) {
    return this.http.get(`${apiUrl}${meetingId}`).toPromise()
  }

  public async endVideoCall(meetingId: any) {
    return this.http.delete(`${apiUrl}${meetingId}`).toPromise()
  }
}
