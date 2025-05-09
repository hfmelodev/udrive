import { Panel } from '@/components/app/panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { storage } from '@/lib/firebase'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import {
  Car,
  DollarSign,
  Gauge,
  Hourglass,
  Layers2,
  Loader2,
  MapPinHouse,
  PhoneCall,
  Plus,
  Trash,
  Upload,
} from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const newCarFormSchema = z.object({
  name: z.string().nonempty({ message: 'O nome é obrigatório' }),
  model: z.string().nonempty({ message: 'O modelo é obrigatório' }),
  year: z.string().nonempty({ message: 'O ano é obrigatório' }),
  km: z.string().nonempty({ message: 'A quilometragem é obrigatória' }),
  price: z.string().nonempty({ message: 'O preço é obrigatório' }),
  city: z.string().nonempty({ message: 'A cidade é obrigatória' }),
  whatsapp: z
    .string()
    .min(1, 'O whatsapp é obrigatório')
    .regex(/^(\d{10,11})$/, 'Número de telefone inválido'),
  description: z.string().nonempty({ message: 'A descrição é obrigatória' }),
})

type NewCarFormType = z.infer<typeof newCarFormSchema>

interface ImageProps {
  uid: string
  name: string
  previewUrl: string
  url: string
}

export function NewCar() {
  const { user } = useAuthStore()

  const [imagesCars, setImagesCars] = useState<ImageProps[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewCarFormType>({
    resolver: zodResolver(newCarFormSchema),
  })

  async function handleNewCar(data: NewCarFormType) {
    console.log(data)
  }

  async function handleUploadImage(image: File) {
    if (!user?.uid) return

    const currentUid = user.uid
    const uidImage = uuidv4()

    // Envia a imagem para o Firebase Storage criando o caminho udrive-cars-images/${currentUid}/${uidImage}
    const uploadRef = ref(
      storage,
      `udrive-cars-images/${currentUid}/${uidImage}`
    )

    await uploadBytes(uploadRef, image).then(snapshot => {
      getDownloadURL(snapshot.ref).then(downloadUrl => {
        const imageItemCar: ImageProps = {
          uid: currentUid,
          name: uidImage,
          previewUrl: URL.createObjectURL(image), // URL.createObjectURL() cria uma URL temporária para o blob da imagem
          url: downloadUrl,
        }

        setImagesCars(imagesCars => [...imagesCars, imageItemCar])
      })

      toast.success('Imagem enviada com sucesso')
    })
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const image = e.target.files[0]

      if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
        toast.error('Formato de imagem inválido', {
          description: 'A imagem deve ser PNG ou JPEG',
        })
        return
      }

      await handleUploadImage(image)
    }
  }

  async function handleDeleteImage(image: ImageProps) {
    const imagePath = `udrive-cars-images/${image.uid}/${image.name}`

    const imageRef = ref(storage, imagePath)

    try {
      // Exclui a imagem do Firebase Storage pelo caminho imagePath
      await deleteObject(imageRef)

      // Remove a imagem do state imagesCars
      setImagesCars(imagesCars.filter(item => item.url !== image.url))

      toast.success('Imagem excluída com sucesso')
    } catch (err) {
      console.log(err)
      toast.error('Não foi possível excluir a imagem', {
        description: 'Tente novamente mais tarde',
      })
    }
  }

  return (
    <>
      <Helmet title="Novo Carro" />

      <div className="w-full flex flex-col gap-4">
        <Panel />

        <div className="w-full bg-white p-4 rounded-md flex flex-col sm:flex-row items-center gap-4 border border-slate-200 shadow-sm">
          <Label className="group relative w-full sm:w-48 md:w-52 h-32 border-2 border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center cursor-pointer transition hover:border-slate-400 hover:bg-slate-50">
            <Upload className="size-6 text-slate-400 group-hover:text-primary transition" />
            <span className="mt-2 text-slate-500 text-sm">
              Selecionar imagem
            </span>
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </Label>

          {imagesCars.length > 0 &&
            imagesCars.map(image => (
              <div
                key={image.name}
                className="w-full sm:w-48 md:w-52 h-32 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/70 hover:bg-rose-100 text-rose-600 hover:text-rose-700 shadow-sm backdrop-blur transition-all"
                  aria-label="Remover imagem"
                  title="Remover imagem"
                  onClick={() => handleDeleteImage(image)}
                >
                  <Trash className="size-4" />
                </Button>

                <img
                  src={image.previewUrl}
                  alt="Foto do carro"
                  className=" object-cover w-full h-full rounded-md"
                />
              </div>
            ))}
        </div>

        <form
          onSubmit={handleSubmit(handleNewCar)}
          className="w-full bg-white p-4 rounded-md flex flex-col items-center gap-4 border border-slate-200 shadow-sm"
        >
          <div className="space-y-1.5 w-full">
            <Label htmlFor="name">Nome do carro</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <Car className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10 text-sm sm:text-base"
                  id="name"
                  type="text"
                  placeholder="Digite o nome do carro"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <span className="text-sm mt-1 text-rose-500">
                  {errors.name.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5 w-full">
            <Label htmlFor="model">Modelo</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <Layers2 className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10 text-sm sm:text-base"
                  id="model"
                  type="text"
                  placeholder="Digite o modelo do carro"
                  {...register('model')}
                />
              </div>
              {errors.model && (
                <span className="text-sm mt-1 text-rose-500">
                  {errors.model.message}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div className="space-y-1.5 w-full">
              <Label htmlFor="year">Ano</Label>
              <div className="flex flex-col gap-1 w-full">
                <div className="relative w-full flex items-center">
                  <Hourglass className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                  <Input
                    className="pl-10 text-sm sm:text-base"
                    id="year"
                    type="text"
                    placeholder="Digite o ano do carro"
                    {...register('year')}
                  />
                </div>
                {errors.year && (
                  <span className="text-sm mt-1 text-rose-500">
                    {errors.year.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <Label htmlFor="km">Kilometragem</Label>
              <div className="flex flex-col gap-1 w-full">
                <div className="relative w-full flex items-center">
                  <Gauge className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                  <Input
                    className="pl-10 text-sm sm:text-base"
                    id="km"
                    type="text"
                    placeholder="Digite os km do carro"
                    {...register('km')}
                  />
                </div>
                {errors.km && (
                  <span className="text-sm mt-1 text-rose-500">
                    {errors.km.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 w-full">
            <Label htmlFor="price">Valor</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <DollarSign className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                <Input
                  className="pl-10 text-sm sm:text-base"
                  id="price"
                  type="text"
                  placeholder="Digite o valor do carro"
                  {...register('price')}
                />
              </div>
              {errors.price && (
                <span className="text-sm mt-1 text-rose-500">
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div className="space-y-1.5 w-full">
              <Label htmlFor="city">Cidade</Label>
              <div className="flex flex-col gap-1 w-full">
                <div className="relative w-full flex items-center">
                  <MapPinHouse className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                  <Input
                    className="pl-10 text-sm sm:text-base"
                    id="city"
                    type="text"
                    placeholder="Digite a cidade do carro"
                    {...register('city')}
                  />
                </div>
                {errors.city && (
                  <span className="text-sm mt-1 text-rose-500">
                    {errors.city.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="flex flex-col gap-1 w-full">
                <div className="relative w-full flex items-center">
                  <PhoneCall className="absolute left-3 text-muted-foreground size-4 pointer-events-none" />
                  <Input
                    className="pl-10 text-sm sm:text-base"
                    id="whatsapp"
                    type="text"
                    placeholder="Digite o número do WhatsApp"
                    {...register('whatsapp')}
                  />
                </div>
                {errors.whatsapp && (
                  <span className="text-sm pt-1 text-rose-500">
                    {errors.whatsapp.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 w-full">
            <Label htmlFor="description">Descrição</Label>
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full flex items-center">
                <Textarea
                  className="text-sm sm:text-base"
                  id="description"
                  {...register('description')}
                />
              </div>
              {errors.description && (
                <span className="text-sm pt-1 text-rose-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <Plus className=" size-4" />
                Cadastrar
              </>
            )}
          </Button>
        </form>

        <span className="text-sm text-center text-muted-foreground my-4">
          {new Date().getFullYear()} UDrive. Todos os direitos reservados
        </span>
      </div>
    </>
  )
}
