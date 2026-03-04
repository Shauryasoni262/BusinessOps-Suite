'use client';

import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';
import { ChatStats } from '@/types/admin';
import { MessageCircle, Hash } from 'lucide-react';
import styles from './chat.module.css';

export default function AdminChatPage() {
  const [data, setData] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setData(await adminService.getChatStats()); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className={styles.loading}>Loading chat data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chat Monitor</h1>
        <p className={styles.subtitle}>Platform messaging overview</p>
      </div>

      <div className={styles.kpiRow}>
        <div className={styles.kpi}>
          <div className={styles.kpiTop}><span className={styles.kpiLabel}>Messages</span><div className={styles.kpiIcon}><MessageCircle size={14} color="#3b82f6" /></div></div>
          <div className={styles.kpiVal}>{data?.totalMessages.toLocaleString()}</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.kpiTop}><span className={styles.kpiLabel}>Rooms</span><div className={styles.kpiIcon}><Hash size={14} color="#8b5cf6" /></div></div>
          <div className={styles.kpiVal}>{data?.totalRooms}</div>
        </div>
      </div>

      {data?.rooms && data.rooms.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Active Rooms</h3>
          <div className={styles.roomList}>
            {data.rooms.map((room, i) => (
              <div key={i} className={styles.roomChip}><Hash size={11} /> {room}</div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Messages</h3>
        <div className={styles.messageList}>
          {data?.recentMessages && data.recentMessages.length > 0 ? (
            data.recentMessages.map(msg => (
              <div key={msg.id} className={styles.msgRow}>
                <div className={styles.msgAvatar}>{msg.username?.charAt(0).toUpperCase()}</div>
                <div className={styles.msgContent}>
                  <div className={styles.msgMeta}>
                    <span className={styles.msgUser}>{msg.username}</span>
                    <span className={styles.msgRoom}># {msg.room}</span>
                    <span className={styles.msgTime}>{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                  </div>
                  <div className={styles.msgText}>{msg.message}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>No messages recorded</div>
          )}
        </div>
      </div>
    </div>
  );
}
