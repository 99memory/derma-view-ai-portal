
-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diagnosis_records table
CREATE TABLE public.diagnosis_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    symptoms TEXT,
    ai_diagnosis TEXT,
    ai_confidence NUMERIC,
    risk_level TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    doctor_id UUID REFERENCES auth.users(id),
    doctor_diagnosis TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for diagnosis_records
CREATE POLICY "Patients can view their own records"
ON public.diagnosis_records FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view all records"
ON public.diagnosis_records FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Patients can create their own records"
ON public.diagnosis_records FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update records"
ON public.diagnosis_records FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Patients can update their own records"
ON public.diagnosis_records FOR UPDATE
TO authenticated
USING (auth.uid() = patient_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diagnosis_records_updated_at
BEFORE UPDATE ON public.diagnosis_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (user_id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', '用户'));
    
    -- Insert default role (patient)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'patient'));
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for diagnosis_records
ALTER PUBLICATION supabase_realtime ADD TABLE public.diagnosis_records;
