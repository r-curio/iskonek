
export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div>
            <div className="w-full h-screen flex justify-center items-center">
                {children}
            </div>
        </div>
    )
}