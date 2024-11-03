import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

interface CardWrapperProps {
    label: string
    title: string
    backButtonText: string
    backButtonPath: string
    children: React.ReactNode
}

import Link from 'next/link'

export default function CardWrapper(props: CardWrapperProps): JSX.Element {

    return (
        <Card className="lg:w-1/4 md:w-1/2">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{props.title}</CardTitle>
                <CardDescription className="text-lg">{props.label}</CardDescription>
            </CardHeader>
            <CardContent>
                {props.children}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link href={props.backButtonPath}>{props.backButtonText}</Link>
            </CardFooter>
        </Card>
    )
}