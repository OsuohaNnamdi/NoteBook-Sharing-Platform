import React, { useEffect, useMemo, useRef, useState } from 'react';
import { chatApi } from '../../api/chatApi';
import { useAuth } from '../../context/AuthContext';
import { extractErrorMessage } from '../../lib/api';

function initialsOf(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
}

export default function ChatPage() {
  const { user, hasAccess } = useAuth();
  const canSend = hasAccess('CHAT', 'WRITE');

  const [individuals, setIndividuals] = useState([]);
  const [activeEmail, setActiveEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [newChatEmail, setNewChatEmail] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const loadIndividuals = async () => {
    try {
      const list = await chatApi.individuals();
      setIndividuals(list);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load your conversations.'));
    }
  };

  const loadConversation = async (otherEmail) => {
    try {
      const pageData = await chatApi.conversation(otherEmail, 0, 50);
      const sorted = [...(pageData.content ?? [])].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sorted);
      // Mark incoming unread messages as read.
      sorted
        .filter((m) => m.sender === otherEmail && !m.read)
        .forEach((m) => chatApi.markRead(m.id).catch(() => {}));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load this conversation.'));
    }
  };

  useEffect(() => {
    loadIndividuals();
    const interval = setInterval(loadIndividuals, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeEmail) return;
    loadConversation(activeEmail);
    const interval = setInterval(() => loadConversation(activeEmail), 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredIndividuals = useMemo(() => {
    if (!search.trim()) return individuals;
    const q = search.toLowerCase();
    return individuals.filter((i) => i.name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q));
  }, [individuals, search]);

  const activePerson = individuals.find((i) => i.email === activeEmail);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeEmail) return;
    setSending(true);
    setError('');
    try {
      await chatApi.sendText(activeEmail, draft.trim());
      setDraft('');
      await loadConversation(activeEmail);
      await loadIndividuals();
    } catch (err) {
      setError(extractErrorMessage(err, 'Message could not be sent.'));
    } finally {
      setSending(false);
    }
  };

  const startNewChat = (e) => {
    e.preventDefault();
    if (!newChatEmail.trim()) return;
    setActiveEmail(newChatEmail.trim());
    setShowNewChat(false);
    setNewChatEmail('');
  };

  return (
    <div className="chat-layout">
      <div className="chat-list">
        <div className="chat-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Messages</strong>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setShowNewChat((s) => !s)}>
            + New
          </button>
        </div>

        {showNewChat && (
          <form onSubmit={startNewChat} style={{ padding: '0 20px 12px' }}>
            <input
              className="chat-search"
              style={{ margin: 0, width: '100%' }}
              placeholder="Enter their email…"
              value={newChatEmail}
              onChange={(e) => setNewChatEmail(e.target.value)}
              autoFocus
            />
          </form>
        )}

        <input
          className="chat-search"
          placeholder="Search anything…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="chat-items">
          {filteredIndividuals.length === 0 && <div className="empty-state">No conversations yet.</div>}
          {filteredIndividuals.map((person) => (
            <div
              key={person.email}
              className={`chat-item${person.email === activeEmail ? ' active' : ''}`}
              onClick={() => setActiveEmail(person.email)}
            >
              <div className="avatar">{initialsOf(person.name || person.email)}</div>
              <div>
                <div className="chat-item-name">{person.name || person.email}</div>
                <div className="chat-item-preview">{person.lastMessage || 'No messages yet'}</div>
              </div>
              {person.unreadCount > 0 && <div className="chat-item-badge">{person.unreadCount}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {!activeEmail ? (
          <div className="chat-empty">Select a conversation, or start a new one.</div>
        ) : (
          <>
            <div className="chat-main-header">
              <div className="avatar">{initialsOf(activePerson?.name || activeEmail)}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{activePerson?.name || activeEmail}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{activeEmail}</div>
              </div>
            </div>

            {error && <div className="alert alert-error" style={{ margin: '12px 24px 0' }}>{error}</div>}

            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id} className={`msg-row${m.sender === user?.email ? ' mine' : ''}`}>
                  <div>
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-meta">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-composer" onSubmit={handleSend}>
              <input
                placeholder={canSend ? 'Type something…' : 'You have read-only access to chat'}
                value={draft}
                disabled={!canSend}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={!canSend || sending || !draft.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
