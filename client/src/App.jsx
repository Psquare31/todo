import React from 'react'
import TodoList from './components/TodoList'

export default function App(){
  return (
    <div className="app">
      <header className="header">
        <h1>Two-User Todo</h1>
      </header>
      <div className="container">
        <TodoList user={1} title="User 1" />
        <TodoList user={2} title="User 2" />
      </div>
    </div>
  )
}
