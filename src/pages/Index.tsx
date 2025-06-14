
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Stethoscope, Brain, Users, Award, Clock } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Dashboard from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">皮肤健康AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">功能特色</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">关于我们</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI驱动的
              <span className="text-blue-600"> 皮肤癌诊断</span>
              平台
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              结合先进的人工智能技术和专业医生复诊，为您提供准确、及时的皮肤健康评估服务
            </p>
            
            {/* Auth Tabs */}
            <div className="max-w-md mx-auto">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">登录</TabsTrigger>
                  <TabsTrigger value="register">注册</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onLogin={handleLogin} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onRegister={handleLogin} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">平台核心功能</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              我们的平台结合了最新的AI技术和专业医疗知识，为用户提供全方位的皮肤健康服务
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>AI智能诊断</CardTitle>
                <CardDescription>
                  基于深度学习的图像识别技术，快速分析皮肤病变
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 高精度图像分析</li>
                  <li>• 多种皮肤病变检测</li>
                  <li>• 即时诊断报告</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>专业医生复诊</CardTitle>
                <CardDescription>
                  认证皮肤科医生进行二次审核，确保诊断准确性
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 资深医生团队</li>
                  <li>• 详细诊断报告</li>
                  <li>• 治疗建议指导</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>个人健康档案</CardTitle>
                <CardDescription>
                  完整记录您的皮肤健康历史，追踪变化趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 诊断历史记录</li>
                  <li>• 健康趋势分析</li>
                  <li>• 随访提醒服务</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">98.5%</div>
              <div className="text-blue-100">诊断准确率</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">服务用户</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">200+</div>
              <div className="text-blue-100">认证医生</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">在线服务</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">皮肤健康AI</span>
              </div>
              <p className="text-gray-400">
                专业的AI皮肤诊断平台，守护您的皮肤健康
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">服务</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI诊断</li>
                <li>医生复诊</li>
                <li>健康档案</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li>帮助中心</li>
                <li>联系我们</li>
                <li>用户指南</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">法律</h3>
              <ul className="space-y-2 text-gray-400">
                <li>隐私政策</li>
                <li>服务条款</li>
                <li>医疗免责声明</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 皮肤健康AI平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
