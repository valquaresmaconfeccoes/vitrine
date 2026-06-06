"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Button } from "@/components/admin/FormFields";
import ImageUpload from "@/components/admin/ImageUpload";
import { createCategory, updateCategory } from "@/app/admin/categorias/actions";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    order: number;
  };
}

/**
 * Formulário de Categoria — usado tanto para criar quanto editar
 *
 * Se receber `category` → modo edição (chama updateCategory)
 * Se não receber → modo criação (chama createCategory)
 *
 * Estado da imagem é gerenciado separadamente porque vem do
 * componente ImageUpload (que faz o upload assíncrono).
 */
export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string>(category?.image ?? "");
  const isEditing = !!category;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("image", image); // garante que a imagem do state vai no FormData

    startTransition(async () => {
      const result = isEditing
        ? await updateCategory(category.id, formData)
        : await createCategory(formData);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      router.push("/admin/categorias");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coluna esquerda: dados textuais */}
        <div className="space-y-6">
          <Input
            label="Nome"
            name="name"
            required
            defaultValue={category?.name ?? ""}
            placeholder="Ex: Vestidos"
            hint="O slug da URL será gerado automaticamente."
          />

          <Textarea
            label="Descrição (opcional)"
            name="description"
            rows={4}
            defaultValue={category?.description ?? ""}
            placeholder="Breve descrição que pode aparecer no site"
          />

          <Input
            label="Ordem de exibição"
            name="order"
            type="number"
            min={0}
            defaultValue={category?.order ?? 0}
            hint="Números menores aparecem primeiro."
          />
        </div>

        {/* Coluna direita: imagem */}
        <div>
          <ImageUpload
            label="Imagem da categoria (opcional)"
            value={image}
            onChange={setImage}
            onRemove={() => setImage("")}
            aspectRatio="portrait"
            hint="Imagem que aparece no grid de categorias da Home."
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-noir/10">
        <Button type="submit" loading={isPending}>
          {isEditing ? "Salvar Alterações" : "Criar Categoria"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categorias")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
