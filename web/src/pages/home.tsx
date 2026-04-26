import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLink, deleteLink, exportLinks, getLinks } from "../api/links";
import { Button } from "../components/Button";
import {
  CopyIcon,
  DownloadIcon,
  SpinnerIcon,
  TrashIcon,
} from "@phosphor-icons/react";

const createLinkFormSchema = z.object({
  originalUrl: z.url("Invalid URL format"),
  shortCode: z
    .string()
    .min(3, "Min 3 characters")
    .max(10, "Max 10 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores",
    ),
});

type CreateLinkFormSchema = z.infer<typeof createLinkFormSchema>;

export function Home() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLinkFormSchema>({
    resolver: zodResolver(createLinkFormSchema),
  });

  const { mutateAsync: createLinkFn, isPending } = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      reset();
      alert("Link criado!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Erro ao criar link");
    },
  });

  async function handleCreateLink(data: CreateLinkFormSchema) {
    await createLinkFn(data);
  }

  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["links"],
    queryFn: getLinks,
  });

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);
    alert("Link copiado!");
  };

  const { mutateAsync: deleteLinkFn, isPending: isDeleting } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      alert("Link removido com sucesso!");
    },
    onError: () => {
      alert("Erro ao deletar o link. Tente novamente.");
    },
  });

  const { mutateAsync: handleExport, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: (data) => {
      const link = document.createElement("a");
      link.href = data.publicUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: () => {
      alert("Erro ao gerar o arquivo de exportação.");
    },
  });
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este link?")) {
      deleteLinkFn(id);
    }
  };
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Novo link</h1>

      <form
        onSubmit={handleSubmit(handleCreateLink)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <div>
          <label>Link Original</label>
          <br />
          <input
            {...register("originalUrl")}
            placeholder="www.exemplo.com.br"
            style={{ width: "100%" }}
            defaultValue={"http://google.com"}
          />
          {errors.originalUrl && (
            <p style={{ color: "red" }}>{errors.originalUrl.message}</p>
          )}
        </div>

        <div>
          <label>Link Encurtado (brev.ly/)</label>
          <br />
          <input
            {...register("shortCode")}
            placeholder="meu-link"
            style={{ width: "100%" }}
            defaultValue={Math.random().toString(36).substring(2, 8)}
          />
          {errors.shortCode && (
            <p style={{ color: "red" }}>{errors.shortCode.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          style={{ padding: "0.5rem", cursor: "pointer" }}
        >
          {isPending ? "Salvando..." : "Salvar link"}
        </Button>
      </form>
      <hr style={{ margin: "2rem 0" }} />

      <section>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Meus links</h2>
          <Button
            variant="secondary"
            onClick={() => handleExport()}
            disabled={isExporting}
          >
            {isExporting ? <SpinnerIcon /> : <DownloadIcon />}
            Baixar CSV
          </Button>
        </div>

        {isLoading && <p>Carregando links...</p>}

        {isError && <p style={{ color: "red" }}>Erro ao carregar a lista.</p>}

        {!isLoading && links?.length === 0 && (
          <p style={{ color: "gray", fontStyle: "italic" }}>
            ainda não existem links cadastrados
          </p>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {links?.map((link) => (
            <li
              key={link.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <a
                    href={`/${link.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontWeight: "bold",
                      color: "#2563eb",
                      textDecoration: "none",
                    }}
                  >
                    brev.ly/{link.shortCode}
                  </a>
                  <p
                    style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}
                  >
                    {link.originalUrl}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#999",
                      alignSelf: "center",
                    }}
                  >
                    {link.accessCount} acessos
                  </span>

                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(link.shortCode)}
                    title="Copiar link"
                  >
                    <CopyIcon />
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleDelete(link.id);
                    }}
                    disabled={isDeleting}
                    title="Excluir link"
                  >
                    {isDeleting ? <SpinnerIcon /> : <TrashIcon />}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
