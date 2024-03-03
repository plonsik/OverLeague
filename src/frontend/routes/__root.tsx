import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-full border-t-2 border-t-[#785a28] border-l border-l-[#1e282d]">
      <div className="h-[20%] text-[#cdfafa] flex justify-center items-center font-[Beaufort, serif]">
        <h2 className="text-3xl">OverLeague</h2>
      </div>

      <Outlet />
    </div>
  ),
});
