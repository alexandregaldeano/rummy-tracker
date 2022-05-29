<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-card :color="card.remaining ? 'grey-lighten-4' : 'red-lighten-5'" class="pa-0" elevation="0"
          @click="card.incrementPlayed(true)">
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col cols="12" :class="['d-flex', 'justify-center', 'pa-2', iconColor]">
          <div class="jokerContainer" v-if="card.value === 'joker'">
            <v-img src="img/joker.svg"/>
          </div>
          <span v-else-if="['ace', 'jack', 'queen', 'king'].includes(card.value)">
            {{ card.value[0].toUpperCase() }}
            <v-icon>mdi-cards-{{ card.type }}</v-icon>
          </span>
          <span v-else>{{ card.value }}<v-icon>mdi-cards-{{ card.type }}</v-icon></span>
        </v-col>
        <v-col cols="12" class="pa-0">
          <v-progress-linear :color="barColor" :model-value="card.remainingPercent" height="16">
            <small><strong>{{ card.remaining }} / {{ card.total }}</strong></small>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'CardComponent',
  inheritAttrs: false,
  customOptions: {},
}
</script>

<script lang="ts" setup>
import { CardType } from '@/models/card.model'
import { computed } from 'vue'
import { CardStatus } from '@/models/deck.model'

const props = defineProps({
  card: CardStatus,
})

const iconColor = computed(() => [undefined, CardType.CLUB, CardType.SPADE].includes(props.card?.type) ? 'black' : 'red')

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
  console.error(rgb)
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
})

</script>

<style lang="scss" scoped>
.v-card {
  user-select: none;
  cursor: pointer;
}

.red i {
  color: #F44336;
}

.black i {
  color: #212121;
}

.jokerContainer {
  height: 21px;
  width: 100%;
  .v-img {
    height: 31px;
    max-height: unset;
    margin-top: -5px;
  }
}

:deep(button) {
  height: 52px !important;
}
</style>
