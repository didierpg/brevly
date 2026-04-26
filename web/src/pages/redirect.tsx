import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { resolveLink } from "../api/links";
import linkImg from "../assets/Logo_Icon.svg";

export function Redirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const { data, isError } = useQuery({
    queryKey: ["resolve", shortCode],
    queryFn: () => resolveLink(shortCode!),
    enabled: !!shortCode,
    retry: false,
    meta: {
      onError: () => navigate("/not-found"),
    },
  });

  useEffect(() => {
    if (isError) {
      navigate("/not-found");
    }

    if (data?.originalUrl) {
      window.location.href = data.originalUrl;
    }
  }, [data, isError, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="flex flex-col items-center justify-center p-12 md:p-16 gap-6 bg-gray-100 rounded-lg w-full max-w-[580px]">
        <div className="flex items-center justify-center mb-2">
          <img src={linkImg} alt="brev.ly" className="h-12 w-auto" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-xl text-gray-600">Redirecionando...</h1>

          <div className="flex flex-col gap-1">
            <p className="text-md font-semibold text-gray-500 leading-relaxed">
              O link será aberto automaticamente em alguns instantes.
            </p>

            <p className="text-md font-semibold text-gray-500">
              Não foi redirecionado?{" "}
              <a
                href={data?.originalUrl || "#"}
                className="text-blue-base hover:underline cursor-pointer"
              >
                Acesse aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
