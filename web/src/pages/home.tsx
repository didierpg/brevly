import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLink, deleteLink, exportLinks, getLinks } from "../api/links";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import {
  CircleNotchIcon,
  CopySimpleIcon,
  DownloadSimpleIcon,
  LinkIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import logoImg from "../assets/Logo.svg";
import { useToastStore } from "../store/useToastStore";

const createLinkFormSchema = z.object({
  originalUrl: z.url("Informe uma URL válida."),
  shortCode: z
    .string()
    .min(3, "A partir de 3 caracteres.")
    .max(10, "Até 10 caracteres.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Apenas letras, números, hífens e sublinhados."),
});

type CreateLinkFormSchema = z.infer<typeof createLinkFormSchema>;

export function Home() {
  const queryClient = useQueryClient();

  const addToast = useToastStore((state) => state.addToast);

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
      addToast({
        type: "success",
        title: "Link criado!",
        description: `O link foi criado com sucesso. `,
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Erro ao criar link",
        description: error.response?.data?.message,
      });
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
  const isEmpty = links?.length === 0;

  const handleCopy = (shortCode: string) => {
    const fullUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);

    addToast({
      type: "info",
      title: "Link copiado com sucesso",
      description: `O link ${shortCode} foi copiado para a área de transferência.`,
    });
  };

  const { mutateAsync: deleteLinkFn, isPending: isDeleting } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      addToast({
        type: "success",
        title: "Link removido",
        description: `O link foi removido com sucesso. `,
      });
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Erro ao deletar o link",
        description: error.response?.data?.message,
      });
    },
  });

  const { mutateAsync: handleExport, isPending: isExporting } = useMutation({
    mutationFn: exportLinks,
    onSuccess: (data) => {
      addToast({
        type: "success",
        title: "Exportação concluída",
        description: "Seu arquivo CSV foi gerado com sucesso.",
      });

      const link = document.createElement("a");
      link.href = data.publicUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (error: any) => {
      addToast({
        type: "error",
        title: "Erro na exportação",
        description: error.response?.data?.message,
      });
    },
  });
  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este link?")) {
      deleteLinkFn(id);
    }
  };
  return (
    <div className="h-screen flex flex-col  overflow-hidden bg-gray-200">
      <header className="px-8 py-6 flex items-center shrink-0 bg-white border-b border-gray-200 justify-center md:justify-start">
        <img src={logoImg} alt="brev.ly" className="h-8 w-auto" />
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-3 p-3 min-h-0 items-start justify-center">
        <section className="w-full md:w-100 bg-white p-6 rounded-lg border border-gray-200 shrink-0">
          <h2 className="text-lg mb-6">Novo link</h2>{" "}
          <form
            onSubmit={handleSubmit(handleCreateLink)}
            className="flex flex-col gap-4"
          >
            <div>
              <Input
                id="link"
                label="Link Original"
                {...register("originalUrl")}
                placeholder="www.exemplo.com.br"
                error={errors.originalUrl?.message}
                defaultValue={"http://google.com"}
              />
            </div>

            <div>
              <Input
                id="shorten"
                label="Link Encurtado"
                prefixText="brev.ly/"
                placeholder="meu-link"
                {...register("shortCode")}
                error={errors.shortCode?.message}
                defaultValue={Math.random().toString(36).substring(2, 8)}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar link"}
            </Button>
          </form>
        </section>

        <section className="w-full max-w-2xl flex-1 flex flex-col bg-white rounded-lg border border-gray-200 min-h-0 self-stretch overflow-hidden relative">
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 overflow-hidden shrink-0">
              <div className="h-full w-1/3 bg-blue-base animate-progress-slide" />
            </div>
          )}
          <div className="p-6 flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-lg ">Meus links</h2>
              <Button
                variant="secondary"
                onClick={() => handleExport()}
                disabled={isExporting}
                className="text-sm h-8"
              >
                {isExporting ? (
                  <CircleNotchIcon size={16} className="animate-spin" />
                ) : (
                  <DownloadSimpleIcon size={16} />
                )}
                Baixar CSV
              </Button>
            </div>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <CircleNotchIcon
                  size={32}
                  className="animate-spin text-blue-base"
                />
                <span className="text-sm text-gray-400">
                  Carregando links...
                </span>
              </div>
            )}
            {isError && (
              <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 flex items-center gap-3">
                <WarningCircleIcon size={20} className="text-danger" />
                <span className="text-sm text-danger font-medium">
                  Erro ao carregar a lista.
                </span>
              </div>
            )}
            {!isLoading && isEmpty && (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-lg">
                <LinkIcon
                  size={40}
                  weight="thin"
                  className="text-gray-400 mb-2"
                />
                <p className="text-xs uppercase text-gray-400">
                  Ainda não existem links cadastrados
                </p>
              </div>
            )}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar ">
              <ul className="flex flex-col">
                {links?.map((link) => (
                  <li
                    key={link.id}
                    className="group flex flex-col gap-2 py-5 border-t border-gray-200 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col overflow-hidden">
                        <a
                          href={`/${link.shortCode}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-md font-bold text-blue-base hover:underline truncate"
                        >
                          brev.ly/{link.shortCode}
                        </a>
                        <p className="text-sm text-gray-400 truncate mt-1">
                          {link.originalUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                          {link.accessCount} acessos
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleCopy(link.shortCode)}
                            className="w-9 h-9 p-0"
                            title="Copiar link"
                          >
                            <CopySimpleIcon size={18} />
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={() => handleDelete(link.id)}
                            disabled={isDeleting}
                            className="w-9 h-9 p-0 hover:text-danger hover:ring-danger"
                            title="Excluir link"
                          >
                            {isDeleting ? (
                              <CircleNotchIcon className="animate-spin" />
                            ) : (
                              <TrashIcon size={18} />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
