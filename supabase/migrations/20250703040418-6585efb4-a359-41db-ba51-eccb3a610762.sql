-- Fix infinite recursion in profiles RLS policies

-- First, create a security definer function to get current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Doctors can view all profiles" ON public.profiles;

-- Recreate the policy using the security definer function
CREATE POLICY "Doctors can view all profiles" ON public.profiles
FOR SELECT USING (public.get_current_user_role() = 'doctor');