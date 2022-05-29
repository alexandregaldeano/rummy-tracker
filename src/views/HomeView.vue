<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="title">All cards
          <v-btn icon @click="reset()" elevation="0">
            <v-icon>mdi-sync</v-icon>
          </v-btn>
        </h2>
        <v-btn icon v-for="(value, valueIndex) of allCardValues" :key="valueIndex" @click="filterValue(value)"
               :color="value === filters.value ? 'primary' : ''" class="ma-1" elevation="1">
          <span v-if="['ace', 'jack', 'queen', 'king'].includes(value)">
            {{ value[0] }}
          </span>
          <span v-else>{{ value }}</span>
        </v-btn>
        <v-btn icon v-for="(type, typeIndex) of allCardTypes" :key="typeIndex" @click="filterType(type)"
               :color="type === filters.type ? 'primary' : ''"  :class="['ma-1', iconColor(type)]">
            <v-img v-if="type === 'joker'" src="img/joker.svg" height="30"/>
          <v-icon v-else>mdi-cards-{{ type }}</v-icon>
        </v-btn>
      </v-col>
      <v-col v-for="(card, cardIndex) of filteredCards" :key="cardIndex" cols="6" md="3" sm="4" lg="2" class="pa-1">
        <CardStatusComponent :card="card"/>
      </v-col>
    </v-row>
    <v-row v-if="hand.length">
      <v-col cols="12">
        <h2 class="title">Hand</h2>
        <h3 v-if="combination" class="title">{{ combination.points }}</h3>
      </v-col>
      <v-col v-for="(card, cardIndex) of hand" :key="cardIndex"  class="pa-1" cols="3" sm="2" md="1">
        <CardComponent :card="card"/>
      </v-col>
    </v-row>
    <v-row v-if="combination">
      <v-col cols="12">
        <h2 class="title">
          Combination: {{ combination.points }}
          <span v-if="combination.isPureSequence">(pure sequence)</span>
        </h2>
      </v-col>
      <v-col v-for="(card, cardIndex) of combination.cards" :key="cardIndex" class="pa-1" cols="3" sm="2" md="1">
        <CardComponent :card="card"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Deck, { CardStatus } from '@/models/deck.model'
import Card, { CardType, CardValue } from '@/models/card.model'
import { $enum } from 'ts-enum-util'
import CardStatusComponent from '@/components/CardStatusComponent.vue'
import CardComponent from '@/components/CardComponent.vue'
import Combination from '@/models/combination.model'

@Options({
  components: { CardStatusComponent, CardComponent },
})
export default class HomeView extends Vue {
  filters: {
    value?: CardValue,
    type?: CardType
  } = {}

  private values = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'] as CardValue[]

  readonly deck = new Deck(
      [
        ...$enum(CardType)
            .map((type) => type)
            .filter((type) => type !== CardType.JOKER)
            .map((type) => this.values.map((value) => new Card(type, value)))
            .flat()
            .map((card) => new CardStatus(card, 2)),
        new CardStatus(new Card(CardType.JOKER), 4),
      ],
  )

  combination: Combination | null = null

  get allCardValues(): CardValue[] {
    return ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'] as CardValue[]
  }

  get allCardTypes(): CardType[] {
    return $enum(CardType).map((it) => it)
  }

  reset(): void {
    this.deck.cards.forEach((card) => {
      card.reset()
    })
  }

  get filteredCards(): CardStatus[] {
    return this.deck.cards.filter((it) => {
      const matchesValue = this.filters.value ? it.value === this.filters.value : true
      const matchesType = this.filters.type ? it.type === this.filters.type : true
      return matchesValue && matchesType
    })
  }

  get hand(): Card[] {
    const hand = this.deck.cards.map((it) => {
      const cards: Card[] = []
      for (let index = 0; index < it.drawn; index++) {
        cards.push(new Card(it.type, it.value))
      }1
      return cards
    }).flat()
    this.combination = new Combination(hand)
    return hand
  }

  filterValue(value: CardValue): void {
    const currentFilterValue = this.filters.value
    this.filters.value = currentFilterValue === value ? undefined : value
  }

  filterType(type: CardType): void {
    const currentFilterType = this.filters.type
    this.filters.type = currentFilterType === type ? undefined : type
  }

  iconColor(type: CardType): string {
    if (type === CardType.JOKER) return ''
    return [CardType.CLUB, CardType.SPADE].includes(type) ? 'black' : 'red'
  }
}
</script>

<style lang="scss" scoped>
.red i {
  color: #F44336;
}

.black i {
  color: #212121;
}
</style>
