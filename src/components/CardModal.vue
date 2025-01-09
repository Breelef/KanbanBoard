<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-semibold mb-4">Create a New Card</h2>

        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              v-model="title"
              type="text"
              class="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              id="description"
              v-model="description"
              rows="4"
              class="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div class="flex justify-between">
            <button type="button" @click="closeModal" class="bg-gray-500 text-white p-2 rounded">
              Cancel
            </button>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Create Card</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Card } from '../utils/kanbanLogic'

export default defineComponent({
  name: 'CardModal',
  props: {
    isVisible: Boolean,
    columnId: Number,
    card: {
      type: Object as PropType<Card | null>,
      required: false,
    },
  },
  emits: ['close', 'createCard', 'updateCard'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('close')
    }

    const updateCard = () => {
      if (props.card) {
        emit('updateCard', props.card)
      }
    }

    return {
      closeModal,
      updateCard
    }
  },
})
</script>
