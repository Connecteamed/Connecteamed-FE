import logo from '@/assets/icon-logo.svg';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex items-center">
          <img src={logo} alt="Connecteamed logo" className="h-30 pt-1.5" />
          <div className="text-primary-500 text-7xl font-bold">Connecteamed</div>
        </div>
      </div>
      <div className="text-neutral-90 mb-6 pt-4 text-4xl font-semibold">잠시만 기다려 주세요</div>

      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full"
            style={{
              backgroundColor: ['#f97316', '#fbbf24', '#fcd9a0'][i],
              animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
              display: 'inline-block',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
