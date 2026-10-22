"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/forms/FormField";
import { useSubmitContact } from "../hooks/useSubmitContact";
import { contactSchema, contactSubjects, type ContactSchema } from "../schemas";

const subjectLabels: Record<ContactSchema["subject"], string> = {
  general: "General inquiry",
  order: "Order question",
  product: "Product / warranty",
  payment: "Payments",
  support: "Technical support",
  other: "Other",
};

/** Form for submitting a "Contact us" message. */
export function ContactForm() {
  const submit = useSubmitContact();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
    },
  });

  const onSubmit = async (values: ContactSchema) => {
    await submit.mutateAsync(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Full name"
          htmlFor="contact-name"
          required
          error={errors.name?.message}
        >
          <Input
            id="contact-name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Email"
          htmlFor="contact-email"
          required
          error={errors.email?.message}
        >
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Phone"
          htmlFor="contact-phone"
          hint="Optional"
          error={errors.phone?.message}
        >
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+855 12 345 678"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </FormField>

        <FormField label="Subject" htmlFor="contact-subject" required>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="contact-subject"
                  className="h-10 w-full"
                  aria-label="Select a subject"
                >
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {contactSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subjectLabels[subject]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Message"
        htmlFor="contact-message"
        required
        error={errors.message?.message}
      >
        <Textarea
          id="contact-message"
          rows={5}
          placeholder="How can we help you?"
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={submit.isPending}
      >
        {submit.isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 size-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}