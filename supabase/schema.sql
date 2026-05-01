-- Smart Green Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_vip boolean not null default false,
  location text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_ar text,
  name_ku text,
  description text not null default '',
  description_ar text,
  description_ku text,
  price numeric(10,2) not null,
  image_url text,
  emoji text not null default '🌿',
  category text not null check (category in ('kit', 'plant', 'nutrient', 'accessory')),
  is_new boolean not null default false,
  is_featured boolean not null default false,
  stock integer not null default 0,
  care_instructions text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "Products are viewable by everyone" on public.products for select using (true);
create policy "Admins can manage products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Orders
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) not null,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  shipping_street text,
  shipping_city text,
  shipping_country text,
  shipping_phone text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins can manage all orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Order Items
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  product_name text not null,
  quantity integer not null default 1,
  price numeric(10,2) not null
);

alter table public.order_items enable row level security;
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
create policy "Admins can view all order items" on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Reviews
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  helpful_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;
create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Authenticated users can create reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Inventory (tracks stock changes)
create table public.inventory_log (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade not null,
  change integer not null,
  reason text,
  created_at timestamptz not null default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('order', 'ai_alert', 'low_stock', 'recommendation', 'system')),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Subscriptions
create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  plan text not null default 'free' check (plan in ('free', 'plus')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz
);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- Sensor Data
create table public.sensor_data (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  ph numeric(4,2) not null,
  ec numeric(4,2) not null,
  water_temp numeric(4,1) not null,
  reservoir_level integer not null,
  timestamp timestamptz not null default now()
);

alter table public.sensor_data enable row level security;
create policy "Users can view own sensor data" on public.sensor_data for select using (auth.uid() = user_id);

-- Garden Configurations
create table public.garden_configs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'My Garden',
  slots jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.garden_configs enable row level security;
create policy "Users can manage own garden configs" on public.garden_configs for all using (auth.uid() = user_id);

-- Addresses
create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  label text not null default 'Home',
  street text not null,
  city text not null,
  country text not null default 'Iraq',
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;
create policy "Users can manage own addresses" on public.addresses for all using (auth.uid() = user_id);

-- Wishlist
create table public.wishlists (
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.wishlists enable row level security;
create policy "Users can manage own wishlist" on public.wishlists for all using (auth.uid() = user_id);

-- Functions

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Decrement stock on order
create or replace function public.decrement_stock()
returns trigger as $$
begin
  update public.products
  set stock = stock - new.quantity
  where id = new.product_id;

  -- Create low stock notification if below threshold
  if (select stock from public.products where id = new.product_id) < 10 then
    insert into public.notifications (user_id, type, title, message)
    select p.id, 'low_stock', 'Low Stock Alert',
      concat((select name from public.products where id = new.product_id), ' is running low (', (select stock from public.products where id = new.product_id), ' remaining)')
    from public.profiles p where p.role = 'admin';
  end if;

  insert into public.inventory_log (product_id, change, reason)
  values (new.product_id, -new.quantity, concat('Order ', new.order_id));

  return new;
end;
$$ language plpgsql security definer;

create trigger on_order_item_created
  after insert on public.order_items
  for each row execute function public.decrement_stock();

-- Enable realtime for key tables
alter publication supabase_realtime add table public.sensor_data;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.orders;
