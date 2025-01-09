<script setup lang="ts">
import type { Card } from '../utils/kanbanLogic';
import { XCircle, Clock } from 'lucide-vue-next';

const props = defineProps({
  card: {
    type: Object as () => Card,
    required: true,
  },
  columnColor: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['removeCard', 'dragstart']);

function removeCard() {
  emit('removeCard', props.card.id);
}

function onDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('cardId', props.card.id.toString());
    emit('dragstart', props.card.id);
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('da-DK', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div
    :class="['rounded-lg shadow p-2 bg-gray-100 border border-black cursor-move group']"
    draggable="true"
    @dragstart="onDragStart"
  >
    <div class="flex justify-between items-start">
      <div>
        <p class="font-semibold text-sm sm:text-base">{{ card.title }}</p>
        <p class="text-xs sm:text-sm text-gray-600">{{ card.description }}</p>
        <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Clock class="w-3 h-3" />
          {{ formatDate(card.id) }}
        </p>
      </div>
      <button
        @click="removeCard"
        class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mt-1 -mr-1 hover:bg-red-100 p-1 rounded-lg"
      >
        <XCircle class="w-4 h-4 text-red-500 hover:text-red-600" />
      </button>
    </div>
  </div>
</template>
