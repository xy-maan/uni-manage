"use client"
import { Button } from '@/components/ui/button'
import { LayoutGrid, List } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
import CardMarketplace from '../CardMarketplace'
import { getMarketplaceProjectsAction } from '@/Actions/getMarketplaceProjects.action'
import { MarketplaceProjectCard } from '@/types/marketplace'

interface MarketplaceProps {
  filters: {
    search: string;
    category: string;
    technology: string;
    project_type: string;
  };
}

export default function Marketplace({ filters }: MarketplaceProps) {
  const [switchLayout, setSwitchLayout] = useState<string>("grid")
  const [projects, setProjects] = useState<MarketplaceProjectCard[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const buildParams = useCallback(() => {
    const params: Record<string, string> = { page: currentPage.toString() };
    if (filters.search) params.search = filters.search;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.technology && filters.technology !== 'all') params.technology = filters.technology;
    if (filters.project_type && filters.project_type !== 'all') params.project_type = filters.project_type;
    return params;
  }, [filters, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  useEffect(() => {
    async function loadProjects() {
      setLoading(true)
      const { ok, payload } = await getMarketplaceProjectsAction(buildParams())
      if (ok && payload) {
        setProjects(payload.results || [])
        setTotalCount(payload.count || 0)
        setTotalPages(Math.ceil((payload.count || 0) / 12))
      }
      setLoading(false)
    }
    loadProjects()
  }, [buildParams])

  const hasActiveFilters = filters.search || (filters.category && filters.category !== 'all') || (filters.technology && filters.technology !== 'all') || (filters.project_type && filters.project_type !== 'all')

  return (
    <div className="">
      <div className='flex items-center justify-between mb-8'>
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `${totalCount} projects found`}
        </p>
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <Button onClick={() => setSwitchLayout("grid")} className={`${switchLayout == "grid" ? "" : "bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"} h-8 py-0 px-3 has-[>svg]:px-2.5 `} >
            <LayoutGrid className='size-4' />
            Grid
          </Button>
          <Button onClick={() => setSwitchLayout("list")} className={`${switchLayout == "list" ? "" : "bg-transparent hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"} h-8 py-0  px-3  has-[>svg]:px-2.5`} >
            <List className='size-4' />
            List
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No projects found matching your filters.</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className={`grid ${switchLayout == "grid" ? " grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "grid-cols-1"} `}>
            {projects.map((project) => (
              <CardMarketplace key={project.id} project={project} switchLayout={switchLayout} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
