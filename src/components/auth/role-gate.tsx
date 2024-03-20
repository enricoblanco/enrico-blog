'use client'

import React from 'react'
import { UserRole } from '@prisma/client'
import { useCurrentUserRole } from '@/hooks/use-current-role'
import { FormError } from '../form-error'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentUserRole()

  if (role !== allowedRole) {
    return <FormError message="You are not authorized to view this page." />
  }
  return <>{children}</>
}
