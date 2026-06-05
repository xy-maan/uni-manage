"use client"
import { GetStudentDataAction } from '@/Actions/getStudentData.action'
import React, { useEffect } from 'react'

export default function Marketplace() {
    async function GetStudentData(){
      const data =await GetStudentDataAction()
      console.log(data);
      
    }
    useEffect(() => {
     GetStudentData()
    }, [])
    
  return (
    <div>Marketplace</div>
  )
}
