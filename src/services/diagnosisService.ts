
import { supabase } from '@/integrations/supabase/client';
import { DiagnosisRecord } from '@/types/database';

export const diagnosisService = {
  // 创建新的诊断记录
  async createDiagnosis(imageFiles: File[], symptoms?: string): Promise<{ data: DiagnosisRecord | null, error: any }> {
    try {
      // 1. 获取当前用户
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('创建诊断失败: 用户未登录');
        throw new Error('未登录');
      }

      console.log('开始创建诊断，用户ID:', user.user.id);

      // 2. 上传图片到存储桶
      const imageUrls: string[] = [];
      
      for (const file of imageFiles) {
        const fileName = `${user.user.id}/${Date.now()}_${file.name}`;
        console.log('上传图片:', fileName);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('diagnosis-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('图片上传失败:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('diagnosis-images')
          .getPublicUrl(fileName);
        
        console.log('图片URL:', publicUrl);
        imageUrls.push(publicUrl);
      }

      // 3. 创建诊断记录
      console.log('创建诊断记录...');
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

      if (error) {
        console.error('保存诊断记录失败:', error);
        throw error;
      }

      console.log('诊断记录已保存:', data);
      return { data: data as DiagnosisRecord, error: null };
    } catch (error) {
      console.error('创建诊断失败:', error);
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

  // 医生获取待审核的诊断（包含患者信息）
  async getPendingDiagnoses(): Promise<{ data: any[], error: any }> {
    // 先获取诊断记录
    const { data: records, error: recordsError } = await supabase
      .from('diagnosis_records')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (recordsError || !records) {
      return { data: [], error: recordsError };
    }

    // 获取所有相关患者的信息
    const patientIds = [...new Set(records.map(r => r.patient_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, name, avatar_url')
      .in('user_id', patientIds);

    if (profilesError) {
      console.error('获取患者信息失败:', profilesError);
    }

    // 合并数据
    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
    const dataWithProfiles = records.map(record => ({
      ...record,
      profiles: profileMap.get(record.patient_id) || { name: '未知患者' }
    }));

    return { data: dataWithProfiles, error: null };
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
