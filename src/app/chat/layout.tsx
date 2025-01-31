import Sidebar from "@/components/sidebar/sidebar";
import { createClient } from "@/utils/supabase/server";
import { createAvatar } from "@dicebear/core";
import { funEmoji } from "@dicebear/collection";

interface Profile {
  id: string;
  username: string;
  avatar: string;
  department: string;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const supabase = await createClient();
  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();
  if (!user || UserError) {
    return <div>Unauthorized</div>;
  }

  // Fetch user profile of the logged-in user
  const { data: profiles, error: ProfileError } = await supabase
    .from("profiles")
    .select("id, username, avatar, department, bgColor")
    .eq("id", user.id)
    .single<Profile>();

  if (ProfileError) {
    return <div>Error fetching profiles</div>;
  }

  if (!profiles) {
    return <div>No profiles found</div>;
  }

  const avatar = createAvatar(funEmoji, {
    seed: profiles.avatar || profiles.username || "Adrian",
  });

  profiles.avatar = avatar.toDataUri();

  return (
    <div className="flex">
      <Sidebar user={profiles} />
      {children}
    </div>
  );
}
