import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://iglffttwjxwuvrpnwgks.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnbGZmdHR3anh3dXZycG53Z2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTkzNTYsImV4cCI6MjA3NDYzNTM1Nn0.qVemVkPHgI1X9b8xsciV6da8Ol27I14p4vIW3j-4idE";

export const supabase = createClient(supabaseUrl, supabaseKey);