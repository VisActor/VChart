import { FFmpeg, createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export class Encoder {
  private _FFMPEG: FFmpeg | null = null;
  private _FFMPEG_Loaded = false;

  constructor() {
    this.initFFMPEG();
  }

  async initFFMPEG() {
    this._FFMPEG = createFFmpeg({ log: true });
    await this.loadFFmpeg();
  }
  async loadFFmpeg() {
    if (this._FFMPEG_Loaded) {
      return;
    }
    if (!this._FFMPEG) {
      this._FFMPEG = createFFmpeg({ log: true });
    }
    await this._FFMPEG.load();
    console.log('加载');
    this._FFMPEG_Loaded = true;
  }

  async exportVideo(frameNum: number, fps: number, cb: (i: number) => Promise<Blob | null>) {
    const outName = `out`;
    await this.initFFMPEG();
    const ffmpeg = this._FFMPEG;
    if (!ffmpeg) {
      return;
    }

    for (let i = 0; i < frameNum; i++) {
      const data = await cb(i);
      console.log(frameNum, i, data);
      const num = `0000${i}`.slice(-3);

      ffmpeg.FS('writeFile', `vstory.${num}.png`, await fetchFile(data));
    }

    await ffmpeg.run(
      '-framerate',
      fps.toString(),
      '-pattern_type',
      'glob',
      '-i',
      '*.png',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      `${outName}.mp4`
    );
    for (let i = 0; i < frameNum; i++) {
      const num = `0000${i}`.slice(-3);
      ffmpeg.FS('unlink', `vstory.${num}.png`);
    }
    console.log('readFile');
    const data = (this._FFMPEG as FFmpeg).FS('readFile', `${outName}.mp4`);
    console.log('data', data);
    const objUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    return objUrl;
  }
}
