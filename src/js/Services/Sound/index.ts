
export default class SoundService {
  constructor(private url: string, private volume: number) { }
  play() {
    const audio = new Audio(this.url);
    audio.volume = (Math.floor(this.volume * 10) / 10);
    audio.play();
  }
}