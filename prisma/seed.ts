import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter });

async function main() {
  // Idempotent: clear existing data before seeding
  await db.businessCertification.deleteMany();
  await db.business.deleteMany();

  // ---------------------------------------------------------------------------
  // 10 APPROVED businesses
  // ---------------------------------------------------------------------------

  const approved = await Promise.all([
    // 1. Restaurant – Tunis – ADMIN_VERIFIED
    db.business.create({
      data: {
        name: "Vert & Saveur",
        slug: slugify("Vert & Saveur"),
        category: "RESTAURANT",
        shortDescription:
          "Restaurant végétarien au coeur de Tunis, zéro déchet et 100 % local.",
        description:
          "Vert & Saveur est un restaurant végétarien fondé en 2019 dans le quartier de Bab El Bhar, Tunis. Notre cuisine s'appuie exclusivement sur des produits frais livrés chaque matin par des agriculteurs bio de la région du Cap Bon. Nous avons éliminé le plastique à usage unique dès notre ouverture et nous compostons l'intégralité de nos déchets organiques en partenariat avec une ferme urbaine locale. Notre carte change selon les saisons pour réduire les kilomètres alimentaires et nous proposons un service de consigne pour les emballages des plats à emporter.",
        governorate: "TUNIS",
        city: "Tunis",
        address: "12 Rue de Marseille, Bab El Bhar",
        lat: 36.8008,
        lng: 10.1798,
        phone: "+216 71 123 456",
        email: "contact@vert-et-saveur.tn",
        website: "https://www.vert-et-saveur.tn",
        instagram: "@vertsaveurtunis",
        priceRange: 2,
        images: [],
        tags: ["végétarien", "bio", "zéro déchet", "tunis"],
        practices: [
          "PLANT_BASED_OPTIONS",
          "LOCALLY_SOURCED",
          "ZERO_WASTE_COMPOSTING",
          "NO_SINGLE_USE_PLASTIC",
          "ANTI_FOOD_WASTE",
        ],
        status: "APPROVED",
        verification: "ADMIN_VERIFIED",
        certifications: {
          create: [
            {
              type: "ORGANIC_BIO_TUNISIE",
              issuer: "CNCC Tunisie",
              year: 2022,
              evidenceUrl:
                "https://www.vert-et-saveur.tn/certifications/bio-tunisie-2022.pdf",
            },
          ],
        },
      },
    }),

    // 2. Café – Ariana – EVIDENCE_PROVIDED
    db.business.create({
      data: {
        name: "Café du Jardin",
        slug: slugify("Café du Jardin"),
        category: "CAFE",
        shortDescription:
          "Café éco-responsable à Ariana avec café de spécialité, gobelets réutilisables et jardin potager.",
        description:
          "Café du Jardin est né de l'envie de créer un espace de vie agréable et respectueux de l'environnement à La Soukra, Ariana. Nous travaillons uniquement avec du café de spécialité issu du commerce équitable et torréfié localement. Tous nos gobelets sont réutilisables et nous offrons une réduction de 500 millimes à toute personne venant avec son propre contenant. Notre terrasse est entourée d'un jardin potager qui fournit herbes aromatiques et légumes à notre cuisine. Les eaux grises de la machine à café sont récupérées pour l'arrosage du jardin.",
        governorate: "ARIANA",
        city: "La Soukra",
        phone: "+216 29 456 789",
        email: "bonjour@cafedujardin.tn",
        instagram: "@cafedujardin_tn",
        priceRange: 2,
        images: [],
        tags: ["café", "bio", "équitable", "jardin"],
        practices: [
          "FAIR_ETHICAL_LABOR",
          "REUSABLE_PACKAGING",
          "WATER_CONSERVATION",
          "LOCALLY_SOURCED",
        ],
        status: "APPROVED",
        verification: "EVIDENCE_PROVIDED",
        certifications: {
          create: [
            {
              type: "FAIR_TRADE",
              issuer: "Fair Trade International",
              year: 2023,
              evidenceUrl:
                "https://www.cafedujardin.tn/docs/fairtrade-cert-2023.pdf",
            },
          ],
        },
      },
    }),

    // 3. Grocery Market – Sousse – ADMIN_VERIFIED
    db.business.create({
      data: {
        name: "Marché Bio Sahel",
        slug: slugify("Marché Bio Sahel"),
        category: "GROCERY_MARKET",
        shortDescription:
          "Épicerie bio en vrac à Sousse, produits locaux et emballages éco-responsables.",
        description:
          "Marché Bio Sahel est la première épicerie entièrement en vrac de la région du Sahel. Depuis 2020, nous proposons à Sousse plus de 200 références de produits alimentaires bio et locaux : légumineuses, céréales, huiles, épices, fruits secs et produits ménagers en vrac. Les clients viennent avec leurs propres contenants ou achètent nos sachets en papier kraft recyclé. Nous travaillons en direct avec 18 producteurs agricoles certifiés bio de la région de Sousse, Nabeul et Kairouan, réduisant ainsi les intermédiaires et améliorant les revenus des agriculteurs. Un programme de compostage collectif est disponible pour nos clients.",
        governorate: "SOUSSE",
        city: "Sousse",
        address: "Avenue Habib Bourguiba, Sousse El Jadida",
        lat: 35.8256,
        lng: 10.6369,
        phone: "+216 73 234 567",
        email: "info@marchebiosahel.tn",
        website: "https://www.marchebiosahel.tn",
        priceRange: 2,
        images: [],
        tags: ["bio", "vrac", "local", "épicerie"],
        practices: [
          "BULK_PACKAGE_FREE",
          "LOCALLY_SOURCED",
          "ZERO_WASTE_COMPOSTING",
          "NO_SINGLE_USE_PLASTIC",
          "RECYCLING_PROGRAM",
        ],
        status: "APPROVED",
        verification: "ADMIN_VERIFIED",
        certifications: {
          create: [
            {
              type: "ORGANIC_BIO_TUNISIE",
              issuer: "CNCC Tunisie",
              year: 2021,
              evidenceUrl:
                "https://www.marchebiosahel.tn/certifs/bio-2021.pdf",
            },
            {
              type: "EU_ORGANIC",
              issuer: "Bureau Veritas",
              year: 2023,
              evidenceUrl:
                "https://www.marchebiosahel.tn/certifs/eu-organic-2023.pdf",
            },
          ],
        },
      },
    }),

    // 4. Accommodation – Medenine (Djerba) – ADMIN_VERIFIED
    db.business.create({
      data: {
        name: "Dar Djerba Éco Lodge",
        slug: slugify("Dar Djerba Éco Lodge"),
        category: "ACCOMMODATION",
        shortDescription:
          "Éco lodge à Djerba dans une maison traditionnelle, énergie solaire et cuisine locale.",
        description:
          "Dar Djerba Éco Lodge est une maison d'hôtes traditionnelle restaurée à Houmt Souk, dans l'île de Djerba. Construite en pierre locale et chaulée à la chaux naturelle, elle accueille les voyageurs soucieux de l'environnement dans 8 chambres décorées d'artisanat local. L'ensemble de la propriété fonctionne à l'énergie solaire grâce à des panneaux photovoltaïques installés en 2021. L'eau chaude est produite par des chauffe-eau solaires. Le petit-déjeuner est composé exclusivement de produits bio de l'île : figues, grenades, olives, fromage de brebis et pain maison. Des vélos sont mis à disposition des clients pour explorer l'île sans voiture.",
        governorate: "MEDENINE",
        city: "Houmt Souk",
        address: "Rue Moncef Bey, Houmt Souk, Djerba",
        lat: 33.8767,
        lng: 10.8582,
        phone: "+216 75 650 123",
        email: "reservation@dardjerba.tn",
        website: "https://www.dardjerba.tn",
        instagram: "@dardjerba_ecolodge",
        priceRange: 3,
        images: [],
        tags: ["djerba", "éco lodge", "solaire", "artisanat", "vélo"],
        practices: [
          "RENEWABLE_ENERGY",
          "WATER_CONSERVATION",
          "LOCALLY_SOURCED",
          "BIKE_EV_FRIENDLY",
          "NO_SINGLE_USE_PLASTIC",
        ],
        status: "APPROVED",
        verification: "ADMIN_VERIFIED",
        certifications: {
          create: [
            {
              type: "GREEN_KEY",
              issuer: "Green Key International",
              year: 2022,
              evidenceUrl:
                "https://www.dardjerba.tn/certifications/greenkey-2022.pdf",
            },
          ],
        },
      },
    }),

    // 5. Retail Shop – Sfax – EVIDENCE_PROVIDED
    db.business.create({
      data: {
        name: "Sfax Nature Boutique",
        slug: slugify("Sfax Nature Boutique"),
        category: "RETAIL_SHOP",
        shortDescription:
          "Boutique de cosmétiques naturels et produits ménagers écologiques fabriqués en Tunisie.",
        description:
          "Sfax Nature Boutique propose depuis 2018 une sélection soigneuse de cosmétiques naturels, savons artisanaux et produits ménagers écologiques fabriqués en Tunisie. Notre gamme comprend des huiles essentielles de romarin et de géranium cultivés en agriculture biologique dans la région de Sfax, des savons à l'huile d'olive vierge pressée à froid, des shampoings solides sans sulfates et des produits ménagers concentrés en recharge. Tous nos emballages sont en verre recyclable ou en papier kraft. Nous refusons tout ingrédient issu de la pétrochimie et n'effectuons aucun test sur les animaux.",
        governorate: "SFAX",
        city: "Sfax",
        address: "Rue Habib Maazoun, Médina de Sfax",
        lat: 34.7406,
        lng: 10.7603,
        phone: "+216 74 345 678",
        email: "boutique@sfaxnature.tn",
        website: "https://www.sfaxnature.tn",
        instagram: "@sfaxnatureboutique",
        images: [],
        tags: ["cosmétiques", "naturel", "artisanal", "sfax", "savon"],
        practices: [
          "NO_SINGLE_USE_PLASTIC",
          "REUSABLE_PACKAGING",
          "LOCALLY_SOURCED",
          "RECYCLING_PROGRAM",
        ],
        status: "APPROVED",
        verification: "EVIDENCE_PROVIDED",
        certifications: {
          create: [
            {
              type: "ORGANIC_BIO_TUNISIE",
              issuer: "CNCC Tunisie",
              year: 2023,
              evidenceUrl:
                "https://www.sfaxnature.tn/docs/certification-bio-2023.pdf",
            },
          ],
        },
      },
    }),

    // 6. Services – Nabeul – EVIDENCE_PROVIDED
    db.business.create({
      data: {
        name: "SolaireCap Energies",
        slug: slugify("SolaireCap Energies"),
        category: "SERVICES",
        shortDescription:
          "Installation et maintenance de panneaux solaires pour particuliers et entreprises à Hammamet et Cap Bon.",
        description:
          "SolaireCap Energies est une entreprise spécialisée dans l'installation, la maintenance et l'optimisation de systèmes d'énergie solaire photovoltaïque et thermique dans la région du Cap Bon. Fondée en 2017 par des ingénieurs en énergie renouvelable, elle a équipé plus de 400 toitures résidentielles et commerciales à Hammamet, Nabeul et Kelibia. Nos équipes interviennent également pour des audits énergétiques et des solutions de stockage par batterie. Nous formons des techniciens locaux en partenariat avec le CETIME et l'ANME pour développer les compétences nationales dans le secteur des énergies renouvelables.",
        governorate: "NABEUL",
        city: "Hammamet",
        phone: "+216 72 456 789",
        email: "contact@solairecap.tn",
        website: "https://www.solairecap.tn",
        facebook: "SolaireCapEnergies",
        images: [],
        tags: ["solaire", "photovoltaïque", "énergie renouvelable", "hammamet"],
        practices: [
          "RENEWABLE_ENERGY",
          "FAIR_ETHICAL_LABOR",
          "WATER_CONSERVATION",
        ],
        status: "APPROVED",
        verification: "EVIDENCE_PROVIDED",
      },
    }),

    // 7. Company B2B – Bizerte – SELF_DECLARED
    db.business.create({
      data: {
        name: "AquaPure Bizerte",
        slug: slugify("AquaPure Bizerte"),
        category: "COMPANY_B2B",
        shortDescription:
          "Solutions de traitement et de recyclage des eaux usées industrielles pour la région Nord.",
        description:
          "AquaPure Bizerte est une société d'ingénierie environnementale qui conçoit et déploie des systèmes de traitement des eaux usées industrielles dans la région de Bizerte et au nord de la Tunisie. Notre expertise couvre la conception de stations d'épuration compactes, les systèmes de filtration membranaire et le conseil en conformité environnementale. Depuis 2015, nous avons traité les eaux de plus de 30 unités industrielles dans les secteurs de l'agroalimentaire, du textile et de la chimie. Nous collaborons avec l'ANPE et le CITET pour accompagner les entreprises dans l'obtention de leur certification environnementale ISO 14001.",
        governorate: "BIZERTE",
        city: "Bizerte",
        phone: "+216 72 567 890",
        email: "info@aquapure-bizerte.tn",
        website: "https://www.aquapure-bizerte.tn",
        images: [],
        tags: ["eau", "traitement", "b2b", "bizerte", "environnement"],
        practices: [
          "WATER_CONSERVATION",
          "RECYCLING_PROGRAM",
          "FAIR_ETHICAL_LABOR",
        ],
        status: "APPROVED",
        verification: "SELF_DECLARED",
      },
    }),

    // 8. Restaurant – Monastir – EVIDENCE_PROVIDED
    db.business.create({
      data: {
        name: "La Table du Pêcheur Vert",
        slug: slugify("La Table du Pêcheur Vert"),
        category: "RESTAURANT",
        shortDescription:
          "Poissons de la pêche artisanale locale et légumes du marché de Monastir, cuisine méditerranéenne.",
        description:
          "La Table du Pêcheur Vert est un restaurant de cuisine méditerranéenne à Monastir qui met en avant la pêche artisanale locale et les légumes de saison. Nous nous approvisionnons directement auprès de pêcheurs artisanaux du port de Monastir qui pratiquent la pêche à faible impact et évitent les espèces surexploitées. Nos légumes viennent du marché hebdomadaire de producteurs locaux de la région. La carte change entièrement selon les arrivages et la saison pour garantir la fraîcheur et réduire le gaspillage alimentaire. Les huiles de cuisson usagées sont collectées pour être transformées en biodiesel. Nous avons banni les bouteilles en plastique à usage unique et proposons de l'eau filtrée en carafe.",
        governorate: "MONASTIR",
        city: "Monastir",
        phone: "+216 73 678 901",
        email: "reservation@pecheurvert.tn",
        instagram: "@pecheurvert_monastir",
        priceRange: 3,
        images: [],
        tags: ["poisson", "méditerranéen", "local", "artisanal", "monastir"],
        practices: [
          "LOCALLY_SOURCED",
          "ANTI_FOOD_WASTE",
          "NO_SINGLE_USE_PLASTIC",
          "WATER_CONSERVATION",
        ],
        status: "APPROVED",
        verification: "EVIDENCE_PROVIDED",
      },
    }),

    // 9. Other – Kairouan – ADMIN_VERIFIED
    db.business.create({
      data: {
        name: "Association Kairouan Verte",
        slug: slugify("Association Kairouan Verte"),
        category: "OTHER",
        shortDescription:
          "Association de sensibilisation écologique et de plantation d'arbres à Kairouan et sa région.",
        description:
          "Association Kairouan Verte est une organisation à but non lucratif fondée en 2016 par des habitants de Kairouan soucieux de la dégradation de l'environnement dans leur région. Nos activités principales incluent des campagnes de plantation d'oliviers et d'arbres fruitiers dans les zones dégradées, des ateliers d'éducation environnementale dans les écoles primaires, la collecte et le tri sélectif des déchets dans les quartiers périphériques, et la création de jardins communautaires. Depuis notre fondation, nous avons planté plus de 12 000 arbres et sensibilisé plus de 8 000 élèves. Nous travaillons en partenariat avec la Direction Régionale de l'Environnement et plusieurs ONG internationales.",
        governorate: "KAIROUAN",
        city: "Kairouan",
        phone: "+216 77 123 456",
        email: "contact@kairouanverte.org",
        website: "https://www.kairouanverte.org",
        facebook: "AssociationKairouanVerte",
        images: [],
        tags: [
          "association",
          "plantation",
          "kairouan",
          "éducation",
          "bénévolat",
        ],
        practices: [
          "RECYCLING_PROGRAM",
          "ZERO_WASTE_COMPOSTING",
          "LOCALLY_SOURCED",
          "FAIR_ETHICAL_LABOR",
        ],
        status: "APPROVED",
        verification: "ADMIN_VERIFIED",
        certifications: {
          create: [
            {
              type: "B_CORP",
              issuer: "B Lab",
              year: 2024,
              evidenceUrl:
                "https://www.kairouanverte.org/certifications/bcorp-2024.pdf",
            },
          ],
        },
      },
    }),

    // 10. Grocery Market – Gabès – SELF_DECLARED
    db.business.create({
      data: {
        name: "Oasis Bio Market",
        slug: slugify("Oasis Bio Market"),
        category: "GROCERY_MARKET",
        shortDescription:
          "Épicerie de produits bio et naturels de l'oasis de Gabès : dattes, herbes et huiles.",
        description:
          "Oasis Bio Market est une épicerie familiale à Gabès qui valorise les trésors de l'oasis littorale, unique au monde. Nous proposons des dattes Deglet Nour et Allig séchées naturellement, du henné naturel pur, des herbes médicinales de l'oasis (romarin, myrte, origan), de l'huile d'olive extra vierge des oliveraies traditionnelles de la région et des figues de Barbarie séchées. Tous nos produits sont cultivés sans pesticides de synthèse par des familles de l'oasis de Gabès. Nous travaillons à la préservation de cette oasis marine menacée par la pollution industrielle en reversant 5 % de nos ventes à une association de protection locale. Les emballages utilisés sont en fibres de palmier dattier recyclées.",
        governorate: "GABES",
        city: "Gabès",
        phone: "+216 75 234 567",
        email: "oasisbiomarket@gmail.com",
        instagram: "@oasisbio_gabes",
        priceRange: 1,
        images: [],
        tags: ["oasis", "dattes", "bio", "gabès", "herbes"],
        practices: [
          "LOCALLY_SOURCED",
          "NO_SINGLE_USE_PLASTIC",
          "REUSABLE_PACKAGING",
          "FAIR_ETHICAL_LABOR",
        ],
        status: "APPROVED",
        verification: "SELF_DECLARED",
      },
    }),
  ]);

  // ---------------------------------------------------------------------------
  // 2 PENDING businesses
  // ---------------------------------------------------------------------------

  const pending = await Promise.all([
    // 11. Café – Nabeul – PENDING / SELF_DECLARED
    db.business.create({
      data: {
        name: "Le Grenier de Hammamet",
        slug: slugify("Le Grenier de Hammamet"),
        category: "CAFE",
        shortDescription:
          "Café-épicerie à Hammamet proposant smoothies aux fruits locaux et collations artisanales sans emballage.",
        description:
          "Le Grenier de Hammamet est un nouveau café-épicerie ouvert début 2026 dans la médina de Hammamet. Notre concept : des boissons fraîches préparées avec des fruits cultivés dans les vergers alentour, des gâteaux maison à base de farine de semoule locale et un espace épicerie vrac pour les produits du quotidien. Nous refusons tout emballage plastique et proposons des sacs en tissu fabriqués par des artisanes locales. Nous souhaitons à terme obtenir la certification bio tunisienne et mettons actuellement en place notre dossier de demande.",
        governorate: "NABEUL",
        city: "Hammamet",
        phone: "+216 22 987 654",
        email: "grenier.hammamet@gmail.com",
        instagram: "@legrenier_hammamet",
        priceRange: 1,
        images: [],
        tags: ["smoothies", "vrac", "hammamet", "artisanal"],
        practices: [
          "NO_SINGLE_USE_PLASTIC",
          "LOCALLY_SOURCED",
          "ANTI_FOOD_WASTE",
        ],
        status: "PENDING",
        verification: "SELF_DECLARED",
      },
    }),

    // 12. Retail Shop – Sfax – PENDING / SELF_DECLARED
    db.business.create({
      data: {
        name: "Écotextile Sfax",
        slug: slugify("Écotextile Sfax"),
        category: "RETAIL_SHOP",
        shortDescription:
          "Vêtements et textile de maison en coton biologique et fibres naturelles tunisiennes.",
        description:
          "Écotextile Sfax est une jeune marque de vêtements et de textile de maison née en 2025 à Sfax. Nous concevons des pièces intemporelles en coton biologique cultivé en Tunisie et en fibres naturelles (lin, chanvre) importées de façon équitable. Notre atelier de confection emploie des couturières locales payées au-dessus du SMIG et bénéficiant d'une couverture sociale complète. Nous utilisons des teintures végétales naturelles issues de plantes tinctoriales cultivées sans pesticides. Chaque vêtement est accompagné de sa fiche traçabilité. Nous sommes en cours de dépôt de dossier pour la certification GOTS (Global Organic Textile Standard).",
        governorate: "SFAX",
        city: "Sfax",
        phone: "+216 52 876 543",
        email: "contact@ecotextile-sfax.tn",
        instagram: "@ecotextile_sfax",
        images: [],
        tags: ["textile", "coton bio", "sfax", "mode éthique", "artisanat"],
        practices: [
          "FAIR_ETHICAL_LABOR",
          "NO_SINGLE_USE_PLASTIC",
          "LOCALLY_SOURCED",
          "REUSABLE_PACKAGING",
        ],
        status: "PENDING",
        verification: "SELF_DECLARED",
      },
    }),
  ]);

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  const totalApproved = await db.business.count({
    where: { status: "APPROVED" },
  });
  const totalPending = await db.business.count({
    where: { status: "PENDING" },
  });
  const totalCerts = await db.businessCertification.count();

  console.log("\n--- Seed complete ---");
  console.log(`APPROVED businesses : ${totalApproved}`);
  console.log(`PENDING  businesses : ${totalPending}`);
  console.log(`Certifications      : ${totalCerts}`);
  console.log(`Total businesses    : ${totalApproved + totalPending}`);
  console.log("---------------------\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
