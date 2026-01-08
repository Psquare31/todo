import React, { useState } from 'react'

export default function TodoItem({ todo, onDelete, onUpdate }){
  const [open, setOpen] = useState(false)
  const [subText, setSubText] = useState('')

  function toggleComplete(){ onUpdate({ completed: !todo.completed }) }
  function toggleSub(i){
    const subs = todo.subtasks.map((s, idx)=> idx===i ? { ...s, completed: !s.completed } : s)
    onUpdate({ subtasks: subs })
  }
  function deleteSub(i){
    const subs = todo.subtasks.filter((_, idx)=> idx !== i)
    onUpdate({ subtasks: subs })
  }
  function addSub(){
    if(!subText.trim()) return
    const newSubs = [...todo.subtasks, { title: subText.trim(), completed: false }]
    onUpdate({ subtasks: newSubs })
    setSubText('')
    setOpen(true)
  }

  return (
    <div className={"todo " + (todo.completed ? 'completed' : '')}>
      <div className="row">
        <div className="left">
          <input type="checkbox" checked={todo.completed} onChange={toggleComplete} />
          <span className="title" onClick={()=>setOpen(o=>!o)}>{todo.title}</span>
        </div>
        <div className="actions">
          <button onClick={()=>setOpen(o=>!o)}>{open ? 'Collapse' : 'Open'}</button>
          <button className="danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      {open && (
        <div className="accordion">
          <div className="subtasks">
            {todo.subtasks.length === 0 && <div className="empty">No subtasks</div>}
            {todo.subtasks.map((s, i)=> (
              <div className="sub" key={i}>
                <input type="checkbox" checked={s.completed} onChange={()=>toggleSub(i)} />
                <span className={s.completed ? 'done' : ''}>{s.title}</span>
                <button className="small" onClick={()=>deleteSub(i)}>x</button>
              </div>
            ))}
          </div>

          <div className="add-sub">
            <input value={subText} onChange={e=>setSubText(e.target.value)} placeholder="Add subtask" />
            <button onClick={addSub}>Add Subtask</button>
          </div>
        </div>
      )}
    </div>
  )
}
