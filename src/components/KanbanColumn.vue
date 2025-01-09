<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue'
import type { Column, Card } from '../utils/kanbanLogic'
import KanbanCard from '@/components/KanbanCard.vue'
import CardModal from '@/components/CardModal.vue'

export default defineComponent({
  name: 'KanbanColumn',
  components: { KanbanCard, CardModal },
  props: {
    column: {
      type: Object as () => Column,
      required: true,
    },
    addCard: {
      type: Function as PropType<
        (card: { title: string; description: string; columnId: number }) => void
      >,
      required: true,
    },
    removeCardFromColumn: {
      type: Function as PropType<(columnId: number, cardId: number) => void>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const currentEditingCard = ref<Card | null>(null)
    const isModalVisible = ref(false)
    const dragOverIndex = ref<number | null>(null)

    const openModal = (card = null) => {
      currentEditingCard.value = card
      isModalVisible.value = true
    }

    const closeModal = () => {
      isModalVisible.value = false
    }

    const updateCard = (updatedCard: Card) => {
      const cardIndex = props.column.cards.findIndex((card) => card.id === updatedCard.id)
      if (cardIndex !== -1) {
        props.column.cards[cardIndex] = updatedCard
      }
      closeModal()
    }

    const onDragEnter = (event: DragEvent, index: number) => {
      event.preventDefault()
      if (index >= 0 && index <= props.column.cards.length) {
        dragOverIndex.value = index
      }
    }

    const onDragLeave = () => {
      console.log('Drag left drop zone') // Debug
      dragOverIndex.value = null
    }

    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
    }

    const onDrop = (event: DragEvent) => {
      event.preventDefault()
      const cardId = Number(event.dataTransfer?.getData('cardId'))
      const dropIndex = dragOverIndex.value !== null ? dragOverIndex.value : props.column.cards.length

      console.log('Dropped card ID:', cardId, 'at position:', dropIndex) // Debug

      if (cardId !== null && dropIndex >= 0) {
        emit('moveCard', cardId, props.column.id, dropIndex)
        dragOverIndex.value = null
      }
    }

    return {
      isModalVisible,
      openModal,
      closeModal,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      dragOverIndex,
    }
  },
})
</script>

<template>
  <div
    :class="[ 'rounded-lg shadow-md px-4 pt-4 pb-1', column.color, 'flex flex-col border-2 border-gray-500 w-full h-full' ]"
    @dragover="onDragOver"
  >
    <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 text-center">
      {{ column.title }}
    </h2>

    <div class="flex-grow">
      <div
        v-if="column.cards.length === 0"
        class="text-gray-500 flex justify-center items-center min-h-[100px]"
        @dragenter.prevent
        @drop="onDrop"
      >
        No cards yet...
      </div>

      <div v-else class="flex flex-col gap-2" :data-testid="'kanban-column-' + column.id">
        <div v-for="(card, index) in column.cards" :key="card.id">
          <div
            class="drop-zone bg-gray-200 opacity-50"
            :class="{ 'h-2 bg-gray-300 rounded transition-all': dragOverIndex === index }"
            @dragenter.prevent="onDragEnter($event, index)"
            @dragleave="onDragLeave"
            @drop="onDrop"
          />
          <KanbanCard
            :card="card"
            :columnColor="column.color"
            @removeCard="removeCardFromColumn(column.id, card.id)"
            @editCard="openModal"
            draggable="true"
          />
        </div>
        <!-- Drop zone after last card -->
        <div
          class="drop-zone bg-gray-200 opacity-50"
          :class="{ 'h-2 bg-gray-300 rounded transition-all': dragOverIndex === column.cards.length }"
          @dragenter.prevent="onDragEnter($event, column.cards.length)"
          @dragleave="onDragLeave"
          @drop="onDrop"
        />
      </div>
    </div>

    <!-- Move the button to the bottom -->
    <button
      @click="openModal"
      :class="['mt-1 rounded text-black', column.color]"
      class="self-center mb-4"
    >
      Add Card
    </button>

    <CardModal
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :columnId="column.id"
      :card="currentEditingCard"
      @close="closeModal"
      @createCard="addCard"
      @updateCard="updateCard"
    />
  </div>
</template>
