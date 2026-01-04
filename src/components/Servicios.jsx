import { Box, Card, CardActions, CardContent, Grid, List, ListItem, ListItemText, Typography, Button, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Campaign as CampaignIcon, ChildCare as ChildCareIcon, Groups as GroupsIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const servicios = [
  {
    title: 'Ahora Todas: Cambiando el algoritmo',
    description: 'Prevención de violencia física, emocional y digital.',
    list: ['Campañas de sensibilización', 'Talleres de autoprotección', 'Red de apoyo comunitario', 'Ruta psicojurídica'],
    cta: 'Ver más',
    icon: <CampaignIcon fontSize="large" />,
    color: '#9f3876',
    ordered: true,
  },
  {
    title: 'Imparables Girls',
    description: 'Proceso para niñas entre 7 y 15 años con acompañamiento integral.',
    list: ['Empoderamiento personal', 'Liderazgo con propósito', 'Cuidado integral'],
    cta: 'Inscribirme',
    icon: <ChildCareIcon fontSize="large" />,
    color: '#bd1d82',
    ordered: false,
  },
  {
    title: 'Comunidad Imparable',
    description: 'Experiencias vivenciales que fortalecen el tejido social.',
    list: ['Círculos de escucha', 'Laboratorios creativos', 'Festivales de sororidad'],
    cta: 'Participar',
    icon: <GroupsIcon fontSize="large" />,
    color: '#f6a4fd',
    ordered: false,
  },
];

const Servicios = () => (
  <Box component="section" id="servicios" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 6 } }}>
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
        ¿Qué hacemos?
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
        Nuestros programas y servicios para la comunidad
      </Typography>
    </Box>
    <Grid container spacing={4}>
      {servicios.map((servicio, index) => (
        <Grid key={servicio.title} item xs={12} md={4}>
          <Card
            component={motion.article}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            tabIndex={0}
            role="article"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              background: `linear-gradient(135deg, ${servicio.color}08, #fff)`,
              border: `2px solid ${servicio.color}30`,
              '&:hover, &:focus-visible': {
                transform: 'translateY(-12px)',
                boxShadow: `0 30px 70px ${servicio.color}35`,
              },
              transition: 'all 0.4s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: `linear-gradient(90deg, ${servicio.color}, ${servicio.color}aa)`,
              },
            }}
          >
            <CardContent sx={{ p: 3, flexGrow: 1 }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${servicio.color}15`,
                      color: servicio.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {servicio.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.3 }}>
                      {servicio.title}
                    </Typography>
                    <Chip
                      label={servicio.ordered ? 'Programa estructurado' : 'Participación abierta'}
                      size="small"
                      sx={{
                        bgcolor: `${servicio.color}20`,
                        color: servicio.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                </Stack>
                <Typography color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.7 }}>
                  {servicio.description}
                </Typography>
                <List
                  component={servicio.ordered ? 'ol' : 'ul'}
                  aria-label={`Lista de acciones para ${servicio.title}`}
                  sx={{
                    pt: 0,
                    listStyleType: 'none',
                    pl: 0,
                    '& .MuiListItem-root': {
                      display: 'flex',
                      alignItems: 'flex-start',
                      pl: 0,
                      py: 0.5,
                    },
                  }}
                >
                  {servicio.list.map((item, idx) => (
                    <ListItem key={item}>
                      <CheckCircleIcon sx={{ color: servicio.color, mr: 1.5, fontSize: 20, mt: 0.3 }} />
                      <ListItemText
                        primary={servicio.ordered ? `${idx + 1}. ${item}` : item}
                        primaryTypographyProps={{
                          component: 'span',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 3, pb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                aria-label={`${servicio.cta} - ${servicio.title}`}
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  background: `linear-gradient(120deg, ${servicio.color}, ${servicio.color}dd)`,
                  '&:hover': {
                    background: `linear-gradient(120deg, ${servicio.color}dd, ${servicio.color})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${servicio.color}50`,
                  },
                  transition: 'all 0.3s',
                }}
              >
                {servicio.cta}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default Servicios;
