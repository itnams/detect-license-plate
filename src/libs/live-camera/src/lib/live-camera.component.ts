import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, AfterViewInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
declare var roboflow: any; // Declare roboflow if its script is included in index.html


@Component({
  selector: 'lib-live-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-camera.component.html',
  styleUrl: './live-camera.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveCameraComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  model: any;
  cameraMode: string = 'environment';
  font: string = '16px sans-serif';
  prevTime!: number;
  pastFrameTimes: number[] = [];
  publishable_key: string = 'rf_m9qQtT0oNDMznbObEkakxEvl1Ur1';
  toLoad = { model: 'detect-license-plate-361yq', version: 3 };

  ngOnInit(): void {
    this.startVideoStream();
    this.loadModel();
  }

  ngAfterViewInit(): void {
    this.video = this.videoElement.nativeElement;
    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  startVideoStream(): void {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: this.cameraMode }
    })
    .then(stream => {
      this.video.srcObject = stream;
      this.video.onloadeddata = () => {
        this.video.play();
        this.resizeCanvas();
        this.detectFrame();
      };
    });
  }

  loadModel(): void {
    roboflow.auth({ publishable_key: this.publishable_key })
      .load(this.toLoad)
      .then((model: any) => {
        this.model = model;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  videoDimensions(video: HTMLVideoElement) {
    const videoRatio = video.videoWidth / video.videoHeight;
    let width = video.offsetWidth;
    let height = video.offsetHeight;
    const elementRatio = width / height;

    if (elementRatio > videoRatio) {
      width = height * videoRatio;
    } else {
      height = width / videoRatio;
    }

    return { width, height };
  }

  resizeCanvas(): void {
    const dimensions = this.videoDimensions(this.video);

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.canvas.style.width = `${dimensions.width}px`;
    this.canvas.style.height = `${dimensions.height}px`;
    this.canvas.style.left = `${(window.innerWidth - dimensions.width) / 2}px`;
    this.canvas.style.top = `${(window.innerHeight - dimensions.height) / 2}px`;
  }

  renderPredictions(predictions: any[]): void {
    const dimensions = this.videoDimensions(this.video);
    const scale = 1;

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    predictions.forEach(prediction => {
      const { x, y, width, height } = prediction.bbox;
      this.ctx.strokeStyle = prediction.color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect((x - width / 2) / scale, (y - height / 2) / scale, width / scale, height / scale);

      this.ctx.fillStyle = prediction.color;
    });

    predictions.forEach(prediction => {
      const { x, y, width, height } = prediction.bbox;
      this.ctx.font = this.font;
      this.ctx.textBaseline = 'top';
      this.ctx.fillStyle = '#000000';
    });
  }

  detectFrame(): void {
    if (!this.model) {
      requestAnimationFrame(() => this.detectFrame());
      return;
    }

    this.model.detect(this.video).then((predictions: any[]) => {
      requestAnimationFrame(() => this.detectFrame());
      this.renderPredictions(predictions);

      if (this.prevTime) {
        this.pastFrameTimes.push(Date.now() - this.prevTime);
        if (this.pastFrameTimes.length > 30) this.pastFrameTimes.shift();

        const total = this.pastFrameTimes.reduce((acc, time) => acc + time / 1000, 0);
        const fps = this.pastFrameTimes.length / total;
        document.getElementById('fps')!.innerText = Math.round(fps).toString();
      }
      this.prevTime = Date.now();
    }).catch((e: any) => {
      console.error('CAUGHT', e);
      requestAnimationFrame(() => this.detectFrame());
    });
  }
}
