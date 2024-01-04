import NavMenu from "../components/NavMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <NavMenu />
        {children}
      </main>
    </>
  );
}
