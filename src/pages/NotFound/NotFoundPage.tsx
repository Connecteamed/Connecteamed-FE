import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="to-primary-100 flex min-h-[calc(100vh-0px)] flex-1 items-center justify-center bg-gradient-to-b from-white via-white px-6 py-12 text-center md:px-10">
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-primary-300 pb-4 text-7xl font-bold md:text-[200px]">404</div>
        <div className="text-3xl font-bold text-neutral-800 md:text-5xl">Page not found :)</div>
        <p className="text-2xl text-neutral-600 md:text-2xl">
          일시적인 오류입니다. 잠시후 다시 시도해주세요.
        </p>

        <div className="flex flex-col items-center p-10 sm:flex-row sm:justify-center">
          <button
            className="bg-primary-500 h-17.5 w-100 max-w-xs rounded-full px-6 text-2xl font-bold text-white"
            onClick={() => navigate('/')}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
