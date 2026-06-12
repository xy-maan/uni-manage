import Marketplace from "@/app/[locale]/_Components/MarketplaceComponents/Marketplace/Marketplace";
import { getTranslations } from "next-intl/server";
import FilteringMarketplace from "../../_Components/MarketplaceComponents/FilteringMarketplace";
export default async function MarketPlaceBasic({
  params,
}:{
  params: Promise< { role: string }>;
}) {
  const { role } = await params;
  const t = await getTranslations("marketplace");

  return (
 <div className="container mx-auto px-4 py-8">
<div className="mb-8">
    <div className="mb-4">
    <h1 className="text-3xl! font-bold!">{t("title")}</h1>
    <p className="text-muted-foreground">{t("description")}</p>
  </div>
  <div className="flex flex-col lg:flex-row gap-4">
    <FilteringMarketplace/>
  </div>
</div>
   <Marketplace/>
 </div>
  );
}
