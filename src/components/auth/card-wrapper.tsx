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
    <Card className="lg:w-1/3 md:w-1/2 w-full">
      <CardHeader className="text-center">
        <Image
          src={Logo}
          alt="logo"
          width={70}
          height={70}
          className="mx-auto"
        />
        <CardTitle className="text-2xl font-bold text-accent">
          Welcome to Iskonek!
        </CardTitle>
        <CardDescription className="text-lg text-accent/90">
          {props.title}
        </CardDescription>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter className="flex justify-center">
        <span>
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
