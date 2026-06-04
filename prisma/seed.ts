import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Seed — Dados iniciais para Val Quaresma
 *
 * Roda com: `npx prisma db seed`
 * (configurar no package.json — instruções no fim do arquivo)
 *
 * Estratégia:
 * - Idempotente: usa `upsert` para poder rodar várias vezes sem erro
 * - Cria categorias, produtos de exemplo e o usuário admin inicial
 * - Senha admin gerada via env var (NUNCA hardcode em produção)
 */

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...\n");

  // ==========================================================================
  // 1. USUÁRIO ADMIN
  // ==========================================================================
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@valquaresma.com.br";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe@123";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Val Quaresma",
      password: passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  // ==========================================================================
  // 2. CATEGORIAS
  // ==========================================================================
  const categoriesData = [
    {
      name: "Vestidos",
      slug: "vestidos",
      description: "Vestidos exclusivos para todas as ocasiões",
      order: 1,
    },
    {
      name: "Joias",
      slug: "joias",
      description: "Peças delicadas que valorizam seu estilo",
      order: 2,
    },
    {
      name: "Acessórios",
      slug: "acessorios",
      description: "O detalhe que transforma o look",
      order: 3,
    },
    {
      name: "Blusas",
      slug: "blusas",
      description: "Conforto e elegância no dia a dia",
      order: 4,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categoriesData.length} categorias criadas`);

  // Recupera IDs para usar nos produtos
  const vestidos = await prisma.category.findUniqueOrThrow({
    where: { slug: "vestidos" },
  });
  const joias = await prisma.category.findUniqueOrThrow({
    where: { slug: "joias" },
  });
  const acessorios = await prisma.category.findUniqueOrThrow({
    where: { slug: "acessorios" },
  });

  // ==========================================================================
  // 3. PRODUTOS DE EXEMPLO
  // ==========================================================================
  // Imagens placeholder do Unsplash — substitua pelas reais via painel admin.
  const productsData = [
    {
      name: "Vestido Midi Floral",
      slug: "vestido-midi-floral",
      description:
        "Vestido midi em tecido leve com estampa floral exclusiva. Caimento perfeito e tecido de alta qualidade para um visual sofisticado em qualquer ocasião.",
      price: 289.9,
      mainImage:
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800",
      categoryId: vestidos.id,
      featured: true,
      stock: 12,
    },
    {
      name: "Colar Dourado Delicado",
      slug: "colar-dourado-delicado",
      description:
        "Colar banhado a ouro com pingente delicado. Peça versátil que combina com looks casuais e ocasiões especiais.",
      price: 129.9,
      mainImage:
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800",
      categoryId: joias.id,
      featured: true,
      stock: 25,
    },
    {
      name: "Bolsa de Couro Caramelo",
      slug: "bolsa-de-couro-caramelo",
      description:
        "Bolsa estruturada em couro legítimo. Tamanho ideal para o dia a dia, com compartimentos internos organizados.",
      price: 459.0,
      mainImage:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      categoryId: acessorios.id,
      featured: false,
      stock: 8,
    },
    {
      name: "Vestido Longo Off White",
      slug: "vestido-longo-off-white",
      description:
        "Vestido longo em tecido fluido, ideal para eventos especiais. Modelagem que valoriza a silhueta com elegância.",
      price: 549.9,
      mainImage:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800",
      categoryId: vestidos.id,
      featured: true,
      stock: 5,
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log(`✅ ${productsData.length} produtos criados`);

  console.log("\n🎉 Seed concluído com sucesso!\n");
  console.log("📧 Login admin:", adminEmail);
  console.log("🔑 Senha admin:", adminPassword);
  console.log("\n⚠️  TROQUE A SENHA NO PRIMEIRO LOGIN!\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
