import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, MapPin, Send, Copy } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { FadeIn } from '../components/animations/FadeIn';
import { SlideIn } from '../components/animations/SlideIn';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { copyToClipboard } from '../lib/utils/helpers';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(3, 'El asunto debe tener al menos 3 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simular envío de email - en producción integrar con EmailJS o Firebase Functions
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Form data:', data);
      toast.success('¡Mensaje enviado con éxito!');
      reset();
    } catch (error) {
      toast.error('Error al enviar el mensaje');
    }
  };

  const handleCopyEmail = async () => {
    const success = await copyToClipboard('contact@example.com');
    if (success) {
      toast.success('Email copiado al portapapeles');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              Trabajemos Juntos
            </h1>
            <p className="text-xl text-light/70">
              ¿Tienes un proyecto en mente? ¡Hablemos!
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-4" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <SlideIn direction="left">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>
                  <p className="text-light/70 leading-relaxed mb-8">
                    Estoy siempre abierto a nuevas oportunidades y colaboraciones.
                    No dudes en contactarme para discutir tu proyecto o simplemente para saludar.
                  </p>
                </div>

                <Card className="flex items-start space-x-4 group cursor-pointer" onClick={handleCopyEmail}>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-light/70 text-sm flex items-center">
                      contact@example.com
                      <Copy className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </Card>

                <Card className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Ubicación</h3>
                    <p className="text-light/70 text-sm">Lima, Perú</p>
                  </div>
                </Card>
              </div>
            </SlideIn>

            {/* Contact Form */}
            <SlideIn direction="right">
              <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Asunto
                    </label>
                    <input
                      {...register('subject')}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all"
                      placeholder="Asunto del mensaje"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensaje
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/10 focus:border-primary focus:outline-none transition-all resize-none"
                      placeholder="Tu mensaje..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    {!isSubmitting && <Send className="w-4 h-4 mr-2" />}
                    Enviar Mensaje
                  </Button>
                </form>
              </Card>
            </SlideIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
