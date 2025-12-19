import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized');
} else {
  console.warn('Supabase credentials not configured. Database features will be unavailable.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/contact', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ success: false, error: 'Database not configured' });
    }

    const { company_name, contact_person, email, phone, message, employees, job_title } = req.body;

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        company_name,
        contact_person,
        email,
        phone,
        message,
      }])
      .select();

    if (error) throw error;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `[Platter WorkLab] New Inquiry from ${company_name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Company:</strong> ${company_name}</p>
          <p><strong>Contact Person:</strong> ${contact_person}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Employees:</strong> ${employees || 'N/A'}</p>
          <p><strong>Job Title:</strong> ${job_title || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message || 'No message provided'}</p>
        `,
      });
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ success: true, data: [], count: 0, hasMore: false });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ success: true, data, count, hasMore: (offset + limit) < (count || 0) });
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ success: false, error: 'Database not configured' });
    }

    const { id } = req.params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    await supabase
      .from('posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    res.json({ success: true, data: { ...data, view_count: (data.view_count || 0) + 1 } });
  } catch (error: any) {
    console.error('Fetch post error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ success: false, error: 'Database not configured' });
    }

    const { title, category, thumbnail_url, content } = req.body;

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, category, thumbnail_url, content, view_count: 0 }])
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({ success: false, error: 'Database not configured' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete post error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid password' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: supabase ? 'connected' : 'not configured',
    email: process.env.EMAIL_USER ? 'configured' : 'not configured'
  });
});

const PORT = parseInt(process.env.PORT || '3001', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
