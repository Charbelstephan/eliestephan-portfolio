import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface FacebookPhoto {
  id: string;
  src: string;
  alt: string;
}

@Injectable({
  providedIn: 'root',
})
export class FacebookService {
  private http = inject(HttpClient);

  getPhotos(limit = 9): Observable<FacebookPhoto[]> {
    return this.http
      .get<FacebookPhoto[]>(`${environment.apiUrl}/facebook-photos.php?limit=${limit}`)
      .pipe(
        catchError(() => of(this.getPlaceholders(limit)))
      );
  }

  private getPlaceholders(count: number): FacebookPhoto[] {
    const colors = ['623b31', '61382c', '807e80', '4d5055', '888b80', '6a3e2d', '2c2617', '524033', '857764'];
    return Array.from({ length: count }, (_, i) => ({
      id: `placeholder-${i + 1}`,
      src: `${environment.placeholderUrl}/${colors[i % colors.length]}/ffffff?text=Photo+${i + 1}`,
      alt: `Photo ${i + 1}`,
    }));
  }
}
