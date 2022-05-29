import Card from '@/models/card.model'

export default class Deck {
  readonly cards: CardStatus[]

  constructor(cards: CardStatus[]) {
    this.cards = cards
  }

  get total(): number {
    return this.cards.reduce((total: number, card: CardStatus) => total + card.total, 0)
  }

  get played(): number {
    return this.cards.reduce((played: number, card: CardStatus) => played + card.played, 0)
  }

  get remaining(): number {
    return this.total - this.played
  }
}

export class CardStatus extends Card {
  readonly total: number

  private _played: number

  constructor(card: Card, total: number, played?: number) {
    super(card.value, card.type)
    if (total < 0) throw Error(`Total has to be positive, is: ${total}`)
    this.total = total
    if (played !== undefined) {
      if (played < 0) throw Error(`Played has to be positive, is: ${played}`)
      if (played > total) throw Error(`Played has to be less than the total (${total}), is: ${played}`)
    }
    this._played = played ?? 0
  }

  get played(): number {
    return this._played
  }

  incrementPlayed(allowOverflow = false): void {
    if (this._played === this.total && !allowOverflow) {
      console.warn('Unable to increment played, ignoring')
      return
    }
    this._played = (this._played + 1) % (this.total + 1)
  }

  decrementPlayed(): void {
    if (this._played <= 0) {
      console.warn('Unable to decrement played, ignoring')
      return
    }
    this._played--
  }

  get remaining(): number {
    return this.total - this.played
  }

  get remainingPercent(): number {
    return 100 * this.remaining / this.total
  }

  resetPlayed(): void {
    this._played = 0
  }
}
