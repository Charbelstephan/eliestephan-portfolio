import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacebookService, FacebookPhoto } from './services/facebook.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private facebookService = inject(FacebookService);

  images: FacebookPhoto[] = [];
  formData = { email: '' };

  ngOnInit(): void {
    this.facebookService.getPhotos().subscribe((photos) => {
      this.images = photos;
    });
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  getImageColumns(): FacebookPhoto[][] {
    const cols: FacebookPhoto[][] = [[], [], []];
    this.images.forEach((img, i) => {
      cols[i % 3].push(img);
    });
    return cols;
  }
}
