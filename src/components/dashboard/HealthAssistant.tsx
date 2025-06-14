
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Heart } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const HealthAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "您好！我是您的AI健康助手。我可以为您提供健康咨询、生活建议和基本的医疗信息。请注意，我的建议仅供参考，不能替代专业医疗诊断。有什么可以帮助您的吗？",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("皮肤") || input.includes("痘痘") || input.includes("痤疮")) {
      return "关于皮肤问题，建议您：\n\n1. 保持面部清洁，每天用温和的洁面产品清洗\n2. 避免用手触摸脸部\n3. 保持充足的睡眠和均衡饮食\n4. 如果症状持续或加重，建议咨询专业皮肤科医生\n\n您也可以通过我们的AI诊断功能上传皮肤照片进行初步评估。";
    }
    
    if (input.includes("饮食") || input.includes("营养")) {
      return "健康饮食建议：\n\n1. 多吃新鲜蔬菜和水果\n2. 选择全谷物食品\n3. 适量摄入优质蛋白质\n4. 限制加工食品和高糖食品\n5. 每天饮用足够的水\n\n均衡的饮食对皮肤健康也很重要哦！";
    }
    
    if (input.includes("运动") || input.includes("锻炼")) {
      return "适度运动对健康很重要：\n\n1. 每周至少150分钟中等强度运动\n2. 可以选择散步、游泳、瑜伽等\n3. 运动后及时清洁皮肤\n4. 选择透气的运动服装\n\n运动能促进血液循环，对皮肤健康也有益处！";
    }
    
    if (input.includes("睡眠") || input.includes("失眠")) {
      return "良好的睡眠对健康至关重要：\n\n1. 每晚保证7-9小时睡眠\n2. 建立规律的作息时间\n3. 睡前避免使用电子设备\n4. 保持卧室环境舒适\n\n充足的睡眠有助于皮肤修复和再生。";
    }
    
    return "感谢您的咨询。作为AI健康助手，我建议您：\n\n1. 保持健康的生活方式\n2. 定期进行健康检查\n3. 如有具体症状，及时咨询专业医生\n4. 可以使用我们的AI诊断功能进行初步评估\n\n还有其他问题吗？我很乐意为您提供更多建议。";
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
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI健康助手
              <Badge variant="secondary" className="text-xs">在线</Badge>
            </CardTitle>
            <CardDescription>
              为您提供健康咨询和生活建议
            </CardDescription>
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
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-white" />
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
                <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
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
          <p className="text-xs text-gray-500 mt-2">
            AI助手的建议仅供参考，不能替代专业医疗建议
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthAssistant;
