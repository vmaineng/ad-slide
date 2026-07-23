from supabase import Client, create_client
 
from .config import SUPABASE_KEY, SUPABASE_URL
 
supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
 