import Sidebar from "@/components/sidebar/sidebar"

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div className='flex'>
            <Sidebar />
            <div>
                {children}
            </div>
        </div>
    )
}