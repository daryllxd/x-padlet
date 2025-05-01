import { supabase } from '../db';

export type ContactFormSubmission = {
  id?: string;
  name: string;
  email: string;
  message: string;
  category?: string;
  created_at?: string;
};

export async function submitContactForm(data: Omit<ContactFormSubmission, 'id' | 'created_at'>) {
  try {
    const { data: result, error } = await supabase.from('contact_form_submissions').insert([data]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw new Error(`Supabase error: ${error.message} (${error.code})`);
    }

    return result;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}
