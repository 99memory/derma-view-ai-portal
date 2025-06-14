
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Shield, 
  Brain, 
  Users,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">皮肤健康AI</h1>
          </div>
          <Link to="/auth">
            <Button>
              开始使用
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <Badge className="mb-4" variant="secondary">
          AI驱动的皮肤健康诊断
        </Badge>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          智能诊断，守护您的
          <span className="text-blue-600">皮肤健康</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          运用先进的人工智能技术，为您提供快速、准确的皮肤病变初步筛查，
          并有专业医生进行二次确认，确保诊断的可靠性。
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="px-8">
              立即体验
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8">
            了解更多
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们？</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            我们结合最新的AI技术和专业医疗知识，为您提供可靠的皮肤健康服务
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI智能分析</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                采用深度学习算法，能够识别多种皮肤病变类型，
                提供快速的初步诊断结果和置信度评估。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>专业医生审核</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                所有AI诊断结果都会经过专业皮肤科医生的二次审核，
                确保诊断的准确性和可靠性。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>隐私保护</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                严格遵循医疗数据保护标准，您的个人信息和医疗数据
                都会得到最高级别的安全保护。
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                及早发现，及时治疗
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">快速筛查</h3>
                    <p className="text-gray-600">几分钟内获得初步诊断结果</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">专业可靠</h3>
                    <p className="text-gray-600">医生审核确保诊断准确性</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">便捷易用</h3>
                    <p className="text-gray-600">随时随地进行皮肤健康检查</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold">健康指导</h3>
                    <p className="text-gray-600">AI健康助手提供个性化建议</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">98.5%</div>
                <div className="text-gray-600 mb-6">AI诊断准确率</div>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  "专业可靠的皮肤健康服务，让我及时发现了问题"
                </p>
                <p className="text-sm text-gray-500 mt-2">- 用户评价</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl">开始您的健康之旅</CardTitle>
            <CardDescription className="text-blue-100">
              立即注册，体验AI驱动的皮肤健康诊断服务
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8">
                免费注册
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">皮肤健康AI平台</span>
          </div>
          <p className="text-gray-400">
            © 2024 皮肤健康AI平台. 保留所有权利.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
