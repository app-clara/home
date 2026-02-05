import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Loader2, CheckCircle, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import logoClara from "@/assets/logo-clara.png";

const commonTimes = [
  { value: "15", label: "15 minutos" },
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora e 30 minutos" },
  { value: "120", label: "2 horas" },
];

// Step 1: Email schema
const emailSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Email inválido" })
    .max(255, { message: "Email deve ter no máximo 255 caracteres" }),
});

// Step 2: Token schema
const tokenSchema = z.object({
  token: z.string()
    .trim()
    .min(1, { message: "Token é obrigatório" })
    .max(50, { message: "Token deve ter no máximo 50 caracteres" }),
});

// Step 3: Edit form schema
const editFormSchema = z.object({
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
  send_reminders: z.boolean(),
  integrate_google_calendar: z.boolean(),
});

type EmailData = z.infer<typeof emailSchema>;
type TokenData = z.infer<typeof tokenSchema>;
type EditFormData = z.infer<typeof editFormSchema>;

const EditPreferences = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const tokenForm = useForm<TokenData>({
    resolver: zodResolver(tokenSchema),
    defaultValues: { token: "" },
  });

  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      business_name: "",
      business_sector: "",
      business_description: "",
      number_of_employees: "",
      attendance_time: "",
      send_reminders: true,
      integrate_google_calendar: true,
    },
  });

  const onEmailSubmit = async (data: EmailData) => {
    setIsLoading(true);
    try {
      // Call endpoint to send reset token
      const response = await fetch('https://southamerica-east1-youtube-api-atomus.cloudfunctions.net/claraleads-editpreferences/send_reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setUserEmail(data.email);
        toast.success("Token enviado para seu email!");
      } else {
        toast.error("Erro ao enviar token. Tente novamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao enviar token. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const onTokenSubmit = async (data: TokenData) => {
    setIsLoading(true);
    try {
      // Call endpoint to verify token
      const response = await fetch('https://southamerica-east1-youtube-api-atomus.cloudfunctions.net/claraleads-editpreferences/verify_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, token: data.token }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Populate form with existing user data
        editForm.reset({
          full_name: userData.full_name || "",
          email: userData.email || userEmail,
          phone_number: userData.phone_number || "",
          business_name: userData.business_name || "",
          business_sector: userData.business_sector || "",
          business_description: userData.business_description || "",
          number_of_employees: userData.number_of_employees?.toString() || "",
          attendance_time: userData.attendance_time || "",
          send_reminders: userData.send_reminders || true,
          integrate_google_calendar: userData.integrate_google_calendar || true,
        });
        toast.success("Token verificado com sucesso!");
        // Redirect to edit form after populating data
        setStep(2);
      } else {
        toast.error("Token inválido. Tente novamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao verificar token. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const onEditSubmit = async (data: EditFormData) => {
    setIsLoading(true);
    try {
      const updateData = {
        ...data,
        number_of_employees: data.number_of_employees ? parseInt(data.number_of_employees) : null,
      };

      const jsonData = JSON.stringify(updateData, null, 2);
      console.log("Update data (JSON):", jsonData);

      const response = await fetch('https://southamerica-east1-youtube-api-atomus.cloudfunctions.net/claraleads-editpreferences/submit_form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
      });

      if (response.ok) {
        console.log("Preferences updated successfully!");
        setShowSuccess(true);
      } else {
        toast.error("Erro ao atualizar. Tente novamente.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao atualizar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-2xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-foreground">
              {step === 1 ? "Enviando token..." : "Processando..."}
            </p>
            <p className="text-sm text-muted-foreground">Aguarde um momento</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 p-12 rounded-3xl bg-card border border-border shadow-2xl max-w-md mx-4 animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Preferências atualizadas!</h2>
              <p className="text-muted-foreground">
                Suas configurações foram salvas com sucesso.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                variant="hero"
                size="lg"
                onClick={() => setShowSuccess(false)}
                className="w-full"
              >
                Fechar
              </Button>
              <Link to="/" className="w-full">
                <Button variant="outline" size="lg" className="w-full">
                  Voltar ao início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <Link to="/">
              <img src={logoClara} alt="Clara" className="h-24 w-auto" />
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="text-xs sm:text-sm whitespace-nowrap px-3 sm:px-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-36 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <span className="hidden sm:inline font-medium">Verificar email</span>
              </div>
              <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <span className="hidden sm:inline font-medium">Editar preferências</span>
              </div>
            </div>
          </div>

          {/* Step 1: Email Verification */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Editar suas preferências</h1>
                <p className="text-muted-foreground">
                  Digite seu email cadastrado para receber um código de verificação.
                </p>
              </div>

              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email cadastrado *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar código de verificação"
                    )}
                  </Button>
                </form>
              </Form>

              {/* Token input appears after email is submitted */}
              {userEmail && (
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="text-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <KeyRound className="h-6 w-6 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enviamos um código para <strong>{userEmail}</strong>
                    </p>
                  </div>

                  <Form {...tokenForm}>
                    <form onSubmit={tokenForm.handleSubmit(onTokenSubmit)} className="space-y-6">
                      <FormField
                        control={tokenForm.control}
                        name="token"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código de verificação *</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite o código recebido" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          "Verificar código"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Edit Form */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Editar suas preferências</h1>
                <p className="text-muted-foreground">
                  Atualize suas informações e configurações.
                </p>
              </div>

              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
                  {/* Original Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone (WhatsApp) *</FormLabel>
                          <FormControl>
                            <Input placeholder="11999999999" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={editForm.control}
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
                      control={editForm.control}
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
                      control={editForm.control}
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

                    <FormField
                      control={editForm.control}
                      name="attendance_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo de atendimento *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tempo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {commonTimes.map((time) => (
                                <SelectItem key={time.value} value={time.value}>
                                  {time.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
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

                  {/* New Preferences */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Preferências adicionais</h3>
                    
                    <div className="space-y-6">
                      <FormField
                        control={editForm.control}
                        name="send_reminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enviar lembretes aos clientes</FormLabel>
                              <FormDescription>
                                Seus clientes receberão lembretes automáticos antes de cada atendimento.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="integrate_google_calendar"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Integrar com Google Calendar</FormLabel>
                              <FormDescription>
                                Seus agendamentos serão sincronizados automaticamente com o Google Calendar.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar alterações"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep(1);
                        setUserEmail("");
                        tokenForm.reset();
                      }}
                    >
                      Voltar para verificação
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditPreferences;
