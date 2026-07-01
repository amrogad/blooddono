import { supabase } from '../supabase';

export const getFunds = async () => {
  const { data, error } = await supabase
    .from('funds')
    .select('*')
    .order('paid_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getFundsTotal = async () => {
  const { data, error } = await supabase.from('funds').select('amount');
  if (error) throw error;
  return data.reduce((sum, f) => sum + Number(f.amount), 0);
};

export const createFund = async (fund) => {
  const { data, error } = await supabase.from('funds').insert(fund).select().single();
  if (error) throw error;
  return data;
};
