"use client";
import { Vehicle, Fleet } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn, englishDateFormat } from "@/lib/utils";
import { handleFileUpload } from "@/lib/firebase-upload";
import { useState } from "react";

const FormSchema = z.object({
  fleetId: z.number(),
  model: z.string(),
  licensePlate: z.string(),
  code: z.string(),
  renavam: z.string(),
  chassis: z.string(),
  year: z.string(),
  installationDate: z.string(),
  comments: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  url: z.instanceof(File),
});

interface Values {
  fleetId: number;
  model: string;
  licensePlate: string;
  code: string;
  renavam: string;
  chassis: string;
  year: string;
  installationDate: Date;
  comments: string;
  status: "ACTIVE" | "INACTIVE";
  url: File;
}

export default function VehicleUpdateForm({
  preloadedValues,
  id,
  fleets,
  vehicle,
}: {
  preloadedValues: Values;
  id: number;
  fleets: Fleet[];
  vehicle: Vehicle;
}) {
  const data = {
    fleetId: preloadedValues.fleetId,
    model: preloadedValues.model,
    licensePlate: preloadedValues.licensePlate,
    code: preloadedValues.code,
    renavam: preloadedValues.renavam,
    chassis: preloadedValues.chassis,
    year: preloadedValues.year,
    installationDate: englishDateFormat(preloadedValues.installationDate),
    comments: preloadedValues.comments,
    status: preloadedValues.status,
    url: preloadedValues.url,
  };
  const [isSending, setIsSendind] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: data,
  });
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    // upload anexo
    const timestamp = new Date().toISOString();
    let file;
    if (data.url instanceof File && data.url.size > 0) {
      const fileExtension = data.url.name.split(".").pop();
      file = await handleFileUpload(
        data.url,
        `star-tracking/vehicles/foto-${timestamp}.${fileExtension}`
      );
    } else if (vehicle?.url) file = vehicle.url;
    else file = "";
    try {
      const info = {
        url: file,
        fleetId: data.fleetId,
        model: data.model,
        licensePlate: data.licensePlate,
        code: data.code,
        renavam: data.renavam,
        chassis: data.chassis,
        year: data.year,
        installationDate: data.installationDate,
        comments: data.comments,
        status: data.status,
      };
      const response = await api.put(`vehicle/${id}`, info);
      if (response.status === 200) {
        router.push("/veiculos");
      }
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="fleetId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Frota</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? fleets.find((item) => item.fleetId === field.value)
                            ?.name
                        : "Selecione a frota"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[60vh] overflow-x-auto">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar frota..." />
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {fleets.map((item) => (
                        <CommandItem
                          value={item.name}
                          key={item.fleetId}
                          onSelect={() => {
                            form.setValue("fleetId", item.fleetId);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.fleetId === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <p
                            className="font-bold"
                            style={{ color: item.color }}
                          >
                            {item.name}
                          </p>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o modelo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="Digite a placa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Digite o código" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="renavam"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renavam</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chassis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chassis/Série</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input placeholder="Digite o ano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="installationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de instalação</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Digite o ano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anexo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormDescription>
                Não preencha esse campo se quiser manter o arquivo anterior
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alguma informação adicional"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Ativo</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="INACTIVE" />
                    </FormControl>
                    <FormLabel className="font-normal">Inativo</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          {isSending ? "Atualizando..." : "Atualizar"}
        </Button>
      </form>
    </Form>
  );
}
