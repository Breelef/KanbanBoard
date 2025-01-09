<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { Column } from '../utils/kanbanLogic';
import KanbanCard from "@/components/KanbanCard.vue";
import CreateCardModal from "@/components/CreateCardModal.vue";

export default defineComponent({
  name: 'KanbanColumn',
  components: { KanbanCard, CreateCardModal },
  props: {
    column: {
      type: Object as () => Column,
      required: true,
    },
    addCard: {
      type: Function,
      required: true
    },
    removeCardFromColumn: {
      type: Function,
      required: true
    }
  },
  setup(props, { emit }) {
    const isModalVisible = ref(false);
    const dragOverIndex = ref<number | null>(null);

    const openModal = () => {
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    const onDragEnter = (event: DragEvent, index: number) => {
      event.preventDefault();
      dragOverIndex.value = index;
    };

    const onDragLeave = () => {
      dragOverIndex.value = null;
    };

    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      const cardId = Number(event.dataTransfer?.getData('cardId'));
      const dropIndex = dragOverIndex.value ?? props.column.cards.length;

      if (cardId) {
        emit('moveCard', cardId, props.column.id, dropIndex);
        dragOverIndex.value = null;
      }
    };

    return {
      isModalVisible,
      openModal,
      closeModal,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      dragOverIndex
    };
  },
});
</script>
<template>
  <div
    :class="['rounded-lg shadow-md p-4', column.color, 'flex flex-col border-2 border-gray-500 w-full h-full']"
    @dragover="onDragOver"
  >
    <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 text-center">
      {{ column.title }}
    </h2>

    <button
      @click="openModal"
      :class="['mt-4 p-2 rounded text-black', column.color]"
      class="self-center"
    >
      Add Card
    </button>

    <div v-if="column.cards.length === 0"
      class="text-gray-500 flex-grow flex justify-center items-center min-h-[100px]"
      @dragenter.prevent
      @drop="onDrop"
    >
      No cards yet...
    </div>

    <div v-else class="flex flex-col gap-2 " :data-testid="'kanban-column-' + column.id">
      <div v-for="(card, index) in column.cards" :key="card.id">
        <div
          class="drop-zone"
          :class="{ 'h-2 bg-gray-300 rounded transition-all': dragOverIndex === index }"
          @dragenter.prevent="onDragEnter($event, index)"
          @dragleave="onDragLeave"
          @drop="onDrop"
        />
        <KanbanCard
          :card="card"
          :columnColor="column.color"
          @removeCard="removeCardFromColumn(column.id, card.id)"
          @dragstart="onDragStart(card.id)"
          draggable="true"
        />
      </div>
      <div
        class="drop-zone"
        :class="{ 'h-2 bg-gray-300 rounded transition-all': dragOverIndex === column.cards.length }"
        @dragenter.prevent="onDragEnter($event, column.cards.length)"
        @dragleave="onDragLeave"
        @drop="onDrop"
      />
    </div>

    <CreateCardModal
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :columnId="column.id"
      @close="closeModal"
      @createCard="addCard"
    />
  </div>
</template>
