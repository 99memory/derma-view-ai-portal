import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Users, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  User,
  Clock
} from "lucide-react";

interface PatientWithStats {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  totalDiagnoses: number;
  pendingDiagnoses: number;
  lastVisit: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const PatientManagement = () => {
  const [patients, setPatients] = useState<PatientWithStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithStats | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      // 获取所有患者角色的用户ID
      const { data: patientRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'patient');

      if (rolesError) throw rolesError;

      const patientUserIds = (patientRoles || []).map(r => r.user_id);

      if (patientUserIds.length === 0) {
        setPatients([]);
        setIsLoading(false);
        return;
      }

      // 获取患者档案
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', patientUserIds);

      if (profilesError) throw profilesError;

      // 获取每个患者的诊断统计信息
      const patientsWithStats: PatientWithStats[] = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: diagnoses, error: diagnosesError } = await supabase
            .from('diagnosis_records')
            .select('*')
            .eq('patient_id', profile.user_id);

          if (diagnosesError) {
            console.error('获取患者诊断记录失败:', diagnosesError);
            return {
              id: profile.id,
              user_id: profile.user_id,
              name: profile.name,
              avatar_url: profile.avatar_url || undefined,
              created_at: profile.created_at,
              totalDiagnoses: 0,
              pendingDiagnoses: 0,
              lastVisit: profile.created_at,
              riskLevel: 'low' as const
            };
          }

          const totalDiagnoses = diagnoses?.length || 0;
          const pendingDiagnoses = diagnoses?.filter(d => d.status === 'pending').length || 0;
          const lastVisit = diagnoses?.length ? 
            Math.max(...diagnoses.map(d => new Date(d.created_at).getTime())) : 
            new Date(profile.created_at).getTime();
          
          // 根据高风险诊断记录判断患者风险等级
          const hasHighRisk = diagnoses?.some(d => d.risk_level === '高风险');
          const hasMediumRisk = diagnoses?.some(d => d.risk_level === '中风险');
          const riskLevel: 'high' | 'medium' | 'low' = hasHighRisk ? 'high' : hasMediumRisk ? 'medium' : 'low';

          return {
            id: profile.id,
            user_id: profile.user_id,
            name: profile.name,
            avatar_url: profile.avatar_url || undefined,
            created_at: profile.created_at,
            totalDiagnoses,
            pendingDiagnoses,
            lastVisit: new Date(lastVisit).toISOString(),
            riskLevel
          };
        })
      );

      setPatients(patientsWithStats);
    } catch (error) {
      console.error('获取患者列表失败:', error);
      toast({
        title: "获取数据失败",
        description: "无法加载患者列表，请刷新页面重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskBadge = (riskLevel: 'high' | 'medium' | 'low') => {
    switch (riskLevel) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">高风险</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">中风险</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">低风险</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const getStatusIcon = (patient: PatientWithStats) => {
    if (patient.pendingDiagnoses > 0) {
      return <Clock className="w-4 h-4 text-orange-500" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总患者数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">已注册患者</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.reduce((sum, p) => sum + p.pendingDiagnoses, 0)}
            </div>
            <p className="text-xs text-muted-foreground">待审核诊断</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高风险患者</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">需要关注</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总诊断数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.reduce((sum, p) => sum + p.totalDiagnoses, 0)}
            </div>
            <p className="text-xs text-muted-foreground">所有患者诊断</p>
          </CardContent>
        </Card>
      </div>

      {/* 患者列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            患者列表
          </CardTitle>
          <CardDescription>
            管理和查看所有患者信息
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索患者姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "未找到匹配的患者" : "暂无患者数据"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>患者信息</TableHead>
                  <TableHead>风险等级</TableHead>
                  <TableHead>诊断次数</TableHead>
                  <TableHead>待处理</TableHead>
                  <TableHead>最后访问</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={patient.avatar_url} />
                          <AvatarFallback>{patient.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-gray-500">
                            注册时间: {new Date(patient.created_at).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRiskBadge(patient.riskLevel)}</TableCell>
                    <TableCell>{patient.totalDiagnoses}</TableCell>
                    <TableCell>
                      {patient.pendingDiagnoses > 0 ? (
                        <Badge variant="outline" className="text-orange-600">
                          {patient.pendingDiagnoses} 个
                        </Badge>
                      ) : (
                        <span className="text-gray-400">无</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(patient.lastVisit).toLocaleDateString('zh-CN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(patient)}
                        <span className="text-sm">
                          {patient.pendingDiagnoses > 0 ? '有待处理' : '正常'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 患者详情弹窗可以在后续实现 */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle>患者详情</CardTitle>
            <CardDescription>
              {selectedPatient.name} 的详细信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>姓名:</strong> {selectedPatient.name}</div>
                  <div><strong>注册时间:</strong> {new Date(selectedPatient.created_at).toLocaleString('zh-CN')}</div>
                  <div><strong>风险等级:</strong> {getRiskBadge(selectedPatient.riskLevel)}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">诊断统计</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>总诊断次数:</strong> {selectedPatient.totalDiagnoses}</div>
                  <div><strong>待处理诊断:</strong> {selectedPatient.pendingDiagnoses}</div>
                  <div><strong>最后访问:</strong> {new Date(selectedPatient.lastVisit).toLocaleString('zh-CN')}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                关闭
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientManagement;