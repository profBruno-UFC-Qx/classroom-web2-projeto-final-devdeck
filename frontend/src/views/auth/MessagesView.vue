<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

interface User {
  id: number
  name: string
  avatarUrl: string
  headline?: string
}

interface Message {
  id: number
  subject: string
  content: string
  createdAt: string
  read: boolean
  sender: User
  receiver: User
}

const messages = ref<Message[]>([])
const selectedMessage = ref<Message | null>(null)
const isLoading = ref(true)

function getOtherUser(msg: Message) {
  if (msg.sender.id === authStore.user?.id) {
    return { ...msg.receiver, label: 'Para: ' }
  }
  return { ...msg.sender, label: 'De: ' }
}

async function fetchMessages() {
  isLoading.value = true
  try {
    const { data } = await api.get('/messages/inbox')
    const rawData = Array.isArray(data) ? data : []

    messages.value = rawData.map((m: any) => ({
      ...m,
      sender: {
        ...m.sender,
        avatarUrl: m.sender?.avatarUrl || `https://ui-avatars.com/api/?name=${m.sender?.name || 'User'}&background=random`
      },
      receiver: {
        ...m.receiver,
        avatarUrl: m.receiver?.avatarUrl || `https://ui-avatars.com/api/?name=${m.receiver?.name || 'User'}&background=random`
      }
    }))

    if (messages.value.length > 0) {
      selectedMessage.value = messages.value[0] || null
    }
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    isLoading.value = false
  }
}

function selectMessage(msg: Message) {
  selectedMessage.value = msg
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }).format(date)
}

onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <div class="inbox-container">
    
    <aside class="msg-list-panel">
      
      <div class="mini-header">
        <span class="label-inbox">Conversas</span>
        <span class="badge-count" v-if="messages.length">{{ messages.length }}</span>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner-sm"></div>
      </div>

      <div v-else-if="messages.length === 0" class="empty-list">
        <i class="bi bi-inbox"></i>
        <p>Caixa de entrada vazia.</p>
      </div>

      <div v-else class="scroll-list">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          class="msg-item" 
          :class="{ active: selectedMessage?.id === msg.id }"
          @click="selectMessage(msg)"
        >
          <img :src="getOtherUser(msg).avatarUrl" class="sender-avatar" />
          
          <div class="msg-preview-info">
            <div class="msg-row-top">
              <span class="sender-name">{{ getOtherUser(msg).name }}</span>
              <span class="msg-date">{{ formatDate(msg.createdAt) }}</span>
            </div>
            <span class="msg-subject">{{ msg.subject }}</span>
            <p class="msg-excerpt">{{ msg.content }}</p>
          </div>
        </div>
      </div>
    </aside>

    <main class="msg-content-panel">
      
      <div v-if="selectedMessage" class="content-wrapper">
        
        <div class="msg-detail-header">
          <div class="sender-profile">
            <img :src="getOtherUser(selectedMessage).avatarUrl" class="avatar-lg" />
            <div class="meta">
              <h2>{{ selectedMessage.subject }}</h2>
              <div class="sub-meta">
                <span class="direction-badge">{{ getOtherUser(selectedMessage).label }}</span>
                <strong>{{ getOtherUser(selectedMessage).name }}</strong>
                <span class="dot">•</span>
                <span>{{ formatDate(selectedMessage.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="msg-body-scroll">
          <div class="msg-paper">
            {{ selectedMessage.content }}
          </div>
        </div>

      </div>

      <div v-else class="empty-content-placeholder">
        <i class="bi bi-chat-left-text"></i>
        <p>Selecione uma mensagem para ler</p>
      </div>

    </main>

  </div>
</template>

<style scoped>
/* --- CONTAINER GERAL --- */
.inbox-container {
  display: flex; 
  width: 100%; 
  height: 100%;       
  min-height: 0;      
  overflow: hidden;  
  
  background: rgba(0, 0, 0, 0.2); 
  border-radius: 16px; 
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

/* --- COLUNA ESQUERDA --- */
.msg-list-panel {
  width: 350px; 
  display: flex; 
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  min-height: 0; 
}

.mini-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.label-inbox { font-size: 0.85rem; font-weight: 700; color: rgba(255, 255, 255, 0.908); text-transform: uppercase; letter-spacing: 0.5px; }
.badge-count { background: rgba(255, 255, 255, 0.47); color: var(--color-primary); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }

.scroll-list { 
  flex-grow: 1;    
  height: 0;     
  overflow-y: auto; 
  scrollbar-width: none; 
  -ms-overflow-style: none;
}
.scroll-list::-webkit-scrollbar { display: none; }

.msg-item {
  display: flex; gap: 12px; padding: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer; transition: all 0.2s; position: relative;
}
.msg-item:hover { background: rgba(255, 255, 255, 0.05); }
.msg-item.active { background: rgba(139, 92, 246, 0.1); }
.msg-item.active::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: white;
  box-shadow: 0 0 10px var(--color-primary);
}

.sender-avatar { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); background: #222; }
.msg-preview-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.msg-row-top { display: flex; justify-content: space-between; align-items: center; }
.sender-name { font-weight: 700; color: #fff; font-size: 0.95rem; }
.msg-date { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
.msg-subject { color: rgba(255,255,255,0.9); font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.msg-excerpt { color: rgba(255,255,255,0.5); font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* --- COLUNA DIREITA  --- */
.msg-content-panel { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  background: rgba(0, 0, 0, 0.2); 
  height: 100%;
  min-height: 0; 
}
.content-wrapper { display: flex; flex-direction: column; height: 100%; overflow: hidden; }

.msg-detail-header {
  padding: 1.5rem 2.5rem; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.015);
  flex-shrink: 0; 
}

.sender-profile { display: flex; gap: 1rem; align-items: center; }
.avatar-lg { width: 52px; height: 52px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.1); background: #222; }
.meta h2 { margin: 0 0 6px 0; font-size: 1.3rem; color: white; font-weight: 700; }
.sub-meta { color: rgba(255,255,255,0.6); font-size: 0.9rem; display: flex; align-items: center; gap: 8px; }
.direction-badge { font-size: 0.75rem; text-transform: uppercase; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; }
.dot { font-size: 0.4rem; opacity: 0.4; }

.msg-body-scroll { 
  flex-grow: 1;    
  height: 0;       
  overflow-y: auto; 
  padding: 2.5rem;
  scrollbar-width: none; 
  -ms-overflow-style: none;
}
.msg-body-scroll::-webkit-scrollbar { display: none; }

.msg-paper { 
  color: rgba(255, 255, 255, 0.9); 
  font-size: 1.05rem; 
  line-height: 1.8; 
  white-space: pre-wrap; 
  font-family: inherit;
  max-width: 800px;
}

/* Estados */
.loading-state, .empty-list, .empty-content-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; color: rgba(255,255,255,0.4); text-align: center; gap: 1rem;
}
.empty-list i, .empty-content-placeholder i { font-size: 3rem; opacity: 0.2; margin-bottom: 0.5rem; }
.spinner-sm { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 1s infinite linear; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .inbox-container { flex-direction: column; overflow: visible; height: auto; }
  .msg-list-panel { width: 100%; height: 350px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .msg-content-panel { height: 500px; }
}
</style>