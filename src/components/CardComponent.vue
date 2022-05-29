<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-card class="pa-0" elevation="1">
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
  </v-card>
</template>

<script lang="ts">
import { Component } from 'vue'

type CardComponent = Component

export default {
  name: 'CardComponent',
  inheritAttrs: false,
  customOptions: {},
} as CardComponent
</script>

<script lang="ts" setup>
import Card, { CardType } from '@/models/card.model'
import { computed } from 'vue'

const props = defineProps({
  card: { type: Card, required: true },
})

const iconColor = computed(() => {
  const type = props.card?.type
  if (!type || type === CardType.JOKER) return ''
  return [CardType.CLUB, CardType.SPADE].includes(type) ? 'black' : 'red'
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
</style>
