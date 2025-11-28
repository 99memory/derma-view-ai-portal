
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { chatService } from "@/services/chatService";
import { ChatMessage } from "@/types/database";
import { Send, Bot, User, History, Trash2 } from "lucide-react";
import healthAssistantAvatar from "@/assets/health-assistant-avatar.jpg";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const HealthAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 加载聊天历史记录
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data: chatHistory, error } = await chatService.getChatHistory();
      
      if (error) {
        console.error('加载聊天历史失败:', error);
        // 如果没有历史记录，显示欢迎消息
        setWelcomeMessage();
        return;
      }

      if (chatHistory && chatHistory.length > 0) {
        // 转换聊天历史为消息格式
        const convertedMessages: Message[] = [];
        chatHistory.forEach((chat) => {
          // 添加用户消息
          convertedMessages.push({
            id: `user-${chat.id}`,
            content: chat.message,
            role: "user",
            timestamp: new Date(chat.created_at)
          });
          // 添加助手回复
          convertedMessages.push({
            id: `assistant-${chat.id}`,
            content: chat.response,
            role: "assistant", 
            timestamp: new Date(chat.created_at)
          });
        });
        setMessages(convertedMessages);
      } else {
        setWelcomeMessage();
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error);
      setWelcomeMessage();
    }
  };

  const setWelcomeMessage = () => {
    setMessages([{
      id: "welcome",
      content: "您好！我是您的智能健康助手小助 🏥\n\n我可以为您提供：\n• 健康咨询和生活建议\n• 皮肤问题初步评估\n• 营养和运动指导\n• 心理健康支持\n\n请注意，我的建议仅供参考，不能替代专业医疗诊断。有什么可以帮助您的吗？",
      role: "assistant",
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // 调用智能服务获取回复
      const aiResponse = await chatService.getAIResponse(currentMessage);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: aiResponse,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 保存到数据库
      const { error } = await chatService.saveChatMessage(currentMessage, aiResponse);
      if (error) {
        console.error('保存聊天记录失败:', error);
        toast({
          title: "保存失败",
          description: "聊天记录保存失败，但对话可以继续",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('获取智能回复失败:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "抱歉，我现在无法回复您的问题。请稍后再试，或者联系技术支持。",
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "连接失败",
        description: "无法连接到智能服务，请检查网络连接",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    setWelcomeMessage();
    toast({
      title: "聊天记录已清空",
      description: "本次会话的聊天记录已清空，历史记录仍保存在数据库中"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={healthAssistantAvatar} alt="智能健康助手" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                助
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                智能健康助手小助
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">在线</Badge>
              </CardTitle>
              <CardDescription>
                为您提供专业健康咨询和生活建议
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1"
            >
              <History className="w-4 h-4" />
              历史
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChatHistory}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              清空
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={healthAssistantAvatar} alt="智能健康助手" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>
                
                {message.role === "user" && (
                  <Avatar className="w-8 h-8 bg-blue-600">
                    <AvatarFallback>
                      <User className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={healthAssistantAvatar} alt="智能健康助手" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">智能助手正在思考...</div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入您的健康问题..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
            <span>智能助手的建议仅供参考，不能替代专业医疗建议</span>
            <span className="text-xs text-gray-400">
              {messages.filter(m => m.role === "user").length} 条对话
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthAssistant;
