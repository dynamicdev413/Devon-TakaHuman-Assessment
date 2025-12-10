import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/notes')
      setNotes(response.data.notes || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      if (editingNote) {
        // Update existing note
        await api.put(`/notes/${editingNote._id}`, formData)
        setSuccess('Note updated successfully')
      } else {
        // Create new note
        await api.post('/notes', formData)
        setSuccess('Note created successfully')
      }
      
      setFormData({ title: '', content: '' })
      setEditingNote(null)
      fetchNotes()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (note) => {
    setEditingNote(note)
    setFormData({ title: note.title, content: note.content })
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      setError('')
      await api.delete(`/notes/${id}`)
      setSuccess('Note deleted successfully')
      fetchNotes()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note')
    }
  }

  const handleCancel = () => {
    setEditingNote(null)
    setFormData({ title: '', content: '' })
    setError('')
    setSuccess('')
  }

  if (loading && notes.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="notes-header">
        <h1>My Notes</h1>
        <button onClick={logout} className="btn btn-secondary btn-small">
          Logout
        </button>
      </div>

      <div className="note-form">
        <h2>{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={submitting}
              maxLength={200}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              disabled={submitting}
              maxLength={5000}
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
            </button>
            {editingNote && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {notes.length === 0 ? (
        <div className="empty-state">
          <h2>No notes yet</h2>
          <p>Create your first note above!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note._id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="note-actions">
                <button
                  onClick={() => handleEdit(note)}
                  className="btn btn-secondary btn-small"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </div>
              <small style={{ color: '#999', fontSize: '12px' }}>
                {new Date(note.updatedAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notes

