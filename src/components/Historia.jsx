import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { HistoryEdu as HistoryIcon, Groups as GroupsIcon } from '@mui/icons-material';

const Historia = () => {
  const [fundadoras, setFundadoras] = useState([]);

  useEffect(() => {
    const fetchFundadoras = async () => {
      try {
        const response = await fetch('/api/sections/fundadoras');
        if (response.ok) {
          const data = await response.json();
          setFundadoras(data.content?.fundadoras || []);
        }
      } catch (error) {
        console.error('Error cargando fundadoras:', error);
      }
    };

    fetchFundadoras();
  }, []);

  return (
    <Box component="section" id="historia" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 } }}>
      <Grid container spacing={4} alignItems="stretch">
        <Grid item xs={12} md={5}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(160deg, rgba(159,56,118,0.15), rgba(246,164,253,0.1), #fff)',
              border: '2px solid rgba(159,56,118,0.25)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 60px rgba(159,56,118,0.25)',
              },
              transition: 'all 0.4s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #9f3876, #bd1d82, #f6a4fd)',
              },
            }}
            aria-label="Nuestra historia Imparables"
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h2" component="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                    Nuestra Historia
                  </Typography>
                </Stack>
                <Chip
                  label="Desde 2018"
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: 'rgba(159,56,118,0.15)',
                    color: '#9f3876',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                />
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  Imparables nació en el corazón del Chocó, Colombia, como un movimiento de mujeres que decidieron enfrentar la
                  violencia estructural con sororidad, arte y acompañamiento. Desde los barrios y riberas del Atrato hemos
                  tejido procesos para sanar las memorias del conflicto y potenciar nuevas narrativas para las juventudes afro,
                  indígenas y mestizas.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              height: '100%',
              background: 'linear-gradient(160deg, #fff, rgba(189,29,130,0.05))',
              border: '2px solid rgba(189,29,130,0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 60px rgba(189,29,130,0.25)',
              },
              transition: 'all 0.4s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #bd1d82, #f6a4fd, #9f3876)',
              },
            }}
            aria-label="Fundadoras de Imparables"
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <GroupsIcon sx={{ fontSize: 40, color: 'primary.dark' }} />
                  <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                    Fundadoras
                  </Typography>
                </Stack>
                <Stack spacing={2.5}>
                  {fundadoras.length > 0 ? (
                    fundadoras.map((fundadora, index) => (
                      <Box key={index}>
                        <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>
                          {fundadora.name}
                        </Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {fundadora.role}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Cargando fundadoras...
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      fontStyle: 'italic',
                      color: 'primary.dark',
                      borderLeft: '4px solid',
                      borderColor: 'primary.dark',
                      pl: 2,
                      py: 1,
                      mt: 2,
                      lineHeight: 1.7,
                    }}
                  >
                    Juntas sostienen una plataforma donde la memoria, el arte y la incidencia política se encuentran para ofrecer
                    oportunidades reales a las mujeres que habitan el Pacífico colombiano.
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Historia;
