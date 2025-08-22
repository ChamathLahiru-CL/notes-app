// App.jsx
import { useState, useEffect } from 'react'
import './App.css'
import { addNote as addNoteToFirestore, getNotes, deleteNote as deleteNoteFromFirestore } from './firebaseService'

function App() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load notes from Firestore on startup
  useEffect(() => {
    loadNotesFromFirestore()
  }, [])

  const loadNotesFromFirestore = async () => {
    try {
      setLoading(true)
      setError('')
      const notesFromFirestore = await getNotes()
      setNotes(notesFromFirestore)
    } catch (err) {
      setError('Failed to load notes. Please check your Firebase configuration.')
      console.error('Error loading notes:', err)
      // Fallback to localStorage if Firebase fails
      const saved = localStorage.getItem('notes')
      if (saved) {
        setNotes(JSON.parse(saved))
      }
    } finally {
      setLoading(false)
    }
  }

  const addNote = async () => {
    if (!title.trim()) return
    
    try {
      setError('')
      const newNote = {
        title: title.trim(),
        content: content.trim(),
      }
      
      // Add to Firestore
      const noteId = await addNoteToFirestore(newNote)
      
      // Add to local state immediately for better UX
      const noteWithId = {
        id: noteId,
        ...newNote,
        createdAt: new Date(),
        date: new Date().toLocaleDateString()
      }
      
      setNotes([noteWithId, ...notes])
      setTitle('')
      setContent('')
    } catch (err) {
      setError('Failed to add note. Please try again.')
      console.error('Error adding note:', err)
    }
  }

  const deleteNote = async (id) => {
    try {
      setError('')
      await deleteNoteFromFirestore(id)
      // Remove from local state immediately for better UX
      setNotes(notes.filter(note => note.id !== id))
    } catch (err) {
      setError('Failed to delete note. Please try again.')
      console.error('Error deleting note:', err)
    }
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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

        {loading ? (
          <div className="loading">Loading notes...</div>
        ) : (
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
        )}
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