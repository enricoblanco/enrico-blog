'use client'

import { RoleGate } from '@/components/auth/role-gate'
import { FormSuccess } from '@/components/form-success'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCurrentUserRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'

const AdminPage = () => {
  return (
    <Card>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are an admin!" />
        </RoleGate>
      </CardContent>
    </Card>
  )
}

export default AdminPage
