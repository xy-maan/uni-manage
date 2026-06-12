import Marketplace from "@/app/[locale]/_Components/MarketplaceComponent/Marketplace/Marketplace";
import { useTranslations } from "next-intl";
export default async function MarketPlaceBasic({
  params,
}:{
  params: Promise< { role: string }>;
}) {
  const { role } = await params;
  const t=useTranslations("marketplace")
  return (
 <div className="container mx-auto px-4 py-8">
<div className="mb-8">
    <div className="mb-4">
    <h1 className="text-3xl font-bold">{t("title")}</h1>
    {/* <p className="text-muted-foreground">{t("description")}</p> */}
  </div>
  <div className="flex flex-col lg:flex-row gap-4">
    
  </div>
</div>
   <Marketplace/>
 </div>
  );
}
