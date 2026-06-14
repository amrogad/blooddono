import { createClient } from '@supabase/supabase-js';
import { DEMO_ACCOUNTS } from '../src/constants/demoAccounts.js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

for (const { email, password, label } of DEMO_ACCOUNTS) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: `Demo ${label}` } },
    });

    if (error) {
        console.error(`${email}: ${error.message}`);
    } else {
        console.log(`${email}: created (${data.user?.id})`);
    }
}
