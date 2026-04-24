import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLink } from "../api/links";

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

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
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

        <button
          type="submit"
          disabled={isPending}
          style={{ padding: "0.5rem", cursor: "pointer" }}
        >
          {isPending ? "Salvando..." : "Salvar link"}
        </button>
      </form>
    </div>
  );
}
