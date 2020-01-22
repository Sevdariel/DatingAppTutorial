import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin/admin.service';
import { AlertifyService } from 'src/app/_services/alertify/alertify.service';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  photos: any;

  constructor(private adminService: AdminService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getPhotosToModerate();
  }

  getPhotosToModerate() {
    this.adminService.getPhotosToModerate().subscribe((photos: Photo[]) => {
      this.photos = photos;
    }, error => {
      this.alertify.error(error);
    });
  }

  aprovePhoto(photoId) {
    this.adminService.aprovePhoto(photoId).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
      this.alertify.success('Photo aproved');
    }, error => {
      this.alertify.error('Failed to reject the photo');
    });
  }

  rejectPhoto(photoId) {
    this.alertify.confirm('Are you sure you want to reject this photo?', () => {
      this.adminService.rejectPhoto(photoId).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
        this.alertify.success('Photo has been rejected');
      }, error => {
        this.alertify.error('Failed to reject the photo');
      });
    });
  }
}
