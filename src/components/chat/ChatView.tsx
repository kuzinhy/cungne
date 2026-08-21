import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Image as ImageIcon, 
  Search, 
  MoreVertical, 
  CheckCheck, 
  Smile, 
  User, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Conversation, Message, UserProfile } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { 
  subscribeToConversations, 
  subscribeToMessages, 
  sendMessage, 
  createOrGetConversation 
} from "../../services/chat.service";
import { uploadMedia } from "../../services/auth.service";
import { SUGGESTED_USERS } from "../../data/seedData";
import { useToast } from "../../contexts/ToastContext";

interface ChatViewProps {
  onOpenAuth: () => void;
  onNavigate: (view: string, param?: any) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onOpenAuth, onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load conversations list
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToConversations(currentUser.uid, (convList) => {
      setConversations(convList);
      if (!activeConversation && convList.length > 0) {
        setActiveConversation(convList[0]);
      }
    });
    return () => unsub();
  }, [currentUser]);

  // Load active messages
  useEffect(() => {
    if (!activeConversation) return;
    const unsub = subscribeToMessages(activeConversation.id, (msgList) => {
      setMessages(msgList);
    });
    return () => unsub();
  }, [activeConversation]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentUser || !userProfile) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Nhắn tin cùng bạn bè
        </h2>
        <p className="text-xs text-slate-500">
          Đăng nhập ngay để bắt đầu trò chuyện realtime và chia sẻ cùng mọi người.
        </p>
        <button
          onClick={onOpenAuth}
          className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const textToSend = messageText.trim();
    setMessageText("");
    setSending(true);

    try {
      await sendMessage(activeConversation.id, userProfile.uid, textToSend);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeConversation) return;

    try {
      const file = files[0];
      const url = await uploadMedia(file, `chat/${activeConversation.id}/${Date.now()}_${file.name}`);
      await sendMessage(activeConversation.id, userProfile.uid, "Đã gửi một hình ảnh", [url]);
    } catch (err) {
      showToast("Không thể gửi ảnh.", "error");
    }
  };

  const startNewChat = async (targetUser: any) => {
    try {
      const conv = await createOrGetConversation(
        userProfile.uid,
        targetUser.uid,
        userProfile.displayName,
        targetUser.displayName,
        userProfile.avatar,
        targetUser.avatar
      );
      setActiveConversation(conv);
      setShowNewChatModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const getOtherParticipantName = (conv: Conversation) => {
    const otherId = conv.participants.find(id => id !== userProfile.uid);
    return (otherId && conv.participantNames?.[otherId]) || "Người dùng CùngNè";
  };

  const getOtherParticipantAvatar = (conv: Conversation) => {
    const otherId = conv.participants.find(id => id !== userProfile.uid);
    return (otherId && conv.participantAvatars?.[otherId]) || "https://api.dicebear.com/7.x/bottts/svg?seed=cungne";
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6.5rem)] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex overflow-hidden">
      
      {/* Left Pane: Conversations List */}
      <div className="w-80 shrink-0 border-r border-slate-200/80 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
        
        {/* Search & Header */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Đoạn chat
            </h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors"
            >
              + Tin mới
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Chưa có cuộc trò chuyện nào. Bấm '+ Tin mới' để bắt đầu!
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = activeConversation?.id === conv.id;
              const name = getOtherParticipantName(conv);
              const avatar = getOtherParticipantAvatar(conv);

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/50"
                      : "hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 bg-indigo-50"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {conv.lastMessage || "Bắt đầu cuộc trò chuyện..."}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat Room */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
          
          {/* Chat Header */}
          <div className="p-3.5 px-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={getOtherParticipantAvatar(activeConversation)}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {getOtherParticipantName(activeConversation)}
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Đang hoạt động</span>
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400">
                  Hãy gửi lời chào đầu tiên để làm quen nhé! 👋
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === userProfile.uid;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-xs shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs"
                      }`}
                    >
                      {msg.images && msg.images.length > 0 && (
                        <div className="mb-2 rounded-xl overflow-hidden">
                          {msg.images.map((img, i) => (
                            <img key={i} src={img} alt="" className="w-full max-h-48 object-cover" />
                          ))}
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadImage}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Gửi hình ảnh"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
            />

            <button
              type="submit"
              disabled={sending || !messageText.trim()}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 mb-2 stroke-1" />
          <p className="text-sm font-semibold">Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Bắt đầu trò chuyện mới
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Chọn người dùng để kết nối và nhắn tin:
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {SUGGESTED_USERS.map((user) => (
                <button
                  key={user.uid}
                  onClick={() => startNewChat(user)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{user.displayName}</div>
                    <div className="text-[11px] text-slate-400">@{user.username}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
