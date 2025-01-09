<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { createColumn, createCard } from '../utils/kanbanLogic.ts'
import type { Column } from '../utils/kanbanLogic.ts'
import KanbanColumn from './kanbanColumn.vue'

export default defineComponent({
  name: 'KanbanBoard',
  components: {
    KanbanColumn,
  },
  setup() {
    const columns = reactive<Column[]>([
      createColumn(1, 'To Do', 'bg-blue-100'),
      createColumn(2, 'In Progress', 'bg-yellow-100'),
      createColumn(3, 'Test', 'bg-purple-100'),
      createColumn(4, 'Review', 'bg-orange-100'),
      createColumn(5, 'Done', 'bg-green-100'),
    ])

    function addCard(cardData: { title: string; description: string; columnId: number }) {
      const newCard = createCard(Date.now(), cardData.title, cardData.description)
      const column = columns.find((col) => col.id === cardData.columnId)
      if (column) {
        column.cards.push(newCard)
      }
    }

    function removeCardFromColumn(columnId: number, cardId: number) {
      const column = columns.find((col) => col.id === columnId)
      if (column) {
        column.cards = column.cards.filter((card) => card.id !== cardId)
      }
    }

    function moveCard(cardId: number, targetColumnId: number, targetIndex: number) {
      let cardToMove: any = null
      let sourceColumn: Column | undefined

      // Find and remove card from source column
      columns.forEach((col) => {
        const cardIndex = col.cards.findIndex((card) => card.id === cardId)
        if (cardIndex !== -1) {
          sourceColumn = col
          cardToMove = col.cards.splice(cardIndex, 1)[0]
        }
      })

      // Insert card at specific position in target column
      const targetColumn = columns.find((col) => col.id === targetColumnId)
      if (cardToMove && targetColumn) {
        targetColumn.cards.splice(targetIndex, 0, cardToMove)
      }
    }

    return { columns, addCard, removeCardFromColumn, moveCard }
  },
})
</script>

<template>
  <div class="flex flex-col items-center bg-gray-100 min-h-screen p-4">
    <h1 class="text-3xl text-gray-800 font-bold mb-4">Kanban Board</h1>
    <div class="flex sm:flex-row gap-4 w-full overflow-x-auto justify-evenly">
      <KanbanColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :addCard="addCard"
        :remove-card-from-column="removeCardFromColumn"
        @moveCard="moveCard"
      />
    </div>
  </div>
</template>
