import { Outlet } from "react-router-dom";
import { Suspense } from "react";

export default function MainLayout() {
  return (
    <>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
