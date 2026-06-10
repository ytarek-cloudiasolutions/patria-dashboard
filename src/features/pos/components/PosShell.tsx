import type { ReactNode } from "react";

type PosShellProps = {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  cart: ReactNode;
};

const PosShell = ({ sidebar, topbar, children, cart }: PosShellProps) => {
  return (
    <div className="flex h-svh overflow-hidden bg-[#FAFAF7] text-[#28293D]">
      {sidebar}
      <section className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-7">
          {children}
        </main>
      </section>
      {cart}
    </div>
  );
};

export default PosShell;
