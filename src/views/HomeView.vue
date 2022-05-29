<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="title">Rummy Tracker
          <v-btn icon @click="reset()">
            <v-icon>mdi-sync</v-icon>
          </v-btn>
        </h1>
      </v-col>
      <v-col cols="12">
        <v-btn icon v-for="(value, valueIndex) of allCardValues" :key="valueIndex" @click="filterValue(value)"
               :color="value === filters.value ? 'primary' : ''" class="ma-1">
          <v-img v-if="value === 'joker'" src="img/joker.svg" height="30"/>
          <span v-else-if="['ace', 'jack', 'queen', 'king'].includes(value)">
            {{ value[0] }}
          </span>
          <span v-else>{{ value }}</span>
        </v-btn>
        <v-btn icon v-for="(type, typeIndex) of allCardTypes" :key="typeIndex" @click="filterType(type)"
               :color="type === filters.type ? 'primary' : ''"  :class="['ma-1', iconColor(type)]">
          <v-icon>mdi-cards-{{ type }}</v-icon>
        </v-btn>
      </v-col>
      <v-col v-for="(card, cardIndex) of filteredCards" :key="cardIndex" cols="6" md="2" sm="3" xl="1" class="pa-1">
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
import CardComponent from '@/components/CardComponent.vue'

@Options({
  components: { CardComponent },
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
            .map((type) => this.values.map((value) => new Card(value, type)))
            .flat()
            .map((card) => new CardStatus(card, 2)),
        new CardStatus(new Card('joker'), 4),
      ],
  )

  get allCardValues(): CardValue[] {
    return ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king', 'joker'] as CardValue[]
  }

  get allCardTypes(): CardType[] {
    return $enum(CardType).map((it) => it)
  }

  reset(): void {
    this.deck.cards.forEach((card) => {
      card.resetPlayed()
    })
  }

  get filteredCards(): CardStatus[] {
    return this.deck.cards.filter((it) => {
      const matchesValue = this.filters.value ? it.value === this.filters.value : true
      const matchesType = this.filters.type ? it.type === this.filters.type : true
      return matchesValue && matchesType
    })
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
    return [CardType.CLUB, CardType.SPADE].includes(type) ? 'black' : 'red'
  }
}
</script>

<style lang="scss">
.red i {
  color: #F44336;
}

.black i {
  color: #212121;
}
</style>
