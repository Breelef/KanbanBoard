export interface Card {
  id: number
  title: string
  description: string
}

export interface Column {
  id: number
  title: string
  cards: Card[]
  color: string
}


export function createColumn(id: number, title: string, color: string): Column {
  return { id, title, color, cards: []}
}

export function createCard(id: number, title: string, description: string): Card {
  return { id, title, description }
}

