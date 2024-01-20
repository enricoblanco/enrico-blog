'use client'

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Header } from './header'
import { BackButton } from './back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  bacckButtonHref: string
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  bacckButtonHref
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton href={bacckButtonHref} label={backButtonLabel}></BackButton>
      </CardFooter>
    </Card>
  )
}
