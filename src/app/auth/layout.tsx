
import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <ToastProvider>
            <div>
                <div className="w-full h-screen flex justify-center items-center">
                    {children}
                </div>
                <Toaster />
            </div>
        </ToastProvider>
    )
}