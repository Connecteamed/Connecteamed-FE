import logoImg from '../assets/icon-sidebar-logo.png';

const Header = () => {
  return (
    <header className="border-neutral-30 flex h-16 w-full items-center gap-1 border-b bg-white px-4 md:hidden">
      <img src={logoImg} alt="logo" className="h-8 w-8" />
      <span className="text-primary-500 text-[18px] font-medium">Connecteamed</span>
    </header>
  );
};
export default Header;
