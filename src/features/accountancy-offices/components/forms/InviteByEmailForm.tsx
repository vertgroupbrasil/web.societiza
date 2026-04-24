'use client';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from '@shadcn/index';
import { Send } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { InviteByEmailInput } from '../../schemas/office.schema';

interface InviteByEmailFormProps {
  form: UseFormReturn<InviteByEmailInput>;
  onSubmit: (data: InviteByEmailInput) => void;
  isPending?: boolean;
}

export function InviteByEmailForm({
  form,
  onSubmit,
  isPending = false,
}: InviteByEmailFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="colega@escritorio.com.br"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          loading={isPending}
          disabled={isPending}
          className="shrink-0 gap-1.5"
          aria-label="Enviar convite por e-mail"
        >
          <Send className="h-4 w-4" />
          Convidar
        </Button>
      </form>
    </Form>
  );
}
