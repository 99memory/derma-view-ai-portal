import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface DoctorStats {
  pendingCount: number;
  monthlyReviewed: number;
  accuracy: number;
  avgResponseTime: number;
  isLoading: boolean;
}

export const useDoctorStats = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DoctorStats>({
    pendingCount: 0,
    monthlyReviewed: 0,
    accuracy: 0,
    avgResponseTime: 0,
    isLoading: true
  });

  useEffect(() => {
    if (profile?.role === 'doctor') {
      loadDoctorStats();
    }
  }, [profile]);

  const loadDoctorStats = async () => {
    try {
      // 获取待审核数量
      const { count: pendingCount } = await supabase
        .from('diagnosis_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // 获取本月审核数量
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const { count: monthlyReviewed } = await supabase
        .from('diagnosis_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'reviewed')
        .gte('updated_at', firstDayOfMonth.toISOString());

      // 获取已审核的诊断记录来计算准确率和响应时间
      const { data: reviewedRecords } = await supabase
        .from('diagnosis_records')
        .select('*')
        .eq('status', 'reviewed')
        .not('doctor_diagnosis', 'is', null)
        .not('ai_diagnosis', 'is', null);

      let accuracy = 0;
      let avgResponseTime = 0;

      if (reviewedRecords && reviewedRecords.length > 0) {
        // 计算准确率：AI诊断与医生诊断一致的比例
        const accurateCount = reviewedRecords.filter(record => 
          record.ai_diagnosis === record.doctor_diagnosis
        ).length;
        accuracy = (accurateCount / reviewedRecords.length) * 100;

        // 计算平均响应时间（小时）
        const totalResponseTime = reviewedRecords.reduce((sum, record) => {
          const createdAt = new Date(record.created_at);
          const updatedAt = new Date(record.updated_at);
          const diffHours = (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          return sum + diffHours;
        }, 0);
        avgResponseTime = totalResponseTime / reviewedRecords.length;
      }

      setStats({
        pendingCount: pendingCount || 0,
        monthlyReviewed: monthlyReviewed || 0,
        accuracy: Number(accuracy.toFixed(1)),
        avgResponseTime: Number(avgResponseTime.toFixed(1)),
        isLoading: false
      });

    } catch (error) {
      console.error('获取医生统计数据失败:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  return stats;
};