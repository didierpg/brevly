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
  const isEmpty = links?.length === 0;

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
    <div className="h-screen flex flex-col p-8 gap-12 overflow-hidden">
      <section className="flex flex-col gap-6 w-full max-w-xl">
        <h2 className="text-lg font-bold  tracking-wider">Novo link</h2>
        <form
          onSubmit={handleSubmit(handleCreateLink)}
          className="flex flex-col gap-1"
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
      <section className="flex flex-col gap-6 w-full max-w-xl flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold  tracking-wider">Meus links</h2>
          <Button
            variant="secondary"
            onClick={() => handleExport()}
            disabled={isExporting}
            className="text-sm h-8"
          >
            {isExporting ? (
              <CircleNotchIcon className="animate-spin" />
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
            <span className="text-sm text-gray-400">Carregando links...</span>
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
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
            <LinkIcon size={40} weight="thin" className="text-gray-400 mb-2" />
            <p className="text-xs uppercase text-gray-400">
              Ainda não existem links cadastrados
            </p>
          </div>
        )}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar h-[calc(100vh-200px)]">
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

                    {/* Ações usando nosso Button flexível */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleCopy(link.shortCode)}
                        className="w-9 h-9 p-0" // Estilo IconButton sem precisar de novo componente
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
      </section>
    </div>
  );
}
