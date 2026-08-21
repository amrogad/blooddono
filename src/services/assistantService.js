import { supabase } from '../supabase';

// Blood group and city are not sent: the edge function reads them from the
// session so a caller cannot claim a profile that isn't theirs.
export const askAssistant = async (messages, locale = 'en') => {
  const { data, error } = await supabase.functions.invoke('ask-assistant', {
    body: { messages, locale },
  });
  if (error) throw error;
  return data;
};
