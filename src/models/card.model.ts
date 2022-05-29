export enum CardType {
  SPADE = 'spade',
  HEART = 'heart',
  CLUB = 'club',
  DIAMOND = 'diamond',
}

export type CardValue = 'joker' | 'ace' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'jack' | 'queen' | 'king'

export default class Card {
  readonly value: CardValue

  readonly type?: CardType

  constructor(value: CardValue, type?: CardType) {
    this.value = value
    if (value !== 'joker' && !type) throw Error(`Card ${value} needs to have a type`)
    if (value === 'joker' && type) console.warn('Joker type is ignored')
    this.type = type
  }
}
