'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl">
        <p className="text-lg mb-6">
          Have any questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              placeholder="Your message..."
              rows={6}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>

        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Other Ways to Reach Us</h2>
          <div>
            <h3 className="font-medium">Email</h3>
            <p>info@realestate.com</p>
          </div>
          <div>
            <h3 className="font-medium">Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="font-medium">Address</h3>
            <p>8911 Tanglewood Ave.<br />Capitol Heights, MD 20743</p>
          </div>
        </div>
      </div>
    </div>
  );
}