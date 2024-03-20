'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  Form
} from '@/components/ui/form'
import { CardWrapper } from './card-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { reset } from '@/actions/reset'

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>('')
  const [success, setSucces] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('')
    setSucces('')

    startTransition(() => {
      reset(values).then(data => {
        setError(data?.error)
        setSucces(data?.success)
      })
    })
    reset(values)
  }

  return (
    <CardWrapper
      headerLabel="Forgot your Password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} className="w-full my-4" type="submit">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
