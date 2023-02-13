import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string | null;
}

export default function Message({ message, avatarUrl, reversed }: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-2 space-x-reverse" : "space-x-2"
      )}
    >
      {avatarUrl ? (
        <Image
          src={`https://imagedelivery.net/zbviVI8oDmIX5FtWyQ7S9g/${avatarUrl}/avatar`}
          alt="product"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-slate-400" />
      )}
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
