import { useState } from 'react';

type ContactFormProps = {
  serviceIdentifier?: string;
  t?: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    buttonIdle: string;
    buttonSending: string;
    successTitle: string;
    successMessage: string;
    errorText: string;
  };
};

export default function ContactForm({ serviceIdentifier = 'General Inquiry', t }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const dict = t || {
    nameLabel: 'Your Name',
    namePlaceholder: 'Jane Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'jane@example.com',
    messageLabel: 'Project Details',
    messagePlaceholder: "Tell me about your goals, timeline, and what you're looking to build...",
    buttonIdle: 'Send Message',
    buttonSending: 'Sending...',
    successTitle: 'Message Received',
    successMessage: "Thanks for reaching out! I'll get back to you within 24-48 hours.",
    errorText: 'Something went wrong. Please check your connection and try again.'
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="py-16 px-8 border border-neutral-100 rounded-3xl bg-neutral-50 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-neutral-900 text-white flex items-center justify-center rounded-2xl mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">{dict.successTitle}</h3>
        <p className="text-neutral-500">{dict.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-10">
      <input type="hidden" name="service_type" value={serviceIdentifier} />
      
      <div className="group">
        <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2 group-focus-within:text-neutral-900 transition-colors">{dict.nameLabel}</label>
        <input 
          required 
          type="text" 
          id="name" 
          name="name" 
          placeholder={dict.namePlaceholder} 
          className="w-full bg-transparent border-b border-neutral-200 py-3 text-lg focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
        />
      </div>

      <div className="group">
        <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2 group-focus-within:text-neutral-900 transition-colors">{dict.emailLabel}</label>
        <input 
          required 
          type="email" 
          id="email" 
          name="email" 
          placeholder={dict.emailPlaceholder} 
          className="w-full bg-transparent border-b border-neutral-200 py-3 text-lg focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300"
        />
      </div>

      <div className="group">
        <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-2 group-focus-within:text-neutral-900 transition-colors">{dict.messageLabel}</label>
        <textarea 
          required 
          id="message" 
          name="message" 
          rows={4} 
          placeholder={dict.messagePlaceholder} 
          className="w-full bg-transparent border-b border-neutral-200 py-3 text-lg focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300 resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'sending'}
        className="w-full md:w-auto self-start px-8 py-4 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {status === 'sending' ? dict.buttonSending : dict.buttonIdle}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm font-medium mt-4">{dict.errorText}</p>
      )}
    </form>
  );
}
