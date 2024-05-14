import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '@detect-license-plate/services';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  selectedFile: File | null = null;
  selectedFileUrl$ = new BehaviorSubject<String>("");
  constructor(private service: ApiService) { }
  ngOnInit(): void {
  }
  onSubmit(): void {
    const formData = new FormData();
    formData.append('upload', this.selectedFile ?? '');
    formData.append('regions', 'vn');
    this.service.postFormDataToPublicApi("/api/plate-recognition",formData).subscribe(resp => {
      console.log(resp)
    }
    )
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl$.next(e.target.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.selectedFileUrl$.next('');
    }
  }
}
