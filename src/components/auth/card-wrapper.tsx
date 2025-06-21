import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardWrapperProps {
  label: string;
  title: string;
  footerText: string;
  backButtonText: string;
  backButtonPath: string;
  children: React.ReactNode;
}

import Link from "next/link";
import Image from "next/image";
import Logo from "@/images/logo.svg";

export default function CardWrapper(props: CardWrapperProps): JSX.Element {
  return (
    <Card className="w-full max-w-sm sm:max-w-md md:w-1/2 lg:w-1/3 mx-4">
      <CardHeader className="text-center">
        <Image
          src={Logo}
          alt="logo"
          width={60}
          height={60}
          className="mx-auto sm:w-[70px] sm:h-[70px]"
        />
        <CardTitle className="text-xl sm:text-2xl font-bold text-accent">
          Welcome to Iskonek!
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-accent/90">
          {props.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">{props.children}</CardContent>
      <CardFooter className="flex justify-center px-4 sm:px-6">
        <span className="text-sm sm:text-base">
          {props.footerText}
          <Link
            href={props.backButtonPath}
            className="text-[#682A43] hover:underline"
          >
            {props.backButtonText}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
