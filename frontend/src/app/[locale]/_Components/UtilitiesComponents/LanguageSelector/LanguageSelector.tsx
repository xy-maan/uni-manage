import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { LANGUAGE } from '@/lib/const'
import { Check, Globe } from 'lucide-react'
import { useLocale } from 'next-intl'
import React from 'react'

export default function LanguageSelector() {
  const locale=useLocale()
  const router=useRouter()
  const pathname=usePathname()
  const selectedlang=LANGUAGE.find(lang=>lang.locale===locale)!

  function switchlang(newLocale:string){
    
    router.replace({pathname},{locale:newLocale})
}
  return (
      
    <DropdownMenu >
  <DropdownMenuTrigger asChild >
          <div className="flex items-center justify-center gap-1">
                      <span className="cursor-pointer text-sm text-foreground flex items-center gap-1.5" onClick={() => switchlang(selectedlang.locale)}>
                        <Globe className="size-4 mt-px" />
                       {selectedlang.name}
                      </span>
             
                      {/* <ChevronDown className="size-4 mt-1 text-foreground"/> */}
                    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
{LANGUAGE.map((lang) => (
  <DropdownMenuItem
    key={lang.locale}
    onClick={() => switchlang(lang.locale)}
  >
    {lang.name}
    {locale === lang.locale && <Check className="size-4 ml-auto" />}
  </DropdownMenuItem>
))}
    {/* {LANGUAGE.map((lan) => {
  ("Item:", lan);
  return (
    <DropdownMenuItem
      key={lan.locale}
      onClick={() => switchlang(lan.locale)}
    >
      {lan.name}
    </DropdownMenuItem>
  );
})} */}
    {/* <DropdownMenuItem>العربية</DropdownMenuItem> */}
  </DropdownMenuContent>
</DropdownMenu>
  )
}
