import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  Send, 
  Phone, 
  Search, 
  ArrowLeft,
  Clock,
  Check,
  CheckCheck
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { Message } from '@/lib/types'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

interface MessageThread {
  id: string
  participantId: string
  participantName: string
  participantRole: 'tenant' | 'landlord'
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  propertyTitle?: string
}

interface MessagesScreenProps {
  onBack?: () => void
}

export function MessagesScreen({ onBack }: MessagesScreenProps) {
  const [threads, setThreads] = useKV<MessageThread[]>('message_threads', [])
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredThreads = threads.filter(thread =>
    thread.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedThread) {
    return (
      <ChatView 
        threadId={selectedThread}
        onBack={() => setSelectedThread(null)}
      />
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center space-x-4 mb-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft size={16} />
            </Button>
          )}
          <h1 className="text-xl font-semibold flex-1">Messages</h1>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {filteredThreads.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg font-medium">No conversations yet</p>
              <p className="text-sm">Start messaging landlords about properties</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-2 p-4">
              {filteredThreads.map((thread) => (
                <Card 
                  key={thread.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {thread.participantName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium truncate">
                              {thread.participantName}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                            >
                              {thread.participantRole}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              {thread.lastMessageTime}
                            </span>
                            {thread.unreadCount > 0 && (
                              <Badge 
                                variant="default" 
                                className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                              >
                                {thread.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {thread.propertyTitle && (
                          <p className="text-xs text-muted-foreground mb-1">
                            Re: {thread.propertyTitle}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {thread.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}

interface ChatViewProps {
  threadId: string
  onBack: () => void
}

function ChatView({ threadId, onBack }: ChatViewProps) {
  const [messages, setMessages] = useKV<Message[]>(`messages_${threadId}`, [])
  const [newMessage, setNewMessage] = useState('')
  const [threads] = useKV<MessageThread[]>('message_threads', [])
  const { user } = useAuth()

  const thread = threads.find(t => t.id === threadId)
  
  const sendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: thread?.participantId || '',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text'
    }

    setMessages((current) => [...current, message])
    setNewMessage('')
    toast.success('Message sent')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          
          <Avatar>
            <AvatarFallback>
              {thread?.participantName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="font-medium">{thread?.participantName}</h2>
            <p className="text-sm text-muted-foreground">
              {thread?.participantRole === 'landlord' ? 'Property Owner' : 'Tenant'}
            </p>
          </div>
          
          <Button variant="outline" size="sm">
            <Phone size={16} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.senderId === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                    message.senderId === user?.id
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Clock size={10} />
                  <span>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {message.senderId === user?.id && (
                    message.read ? <CheckCheck size={12} /> : <Check size={12} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card">
        <div className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}