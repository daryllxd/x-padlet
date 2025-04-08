import { ContactFormSubmission, supabase } from '../supabase';

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
