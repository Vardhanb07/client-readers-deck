import { ModeToggle } from "../ui/mode-toggle";

export default function BaseLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center p-5 h-full w-full gap-4">
      <div className="flex flex-row justify-center items-center gap-4">
        <p>
          <i>{title}</i>
        </p>
        <ModeToggle />
      </div>
      <div className="flex w-full p-10 justify-center items-center">
        {children}
      </div>
    </div>
  );
}
