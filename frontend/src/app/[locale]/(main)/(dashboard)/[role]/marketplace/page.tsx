"use client"
import Marketplace from "@/app/[locale]/_Components/MarketplaceComponents/Marketplace/Marketplace";
import FilteringMarketplace from "../../../../_Components/MarketplaceComponents/FilteringMarketplace";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MarketPlaceBasic() {
  const t = useTranslations("marketplace");
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    technology: "all",
    project_type: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-3xl! font-bold!">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <FilteringMarketplace filters={filters} onFilterChange={handleFilterChange} />
      </div>
      <Marketplace filters={filters} />
    </div>
  );
}
