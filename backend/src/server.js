import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import bcrypt from 'bcrypt';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma, resources } from './admin/admin.config.js';
import { upload } from './middleware/upload.js';
import { excelUpload } from './middleware/excelUpload.js';
import xlsx from 'xlsx';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../public/uploads');
const tempDir = path.join(__dirname, '../public/uploads/temp');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Created uploads directory');
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('✓ Created temp directory');
}

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

const start = async () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../public'));

  // Trust proxy (CRITICAL for Render/Railway/Heroku)
  app.set('trust proxy', 1);

  const uploadPageUser = process.env.UPLOAD_PAGE_USERNAME || 'admin';
  const uploadPagePassword = process.env.UPLOAD_PAGE_PASSWORD || process.env.ADMIN_PASSWORD;
  const uploadAuthCookieName = 'upload_page_auth';

  const hasUploadAccess = (req) => {
    const cookieHeader = req.headers.cookie || '';
    return cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .includes(`${uploadAuthCookieName}=1`);
  };

  const renderUploadPasswordPage = (errorMessage = '') => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Upload Access</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f7fb; font-family: "Segoe UI", Arial, sans-serif; }
    .overlay { width: 100%; min-height: 100vh; display: grid; place-items: center; padding: 16px; }
    .modal { width: 100%; max-width: 360px; background: #fff; border: 1px solid #dbe3ee; border-radius: 12px; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12); padding: 24px; }
    h1 { margin: 0; font-size: 22px; text-align: center; color: #0f172a; }
    p { margin: 10px 0 18px; text-align: center; color: #475569; font-size: 14px; }
    label { display: block; margin-bottom: 8px; color: #1e293b; font-weight: 600; font-size: 14px; }
    input { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 11px 12px; font-size: 14px; box-sizing: border-box; }
    input:focus { outline: none; border-color: #1d4ed8; box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12); }
    button { width: 100%; margin-top: 12px; border: none; border-radius: 10px; background: #1d4ed8; color: #fff; padding: 12px 14px; font-weight: 600; cursor: pointer; }
    button:hover { background: #1e40af; }
    .error { margin: 0 0 12px; padding: 10px; border-radius: 8px; border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; font-size: 13px; }
  </style>
</head>
<body>
  <div class="overlay">
    <div class="modal">
      <h1> Upload Page</h1>
      <p>Enter password to continue to upload page.</p>
      ${errorMessage ? `<div class="error">${errorMessage}</div>` : ''}
      <form method="POST" action="/upload-auth">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" required autocomplete="username" />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" required autocomplete="current-password" autofocus />
        <button type="submit">Open Upload Page</button>
      </form>
    </div>
  </div>
</body>
</html>`;

  app.get('/upload.html', (req, res) => {
    if (!uploadPagePassword) {
      return res.status(500).send('Upload page password is not configured');
    }

    if (hasUploadAccess(req)) {
      return res.sendFile(path.join(__dirname, '../public/upload.html'));
    }

    return res.status(401).send(renderUploadPasswordPage());
  });

  // Session configuration
  const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite:'lax',
      maxAge: 1000 * 60 * 60 * 24,
    },
    name: 'adminjs-session'
  };

  // Serve static files FIRST
  app.use(express.static(path.join(__dirname, '../public')));
  app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

  // CORS Configuration - Environment variable controlled
  const setupCORS = () => {
    if (process.env.ALLOW_ALL_ORIGINS === 'true') {
      return cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
      });
    }

    const allowedOrigins = [];
    
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(...process.env.FRONTEND_URL.split(',').map(url => url.trim()));
    }
    
    if (process.env.BACKEND_URL) {
      allowedOrigins.push(process.env.BACKEND_URL);
    }
    
    if (!isProduction) {
      allowedOrigins.push('http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000');
    }

    return cors({
      origin: function(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        
        console.log('Blocked origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
    });
  };

  app.use(setupCORS());

  // Health check endpoint
  app.get('/health', (req, res) => {
    return res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // AdminJS setup BEFORE body parser
  const admin = new AdminJS({
    resources,
    rootPath: '/admin',
    branding: {
      companyName: 'Professor Portfolio Admin',
      logo: false,
      softwareBrothers: false,
    },
  });

  // Authentication
  const authenticate = async (email, password) => {
    try {
      const user = await prisma.adminUser.findUnique({ where: { email } });
      if (user && await bcrypt.compare(password, user.encryptedPassword)) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  };

  // Build authenticated router
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    },
    null,
    sessionConfig
  );

  // Mount AdminJS router
  app.use(admin.options.rootPath, adminRouter);

  // Body parser AFTER AdminJS
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post('/upload-auth', (req, res) => {
    const submittedUsername = String(req.body?.username || '').trim();
    const submittedPassword = String(req.body?.password || '');

    if (!uploadPagePassword) {
      return res.status(500).send('Upload page password is not configured');
    }

    if (submittedUsername !== uploadPageUser || submittedPassword !== uploadPagePassword) {
      return res.status(401).send(renderUploadPasswordPage('Incorrect username or password. Please try again.'));
    }

    const cookieParts = [
      `${uploadAuthCookieName}=1`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${60 * 60 * 24}`
    ];

    if (isProduction) {
      cookieParts.push('Secure');
    }

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    return res.redirect('/upload.html');
  });

  app.post('/upload-logout', (req, res) => {
    const clearCookieParts = [
      `${uploadAuthCookieName}=`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=0'
    ];

    if (isProduction) {
      clearCookieParts.push('Secure');
    }

    res.setHeader('Set-Cookie', clearCookieParts.join('; '));
    return res.json({ success: true });
  });

  app.post('/api/reset-password-secure', async (req, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Email, current password, and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }

      if (oldPassword === newPassword) {
        return res.status(400).json({ error: 'New password must be different from current password' });
      }

      const user = await prisma.adminUser.findUnique({
        where: { email: String(email).trim().toLowerCase() }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(oldPassword, user.encryptedPassword);

      if (!isCurrentPasswordValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.adminUser.update({
        where: { id: user.id },
        data: { encryptedPassword: hashedPassword }
      });

      return res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Secure reset password error:', error);
      return res.status(500).json({ error: 'Failed to reset password' });
    }
  });

  // Image Upload Endpoint 
  app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      
      return res.json({ 
        success: true,
        filename: req.file.filename,
        url: imageUrl 
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.post('/api/publications/bulk-upload', (req, res) => {
    excelUpload.single('file')(req, res, async (uploadError) => {
      if (uploadError) {
        return res.status(400).json({ error: uploadError.message || 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = req.file.path;

      try {
        const workbook = xlsx.readFile(filePath);
        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          return res.status(400).json({ error: 'Uploaded file does not contain any sheet' });
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows.length) {
          return res.status(400).json({ error: 'Uploaded file is empty' });
        }

        const normalizeRowKeys = (row) => {
          const normalized = {};
          Object.entries(row).forEach(([key, value]) => {
            normalized[String(key).trim().toLowerCase()] = value;
          });
          return normalized;
        };

        const toTrimmedString = (value) => String(value ?? '').trim();
        const parseBoolean = (value) => {
          const normalized = toTrimmedString(value).toLowerCase();
          if (!normalized) return true;
          return ['true', '1', 'yes', 'y'].includes(normalized);
        };

        const normalizedRows = rawRows
          .map(normalizeRowKeys)
          .filter((row) =>
            Object.values(row).some((value) => toTrimmedString(value) !== '')
          );

        if (!normalizedRows.length) {
          return res.status(400).json({ error: 'Uploaded file contains only empty rows' });
        }

        const records = normalizedRows.map((row, index) => {
          const title = toTrimmedString(row.title);
          const authors = toTrimmedString(row.authors);
          const venue = toTrimmedString(row.venue);
          const doi = toTrimmedString(row.doi);
          const publisher = toTrimmedString(row.publisher);
          const year = Number.parseInt(toTrimmedString(row.year), 10);

          if (!title || !authors || !venue || !doi || !publisher || Number.isNaN(year)) {
            throw new Error(
              `Invalid data at row ${index + 2}. Required: title, authors, venue, year, doi, publisher`
            );
          }

          const parsedOrder = Number.parseInt(toTrimmedString(row.order), 10);

          return {
            title,
            authors,
            venue,
            year,
            doi, 
            publisher,
            order: Number.isNaN(parsedOrder) ? index : parsedOrder,
            isVisible: parseBoolean(row.isvisible)
          };
        });

        await prisma.publicationPage.createMany({
          data: records
        });

        return res.json({
          success: true,
          insertedCount: records.length,
          message: `Successfully uploaded ${records.length} publication(s)`
        });
      } catch (error) {
        console.error('Bulk upload error:', error);
        return res.status(400).json({ error: error.message || 'Bulk upload failed' });
      } finally {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanupError) {
          console.error('Failed to cleanup temp upload file:', cleanupError);
        }
      }
    });
  });

  // API Routes for Frontend
  
  app.get('/api/hero', async (req, res) => {
    try {
      const hero = await prisma.hero.findFirst();
      return res.json(hero || {});
    } catch (error) {
      console.error('Hero fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch hero data' });
    }
  });

  app.get('/api/about', async (req, res) => {
    try {
      const about = await prisma.about.findFirst();
      return res.json(about || {});
    } catch (error) {
      console.error('About fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch about data' });
    }
  });

  app.get('/api/publications', async (req, res) => {
    try {
      const publications = await prisma.publication.findMany({
        where: { isVisible: true },
        orderBy: [{ year: 'desc' }, { order: 'asc' }]
      });
      return res.json(publications);
    } catch (error) {
      console.error('Publications fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch publications' });
    }
  });

  app.get('/api/news', async (req, res) => {
    try {
      const news = await prisma.news.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' }
      });
      return res.json(news);
    } catch (error) {
      console.error('News fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch news' });
    }
  });

  app.get('/api/research', async (req, res) => {
    try {
      const research = await prisma.research.findMany({
        where: { isVisible: true },
        include: {
          publications: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });
      return res.json(research);
    } catch (error) {
      console.error('Research fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch research data' });
    }
  });

  app.get('/api/teaching', async (req, res) => {
    try {
      const departments = await prisma.teachingDepartment.findMany({
        where: { isVisible: true },
        include: {
          courses: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });
      return res.json(departments);
    } catch (error) {
      console.error('Teaching fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch teaching data' });
    }
  });

  app.get('/api/resume', async (req, res) => {
    try {
      const [
        profile,
        education,
        positions,
        researchInterests,
        awards,
        editorials,
        patents,
        selectedPublications
      ] = await Promise.all([
        prisma.resumeProfile.findFirst(),
        prisma.education.findMany({ orderBy: { order: 'asc' } }),
        prisma.position.findMany({ orderBy: { order: 'asc' } }),
        prisma.researchInterest.findMany({ orderBy: { order: 'asc' } }),
        prisma.award.findMany({ orderBy: { order: 'asc' } }),
        prisma.editorial.findMany({ orderBy: { order: 'asc' } }),
        prisma.patent.findMany({ orderBy: { order: 'asc' } }),
        prisma.publication.findMany({
          where: { isVisible: true },
          orderBy: [{ year: 'desc' }, { order: 'asc' }],
          take: 10
        })
      ]);

      return res.json({
        profile,
        education,
        positions,
        researchInterests,
        awards,
        editorials,
        patents,
        selectedPublications
      });
    } catch (error) {
      console.error('Resume fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch resume data' });
    }
  });

  app.get('/api/lab', async (req, res) => {
    try {
      const [
        profile,
        carouselImages,
        projects,
        currentPhdStudents,
        graduatedPhdStudents,
        mtechStudents,
        btechStudents
      ] = await Promise.all([
        prisma.labProfile.findFirst(),
        prisma.labCarouselImage.findMany({ orderBy: { order: 'asc' } }),
        prisma.labProject.findMany({
          where: { isVisible: true },
          orderBy: { order: 'asc' }
        }),
        prisma.phdStudent.findMany({
          where: { isAlumni: false },
          orderBy: { order: 'asc' }
        }),
        prisma.phdStudent.findMany({
          where: { isAlumni: true },
          orderBy: { order: 'asc' }
        }),
        prisma.mtechStudent.findMany({ orderBy: { order: 'asc' } }),
        prisma.btechStudent.findMany({ orderBy: { order: 'asc' } })
      ]);

      return res.json({
        profile,
        carouselImages,
        projects,
        currentPhdStudents,
        graduatedPhdStudents,
        mtechStudents,
        btechStudents
      });
    } catch (error) {
      console.error('Lab fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch lab data' });
    }
  });

  app.get('/api/publications-page', async (req, res) => {
    try {
      const [publications, books, bookChapters] = await Promise.all([
        prisma.publicationPage.findMany({
          where: { isVisible: true },
          orderBy: [{ year: 'desc' }, { order: 'asc' }]
        }),
        prisma.book.findMany({ orderBy: { order: 'asc' } }),
        prisma.bookChapter.findMany({ orderBy: { order: 'asc' } })
      ]);

      return res.json({ publications, books, bookChapters });
    } catch (error) {
      console.error('Publications page fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch publications data' });
    }
  });

  app.get('/api/patents-page', async (req, res) => {
    try {
      const [internationalPatents, indianPatents] = await Promise.all([
        prisma.patent.findMany({
          where: { patentType: 'International' },
          orderBy: { order: 'asc' }
        }),
        prisma.patent.findMany({
          where: { patentType: 'Indian' },
          orderBy: { order: 'asc' }
        })
      ]);

      return res.json({ internationalPatents, indianPatents });
    } catch (error) {
      console.error('Patents page fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch patents data' });
    }
  });

  app.get('/api/computational-tools', async (req, res) => {
    try {
      const tools = await prisma.computationalTool.findMany({
        orderBy: { order: 'asc' }
      });
      return res.json(tools);
    } catch (error) {
      console.error('Computational tools fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch computational tools' });
    }
  });

  app.get('/api/site-settings', async (req, res) => {
    try {
      const settings = await prisma.siteSettings.findFirst();
      return res.json(settings || {});
    } catch (error) {
      console.error('Site settings fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch site settings' });
    }
  });

  app.get('/api/outreach', async (req, res) => {
    try {
      const outreach = await prisma.outreach.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' }
      });
      return res.json(outreach);
    } catch (error) {
      console.error('Outreach fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch outreach data' });
    }
  });

  app.get('/api/industry', async (req, res) => {
    try {
      const industry = await prisma.industry.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' }
      });
      return res.json(industry);
    } catch (error) {
      console.error('Industry fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch industry data' });
    }
  });

  // Root endpoint
  app.get('/reset-password', (req, res) => {
    return res.render('reset-password');
  });

  app.get('/reset-password.html', (req, res) => {
    return res.redirect('/reset-password');
  });

  app.get('/', (req, res) => {
    return res.json({ 
      status: 'running',
      environment: process.env.NODE_ENV || 'development',
      admin: '/admin',
      uploadPage: '/upload.html'
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    
    console.error('Error:', err.message);
    return res.status(500).json({ 
      error: isProduction ? 'Internal server error' : err.message 
    });
  });

  // 404 handler
  app.use((req, res) => {
    if (res.headersSent) {
      return;
    }
    return res.status(404).json({ error: 'Not found' });
  });

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!isProduction) {
      console.log(`Admin panel: ${process.env.BACKEND_URL}/admin`);
      console.log(`Upload page: ${process.env.BACKEND_URL}/upload.html`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received: closing server');
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received: closing server');
    await prisma.$disconnect();
    process.exit(0);
  });
};

start().catch(console.error);
