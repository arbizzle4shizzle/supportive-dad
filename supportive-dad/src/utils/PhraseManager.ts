function shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
export class PhraseManager {
    phrases: string[];
    currentIndex: number;

    constructor(phrases: string[]) {
        this.phrases = phrases;
        this.currentIndex = 0;
        shuffleArray(this.phrases);
    }

    getNextPhrase(): string {
        const phrase = this.phrases[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
        return phrase;
    }
}