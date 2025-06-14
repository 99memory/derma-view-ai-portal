
-- 创建用户档案表
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- 创建诊断记录表
CREATE TABLE public.diagnosis_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) NOT NULL,
  image_urls TEXT[] NOT NULL,
  symptoms TEXT,
  ai_diagnosis TEXT,
  ai_confidence DECIMAL(5,2),
  risk_level TEXT CHECK (risk_level IN ('低风险', '中风险', '高风险')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'completed')),
  doctor_id UUID REFERENCES public.profiles(id),
  doctor_diagnosis TEXT,
  doctor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建健康助手对话表
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 创建触发器函数，用户注册时自动创建档案
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'User'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- 创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 启用行级安全策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 用户档案访问策略
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 医生可以查看所有档案
CREATE POLICY "Doctors can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- 诊断记录访问策略
CREATE POLICY "Patients can view their own records" ON public.diagnosis_records
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "Patients can create their own records" ON public.diagnosis_records
  FOR INSERT WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update their own pending records" ON public.diagnosis_records
  FOR UPDATE USING (patient_id = auth.uid() AND status = 'pending');

-- 医生可以查看和更新所有记录
CREATE POLICY "Doctors can view all records" ON public.diagnosis_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

CREATE POLICY "Doctors can update all records" ON public.diagnosis_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'doctor'
    )
  );

-- 聊天消息访问策略
CREATE POLICY "Users can view their own messages" ON public.chat_messages
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 创建图片存储桶
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diagnosis-images', 'diagnosis-images', true);

-- 存储桶访问策略
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'diagnosis-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view all images" ON storage.objects
  FOR SELECT USING (bucket_id = 'diagnosis-images');
