<!--suppress HtmlUnknownBooleanAttribute -->
<template>
  <v-card :color="card.remaining ? 'grey-lighten-5' : 'grey-lighten-2'" elevation="0" class="pb-0">
    <v-card-title class="d-flex justify-center">
      <v-row>
        <v-col :class="['d-flex', 'justify-center', color]" cols="12" sm="6">
          <v-img v-if="card.value === 'joker'" src="img/joker.svg"/>
          <span v-else-if="['ace', 'jack', 'queen', 'king'].includes(card.value)">
            {{ card.value[0].toUpperCase() }}
            <v-icon>mdi-cards-{{ card.type }}</v-icon>
          </span>
          <span v-else>{{ card.value }}<v-icon>mdi-cards-{{ card.type }}</v-icon></span>
        </v-col>
        <v-col class="d-flex justify-center" cols="12" sm="6">{{ card.remaining }} / {{ card.total }}</v-col>
      </v-row>
    </v-card-title>
    <v-card-actions class="pt-0 pb-0">
      <v-row>
        <v-col class="d-flex justify-center pa-0 pl-1" cols="6">
          <v-btn :disabled="card.played === 0" block @click="card.decrementPlayed()">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center pa-0 pr-1" cols="6">
          <v-btn :disabled="card.remaining === 0" block @click="card.incrementPlayed()">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
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

const color = computed(() => [undefined, CardType.CLUB, CardType.SPADE].includes(props.card?.type) ? 'black' : 'red')
</script>

<style lang="scss" scoped>
.v-card {
  user-select: none;
}

.red i {
  color: red;
}

.black i {
  color: black;
}

.v-img {
  max-height: 38px;
  margin-top: -2px;
  margin-bottom: -4px;
}

:deep(button)  {
 height: 52px !important;
}
</style>
