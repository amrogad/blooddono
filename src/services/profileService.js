import { supabase } from '../lib/supabaseClient';

export const getProfile = async (userId) => {
    const { data } = await supabase
        .from('profiles')
        .select('display_name, photo_url, role, blood_group, governorate, city')
        .eq('id', userId)
        .single();
    return data;
};
