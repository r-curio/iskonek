import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ToastProvider>
      <div>
        <div className="w-full min-h-screen py-12 flex justify-center items-center bg-[url('/images/bg.svg')] bg-cover bg-gray-100">
          {children}
        </div>
        <Toaster />
      </div>
    </ToastProvider>
  );
}
