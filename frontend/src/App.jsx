import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = 'http://localhost:8080/api/todos'
const FILTERS = ['All', 'Active', 'Completed']

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then(setTodos)
  }, [])

  const addTodo = async () => {
    const text = input.trim()
    if (!text) return
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const todo = await res.json()
    setTodos((prev) => [...prev, todo])
    setInput('')
  }

  const toggleTodo = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'PATCH' })
    const updated = await res.json()
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const deleteTodo = async (id) => {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  const clearCompleted = async () => {
    await fetch(`${API_BASE}/completed`, { method: 'DELETE' })
    setTodos((prev) => prev.filter((t) => !t.done))
  }

  const filtered = todos.filter((t) => {
    if (filter === 'Active') return !t.done
    if (filter === 'Completed') return t.done
    return true
  })

  const activeCount = todos.filter((t) => !t.done).length

  return (
    <div className="todo-app">
      <h1>Todo</h1>
      <div className="todo-input-row">
        <input
          className="todo-input"
          type="text"
          placeholder="What needs to be done?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button className="todo-add-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      <div className="todo-card">
        <div className="todo-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="todo-empty">
            {filter === 'Completed' ? 'No completed tasks.' : 'No tasks yet.'}
          </p>
        ) : (
          <ul className="todo-list">
            {filtered.map((todo) => (
              <li key={todo.id} className={`todo-item${todo.done ? ' done' : ''}`}>
                <button
                  className="todo-check"
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {todo.done && (
                    <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button
                  className="todo-delete"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="todo-footer">
          <span>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
          {todos.some((t) => t.done) && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
