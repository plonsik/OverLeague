import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    setTimeout(() => {
      navigate({ to: "lobby-view" });
    }, 5000);
  }, []);

  return (
    <div
      id="waitingForLobby"
      className="flex flex-col justify-center gap-8 items-center h-full font-[Beaufort, serif] text-2xl text-white"
    >
      <p>Waiting for lobby...</p>
      <div className="flex justify-center items-center">
        <div
          className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-dotFlashing"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-dotFlashing"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2.5 h-2.5 bg-white rounded-full m-1 animate-dotFlashing"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
