import { useState } from 'react'
import './App.css'

const FILTERS = ['All', 'Active', 'Completed']

let nextId = 1

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('All')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: nextId++, text, done: false }])
    setInput('')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const clearCompleted = () => setTodos(todos.filter((t) => !t.done))

  const filtered = todos.filter((t) => {
    if (filter === 'Active') return !t.done
    if (filter === 'Completed') return t.done
    return true
  })

  const activeCount = todos.filter((t) => !t.done).length

  return (
    <div className="todo-app">
      이순신
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
