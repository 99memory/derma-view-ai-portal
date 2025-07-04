
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { diagnosisService } from "@/services/diagnosisService";
import { DiagnosisRecord } from "@/types/database";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Search, 
  Eye, 
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";

const DiagnosisHistory = ({ isDoctor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [historyRecords, setHistoryRecords] = useState<DiagnosisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: records } = await diagnosisService.getUserDiagnoses();
        setHistoryRecords(records);
      } catch (error) {
        console.error("获取诊断历史失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "待复诊";
      case "reviewed": return "已确认";
      case "completed": return "已完成";
      default: return status;
    }
  };

  const getRiskText = (riskLevel: string) => {
    switch (riskLevel) {
      case "低风险": return "低风险";
      case "中风险": return "中风险";
      case "高风险": return "高风险";
      default: return riskLevel || "未知";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusText = getStatusText(status);
    switch (status) {
      case "reviewed":
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />{statusText}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />{statusText}</Badge>;
      default:
        return <Badge variant="secondary">{statusText}</Badge>;
    }
  };

  const getRiskBadge = (level: string) => {
    const riskText = getRiskText(level);
    switch (level) {
      case "低风险":
        return <Badge className="bg-green-100 text-green-800">{riskText}</Badge>;
      case "中风险":
        return <Badge className="bg-yellow-100 text-yellow-800">{riskText}</Badge>;
      case "高风险":
        return <Badge className="bg-red-100 text-red-800">{riskText}</Badge>;
      default:
        return <Badge variant="secondary">{riskText}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isDoctor ? "诊断审核历史" : "我的诊断历史"}
          </CardTitle>
          <CardDescription>
            {isDoctor ? "查看您审核过的所有病例" : "查看您的所有诊断记录"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={isDoctor ? "搜索患者姓名或诊断..." : "搜索诊断记录..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              筛选日期
            </Button>
          </div>

          {/* History List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyRecords.map((record) => (
                <Card key={record.id} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-lg">{record.ai_diagnosis || "AI诊断中"}</h3>
                          {getStatusBadge(record.status)}
                          {getRiskBadge(record.risk_level || "")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(record.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div>
                            <span className="text-gray-600">AI置信度:</span>
                            <span className="ml-2 font-medium">{record.ai_confidence ? record.ai_confidence.toFixed(1) + '%' : '待分析'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">图片数量:</span>
                            <span className="ml-2">{record.image_urls?.length || 0} 张</span>
                          </div>
                          {record.symptoms && (
                            <div>
                              <span className="text-gray-600">症状:</span>
                              <span className="ml-2">{record.symptoms}</span>
                            </div>
                          )}
                        </div>
                        
                        {record.doctor_notes && record.doctor_notes.trim() !== '' && (
                          <div className="space-y-2">
                            <div className="text-gray-600">医生备注:</div>
                            <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                              {record.doctor_notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // TODO: 实现查看详情功能
                          toast({
                            title: "查看详情",
                            description: "详情页面开发中，敬请期待",
                          });
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        查看详情
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        下载报告
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && historyRecords.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无记录</h3>
              <p className="text-gray-500">
                {isDoctor ? "您还没有审核过任何病例" : "您还没有进行过诊断"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisHistory;
