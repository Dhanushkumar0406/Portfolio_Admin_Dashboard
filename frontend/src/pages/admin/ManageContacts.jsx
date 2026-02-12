import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaEnvelopeOpen, FaTimes, FaUser, FaPhone, FaClock, FaTrash } from 'react-icons/fa'
import api from '../../services/api'

const ManageContacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contact/')
      setContacts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/${id}`, { is_read: true })
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, is_read: true } : c)))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const deleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/contact/${id}`)
      setContacts((prev) => prev.filter((c) => c.id !== id))
      if (selectedContact?.id === id) setSelectedContact(null)
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const openMessage = (contact) => {
    setSelectedContact(contact)
    if (!contact.is_read) markAsRead(contact.id)
  }

  const unreadCount = contacts.filter((c) => !c.is_read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Messages</h1>
        <p className="text-soft mt-1">
          {contacts.length} message{contacts.length !== 1 && 's'}
          {unreadCount > 0 && <span className="text-primary ml-2">({unreadCount} unread)</span>}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="glass-card p-12 text-center text-soft">
          <FaEnvelope size={32} className="mx-auto mb-3 opacity-30" />
          <p>No messages yet. Contact submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          {/* Message List */}
          <div className="glass-card overflow-hidden">
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-white/5">
              {contacts.map((contact, index) => (
                <motion.button
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => openMessage(contact)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-white/5 border-l-2 border-primary' : ''
                  } ${!contact.is_read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {contact.is_read ? (
                        <FaEnvelopeOpen size={14} className="text-soft" />
                      ) : (
                        <FaEnvelope size={14} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${!contact.is_read ? 'text-white' : 'text-soft'}`}>
                          {contact.name}
                        </p>
                        {contact.created_at && (
                          <span className="text-xs text-soft ml-2 flex-shrink-0">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-soft truncate mt-0.5">{contact.subject || 'No subject'}</p>
                      <p className="text-xs text-soft/60 truncate mt-0.5">{contact.message}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="glass-card p-6">
            {selectedContact ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-heading">{selectedContact.subject || 'No Subject'}</h2>
                    <p className="text-soft text-sm mt-1">from {selectedContact.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-soft hover:text-white p-1 lg:hidden"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-soft">
                    <FaUser size={12} />
                    <span>{selectedContact.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-soft">
                    <FaEnvelope size={12} />
                    <a href={`mailto:${selectedContact.email}`} className="hover:text-primary transition-colors">
                      {selectedContact.email}
                    </a>
                  </div>
                  {selectedContact.phone && (
                    <div className="flex items-center gap-2 text-soft">
                      <FaPhone size={12} />
                      <span>{selectedContact.phone}</span>
                    </div>
                  )}
                  {selectedContact.created_at && (
                    <div className="flex items-center gap-2 text-soft">
                      <FaClock size={12} />
                      <span>{new Date(selectedContact.created_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || ''}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-primary text-ink rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    <FaEnvelope size={12} /> Reply via Email
                  </a>
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full py-20 text-soft text-sm">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageContacts
