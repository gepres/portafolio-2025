import { SEOHead } from '../components/SEOHead';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead
        title="Política de Privacidad | Genaro Pretill"
        description="Política de privacidad de genaropretill.com. Información sobre el tratamiento de datos personales recopilados a través del formulario de contacto."
        canonical="https://genaropretill.com/privacy-policy"
      />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-24 sm:px-6">
        <h1 className="text-3xl font-bold gradient-text mb-2">Política de Privacidad</h1>
        <p className="text-slate-500 dark:text-light/50 text-sm mb-10">
          Última actualización: 23 de febrero de 2026
        </p>

        <div className="space-y-8 text-slate-600 dark:text-light/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">1. Responsable del tratamiento</h2>
            <p>
              Genaro Pretill Escobar (<strong>genaropretill.com</strong>) es el responsable del
              tratamiento de los datos personales recopilados a través de este sitio web.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">2. Datos que recopilamos</h2>
            <p>Cuando utilizas el formulario de contacto, recopilamos:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Asunto del mensaje</li>
              <li>Contenido del mensaje</li>
            </ul>
            <p className="mt-3">
              No se recopilan datos de navegación, cookies de seguimiento ni información sensible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">3. Finalidad del tratamiento</h2>
            <p>
              Los datos recopilados a través del formulario de contacto se utilizan exclusivamente para:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Responder consultas sobre proyectos o colaboraciones</li>
              <li>Gestionar ofertas de trabajo o comunicaciones profesionales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">4. Compartición de datos</h2>
            <p>
              Tus datos <strong>no son vendidos, alquilados ni compartidos</strong> con terceros,
              salvo los proveedores de servicio de email (EmailJS) necesarios para el envío técnico
              del mensaje, quienes actúan como encargados del tratamiento bajo sus propias políticas
              de privacidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">5. Conservación de datos</h2>
            <p>
              Los mensajes recibidos se conservan únicamente el tiempo necesario para responder la
              consulta. No se mantiene una base de datos de contactos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">6. Tus derechos</h2>
            <p>Puedes ejercer en cualquier momento los siguientes derechos:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acceso a tus datos personales</li>
              <li>Rectificación de datos inexactos</li>
              <li>Supresión de tus datos</li>
              <li>Oposición al tratamiento</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contáctame mediante el formulario en{' '}
              <a href="/#contact" className="text-primary hover:underline">genaropretill.com/#contact</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-light mb-3">7. Cambios en esta política</h2>
            <p>
              Me reservo el derecho de actualizar esta política de privacidad. Los cambios serán
              publicados en esta página con la fecha de actualización correspondiente.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};
