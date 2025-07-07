
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { diagnosisService } from "@/services/diagnosisService";
import { DiagnosisRecord } from "@/types/database";
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
  const [selectedCase, setSelectedCase] = useState<DiagnosisRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [finalDiagnosis, setFinalDiagnosis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingCases, setPendingCases] = useState<DiagnosisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingCases();
  }, []);

  const loadPendingCases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await diagnosisService.getPendingDiagnoses();
      if (error) {
        console.error('获取待审核病例失败:', error);
        toast({
          title: "获取数据失败",
          description: "无法加载待审核病例，请刷新页面重试",
          variant: "destructive"
        });
      } else {
        setPendingCases(data);
      }
    } catch (error) {
      console.error('获取待审核病例失败:', error);
      toast({
        title: "获取数据失败",
        description: "无法加载待审核病例，请刷新页面重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "高风险":
        return <Badge className="bg-red-100 text-red-800">紧急</Badge>;
      case "中风险":
        return <Badge className="bg-yellow-100 text-yellow-800">普通</Badge>;
      case "低风险":
        return <Badge className="bg-green-100 text-green-800">非紧急</Badge>;
      default:
        return <Badge variant="secondary">普通</Badge>;
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

  const handleCaseSelect = (caseItem: DiagnosisRecord) => {
    setSelectedCase(caseItem);
    setReviewNotes("");
    setFinalDiagnosis(caseItem.ai_diagnosis || "");
  };

  const handleSubmitReview = async (decision: 'confirm' | 'modify') => {
    if (!reviewNotes.trim()) {
      toast({
        title: "请填写审核意见",
        description: "请在审核意见中详细说明您的诊断和建议",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCase) return;

    setIsSubmitting(true);

    try {
      const { error } = await diagnosisService.updateDiagnosis(selectedCase.id, {
        doctor_diagnosis: finalDiagnosis,
        doctor_notes: reviewNotes,
        status: 'reviewed'
      });

      if (error) {
        toast({
          title: "提交失败",
          description: "审核提交失败，请重试",
          variant: "destructive"
        });
      } else {
        toast({
          title: "审核完成",
          description: `已${decision === 'confirm' ? '确认' : '修正'}诊断，患者将收到通知`,
        });

        setSelectedCase(null);
        setReviewNotes("");
        setFinalDiagnosis("");
        loadPendingCases(); // 重新加载列表
      }
    } catch (error) {
      console.error('提交审核失败:', error);
      toast({
        title: "提交失败",
        description: "审核提交失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">加载中...</div>
            ) : pendingCases.length === 0 ? (
              <div className="p-4 text-center text-gray-500">暂无待审核病例</div>
            ) : (
              <div className="space-y-1">
                {pendingCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-l-4 ${
                      selectedCase?.id === caseItem.id 
                        ? 'bg-blue-50 border-l-blue-500' 
                        : caseItem.risk_level === '高风险' 
                          ? 'border-l-red-500' 
                          : 'border-l-transparent'
                    }`}
                    onClick={() => handleCaseSelect(caseItem)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{(caseItem as any).profiles?.name || '患者'}</span>
                      </div>
                      {getUrgencyBadge(caseItem.risk_level || '低风险')}
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(caseItem.created_at).toLocaleString('zh-CN')}
                      </div>
                      <div className="font-medium">{caseItem.ai_diagnosis || '待分析'}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">AI置信度: {caseItem.ai_confidence?.toFixed(1) || 0}%</span>
                        {getRiskBadge(caseItem.risk_level || '低风险')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  {getUrgencyBadge(selectedCase.risk_level || '低风险')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div><strong>姓名:</strong> {(selectedCase as any).profiles?.name || '患者'}</div>
                    <div><strong>提交时间:</strong> {new Date(selectedCase.created_at).toLocaleString('zh-CN')}</div>
                  </div>
                  <div className="space-y-2">
                    <div><strong>症状描述:</strong></div>
                    <div className="text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedCase.symptoms || '无症状描述'}
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
                    <div><strong>AI诊断:</strong> {selectedCase.ai_diagnosis || '待分析'}</div>
                    <div><strong>置信度:</strong> {selectedCase.ai_confidence?.toFixed(1) || 0}%</div>
                    <div className="flex items-center space-x-2">
                      <strong>风险等级:</strong>
                      {getRiskBadge(selectedCase.risk_level || '低风险')}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h4 className="font-medium mb-3">皮肤图像</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCase.image_urls.map((image, index) => (
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
                      <SelectItem value={selectedCase.ai_diagnosis || ''}>确认AI诊断: {selectedCase.ai_diagnosis || '待分析'}</SelectItem>
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
