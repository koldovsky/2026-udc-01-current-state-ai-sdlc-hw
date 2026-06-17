import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import ShoppingList from './ShoppingList'

describe('ShoppingList', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should render with empty state message', () => {
    render(<ShoppingList />)
    expect(screen.getByText('No items yet. Add one to get started!')).toBeInTheDocument()
  })

  it('should add item when form is submitted', async () => {
    const user = userEvent.setup()
    render(<ShoppingList />)

    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Milk')
    await user.click(addButton)

    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('should not add empty items', async () => {
    const user = userEvent.setup()
    render(<ShoppingList />)

    const addButton = screen.getByRole('button', { name: 'Add' })
    await user.click(addButton)

    expect(screen.getByText('No items yet. Add one to get started!')).toBeInTheDocument()
  })

  it('should add item on Enter key', async () => {
    const user = userEvent.setup()
    render(<ShoppingList />)

    const input = screen.getByPlaceholderText('Add item...')
    await user.type(input, 'Bread{Enter}')

    expect(screen.getByText('Bread')).toBeInTheDocument()
  })

  it('should remove item when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<ShoppingList />)

    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Eggs')
    await user.click(addButton)

    expect(screen.getByText('Eggs')).toBeInTheDocument()

    const removeButton = screen.getByRole('button', { name: 'Remove' })
    await user.click(removeButton)

    expect(screen.queryByText('Eggs')).not.toBeInTheDocument()
  })

  it('should clear all items', async () => {
    const user = userEvent.setup()
    render(<ShoppingList />)

    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Item 1')
    await user.click(addButton)
    await user.type(input, 'Item 2')
    await user.click(addButton)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()

    const clearButton = screen.getByRole('button', { name: 'Clear All' })
    await user.click(clearButton)

    expect(screen.getByText('No items yet. Add one to get started!')).toBeInTheDocument()
  })

  it('should save items to localStorage', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ShoppingList />)

    const input = screen.getByPlaceholderText('Add item...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Cheese')
    await user.click(addButton)

    await waitFor(() => {
      const stored = localStorage.getItem('shopping-items')
      expect(stored).toBeTruthy()
      const items = JSON.parse(stored!)
      expect(items).toHaveLength(1)
      expect(items[0].text).toBe('Cheese')
    })

    unmount()
  })

  it('should load items from localStorage on mount', async () => {
    const testItems = [{ id: '1', text: 'Apple' }, { id: '2', text: 'Orange' }]
    localStorage.setItem('shopping-items', JSON.stringify(testItems))

    render(<ShoppingList />)

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Orange')).toBeInTheDocument()
    })
  })
})
