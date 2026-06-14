import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabaseClient';
import { setUser, logOut } from '../redux/authSlice';

const useAuthBootstrap = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadProfile = async (session) => {
            if (!session) {
                dispatch(logOut());
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, photo_url, role, blood_group, governorate, city')
                .eq('id', session.user.id)
                .single();

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

        supabase.auth.getSession().then(({ data: { session } }) => loadProfile(session));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            loadProfile(session);
        });

        return () => subscription.unsubscribe();
    }, [dispatch]);
};

export default useAuthBootstrap;
