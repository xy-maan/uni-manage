import CardMeth from '@/app/_Components/Projects/Methodology/CardMeth'
import HeaderMeth from '@/app/_Components/Projects/Methodology/HeaderMeth'
import React from 'react'
import SprintPage from '../../../../../_Components/Projects/Methodology/sprint/SprintMethodology/SprintMethodology'
import MilestonePage from '@/app/_Components/Projects/Methodology/Milestone/MilestoneMethodology/MilestoneMethodology'
import FlexiblePage from '@/app/_Components/Projects/Methodology/Flexible/FlexibleMethodology/FlexibleMethodology'

export default function page() {
  return (
       <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* <SprintPage/> */}
        {/* <MilestonePage/> */}
        <FlexiblePage/>
</div>
  )
}
