import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../_models/user';
import { PathLocationStrategy } from '@angular/common';
import { Photo } from 'src/app/_models/photo';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserWithRoles() {
    return this.http.get(this.baseUrl + 'admin/usersWithRoles');
  }

  updateUserRoles(user: User, roles: {}) {
    return this.http.post(this.baseUrl + 'admin/editRoles/' + user.userName, roles);
  }

  getPhotosToModerate() {
    return this.http.get(this.baseUrl + 'admin/photosForModeration');
  }

  aprovePhoto(photoId) {
    return this.http.post(this.baseUrl + 'admin/aprovePhoto/' + photoId, {});
  }

  rejectPhoto(photoId) {
    return this.http.delete(this.baseUrl + 'admin/rejectPhoto/' + photoId, {});
  }
}
