-- 为了测试，我们需要手动插入一些用户数据到 profiles 表
-- 注意：在生产环境中，这些应该通过注册流程自动创建

-- 插入测试用户档案
INSERT INTO public.profiles (id, name, role, avatar_url, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '患者测试用户', 'patient', null, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440002', '医生测试用户', 'doctor', null, now(), now())
ON CONFLICT (id) DO NOTHING;