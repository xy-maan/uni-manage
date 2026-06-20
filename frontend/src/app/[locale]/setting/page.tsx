import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Globe, Lock, Trash2, User } from 'lucide-react'
import React from 'react'
import Security from '../_Components/SettingsComponents/SecuritySettings'
import NotificationsSettings from '../_Components/SettingsComponents/NotificationsSettings'
import PreferencesSettings from '../_Components/SettingsComponents/PreferencesSettings'
import AccountSettings from '../_Components/SettingsComponents/AccountSettings'

export default function setting() {
  return (
    <div className='container mx-auto px-4 lg:px-8 py-8'>

      <div className="mb-8">
        <h1 className="mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
            <Tabs defaultValue="Account" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="Account"><User className='size-4 mr-2'/>Account</TabsTrigger>
          <TabsTrigger value="Security"><Lock className='size-4 mr-2'/>Security</TabsTrigger>
          <TabsTrigger value="Notifications"><Bell className='size-4 mr-2'/>Notifications </TabsTrigger>
          <TabsTrigger value="Preferences"><Globe className='size-4 mr-2'/>Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="Account">
<AccountSettings/>
        </TabsContent>
      <TabsContent value="Security">
<Security/>
        </TabsContent>
              <TabsContent value="Notifications">
<NotificationsSettings/>
        </TabsContent>
                      <TabsContent value="Preferences">
<PreferencesSettings/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
