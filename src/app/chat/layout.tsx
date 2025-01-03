

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    )
}