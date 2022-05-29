<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-card :color="card.remaining ? '' : 'red-lighten-5'" class="pa-0" elevation="1">
    <v-card-title class="pa-0">
      <v-row class="ma-0">
        <v-col :class="['d-flex', 'justify-center', 'pa-2', iconColor]" cols="12">
          <div v-if="card.type === CardType.JOKER" class="jokerContainer">
            <v-img src="img/joker.svg"/>
          </div>
          <template v-else-if="['ace', 'jack', 'queen', 'king'].includes(card.value)">
            <span class="cardValue">{{ card.value[0].toUpperCase() }}</span>
            <v-icon>mdi-cards-{{ card.type }}</v-icon>
          </template>
          <template v-else>
            <span class="cardValue">{{ card.value }}</span>
            <v-icon>mdi-cards-{{ card.type }}</v-icon>
          </template>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions>
      <v-row class="pa-1">
        <v-col class="d-flex justify-center pa-0">
          <v-badge v-if="card.played" :content="card.played"
                   bottom overlap>
            <v-btn elevation="0" icon @click="card.incrementPlayed()">
              <v-icon>mdi-cards-outline</v-icon>
            </v-btn>
          </v-badge>
          <v-btn v-else :disabled="!card.remaining" elevation="0" icon @click="card.incrementPlayed()">
            <v-icon>mdi-cards-outline</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center pa-0">
          <v-badge v-if="card.drawn" :content="card.drawn"
                   bottom overlap>
            <v-btn elevation="0" icon @click="card.incrementDrawn()">
              <v-icon>mdi-hand</v-icon>
            </v-btn>
          </v-badge>
          <v-btn v-else :disabled="!card.remaining" elevation="0" icon @click="card.incrementDrawn()">
            <v-icon>mdi-hand</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center pa-0">
          <v-badge v-if="card.discarded" :content="card.discarded"
                   bottom overlap>
            <v-btn elevation="0" icon @click="card.incrementDiscarded()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-badge>
          <v-btn v-else :disabled="!card.remaining" elevation="0" icon @click="card.incrementDiscarded()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
        <v-col class="pa-0" cols="12">
          <v-progress-linear :color="barColor" :model-value="card.remainingPercent"/>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component } from 'vue'

type CardStatusComponent = Component

export default {
  name: 'CardStatusComponent',
  inheritAttrs: false,
  customOptions: {},
} as CardStatusComponent
</script>

<script lang="ts" setup>
import { CardType } from '@/models/card.model'
import { computed } from 'vue'
import { CardStatus } from '@/models/deck.model'

const props = defineProps({
  card: { type: CardStatus, required: true },
})

const iconColor = computed(() => {
  const type = props.card?.type
  if (!type || type === CardType.JOKER) return ''
  return [CardType.CLUB, CardType.SPADE].includes(type) ? 'black' : 'red'
})

const max: [number, number, number] = [200, 230, 201]
const min: [number, number, number] = [255, 205, 210]

function linearInterpolation(from: number, to: number, ratio: number, round = true): number {
  const interpolation = from + (to - from) * ratio
  return round ? Math.round(interpolation) : interpolation
}

function quadraticInterpolation(from: number, to: number, ratio: number, round = true): number {
  const interpolation = Math.sqrt(linearInterpolation(from * from, to * to, ratio, false))
  return round ? Math.round(interpolation) : interpolation
}

const barColor = computed(() => {
  const { card } = props
  if (!card) return ''
  const ratio = card.remainingPercent / 100
  const rgb = min.map((from, index) => {
    const to = max[index]
    return quadraticInterpolation(from, to, ratio)
  }) as [number, number, number]
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
})
</script>

<style lang="scss" scoped>
.v-card {
  user-select: none;
  cursor: pointer;
}

.v-card-actions {
  min-height: unset;
}

.red i {
  color: #F44336;
}

.black i {
  color: #212121;
}

.jokerContainer {
  height: 30px;
  width: 100%;

  .v-img {
    height: 40px;
    max-height: unset;
    margin-top: -5px;
  }
}

.cardValue {
  height: 21px;
  font-size: calc(var(--v-icon-size-multiplier) * 1.5em);
  text-align: center;
}

:deep(button) {
  color: #424242;
  caret-color: #424242;
}
</style>
