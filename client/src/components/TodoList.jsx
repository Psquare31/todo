import React, { useEffect, useState } from 'react'
import TodoItem from './TodoItem'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function TodoList({ user, title }){
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>{ fetchTodos() }, [])

  async function fetchTodos(){
    const res = await fetch(`${API}/api/todos?user=${user}`)
    const data = await res.json()
    setTodos(data)
  }

  async function add(){
    if(!text.trim()) return
    const res = await fetch(`${API}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, title: text, subtasks: [] })
    })
    const t = await res.json()
    setText('')
    setTodos(prev=>[t, ...prev])
  }

  async function remove(id){
    await fetch(`${API}/api/todos/${id}`, { method: 'DELETE' })
    setTodos(prev=>prev.filter(t=>t._id !== id))
  }

  async function update(id, updates){
    const res = await fetch(`${API}/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const t = await res.json()
    setTodos(prev=>prev.map(it=>it._id === t._id ? t : it))
  }

  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="add">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Add new todo" />
        <button onClick={add}>Add</button>
      </div>
      <div className="list">
        {todos.map(todo=> (
          <TodoItem key={todo._id} todo={todo} onDelete={()=>remove(todo._id)} onUpdate={(u)=>update(todo._id, u)} />
        ))}
      </div>
    </section>
  )
}
