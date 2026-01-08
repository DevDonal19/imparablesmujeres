import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import PeopleIcon from '@mui/icons-material/People';

const Fundadoras = () => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await fetch('/api/sections/fundadoras');
        if (response.ok) {
          const data = await response.json();
          setSection(data.content);
        }
      } catch (error) {
        console.error('Error cargando sección de fundadoras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, []);

  if (loading) {
    console.log('⏳ [Fundadoras] Cargando...');
    return null;
  }

  if (!section) {
    console.log('⚠️ [Fundadoras] No hay datos de sección');
    return null;
  }

  console.log('✅ [Fundadoras] Renderizando sección con:', section);

  return (
    <Box
      id="fundadoras"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, rgba(159,56,118,0.03) 0%, rgba(189,29,130,0.05) 100%)',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                px: 3,
                py: 1,
                borderRadius: '50px',
                background: 'linear-gradient(120deg, rgba(159,56,118,0.1), rgba(189,29,130,0.1))',
              }}
            >
              <PeopleIcon sx={{ color: '#9f3876', fontSize: 24 }} />
              <Typography
                variant="overline"
                sx={{
                  color: '#9f3876',
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                {section.title || 'Fundadoras'}
              </Typography>
            </Box>
            
            {section.subtitle && (
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 800,
                  mx: 'auto',
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  lineHeight: 1.8,
                }}
              >
                {section.subtitle}
              </Typography>
            )}
          </Box>

          <Grid container spacing={4}>
            {section.fundadoras?.map((fundadora, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: 'rgba(159,56,118,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#9f3876',
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(159,56,118,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      {fundadora.image && (
                        <Avatar
                          src={fundadora.image}
                          alt={fundadora.name}
                          sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 2,
                            border: '4px solid',
                            borderColor: '#9f3876',
                          }}
                        />
                      )}
                      
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          color: '#9f3876',
                          mb: 1,
                        }}
                      >
                        {fundadora.name}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {fundadora.role}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Fundadoras;
