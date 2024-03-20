'use client'

import { useState, useTransition } from 'react'
import * as z from 'zod'

import { settings } from '@/actions/settings'
import { SettingsSchema } from '@/schemas'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { FormSuccess } from '@/components/form-success'
import { FormError } from '@/components/form-error'

const SettignsPage = () => {
  const [isPending, startTransition] = useTransition()
  const { update } = useSession()
  const [error, setError] = useState<string>('')
  const [success, setSucces] = useState<string>('')
  const user = useCurrentUser()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then(data => {
          if (data.error) {
            setError(data.error)
          }

          if (data.success) {
            update()
            setSucces(data.success)
          }
        })
        .catch(() => {
          setError('An error occurred')
        })
    })
  }

  return (
    <Card className="max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Settings</p>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Jhon Doe"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit">Save</Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default SettignsPage
