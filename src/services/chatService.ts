
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/database';

export const chatService = {
  // 获取用户的聊天历史记录
  async getChatHistory(): Promise<{ data: ChatMessage[], error: any }> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    return { data: (data as ChatMessage[]) || [], error };
  },

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

    return { data: data as ChatMessage, error };
  },

  // 智能健康助手回复 - 这里可以集成真实的智能API
  async getAIResponse(userMessage: string): Promise<string> {
    // TODO: 这里可以集成真实的智能健康助手API
    // 比如 OpenAI GPT, Google Gemini, 或者自定义的健康智能模型
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    return generateHealthAdvice(userMessage);
  }
};

// 生成健康建议的函数
function generateHealthAdvice(userInput: string): string {
  const input = userInput.toLowerCase();
  
  // 皮肤相关问题
  if (input.includes("皮肤") || input.includes("痘痘") || input.includes("痤疮") || input.includes("诊断") || input.includes("黑色素") || input.includes("色斑")) {
    return `🔍 **皮肤健康分析**

根据您的描述，我为您提供以下专业建议：

**症状评估：**
• 如果发现皮肤斑块快速变化、颜色不均、边缘不规则
• 出现疼痛、渗出或出血症状
• 建议立即进行专业皮肤镜检查

**预防措施：**
• 日常防晒：SPF 30+防晒霜，避免暴晒
• 定期自检：观察痣的ABCD特征变化
• 保持皮肤清洁，使用温和护肤品

**紧急情况：**
如有以下症状请立即就医：
• 皮损快速增大或形状改变
• 出血、溃烂、持续疼痛
• 淋巴结肿大

💡 您也可以使用我们的智能皮肤诊断功能进行初步评估。

⚠️ 此建议仅供参考，请及时咨询皮肤科医生获得专业诊断。`;
  }
  
  // 饮食营养问题
  if (input.includes("饮食") || input.includes("营养") || input.includes("吃什么")) {
    return `🥗 **营养健康指南**

**均衡饮食建议：**
• 蔬果类：每日至少5份不同颜色的蔬菜水果
• 蛋白质：鱼类、瘦肉、豆类、坚果适量摄入
• 全谷物：糙米、燕麦、全麦面包替代精制谷物
• 健康脂肪：橄榄油、鳄梨、深海鱼富含Omega-3

**皮肤友好食物：**
• 富含维生素C：柑橘类、草莓、西兰花
• 富含维生素E：坚果、种子、绿叶蔬菜
• 富含锌：海鲜、瘦肉、南瓜子
• 抗氧化食物：蓝莓、绿茶、西红柿

**避免食物：**
• 高糖食品：可能加重皮肤炎症
• 过度加工食品：含有过多添加剂
• 高脂油炸食品：可能影响皮脂分泌

💧 记得每天饮水 8-10 杯，保持皮肤水分平衡！`;
  }
  
  // 运动锻炼问题
  if (input.includes("运动") || input.includes("锻炼") || input.includes("健身")) {
    return `💪 **运动健康计划**

**运动频率建议：**
• 有氧运动：每周150分钟中等强度或75分钟高强度
• 力量训练：每周2-3次，针对主要肌群
• 柔韧性：每天10-15分钟拉伸运动

**适合的运动类型：**
• 初学者：散步、游泳、瑜伽、太极
• 中级：慢跑、骑车、健身操、攀岩
• 高级：HIIT训练、马拉松、力量举重

**运动与皮肤健康：**
• 运动促进血液循环，改善肌肤光泽
• 出汗帮助清洁毛孔，排出毒素
• 减压效果有助于减少压力性皮肤问题

**注意事项：**
• 运动前后及时清洁皮肤
• 选择透气排汗的运动服装
• 户外运动务必做好防晒保护
• 运动后及时补充水分

🏃‍♀️ 循序渐进，找到适合自己的运动节奏最重要！`;
  }
  
  // 睡眠问题
  if (input.includes("睡眠") || input.includes("失眠") || input.includes("睡不着")) {
    return `😴 **优质睡眠指南**

**理想睡眠模式：**
• 成人：每晚7-9小时深度睡眠
• 就寝时间：建议22:00-23:00之间
• 起床时间：保持规律，即使周末也不宜过度赖床

**改善睡眠质量：**
• 睡前1小时避免使用电子设备
• 创造舒适环境：温度18-22°C，保持黑暗安静
• 建立睡前仪式：洗澡、阅读、冥想
• 避免睡前大餐和咖啡因

**睡眠与皮肤修复：**
• 夜间是皮肤细胞再生的黄金时期
• 深度睡眠促进胶原蛋白生成
• 充足睡眠有助于减少黑眼圈和细纹
• 睡眠不足会导致皮肤暗沉、老化加速

**助眠建议：**
• 规律作息，生物钟调节
• 适度运动，但避免睡前剧烈运动
• 放松技巧：深呼吸、渐进性肌肉放松
• 必要时可考虑褪黑素等天然助眠剂

🌙 良好的睡眠是最好的美容觉！`;
  }
  
  // 心理健康问题
  if (input.includes("压力") || input.includes("焦虑") || input.includes("心情") || input.includes("抑郁")) {
    return `🧠 **心理健康关怀**

**压力管理策略：**
• 识别压力源：工作、人际关系、财务等
• 时间管理：制定优先级，避免过度承诺
• 放松技巧：冥想、瑜伽、深呼吸练习
• 社交支持：与朋友家人分享感受

**心理与皮肤的关系：**
• 压力激素会影响皮脂分泌
• 焦虑可能导致皮肤过敏或湿疹加重
• 抓挠习惯可能因压力而加剧
• 良好心态有助于皮肤自然修复

**自我调节方法：**
• 正念冥想：每日10-15分钟
• 运动释压：有氧运动分泌内啡肽
• 兴趣爱好：绘画、音乐、园艺等
• 充足休息：保证睡眠质量

**专业求助：**
如果感到持续的焦虑、抑郁或压力：
• 考虑咨询心理健康专家
• 认知行为疗法(CBT)效果显著
• 必要时可考虑药物治疗
• 定期心理健康评估

💝 记住，关注心理健康是对自己最好的投资！`;
  }
  
  // 通用健康咨询
  return `🏥 **健康生活指导**

感谢您信任我们的智能健康助手！基于您的咨询，我为您提供以下综合建议：

**日常健康维护：**
• 规律作息：保持稳定的睡眠和饮食时间
• 适度运动：根据体能选择合适的运动方式
• 均衡营养：多样化饮食，注意营养搭配
• 定期体检：预防胜于治疗

**皮肤健康管理：**
• 温和清洁：使用适合肤质的洁面产品
• 保湿防晒：日间护肤的两大要素
• 观察变化：定期检查皮肤状况
• 专业咨询：有问题及时就医

**生活方式建议：**
• 戒烟限酒：对整体健康都有益处
• 压力管理：学会放松和减压
• 社交活动：保持良好的人际关系
• 持续学习：保持大脑活跃

**何时需要就医：**
• 症状持续或加重
• 出现新的异常症状
• 定期健康检查
• 专业医疗建议

🎯 **下一步行动建议：**
1. 如有皮肤问题，可使用我们的智能诊断功能
2. 制定个人健康计划
3. 记录症状日记
4. 必要时预约专科医生

💡 有任何具体问题，随时可以继续咨询我！`;
}
