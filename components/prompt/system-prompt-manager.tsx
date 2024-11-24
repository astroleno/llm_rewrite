'use client'

import { useState } from 'react'
import { useModelStore } from '@/lib/store/model-store'
import { PlusCircle, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export function SystemPromptManager() {
  const { systemPrompts, addSystemPrompt, updateSystemPrompt, removeSystemPrompt } = useModelStore()
  const [isAdding, setIsAdding] = useState(false)
  const [newPromptName, setNewPromptName] = useState('')
  const [newPromptContent, setNewPromptContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleAdd = () => {
    if (newPromptName && newPromptContent) {
      addSystemPrompt(newPromptName, newPromptContent)
      setNewPromptName('')
      setNewPromptContent('')
      setIsAdding(false)
    }
  }

  const handleUpdate = (id: string) => {
    const prompt = systemPrompts.find(p => p.id === id)
    if (prompt && newPromptName && newPromptContent) {
      updateSystemPrompt(id, {
        name: newPromptName,
        content: newPromptContent
      })
      setEditingId(null)
      setNewPromptName('')
      setNewPromptContent('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">System Prompts</h3>
        <div className="flex items-center gap-4">
          {!isCollapsed && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="glass-panel flex items-center gap-2 px-3 py-1.5 text-white/80 hover:text-white transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              添加 Prompt
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className={`space-y-2 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
      }`}>
        {isAdding && (
          <div className="glass-panel p-4">
            <input
              type="text"
              placeholder="Prompt 名称"
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white"
            />
            <textarea
              placeholder="Prompt 内容"
              value={newPromptContent}
              onChange={(e) => setNewPromptContent(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white h-32"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-white/80 hover:text-white"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md"
              >
                保存
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {systemPrompts.map((prompt) => (
            <div key={prompt.id} className="glass-panel p-4">
              {editingId === prompt.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newPromptName || prompt.name}
                    onChange={(e) => setNewPromptName(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white"
                  />
                  <textarea
                    value={newPromptContent || prompt.content}
                    onChange={(e) => setNewPromptContent(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-md px-3 py-2 text-white h-32"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setNewPromptName('')
                        setNewPromptContent('')
                      }}
                      className="px-3 py-1 text-white/80 hover:text-white"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => handleUpdate(prompt.id)}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md"
                    >
                      更新
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">{prompt.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingId(prompt.id)
                          setNewPromptName(prompt.name)
                          setNewPromptContent(prompt.content)
                        }}
                        className="text-white/80 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeSystemPrompt(prompt.id)}
                        className="text-white/80 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">
                    {prompt.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 