<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="title">Rummy Tracker <v-btn icon @click="reset()"><v-icon>mdi-sync</v-icon></v-btn></h1>
      </v-col>
      <v-col v-for="(card, cardIndex) of deck.cards" :key="cardIndex" cols="6" sm="4" md="3" lg="2">
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

  reset(): void {
    this.deck.cards.forEach((card) => {
      card.resetPlayed()
    })
  }
}
</script>
