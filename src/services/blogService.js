import { supabase } from '../supabase';

export const getPublishedBlogs = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getAllBlogs = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getBlog = async (id) => {
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createBlog = async (blog) => {
  const { data, error } = await supabase.from('blogs').insert(blog).select().single();
  if (error) throw error;
  return data;
};

export const updateBlog = async (id, updates) => {
  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteBlog = async (id) => {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
};

export const uploadBlogImage = async (file) => {
  const path = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from('blog-images').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
  return data.publicUrl;
};
