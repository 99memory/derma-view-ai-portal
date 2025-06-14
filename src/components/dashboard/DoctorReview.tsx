
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  User,
  Calendar,
  Brain,
  Stethoscope
} from "lucide-react";

const DoctorReview = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 模拟待审核病例
  const pendingCases = [
    {
      id: 1,
      patientName: "张三",
      patientAge: 35,
      submitDate: "2024-01-15 14:30",
      aiDiagnosis: "良性色素痣",
      aiConfidence: 92.5,
      riskLevel: "低风险",
      symptoms: "无明显症状，发现色素斑块约2个月",
      images: [
        "/api/placeholder/300/300",
        "/api/placeholder/300/300"
      ],
      urgency: "normal"
    },
    {
      id: 2,
      patientName: "李四",
      patientAge: 52,
      submitDate: "2024-01-15 16:45",
      aiDiagnosis: "基底细胞癌可能",
      aiConfidence: 78.3,
      riskLevel: "高风险",
      symptoms: "皮损逐渐增大，偶有出血，持续3个月",
      images: [
        "/api/placeholder/300/300"
      ],
      urgency: "high"
    },
    {
      id: 3,
      patientName: "王五",
      patientAge: 28,
      submitDate: "2024-01-15 10:15",
      aiDiagnosis: "脂溢性皮炎",
      aiConfidence: 89.7,
      riskLevel: "低风险",
      symptoms: "轻微瘙痒，皮肤油腻，反复发作",
      images: [
        "/api/placeholder/300/300"
      ],
      urgency: "low"
    }
  ];

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">紧急</Badge>;
      case "normal":
        return <Badge className="bg-yellow-100 text-yellow-800">普通</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">非紧急</Badge>;
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
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

  const handleCaseSelect = (caseItem) => {
    setSelectedCase(caseItem);
    setReviewNotes("");
    setFinalDiagnosis(caseItem.aiDiagnosis);
  };

  const handleSubmitReview = async (decision) => {
    if (!reviewNotes.trim()) {
      toast({
        title: "请填写审核意见",
        description: "请在审核意见中详细说明您的诊断和建议",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // 模拟提交过程
    setTimeout(() => {
      toast({
        title: "审核完成",
        description: `已${decision === 'confirm' ? '确认' : '修正'}诊断，患者将收到通知`,
      });

      setSelectedCase(null);
      setReviewNotes("");
      setFinalDiagnosis("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Cases List */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              待审核病例
            </CardTitle>
            <CardDescription>
              共 {pendingCases.length} 个病例待审核
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {pendingCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                    selectedCase?.id === caseItem.id 
                      ? 'bg-blue-50 border-l-blue-500' 
                      : caseItem.urgency === 'high' 
                        ? 'border-l-red-500' 
                        : 'border-l-transparent'
                  }`}
                  onClick={() => handleCaseSelect(caseItem)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{caseItem.patientName}</span>
                      <span className="text-sm text-gray-500">({caseItem.patientAge}岁)</span>
                    </div>
                    {getUrgencyBadge(caseItem.urgency)}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      {caseItem.submitDate}
                    </div>
                    <div className="font-medium">{caseItem.aiDiagnosis}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">AI置信度: {caseItem.aiConfidence}%</span>
                      {getRiskBadge(caseItem.riskLevel)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Case Details */}
      <div className="lg:col-span-2">
        {selectedCase ? (
          <div className="space-y-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    患者信息
                  </span>
                  {getUrgencyBadge(selectedCase.urgency)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div><strong>姓名:</strong> {selectedCase.patientName}</div>
                    <div><strong>年龄:</strong> {selectedCase.patientAge}岁</div>
                    <div><strong>提交时间:</strong> {selectedCase.submitDate}</div>
                  </div>
                  <div className="space-y-2">
                    <div><strong>症状描述:</strong></div>
                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedCase.symptoms}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI分析结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div><strong>AI诊断:</strong> {selectedCase.aiDiagnosis}</div>
                    <div><strong>置信度:</strong> {selectedCase.aiConfidence}%</div>
                    <div className="flex items-center space-x-2">
                      <strong>风险等级:</strong>
                      {getRiskBadge(selectedCase.riskLevel)}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h4 className="font-medium mb-3">皮肤图像</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCase.images.map((image, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`皮肤图像 ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Review */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  医生审核
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">最终诊断</label>
                  <Select value={finalDiagnosis} onValueChange={setFinalDiagnosis}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={selectedCase.aiDiagnosis}>确认AI诊断: {selectedCase.aiDiagnosis}</SelectItem>
                      <SelectItem value="良性色素痣">良性色素痣</SelectItem>
                      <SelectItem value="脂溢性角化病">脂溢性角化病</SelectItem>
                      <SelectItem value="基底细胞癌">基底细胞癌</SelectItem>
                      <SelectItem value="鳞状细胞癌">鳞状细胞癌</SelectItem>
                      <SelectItem value="黑色素瘤">黑色素瘤</SelectItem>
                      <SelectItem value="需要进一步检查">需要进一步检查</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">审核意见和建议 *</label>
                  <Textarea
                    placeholder="请详细描述您的诊断意见、治疗建议和后续随访安排..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={() => handleSubmitReview('confirm')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isSubmitting ? "提交中..." : "确认诊断"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleSubmitReview('modify')}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    修正诊断
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">选择病例进行审核</h3>
                <p className="text-gray-500">请从左侧列表中选择一个待审核的病例</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorReview;
