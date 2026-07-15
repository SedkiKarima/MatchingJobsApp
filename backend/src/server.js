const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const processResume = require('./services/_process-resume');

const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const offersRoutes = require("./routes/offersRoutes");
const applicationsRoutes = require("./routes/applicationsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use("/api/offers", offersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRoutes);

app.get('/api/pdf-extract', async (req, res) => {
  try {
    const jobDescriptionFromMySQL = `Sports Program & Events Coordinator

We are seeking a Sports Program and Events Coordinator to manage athletic programs and oversee large-scale sporting events for our organization.

Responsibilities:
- Coordinate and supervise sporting events from planning through execution
- Manage relationships with referees, coaches, and athletic staff
- Track and analyze player/team performance data
- Lead volunteer and staff teams during marathons and tournaments
- Develop digital tools and dashboards to modernize event operations
- Manage budgets and vendor contracts for sports facilities
- Oversee certified officiating staff across multiple sporting disciplines
- Design and deliver athlete training and performance programs

Requirements:
- Bachelor's degree in Sports Science, Physical Education, or related field
- 3+ years managing large-scale sporting or community events
- Experience with performance analysis tools and player tracking software
- Certified referee/official credentials in at least one sport
- Strong budgeting and vendor negotiation skills
- Experience with CRM or event management software (e.g., Cvent, Eventbrite)
- Bilingual (French/Arabic/English) communication skills
- Bonus: experience in international multi-sport event logistics (Olympics, continental championships)`;

    // Replace with actual job description fetched from MySQL
    const result = await processResume('uploads/CV_ZAIDAHMEDYASSINE.pdf', jobDescriptionFromMySQL);
    res.json({ status: 'ok', result });
  } catch (error) {
    console.error('Error extracting PDF:', error);
    res.status(500).json({ error: 'Failed to extract PDF' });
  }
});

const PORT = process.env.PORT || 5000;

pool.query('SELECT 1')
  .then(() => {
    console.log('Connexion MySQL OK');
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Impossible de se connecter à MySQL:', err.message);
    process.exit(1);
  });
