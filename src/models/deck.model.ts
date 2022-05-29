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

  private _played = 0

  private _drawn = 0

  private _discarded = 0

  constructor(card: Card, total: number) {
    super(card.type, card.value)
    if (total < 0) throw Error(`Total has to be positive, is: ${total}`)
    this.total = total
  }

  get played(): number {
    return this._played
  }

  get drawn(): number {
    return this._drawn
  }

  get discarded(): number {
    return this._discarded
  }

  reset(): void {
    this._played = 0
    this._drawn = 0
    this._discarded = 0
  }

  get remaining(): number {
    return this.total - this.played - this.discarded - this.drawn
  }

  get remainingPercent(): number {
    return 100 * this.remaining / this.total
  }

  incrementPlayed(): void {
    this._played = this.remaining <= 0 ? 0 : this._played + 1
  }

  incrementDrawn(): void {
    this._drawn = this.remaining <= 0 ? 0 : this._drawn + 1
  }

  incrementDiscarded(): void {
    this._discarded = this.remaining <= 0 ? 0 : this._discarded + 1
  }

  moveDrawnToPlayed(): void {
    if (this._drawn <= 0) return
    this._drawn--
    this._played++
  }

  moveDrawnToDiscarded(): void {
    if (this._drawn <= 0) return
    this._drawn--
    this._discarded++
  }
}
