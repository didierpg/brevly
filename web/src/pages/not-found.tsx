import notFoundImg from "../assets/404.svg";

export function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col items-center justify-center p-16 gap-6 bg-gray-100 rounded-lg w-full max-w-[580px]">
        <div className="flex items-center justify-center">
          <img
            src={notFoundImg}
            alt="Página não encontrada"
            className="w-48.5 h-21.25"
          />
        </div>

        <div className="flex flex-col items-center gap-4 text-center w-full">
          <h1 className="text-xl text-gray-600">Link não encontrado</h1>

          <div className="flex flex-col gap-1">
            <p className="text-md font-semibold text-gray-500 leading-relaxed">
              O link que você está tentando acessar não existe, foi removido ou
              é uma URL inválida. Saiba mais em
              <a
                href="/"
                className="text-blue-base hover:underline font-semibold"
              >
                {" "}
                brev.ly.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
