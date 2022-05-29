export enum CardType {
  SPADE = 'spade',
  HEART = 'heart',
  CLUB = 'club',
  DIAMOND = 'diamond',
  JOKER = 'joker',
}

export type CardValue = 'ace' | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'jack' | 'queen' | 'king'

export default class Card {
  private _value: CardValue

  readonly type: CardType

  constructor(type: CardType, value?: CardValue) {
    this.type = type
    this._value = value ?? 'ace'
  }

  get value(): CardValue {
    return this._value
  }

  set value(value: CardValue) {
    if (this.type !== CardType.JOKER) throw Error('None Joker card cannot change their value.')
    this._value = value
  }
}
