
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/database';

export const chatService = {
  // 保存聊天消息
  async saveChatMessage(message: string, response: string): Promise<{ data: ChatMessage | null, error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('未登录');

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.user.id,
        message,
        response
      })
      .select()
      .single();

    return { data, error };
  },

  // 获取用户的聊天历史
  async getChatHistory(): Promise<{ data: ChatMessage[], error: any }> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    return { data: data || [], error };
  }
};
