import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabaseClient';
import { setUser, logOut } from '../redux/authSlice';

let latestAuthToken;

const useAuthBootstrap = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadProfile = async (session, token) => {
            if (!session) {
                dispatch(logOut());
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, photo_url, role, blood_group, governorate, city')
                .eq('id', session.user.id)
                .single();

            if (token !== latestAuthToken) return;

            dispatch(setUser({
                uid: session.user.id,
                email: session.user.email,
                displayName: profile?.display_name ?? session.user.email,
                photoURL: profile?.photo_url ?? null,
                role: profile?.role ?? 'donor',
                bloodGroup: profile?.blood_group ?? null,
                governorate: profile?.governorate ?? null,
                city: profile?.city ?? null,
            }));
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const token = (latestAuthToken = {});
            loadProfile(session, token);
        });

        return () => subscription.unsubscribe();
    }, [dispatch]);
};

export default useAuthBootstrap;
