import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
    const supabase = await createClient();
    
    // Check which field is being updated
    const avatar = request.headers.get('avatar');
    const username = request.headers.get('username');
    const department = request.headers.get('department');
    const password = request.headers.get('password');

    const { data: { user }, error: UserError } = await supabase.auth.getUser();
    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Handle different update types
        if (avatar) {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar })
                .eq('id', user.id);
            if (error) throw error;
            return NextResponse.json({ success: true, type: 'avatar' });
        }

        if (username) {
            const { error } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user.id);
            if (error) throw error;
            return NextResponse.json({ success: true, type: 'username' });
        }

        if (department) {
            const { error } = await supabase
                .from('profiles')
                .update({ department })
                .eq('id', user.id);
            if (error) throw error;
            return NextResponse.json({ success: true, type: 'department' });
        }

        if (password) {
            const { error } = await supabase.auth.updateUser({
                password: password
            });
            if (error) throw error;
            return NextResponse.json({ success: true, type: 'password' });
        }

        return NextResponse.json({ error: 'No valid update field provided' }, { status: 400 });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
    }
}