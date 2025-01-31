import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

type ProfileUpdateData = {
    username?: string;
    department?: string;
    currentPassword?: string;
    newPassword?: string;
    avatar?: string;
};


export async function PUT(request: Request) {
    const supabase = await createClient();
    
    const { data: { user }, error: UserError } = await supabase.auth.getUser();
    if (!user || UserError) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const updateType = request.headers.get('update-type');

        // Handle password update
        if (updateType === 'password') {

            const { currentPassword, newPassword } = body;
            
            if (!currentPassword || !newPassword) {
                return NextResponse.json({ error: 'Missing password fields' }, { status: 400 });
            }

            // Verify current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email!,
                password: currentPassword,
            });

            if (signInError) {
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
            }

            // Update password
            const { error: passwordError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (passwordError) {
                return NextResponse.json({ error: passwordError.message }, { status: 400 });
            }

            return NextResponse.json({ success: true, updated: ['password'] });
        }

        // Handle profile updates
        const updateData: Record<string, ProfileUpdateData[keyof ProfileUpdateData]> = {};
        if (body.username) updateData.username = body.username;
        if (body.department) updateData.department = body.department;
        if (body.avatar) updateData.avatar = body.avatar;
        if (body.bgColor) updateData.bgColor = body.bgColor;
        
        // get the current username of the user
        const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();

        const username = data?.username;

        // Check if the user edit their username
        if (body.username && body.username !== username) {

            // check if the user is more than 3 characters
            if (body.username.length < 3) {
                return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
            }

            // Check if username is unique
            const { data: existingUserByUsername } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', body.username)
                .single()

            if (existingUserByUsername) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
        }


        
        if (Object.keys(updateData).length > 0) {
            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', user.id);
                
            if (error) throw error;
            return NextResponse.json({ 
                success: true, 
                updated: Object.keys(updateData)
            });
        }

        return NextResponse.json({ error: 'No valid update field provided' }, { status: 400 });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : 'Error updating profile' 
        }, { status: 500 });
    }
}