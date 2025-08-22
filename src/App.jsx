// App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [search, setSearch] = useState('')

  // Load notes from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!title.trim()) return
    
    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString()
    }
    
    setNotes([newNote, ...notes])
    setTitle('')
    setContent('')
  }

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <header>
        <h1>📝 My Notes</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main>
        <div className="add-note">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNote()}
          />
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
          />
          <button onClick={addNote} disabled={!title.trim()}>
            Add Note
          </button>
        </div>

        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <p className="no-notes">
              {search ? 'No notes match your search.' : 'No notes yet. Add your first note!'}
            </p>
          ) : (
            filteredNotes.map(note => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onDelete={deleteNote}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}

// Separate component for each note
function NoteCard({ note, onDelete }) {
  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        <button 
          className="delete-btn"
          onClick={() => onDelete(note.id)}
          title="Delete note"
        >
          ✕
        </button>
      </div>
      {note.content && <p>{note.content}</p>}
      <div className="note-date">{note.date}</div>
    </div>
  )
}

export default App