import { Youtube } from "lucide-react";

type SimulationVideoButtonProps = {
  href: string;
};

export default function SimulationVideoButton({ href }: SimulationVideoButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-red-500 cursor-pointer"
      title="YouTube Video"
    >
      <Youtube className="mr-1.5 h-4 w-4" />
      YouTube Video
    </a>
  );
}
