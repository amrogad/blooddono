import { supabase } from '../lib/supabaseClient';

export const getProfile = async (userId) => {
  const { data } = await supabase
    .from('profiles')
    .select('display_name, photo_url, role, status, blood_group, governorate, city, is_searchable')
    .eq('id', userId)
    .single();
  return data;
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const uploadAvatar = async (userId, file) => {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
};

export const searchDonors = async (bloodGroup, governorate, city) => {
  const { data, error } = await supabase.rpc('search_donors', {
    p_blood_group: bloodGroup,
    p_governorate: governorate,
    p_city: city,
  });
  if (error) throw error;
  return data;
};

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const setUserRole = async (targetId, role) => {
  const { error } = await supabase.rpc('admin_set_role', { target_id: targetId, new_role: role });
  if (error) throw error;
};

export const setUserStatus = async (targetId, status) => {
  const { error } = await supabase.rpc('admin_set_status', {
    target_id: targetId,
    new_status: status,
  });
  if (error) throw error;
};
