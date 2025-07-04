
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { diagnosisService } from "@/services/diagnosisService";
import { 
  Upload, 
  Camera, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Brain,
  Clock
} from "lucide-react";

const DiagnosisUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedFile) {
      toast({
        title: "请选择图片",
        description: "请先上传一张皮肤图片进行分析",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    // 模拟AI分析过程
    const steps = [
      { progress: 20, message: "图像预处理中..." },
      { progress: 40, message: "特征提取中..." },
      { progress: 60, message: "AI模型分析中..." },
      { progress: 80, message: "结果生成中..." },
      { progress: 100, message: "分析完成" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    // 模拟分析结果
    const mockResult = {
      diagnosis: "良性色素痣",
      confidence: 92.5,
      riskLevel: "低风险",
      riskColor: "green",
      details: [
        "图像质量良好，病变边界清晰",
        "色素分布均匀，无明显不对称",
        "病变直径约3mm，在正常范围内",
        "表面平滑，无溃疡或出血征象"
      ],
      recommendations: [
        "建议定期观察，如有变化及时就医",
        "避免长时间阳光暴晒",
        "保持皮肤清洁和滋润",
        "建议6个月后复查"
      ],
      needsDoctorReview: true
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);

    // 保存诊断记录到数据库
    try {
      const { data, error } = await diagnosisService.createDiagnosis([selectedFile], symptoms);
      
      if (error) throw error;
      
      // 更新记录的AI诊断结果
      if (data) {
        await diagnosisService.updateDiagnosis(data.id, {
          doctor_diagnosis: mockResult.diagnosis,
          doctor_notes: `AI置信度: ${mockResult.confidence}%, 风险等级: ${mockResult.riskLevel}`
        });
      }

      toast({
        title: "AI分析完成",
        description: "分析结果已生成并保存，建议医生进一步确认",
      });
    } catch (error) {
      console.error("保存诊断记录失败:", error);
      toast({
        title: "AI分析完成",
        description: "分析结果已生成，但保存失败。建议医生进一步确认",
        variant: "destructive"
      });
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case "低风险": return "bg-green-100 text-green-800";
      case "中风险": return "bg-yellow-100 text-yellow-800";
      case "高风险": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              上传皮肤图片
            </CardTitle>
            <CardDescription>
              上传清晰的皮肤病变图片以进行AI分析
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="space-y-2">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Selected" 
                    className="max-w-full max-h-48 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">点击选择图片或拖拽上传</p>
                </div>
              )}
            </div>
            
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full"
            />
            
            <div className="space-y-2">
              <Label htmlFor="symptoms">症状描述（可选）</Label>
              <Textarea
                id="symptoms"
                placeholder="请描述相关症状，如疼痛、瘙痒、变化等..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleAnalysis} 
              className="w-full" 
              disabled={!selectedFile || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  AI分析中...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  开始AI分析
                </>
              )}
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-gray-600">
                  分析进度: {progress}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              拍摄建议
            </CardTitle>
            <CardDescription>
              获得最佳分析结果的拍摄技巧
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">充足光线</h4>
                  <p className="text-sm text-gray-600">在自然光下拍摄，避免阴影</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">清晰对焦</h4>
                  <p className="text-sm text-gray-600">确保病变部位清晰，无模糊</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">适当距离</h4>
                  <p className="text-sm text-gray-600">距离病变5-10cm，包含周围正常皮肤</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">多角度拍摄</h4>
                  <p className="text-sm text-gray-600">如可能，提供2-3张不同角度的图片</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">温馨提示</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  AI分析仅供参考，最终诊断需要专业医生确认
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI分析结果
              </span>
              <Badge className={getRiskBadgeColor(analysisResult.riskLevel)}>
                {analysisResult.riskLevel}
              </Badge>
            </CardTitle>
            <CardDescription>
              基于深度学习模型的初步分析结果
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">诊断结果</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>初步诊断:</span>
                    <span className="font-medium">{analysisResult.diagnosis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>置信度:</span>
                    <span className="font-medium">{analysisResult.confidence}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">状态</h4>
                <div className="space-y-2">
                  {analysisResult.needsDoctorReview && (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">等待医生复诊确认</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">分析详情</h4>
              <ul className="space-y-1">
                {analysisResult.details.map((detail, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">建议</h4>
              <ul className="space-y-1">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">重要提醒</span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                此结果仅为AI初步分析，不能替代专业医生诊断。请等待医生复诊确认，如有紧急情况请立即就医。
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiagnosisUpload;
