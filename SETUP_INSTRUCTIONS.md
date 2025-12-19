# WhatsApp Storefront - Setup Instructions

This document contains step-by-step instructions to set up the WhatsApp storefront with Supabase.

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and create the project

### Set Up Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the following SQL script:

```sql
-- Stores table
CREATE TABLE stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  whatsapp_number TEXT NOT NULL,
  logo_url TEXT,
  currency TEXT DEFAULT '₹',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public access stores" ON stores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access products" ON products FOR ALL USING (true) WITH CHECK (true);
```

5. Click **Run** to execute the script

### Set Up Storage Bucket

1. Navigate to **Storage** (in the left sidebar)
2. Click **New Bucket**
3. Name it: `store-images`
4. Set it to **Public bucket** (toggle on)
5. Click **Create Bucket**

### Get Your API Credentials

1. Navigate to **Settings** → **API** (in the left sidebar)
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## 2. Project Configuration

### Install Dependencies

```bash
npm install
```

This will install all required dependencies including `@supabase/supabase-js`.

### Configure Environment Variables

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholder values with your actual Supabase credentials from step 1.

## 3. Run the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 4. How It Works

### Creating a Store

1. Click the **"Create Store"** button on the homepage
2. **Step 1**: Fill in store details (name, description, WhatsApp number, currency, logo)
3. **Step 2**: Add products (name, description, price, image)
4. **Step 3**: Get your unique store link and share it

### Viewing a Store

- Public stores are accessible at: `http://yourdomain.com/store/[slug]`
- Example: `http://localhost:5173/store/fresh-fruit-market-abc1`

### Buying Products

- Customers click the "Buy on WhatsApp" button
- A pre-filled WhatsApp message opens with product details
- The message is sent to the store's WhatsApp number

## 5. Storage Bucket Policy (Optional)

If you want to restrict uploads to authenticated users only (while keeping images publicly readable):

1. Go to **Storage** → **Policies** → **store-images**
2. Create a policy:
   - **Policy Name**: "Authenticated users can upload"
   - **Allowed operation**: INSERT
   - **Policy definition**: `(auth.role() = 'authenticated')`
3. Create another policy:
   - **Policy Name**: "Public can view"
   - **Allowed operation**: SELECT
   - **Policy definition**: `true`

## 6. Troubleshooting

### Images not uploading

- Check that the `store-images` bucket exists and is public
- Verify the Supabase URL and API key are correct in `.env`
- Check browser console for error messages

### Store not found

- Verify the store slug in the URL is correct
- Check the `stores` table in Supabase to see if the store exists
- Make sure the RLS policies are set up correctly

### Database errors

- Ensure all SQL scripts ran successfully
- Check the Supabase logs for detailed error messages
- Verify the tables exist in the **Table Editor**

## 7. Customization

### Change Currency Options

Edit `components/StoreDetailsForm.tsx` around line 133 to add/remove currencies:

```tsx
<select>
  <option value="₹">₹ (Indian Rupee)</option>
  <option value="$">$ (US Dollar)</option>
  <option value="€">€ (Euro)</option>
  <option value="AED">AED (UAE Dirham)</option>
  {/* Add more currencies here */}
</select>
```

### Modify Design

- All clay/neumorphic design styles are in `index.html` (lines 34-116)
- Component-specific styles use Tailwind CSS classes

### Change Domain for Store Links

The store URL is automatically generated based on `window.location.origin`. When deployed, it will use your production domain automatically.

## 8. Deployment

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Add environment variables in the deployment platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Important Notes

- Make sure `.env` is in `.gitignore` (it should be by default)
- Never commit your actual Supabase credentials to Git
- Use the environment variables feature of your hosting platform

## Need Help?

- Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Review the code comments in `services/supabase.ts`
- Open an issue in the project repository
