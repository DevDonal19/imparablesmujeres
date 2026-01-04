import { Box, Grid, Typography, Card, CardContent, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

const cards = [
  {
    title: 'Misión',
    icon: <FavoriteIcon fontSize="large" aria-hidden="true" />,
    text: 'Impulsar el feminismo negro, el empoderamiento de juventudes y el acompañamiento integral a mujeres afro e indígenas para que sus voces lideren los cambios en sus territorios.',
    color: '#9f3876',
  },
  {
    title: 'Visión',
    icon: <VisibilityIcon fontSize="large" aria-hidden="true" />,
    text: 'Construir una sociedad donde las mujeres vivan sin miedo.',
    highlight: 'Imparables: porque el cambio empieza cuando una mujer se atreve a creer en sí misma.',
    color: '#bd1d82',
  },
];

const MisionVision = () => (
  <Box component="section" id="mision-vision" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 } }}>
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="h2"
        component={motion.h2}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3rem' }, mb: 2 }}
      >
        Nuestro Propósito
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        component={motion.p}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Lo que nos mueve y hacia dónde vamos
      </Typography>
    </Box>
    <Grid container spacing={4}>
      {cards.map((card, index) => (
        <Grid key={card.title} item xs={12} md={6}>
          <Card
            component={motion.article}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            aria-labelledby={`card-${card.title}`}
            sx={{
              height: '100%',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${card.color}08, #fff)`,
              border: `2px solid ${card.color}30`,
              '&:hover': {
                transform: 'translateY(-12px)',
                boxShadow: `0 25px 70px ${card.color}30`,
              },
              transition: 'all 0.4s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: `linear-gradient(90deg, ${card.color}, ${card.color}aa)`,
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: `${card.color}15`,
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Chip
                      label={card.title}
                      sx={{
                        bgcolor: `${card.color}20`,
                        color: card.color,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        mb: 1,
                      }}
                    />
                    <Typography id={`card-${card.title}`} variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2rem' } }}>
                      {card.title}
                    </Typography>
                  </Box>
                </Stack>
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {card.text}
                </Typography>
                {card.highlight && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${card.color}10, ${card.color}05)`,
                      border: `2px solid ${card.color}20`,
                    }}
                  >
                    <Typography
                      component="blockquote"
                      sx={{
                        fontStyle: 'italic',
                        fontWeight: 600,
                        color: card.color,
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        m: 0,
                      }}
                    >
                      "{card.highlight}"
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default MisionVision;
