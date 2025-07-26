
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SiteConfig } from "@shared/schema";

interface AboutSectionTextsFormProps {
  configs: SiteConfig[];
}

export function AboutSectionTextsForm({ configs }: AboutSectionTextsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const aboutSchema = z.object({
    professionalTitle: z.string().min(1, "Título profissional é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
  });

  type AboutTextsForm = z.infer<typeof aboutSchema>;

  const getAboutData = () => {
    const aboutSection = configs?.find(c => c.key === 'about_section')?.value as any || {};
    const generalInfo = configs?.find(c => c.key === 'general_info')?.value as any || {};
    
    return {
      professionalTitle: generalInfo.professionalTitle || "Psicóloga Clínica CRP 08/123456",
      description: aboutSection.description || "Com experiência em terapia cognitivo-comportamental, ofereço um espaço seguro e acolhedor para você trabalhar suas questões emocionais e desenvolver ferramentas para uma vida mais equilibrada.",
    };
  };

  const form = useForm<AboutTextsForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: getAboutData(),
  });

  React.useEffect(() => {
    if (configs && configs.length > 0) {
      const newData = getAboutData();
      form.reset(newData);
    }
  }, [configs, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: AboutTextsForm) => {
      // Atualizar título profissional na configuração geral
      await apiRequest("POST", "/api/admin/config", {
        key: "general_info",
        value: { professionalTitle: data.professionalTitle }
      });
      
      // Atualizar descrição na seção sobre
      await apiRequest("POST", "/api/admin/config", {
        key: "about_section",
        value: { description: data.description }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      toast({ title: "Textos da seção Sobre atualizados com sucesso!" });
    },
  });

  const onSubmit = (data: AboutTextsForm) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="professionalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título Profissional</FormLabel>
                <FormControl>
                  <Input placeholder="Psicóloga Clínica CRP 08/123456" {...field} />
                </FormControl>
                <FormDescription>
                  Título profissional que aparece acima da descrição na seção sobre
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição Principal</FormLabel>
                <FormControl>
                  <Textarea placeholder="Com experiência em terapia cognitivo-comportamental..." rows={4} {...field} />
                </FormControl>
                <FormDescription>
                  Descrição detalhada sobre sua experiência e abordagem profissional
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Salvando..." : "Salvar Textos da Seção Sobre"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
