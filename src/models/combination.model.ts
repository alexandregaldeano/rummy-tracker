import Card, { CardType, CardValue } from '@/models/card.model'
import { seq } from '@/utils'

export default class Combination {
  readonly cards: Card[]

  readonly points: number

  readonly isPureSequence: boolean

  constructor(cards: Card[]) {
    [this.cards, this.points] = Combination.computePoints(cards)
    if (!this.isValid) {
      this.isPureSequence = false
      return
    }
    this.isPureSequence = Combination.isPureSequence(this.cards)
  }


  get isValid(): boolean {
    return this.points > 0
  }

  // TODO doesn't work with ace in first position in a sequence
  static computePoints(cards: Card[]): [Card[], number] {
    if (cards.length < 3) return [cards, 0]
    if (cards.length > 14) return [cards, 0]
    const jokers = cards.filter((it) => it.type === CardType.JOKER)
    const nonJokers = cards.filter((it) => it.type !== CardType.JOKER)
    if (nonJokers.length === 0) return [cards, 0]
    const reference = nonJokers[0].copy()
    const referenceValue = reference.value
    const referenceType = reference.type
    if (cards.length <= 4) {
      const duplicates: Card[] = [reference]
      let valuePoints: number
      if (typeof referenceValue === 'number') valuePoints = referenceValue
      else if (referenceValue === 'ace') valuePoints = 11
      else valuePoints = 10
      for (let cardIndex = 1; cardIndex < nonJokers.length; cardIndex++) {
        const nonJoker = nonJokers[cardIndex].copy()
        if (duplicates.some((it) => it.type === nonJoker.type)) break
        if (nonJoker.value !== referenceValue) break
        duplicates.push(nonJoker)
      }
      if (duplicates.length + jokers.length === cards.length) {
        duplicates.push(...jokers.map((it) => it.copy(it.type, referenceValue)))
        return [duplicates, valuePoints * duplicates.length]
      }
    }
    if (nonJokers.find((it) => it.type !== referenceType)) return [cards, 0]
    const sequence: (Card | undefined)[] = seq(14).map(() => undefined)
    for (let index = sequence.length - 1; index >= 0; index--) {
      let value: CardValue
      if (index === 0) {
        value = 'ace'
      } else if (index < 10) {
        value = index + 1 as CardValue
      } else if (index === 10) {
        value = 'jack'
      } else if (index === 11) {
        value = 'queen'
      } else if (index === 12) {
        value = 'king'
      } else {
        value = 'ace'
      }
      let nonJoker = nonJokers.find((it) => it.value === value)
      if (!nonJoker) continue
      nonJokers.splice(nonJokers.indexOf(nonJoker), 1)
      nonJoker = nonJoker.copy()
      sequence[index] = nonJoker
      if (nonJokers.length === 0) break
    }

    // Fills holes
    let previousCard: Card | undefined = undefined
    let hasHole = false
    for (let index = sequence.length - 1; index >= 0; index--) {
      if (!sequence.slice(0, index + 1).some((it) => it)) break
      const card = sequence[index]
      hasHole = previousCard !== undefined && card === undefined
      previousCard = card
      if (!hasHole) continue
      if (jokers.length === 0) break
      let joker = jokers.splice(0, 1)[0]
      joker = joker.copy(CardType.JOKER, Combination.indexToValue(index))
      sequence[index] = joker
    }

    if (hasHole) return [cards, 0]

    // Add Jokers to maximise points
    let firstAvailable = sequence.length - 1
    while (jokers.length > 0) {
      while (sequence[firstAvailable]) {
        firstAvailable--
      }
      let joker = jokers.splice(0, 1)[0]
      joker = joker.copy(CardType.JOKER, Combination.indexToValue(firstAvailable))
      sequence[firstAvailable] = joker
      firstAvailable = sequence.length - 1
    }

    const combination: Card[] = []
    let points = 0
    for (let index = 0; index < sequence.length; index++) {
      const card = sequence[index]
      if (card) {
        combination.push(card)
        points += Combination.indexToPoints(index)
      }
    }

    return [combination, points]
  }

  static indexToValue(index: number): CardValue {
    if (index === 0) return 'ace'
    if (index < 10) return index + 1 as CardValue
    if (index === 10) return 'jack'
    if (index === 11) return 'queen'
    if (index === 12) return 'king'
    return 'ace'
  }

  static indexToPoints(index: number): number {
    if (index < 10) return index + 1
    if (index >= 13) return 11
    return 10
  }

  // The list of card has to be sorted
  // TODO doesn't work with aces.
  static isPureSequence(cards: Card[]): boolean {
    let previousCard = cards[0]
    for (let cardIndex = 1; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex]
      const isJoker = card.type === CardType.JOKER
      if (isJoker) return false
      const isSameColor = card.type === previousCard.type
      if (!isSameColor) return false
      const previousValue = previousCard.value
      const value = card.value
      const isSequence =
        typeof previousValue === 'number' && typeof value === 'number' && previousValue === value - 1
        || previousValue === 'ace' && value === 2
        || previousValue === 10 && value === 'jack'
        || previousValue === 'jack' && value === 'queen'
        || previousValue === 'queen' && value === 'king'
        || previousValue === 'king' && value === 'ace' && cardIndex === cards.length
      if (!isSequence) return false
      previousCard = card
    }
    return true
  }
}
