
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // 模拟历史数据
  const mockHistory = [
    {
      id: 1,
      date: "2024-01-15",
      patientName: isDoctor ? "张三" : null,
      diagnosis: "良性色素痣",
      aiConfidence: 92.5,
      status: "已确认",
      riskLevel: "低风险",
      doctorNotes: "建议定期观察，6个月后复查",
      images: 1
    },
    {
      id: 2,
      date: "2024-01-10", 
      patientName: isDoctor ? "李四" : null,
      diagnosis: "脂溢性角化病",
      aiConfidence: 88.3,
      status: "待复诊",
      riskLevel: "低风险",
      doctorNotes: "",
      images: 2
    },
    {
      id: 3,
      date: "2024-01-05",
      patientName: isDoctor ? "王五" : null,
      diagnosis: "基底细胞癌可能",
      aiConfidence: 76.8,
      status: "需要进一步检查",
      riskLevel: "高风险",
      doctorNotes: "建议立即到皮肤科就诊，进行活检确诊",
      images: 3
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "已确认":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />已确认</Badge>;
      case "待复诊":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />待复诊</Badge>;
      case "需要进一步检查":
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />需检查</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case "低风险":
        return <Badge className="bg-green-100 text-green-800">低风险</Badge>;
      case "中风险":
        return <Badge className="bg-yellow-100 text-yellow-800">中风险</Badge>;
      case "高风险":
        return <Badge className="bg-red-100 text-red-800">高风险</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
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
          <div className="space-y-4">
            {mockHistory.map((record) => (
              <Card key={record.id} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-medium text-lg">{record.diagnosis}</h3>
                          {getStatusBadge(record.status)}
                          {getRiskBadge(record.riskLevel)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.date}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          {isDoctor && (
                            <div>
                              <span className="text-gray-600">患者:</span>
                              <span className="ml-2 font-medium">{record.patientName}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-600">AI置信度:</span>
                            <span className="ml-2 font-medium">{record.aiConfidence}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">图片数量:</span>
                            <span className="ml-2">{record.images} 张</span>
                          </div>
                        </div>
                        
                        {record.doctorNotes && (
                          <div className="space-y-2">
                            <div className="text-gray-600">医生备注:</div>
                            <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                              {record.doctorNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
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

          {/* Empty State */}
          {mockHistory.length === 0 && (
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
