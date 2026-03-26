import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data, error } = await supabase
    .from('Order')
    .select('*, service:Service(title), seller:Profile!seller_id(full_name), reviews:Review(id)')
    .limit(1);
    
  if (error) {
    console.error('Error fetching Orders:', error);
  } else {
    console.log('Query success:', data);
  }
}

check();
