import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface PatientStats {
  totalDiagnoses: number;
  monthlyDiagnoses: number;
  confirmedDiagnoses: number;
  pendingDiagnoses: number;
  isLoading: boolean;
}

export const usePatientStats = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<PatientStats>({
    totalDiagnoses: 0,
    monthlyDiagnoses: 0,
    confirmedDiagnoses: 0,
    pendingDiagnoses: 0,
    isLoading: true
  });

  useEffect(() => {
    if (profile?.role === 'patient' && user?.id) {
      loadPatientStats();
    }
  }, [profile, user]);

  const loadPatientStats = async () => {
    try {
      if (!user?.id) return;

      // 获取患者总诊断数
      const { count: totalDiagnoses } = await supabase
        .from('diagnosis_records')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user.id);

      // 获取本月诊断数
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const { count: monthlyDiagnoses } = await supabase
        .from('diagnosis_records')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user.id)
        .gte('created_at', firstDayOfMonth.toISOString());

      // 获取已确认诊断数
      const { count: confirmedDiagnoses } = await supabase
        .from('diagnosis_records')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user.id)
        .eq('status', 'reviewed');

      // 获取待审核诊断数
      const { count: pendingDiagnoses } = await supabase
        .from('diagnosis_records')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user.id)
        .eq('status', 'pending');

      setStats({
        totalDiagnoses: totalDiagnoses || 0,
        monthlyDiagnoses: monthlyDiagnoses || 0,
        confirmedDiagnoses: confirmedDiagnoses || 0,
        pendingDiagnoses: pendingDiagnoses || 0,
        isLoading: false
      });

    } catch (error) {
      console.error('获取患者统计数据失败:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  return stats;
};