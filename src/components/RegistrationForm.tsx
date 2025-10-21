import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  full_name: z.string()
    .trim()
    .min(2, { message: "Nome completo deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome completo deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
  phone_number: z.string()
    .trim()
    .min(1, { message: "Telefone é obrigatório" })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Número de telefone inválido (use formato E.164, ex: +5511999999999)" }),
  business_name: z.string()
    .trim()
    .min(2, { message: "Nome do negócio deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome do negócio deve ter no máximo 100 caracteres" }),
  business_sector: z.string()
    .trim()
    .min(1, { message: "Setor de atuação é obrigatório" })
    .max(100, { message: "Setor deve ter no máximo 100 caracteres" }),
  business_description: z.string()
    .trim()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres" })
    .optional(),
  number_of_employees: z.string()
    .trim()
    .min(1, { message: "Número de funcionários é obrigatório" })
    .regex(/^\d+$/, { message: "Digite apenas números" }),
});

type FormData = z.infer<typeof formSchema>;

export const RegistrationForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      business_name: "",
      business_sector: "",
      business_description: "",
      number_of_employees: "",
    },
  });

  const onSubmit = (data: FormData) => {
    // Generate UUID and timestamps
    const registrationData = {
      id: crypto.randomUUID(),
      ...data,
      number_of_employees: data.number_of_employees ? parseInt(data.number_of_employees) : null,
      flg_onboarding: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Serialize to JSON
    const jsonData = JSON.stringify(registrationData, null, 2);
    console.log("Registration data (JSON):", jsonData);
    
    // Here you would integrate with your backend
    // Example: send jsonData to your API endpoint
    toast.success("Obrigado! Entraremos em contato em breve.");
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (WhatsApp) *</FormLabel>
                <FormControl>
                  <Input placeholder="+5511999999999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do negócio *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da sua empresa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor de atuação *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Saúde, Educação, Beleza" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number_of_employees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de funcionários *</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Ex: 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="business_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do negócio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Conte um pouco sobre o seu negócio..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center gap-4">
          <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto">
            Começar grátis
          </Button>
          <p className="text-sm text-muted-foreground">
            Sem compromisso. Cancele quando quiser.
          </p>
        </div>
      </form>
    </Form>
  );
};
