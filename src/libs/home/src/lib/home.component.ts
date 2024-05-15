import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@detect-license-plate/services';
import { BoxImageComponent } from '@detect-license-plate/box-image';
import { BehaviorSubject } from 'rxjs';
import { PlateRecognition, PlateResults } from '@detect-license-plate/models';

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
  constructor(private service: ApiService) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    const formData = new FormData();
    formData.append('upload', this.selectedFile ?? '');
    formData.append('regions', 'vn');
    this.service.postFormDataToPublicApi<PlateRecognition>("/api/plate-recognition", formData).subscribe(resp => {
      this.results$.next(resp.results ?? [])
      console.log(resp.results)
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
}
