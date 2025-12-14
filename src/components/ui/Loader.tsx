import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-dark">
      <div className="relative">
        {/* Animated code symbol */}
        <motion.div
          className="text-8xl font-bold gradient-text"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          &lt;/&gt;
        </motion.div>

        {/* Animated circles around */}
        <motion.div
          className="absolute inset-0 -m-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-accent rounded-full -translate-x-1/2" />
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-primary rounded-full -translate-y-1/2" />
          <div className="absolute right-0 top-1/2 w-2 h-2 bg-accent rounded-full -translate-y-1/2" />
        </motion.div>

        {/* Loading text */}
        {/* <motion.p
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-slate-600 dark:text-light/60 font-medium whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Cargando...
        </motion.p> */}
      </div>
    </div>
  );
};
