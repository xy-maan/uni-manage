import SidebarAdmin from "@/app/_Components/SidebarAdmin/SidebarAdmin";
import {
    SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        // <div className="min-h-screen w-full">
    <SidebarProvider>
        <SidebarAdmin/>
           {/* <SidebarInset> */}

      <main className="p-4">{children}</main>
           {/* </SidebarInset> */}
    </SidebarProvider>
        // {/* </div> */}
            
  );
}