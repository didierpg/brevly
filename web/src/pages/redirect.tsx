import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { resolveLink } from "../api/links";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Redirecionando...</h1>
      <p>O link será aberto automaticamente em alguns instantes.</p>

      {data?.originalUrl && (
        <p style={{ marginTop: "1rem", fontSize: "14px" }}>
          Não foi redirecionado? <a href={data.originalUrl}>Acesse aqui</a>
        </p>
      )}
    </div>
  );
}
