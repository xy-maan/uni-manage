import React from 'react'

export default function Footer() {
  return (
   <footer className='border-t py-12 bg-background'>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-8">
            <div className="footer-item ">
              <div className="flex items-center gap-2 font-semibold mb-4">
               <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 17L12 22L22 17" stroke="white"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 12L12 17L22 12" stroke="white"   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>

               </div>
               UniManage
              </div>
              <p className='text-sm text-muted-foreground'>The ultimate platform for managing university graduation projects.</p>
            </div>
            <div className="footer-item ">
              <h4 className="mb-4">
               Product
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='hover:text-foreground'>Features</li>
                <li className='hover:text-foreground'>Pricing</li>
                <li className='hover:text-foreground'>FAQ</li>
              </ul>
            </div>
                   <div className="footer-item  ">
              <h4 className="mb-4">
               Company
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='hover:text-foreground'>About</li>
                <li className='hover:text-foreground'>Blog</li>
                <li className='hover:text-foreground'>Contact</li>
              </ul>
            </div>
                    <div className="footer-item  ">
              <h4 className="mb-4">
               Legal
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li className='hover:text-foreground'>Privacy</li>
                <li className='hover:text-foreground'>Terms</li>
                <li className='hover:text-foreground'>Security</li>
              </ul>
            </div>
        </div>
            <div className="border-t pt-8 text-center text-sm text-muted-foreground w-full"><p>© 2026 UniManage. All rights reserved.</p></div>
      </div>
   </footer>
  )
}
