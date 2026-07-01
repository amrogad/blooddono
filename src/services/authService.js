import { supabase } from '../supabase';

export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signIn = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signUp = async (data) => {
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.name,
        blood_group: data.bloodGroup,
        governorate: data.governorate,
        city: data.city,
      },
    },
  });

  if (error) throw error;
};
