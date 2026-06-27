import { supabase } from '../lib/supabaseClient';

export const getDonationRequests = async () => {
  const { data, error } = await supabase
    .from('blood_donation_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Pending requests for the public list.
export const getPendingRequests = async () => {
  const { data, error } = await supabase.rpc('get_pending_requests');
  if (error) throw error;
  return data;
};

// Full request row, used by the dashboard.
export const getDonationRequest = async (id) => {
  const { data, error } = await supabase
    .from('blood_donation_requests')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

// Single-request details for the donor-facing page.
export const getRequestDetails = async (id) => {
  const { data, error } = await supabase.rpc('get_request_details', { p_id: id });
  if (error) throw error;
  return data?.[0] ?? null;
};

export const getMyDonationRequests = async (userId) => {
  const { data, error } = await supabase
    .from('blood_donation_requests')
    .select('*')
    .eq('requester_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createDonationRequest = async (requestData) => {
  const { data, error } = await supabase
    .from('blood_donation_requests')
    .insert(requestData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateDonationRequest = async (id, updates) => {
  const { data, error } = await supabase
    .from('blood_donation_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteDonationRequest = async (id) => {
  const { error } = await supabase.from('blood_donation_requests').delete().eq('id', id);
  if (error) throw error;
};

export const acceptRequest = async (id) => {
  const { error } = await supabase.rpc('accept_request', { request_id: id });
  if (error) throw error;
};
