import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const supabase = await createClient();

  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (!user || UserError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { password, confirmPassword } = body;

  if (!password || !confirmPassword) {
    return NextResponse.json(
      { error: "Missing password fields" },
      { status: 400 }
    );
  }

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: password,
  });

  if (signInError) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  // verify if passwords match
  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }
  
  // delete chatrooms related to the user
  const { error: deleteChatroomsError } = await supabaseAdmin.from("chat_rooms").delete().or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
  if (deleteChatroomsError) {
    console.error("Error deleting chatrooms:", deleteChatroomsError);
    return NextResponse.json(
      { error: deleteChatroomsError.message },
      { status: 400 }
    );
  }


  // Delete user
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  );

  if (deleteError) {
    console.log("Attempting to delete user with ID:", user.id);
    console.error("Error deleting user:", deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
