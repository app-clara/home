import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_bJe28t7eD69g63l8hi73G01";
const commonTimes = [
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora e 30 minutos" },
  { value: "120", label: "2 horas" },
];
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
    .regex(/^\d{11}$/, { message: "Telefone deve ter exatamente 11 dígitos" }),
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
  attendance_time: z.string()
    .min(1, { message: "Tempo de atendimento é obrigatório" }),
});
type FormData = z.infer<typeof formSchema>;
export const RegistrationFormPaid = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      attendance_time: "",
    },
  });
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const registrationData = {
        id: crypto.randomUUID(),
        ...data,
        number_of_employees: data.number_of_employees ? parseInt(data.number_of_employees) : null,
        flg_onboarding: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const jsonData = JSON.stringify(registrationData, null, 2);
      console.log("Registration data (JSON):", jsonData);
      const response = await fetch('https://leadsclarafull-504763904926.southamerica-east1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
      });
      if (response.ok) {
        console.log("Data saved successfully! Redirecting to checkout...");
        // Redirect to Stripe Payment Link with prefilled email
        const checkoutUrl = `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(data.email)}`;
        window.location.href = checkoutUrl;
      } else {
        console.log('Error saving data');
        toast.error("Erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-2xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-foreground">Enviando seu cadastro...</p>
            <p className="text-sm text-muted-foreground">Você será redirecionado para o pagamento</p>
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="full_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl><Input type="email" placeholder="seu@email.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (WhatsApp) *</FormLabel>
                <FormControl><Input placeholder="11999999999" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do negócio *</FormLabel>
                <FormControl><Input placeholder="Nome da sua empresa" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="business_sector" render={({ field }) => (
              <FormItem>
                <FormLabel>Setor de atuação *</FormLabel>
                <FormControl><Input placeholder="Ex: Saúde, Educação, Beleza" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="number_of_employees" render={({ field }) => (
              <FormItem>
                <FormLabel>Número de funcionários *</FormLabel>
                <FormControl><Input type="text" placeholder="Ex: 5" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="attendance_time" render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo de atendimento *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione o tempo" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commonTimes.map((time) => (
                      <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="business_description" render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do negócio</FormLabel>
              <FormControl>
                <Textarea placeholder="Conte um pouco sobre o seu negócio..." className="resize-none" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="flex flex-col items-center gap-4">
            <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</>
              ) : (
                "Assinar por R$35/mês"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Pagamento seguro via Stripe. Cancele quando quiser.
            </p>
          </div>
        </form>
      </Form>
    </>
  );
};
