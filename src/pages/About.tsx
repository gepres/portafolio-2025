import { motion } from 'framer-motion';
import { Download, Code2, Server, Cloud } from 'lucide-react';
import { PageTransition } from '../components/layout/PageTransition';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FadeIn } from '../components/animations/FadeIn';
import { SlideIn } from '../components/animations/SlideIn';
import { staggerContainer, staggerItem } from '../lib/utils/animations';

const services = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'Desarrollo de interfaces modernas y responsive con React, Next.js y TypeScript',
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'APIs robustas y escalables con Node.js, NestJS y bases de datos SQL/NoSQL',
  },
  {
    icon: Cloud,
    title: 'DevOps & Cloud',
    description: 'Infraestructura cloud con AWS, Docker, Kubernetes y CI/CD pipelines',
  },
];

const interests = ['Música', 'Literatura', 'Tecnología', 'Viajes', 'Fotografía'];

export const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              Sobre Mí
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </FadeIn>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <SlideIn direction="left">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden glass">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-9xl font-bold gradient-text">
                    G
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-accent blur-2xl opacity-20 -z-10" />
              </div>
            </SlideIn>

            {/* Bio */}
            <SlideIn direction="right">
              <div className="space-y-6 text-light/80">
                <p className="text-lg leading-relaxed">
                  ¡Hola! Soy Genaro, un desarrollador full stack apasionado por crear soluciones
                  tecnológicas innovadoras y de alto impacto. Con experiencia en el desarrollo de
                  aplicaciones web modernas y arquitecturas cloud-native.
                </p>
                <p className="text-lg leading-relaxed">
                  Actualmente trabajo como DevOps Engineer y Full Stack Developer en Izipay (Interbank),
                  donde me especializo en la gestión de infraestructura Kubernetes, desarrollo de
                  aplicaciones con Next.js y React, y la implementación de pipelines CI/CD robustos.
                </p>
                <p className="text-lg leading-relaxed">
                  Mi enfoque está en escribir código limpio, escalable y mantenible, siempre buscando
                  las mejores prácticas y las tecnologías más actuales para resolver problemas complejos
                  de manera elegante.
                </p>

                <div className="flex items-center space-x-4 pt-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">3+</div>
                    <div className="text-sm text-light/60">Años de Experiencia</div>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">20+</div>
                    <div className="text-sm text-light/60">Proyectos Completados</div>
                  </div>
                </div>

                <Button variant="primary" className="mt-6">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar CV
                </Button>
              </div>
            </SlideIn>
          </div>

          {/* Services */}
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              ¿Qué hago?
            </h2>
          </FadeIn>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full group hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-light/70">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Interests */}
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Intereses
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  className="px-6 py-3 glass-hover rounded-full text-primary font-medium cursor-hover"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
};
