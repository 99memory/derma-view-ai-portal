
import { supabase } from '@/integrations/supabase/client';
import { DiagnosisRecord } from '@/types/database';

export const diagnosisService = {
  // 创建新的诊断记录
  async createDiagnosis(imageFiles: File[], symptoms?: string): Promise<{ data: DiagnosisRecord | null, error: any }> {
    try {
      // 1. 上传图片到存储桶
      const imageUrls: string[] = [];
      
      for (const file of imageFiles) {
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('diagnosis-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('diagnosis-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // 2. 创建诊断记录
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('未登录');

      const { data, error } = await supabase
        .from('diagnosis_records')
        .insert({
          patient_id: user.user.id,
          image_urls: imageUrls,
          symptoms,
          status: 'pending'
        })
        .select()
        .single();

      return { data: data as DiagnosisRecord, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // 获取用户的诊断历史
  async getUserDiagnoses(): Promise<{ data: DiagnosisRecord[], error: any }> {
    const { data, error } = await supabase
      .from('diagnosis_records')
      .select('*')
      .order('created_at', { ascending: false });

    return { data: (data as DiagnosisRecord[]) || [], error };
  },

  // 医生获取待审核的诊断
  async getPendingDiagnoses(): Promise<{ data: DiagnosisRecord[], error: any }> {
    const { data, error } = await supabase
      .from('diagnosis_records')
      .select(`
        *,
        profiles!diagnosis_records_patient_id_fkey(name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    return { data: (data as DiagnosisRecord[]) || [], error };
  },

  // 医生更新诊断结果
  async updateDiagnosis(id: string, updates: {
    doctor_diagnosis?: string;
    doctor_notes?: string;
    status?: 'reviewed' | 'completed';
  }): Promise<{ data: DiagnosisRecord | null, error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('未登录');

    const { data, error } = await supabase
      .from('diagnosis_records')
      .update({
        ...updates,
        doctor_id: user.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data: data as DiagnosisRecord, error };
  },

  // 智能诊断接口 - 预留给您的模型
  async performAIDiagnosis(imageUrls: string[]): Promise<{
    diagnosis: string;
    confidence: number;
    riskLevel: '低风险' | '中风险' | '高风险';
  }> {
    // TODO: 这里将调用您训练好的智能模型
    // 目前返回模拟数据
    console.log('调用智能诊断模型，图片URLs:', imageUrls);
    
    // 模拟智能分析延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 返回模拟结果 - 您可以替换为真实的模型调用
    return {
      diagnosis: '良性色素痣',
      confidence: 87.5,
      riskLevel: '低风险'
    };
  }
};
