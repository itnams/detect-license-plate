import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@detect-license-plate/services';
import { BoxImageComponent } from '@detect-license-plate/box-image';
import { BehaviorSubject } from 'rxjs';
import { PlateRecognition, PlateResults } from '@detect-license-plate/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HomeComponent, BoxImageComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  selectedFile: File | null = null;
  selectedFileUrl$ = new BehaviorSubject<String>("");
  results$ = new BehaviorSubject<PlateResults[]>([])
  imageWidth$ = new BehaviorSubject<number>(0);
  loading$ = new BehaviorSubject<boolean>(false);
  plateRecognition$ = new BehaviorSubject<PlateRecognition>({})
  listPlateRecognition$ = new BehaviorSubject<PlateRecognition[]>([])
  constructor(private service: ApiService,private sanitizer: DomSanitizer) { 
    this.getPlateRecognition()
  }
  ngOnInit(): void {
    this.selectedFileUrl$.subscribe(resp => {
      this.results$.next([])
    })
  }
  onSubmit(): void {
    const formData = new FormData();
    formData.append('upload', this.selectedFile ?? '');
    formData.append('regions', 'vn');
    this.loading$.next(true);
    this.service.postFormDataToPublicApi<PlateRecognition>("/api/plate-recognition", formData).subscribe(resp => {
      const data: PlateRecognition = {
        ...resp,
        results: resp.results?.map(result => {
          return {
            ...result,
            box: {
              ...result.box,
              xmin: (result.box?.xmin ?? 0) * 600 / this.imageWidth$.value,
              ymin: (result.box?.ymin ?? 0) * 600 / this.imageWidth$.value,
              xmax: (result.box?.xmax ?? 0) * 600 / this.imageWidth$.value,
              ymax: (result.box?.ymax ?? 0) * 600 / this.imageWidth$.value,
            }
          }
        })
      }
      this.loading$.next(false);
      this.results$.next(data.results ?? [])
      this.plateRecognition$.next(data)
      this.getPlateRecognition()
    }
    )
  }
  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl$.next(e.target.result as string);
        console.log(e)
      };
      const imageWidth = await this.getImgWidth(file)
      this.imageWidth$.next(imageWidth)
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.selectedFileUrl$.next('');
    }
  }
  getImgWidth(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          resolve(img.width);
        };
        img.onerror = () => {
          reject("Failed to load image");
        };
        img.src = event.target.result;
      };
      reader.onerror = () => {
        reject("Failed to read file");
      };
      reader.readAsDataURL(file);
    });
  }
  getPlateRecognition() {
    this.service.getFromPublicApi<PlateRecognition[]>("/api/plate-recognition").subscribe(resp => {
      this.listPlateRecognition$.next(resp ?? [])
    }
    )
  }
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
