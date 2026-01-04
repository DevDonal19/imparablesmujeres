import { useRef, useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { getAssetUrl } from '../utils/assets';
import { apiFetch } from '../utils/api';

const defaultDollImage = getAssetUrl('doll-imparables.png');

const GradientBackground = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'reduceMotion',
})(({ theme, reduceMotion }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(120deg, #9f3876, #bd1d82, #ffffff, #f6a4fd, #a8a8a8, #000000)',
  backgroundSize: '400% 400%',
  animation: reduceMotion ? 'none' : 'gradientShift 15s ease infinite',
  paddingBlock: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    paddingBlock: theme.spacing(8),
  },
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

const DollWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: 420,
  marginInline: 'auto',
  '& img': {
    width: '100%',
    height: 'auto',
    display: 'block',
    transformOrigin: 'center bottom',
  },
}));

const motionVariants = {
  idle: {
    scale: [1, 1.02, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  salute: {
    rotate: [0, -2, 3, -1, 0],
    y: [0, -6, -8, -4, 0],
    transition: { duration: 0.5 },
  },
};

const Hero = () => {
  const [isSaluting, setIsSaluting] = useState(false);
  const [heroData, setHeroData] = useState({
    title: '"Somos mujeres que transforman el miedo en fuerza, el dolor en poder y los sueños en acciones"',
    subtitle: 'Movimiento de mujeres del Pacífico colombiano que construyen paz, justicia y sororidad.',
    buttonText: 'Explorar Nuestra Historia',
    buttonLink: '#historia',
    image: defaultDollImage,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const dollRef = useRef(null);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const response = await apiFetch('/sections');
        if (response.ok) {
          const data = await response.json();
          const heroSection = data.find(s => s.section === 'hero');
          if (heroSection && heroSection.content) {
            setHeroData({
              title: heroSection.content.title || heroData.title,
              subtitle: heroSection.content.subtitle || heroData.subtitle,
              buttonText: heroSection.content.buttonText || heroData.buttonText,
              buttonLink: heroSection.content.buttonLink || heroData.buttonLink,
              image: heroSection.content.image || defaultDollImage,
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos del Hero:', error);
      }
    };
    loadHeroData();
  }, []);

  const handleInteraction = () => {
    if (prefersReducedMotion) return;
    setIsSaluting(true);
    setTimeout(() => setIsSaluting(false), 500);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleInteraction();
    }
  };

  return (
    <GradientBackground id="inicio" reduceMotion={prefersReducedMotion}>
      <Box sx={{ width: '100%', px: { xs: 3, md: 8 } }}>
        <Grid container spacing={6} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                color="#fff"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.8rem' },
                  fontWeight: 900,
                  mb: 3,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  lineHeight: 1.2,
                }}
              >
                {heroData.title}
              </Typography>
              <Typography
                variant="h5"
                color="rgba(255,255,255,0.95)"
                sx={{
                  mb: 4,
                  fontWeight: 500,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                {heroData.subtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  component="a"
                  href={heroData.buttonLink}
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {heroData.buttonText}
                </Button>
                <Button
                  component="a"
                  href="#contacto"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderWidth: 3,
                    borderColor: '#fff',
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderWidth: 3,
                      borderColor: '#f6a4fd',
                      backgroundColor: 'rgba(246, 164, 253, 0.25)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(246, 164, 253, 0.4)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Únete al Movimiento
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <DollWrapper
                role="button"
                aria-label="Muñeca Imparables levantando el puño"
                tabIndex={0}
                onClick={handleInteraction}
                onKeyDown={onKeyDown}
              >
                <Box
                  component={motion.img}
                  ref={dollRef}
                  src={heroData.image}
                  alt="Muñeca Imparables"
                  initial={false}
                  animate={prefersReducedMotion ? {} : isSaluting ? 'salute' : 'idle'}
                  variants={motionVariants}
                  sx={{
                    filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.4))',
                    cursor: 'pointer',
                  }}
                />
              </DollWrapper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </GradientBackground>
  );
};

export default Hero;
