
import { useState } from "react";
import { useDoctorStats } from "@/hooks/useDoctorStats";
import { usePatientStats } from "@/hooks/usePatientStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  LogOut, 
  Upload, 
  History, 
  Users, 
  Settings, 
  Bell,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageCircle
} from "lucide-react";
import DiagnosisUpload from "./DiagnosisUpload";
import DiagnosisHistory from "./DiagnosisHistory";
import DoctorReview from "./DoctorReview";
import HealthAssistant from "./HealthAssistant";
import PatientManagement from "./PatientManagement";

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("upload");
  const doctorStats = useDoctorStats();
  const patientStats = usePatientStats();

  const isDoctor = profile?.role === "doctor";

  const handleLogout = async () => {
    await signOut();
  };

  if (!profile) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">皮肤辅助诊断平台</h1>
            <Badge variant={isDoctor ? "default" : "secondary"}>
              {isDoctor ? "医生" : "患者"}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{profile.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isDoctor ? "待审核诊断" : "上传诊断"}
            </Button>
            <Button
              variant={activeTab === "history" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("history")}
            >
              <History className="w-4 h-4 mr-2" />
              {isDoctor ? "审核历史" : "诊断历史"}
            </Button>
            {!isDoctor && (
              <Button
                variant={activeTab === "assistant" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("assistant")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                健康助手
              </Button>
            )}
            {isDoctor && (
              <Button
                variant={activeTab === "patients" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("patients")}
              >
                <Users className="w-4 h-4 mr-2" />
                患者管理
              </Button>
            )}
            <Button
              variant={activeTab === "settings" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "待审核" : "总诊断数"}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isDoctor 
                      ? (doctorStats.isLoading ? "..." : doctorStats.pendingCount)
                      : (patientStats.isLoading ? "..." : patientStats.totalDiagnoses)
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "需要您审核的病例" : "您的诊断记录"}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "本月审核" : "本月诊断"}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isDoctor 
                      ? (doctorStats.isLoading ? "..." : doctorStats.monthlyReviewed)
                      : (patientStats.isLoading ? "..." : patientStats.monthlyDiagnoses)
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    本月统计数据
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "准确率" : "已确认"}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isDoctor 
                      ? (doctorStats.isLoading ? "..." : `${doctorStats.accuracy}%`)
                      : (patientStats.isLoading ? "..." : patientStats.confirmedDiagnoses)
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "智能诊断准确率" : "医生已确认"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isDoctor ? "响应时间" : "待复诊"}
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isDoctor 
                      ? (doctorStats.isLoading ? "..." : `${doctorStats.avgResponseTime}h`)
                      : (patientStats.isLoading ? "..." : patientStats.pendingDiagnoses)
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isDoctor ? "平均响应时间" : "等待医生确认"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tab Content */}
            {activeTab === "upload" && (
              isDoctor ? <DoctorReview /> : <DiagnosisUpload />
            )}
            {activeTab === "history" && <DiagnosisHistory isDoctor={isDoctor} />}
            {activeTab === "assistant" && !isDoctor && <HealthAssistant />}
            {activeTab === "patients" && isDoctor && <PatientManagement />}
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>账户设置</CardTitle>
                  <CardDescription>管理您的账户偏好</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">设置功能开发中...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
