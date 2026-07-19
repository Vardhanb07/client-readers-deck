import { SignOutButton } from "@clerk/react";
import { Home, LogOut } from "lucide-react";
import { Link } from "react-router";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function BaseLayout({
	children,
	title,
	signInOrOutScreen,
}: {
	children: React.ReactNode;
	title: string;
	signInOrOutScreen: boolean;
}) {
	return (
		<div className="flex flex-col justify-center items-center p-5 h-full w-full gap-4">
			{!signInOrOutScreen ? (
				<div className="flex flex-row justify-center items-center gap-4">
					<Link to={"/"}>
						<Home />
					</Link>
					<p>
						<i>{title}</i>
					</p>
					<ModeToggle />
					<SignOutButton>
						<LogOut />
					</SignOutButton>
				</div>
			) : (
				<div className="flex flex-row justify-center items-center gap-4">
					<ModeToggle />
				</div>
			)}
			<div className="flex flex-col w-full p-10 justify-center items-center">
				{children}
			</div>
		</div>
	);
}
