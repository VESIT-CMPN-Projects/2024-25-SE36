'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, DollarSign, Home, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Types
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  images: string[];
  owner_id: string;
}

interface PropertyDetailsProps {
  id: string;
}

// Components
const PropertyImageGallery = ({ images }: { images: string[] }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10" />
        <Image
          src={mainImage || '/default-property.jpg'}
          alt="Main property image"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-700"
          priority
          sizes="100vw"
          quality={90}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 
              ${mainImage === image ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`Property image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 20vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertyFeatures = ({ property }: { property: Property }) => (
  <div className="grid grid-cols-3 gap-4 p-6 bg-muted rounded-lg">
    <div className="flex items-center gap-2">
      <Home className="w-5 h-5 text-primary" />
      <span>{property.bedrooms} beds</span>
    </div>
    <div className="flex items-center gap-2">
      <Building2 className="w-5 h-5 text-primary" />
      <span>{property.bathrooms} baths</span>
    </div>
    <div className="flex items-center gap-2">
      <DollarSign className="w-5 h-5 text-primary" />
      <span>{property.square_feet.toLocaleString()} sqft</span>
    </div>
  </div>
);

const PropertyMap = ({ coordinates }: { coordinates: [number, number] }) => {
  const [lat, lng] = coordinates;
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&marker=${lat}%2C${lng}&layer=mapnik`;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Location</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[400px] relative rounded-lg overflow-hidden">
          <iframe 
            src={osmMapUrl} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen 
            aria-hidden="false" 
            tabIndex={0}
            title="Property Location"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <Skeleton className="h-[500px] w-full rounded-2xl" />
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
    <div className="space-y-4">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  </div>
);

export default function PropertyDetails({ id }: PropertyDetailsProps) {
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [propertyResponse, userResponse] = await Promise.all([
          supabase.from('properties').select('*').eq('id', id).single(),
          supabase.auth.getUser()
        ]);

        if (propertyResponse.error) throw propertyResponse.error;
        
        setProperty(propertyResponse.data);
        
        if (!userResponse.error) {
          setCurrentUser(userResponse.data.user);
          if (userResponse.data.user?.email) {
            setContactEmail(userResponse.data.user.email);
          }
        }

        // Geocode address
        if (propertyResponse.data.address) {
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(propertyResponse.data.address)}`
          );
          const geocodeData = await geocodeResponse.json();
          
          if (geocodeData?.[0]) {
            setCoordinates([parseFloat(geocodeData[0].lat), parseFloat(geocodeData[0].lon)]);
          }
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!currentUser) {
        throw new Error('You must be logged in to submit an application');
      }

      if (currentUser.id === property?.owner_id) {
        throw new Error('You cannot apply to your own property');
      }

      const { error: applicationError } = await supabase
        .from('property_applications')
        .insert([{
          property_id: id,
          applicant_id: currentUser.id,
          email: contactEmail,
          phone: contactPhone,
          message: message,
        }]);

      if (applicationError) throw applicationError;

      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the property owner.",
      });

      setMessage('');
      setContactPhone('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (error || !property) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-destructive">Error: Property not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <PropertyImageGallery images={property.images} />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
            <p className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</p>
          </div>
          
          <PropertyFeatures property={property} />

          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground">{property.address}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact About This Property</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              currentUser.id !== property.owner_id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <Input
                        type="tel"
                        placeholder="Your phone number"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                      />
                    </div>
                    <Textarea
                      placeholder="Your message about this property..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              ) : (
                <p className="text-center text-muted-foreground">
                  This is your property listing
                </p>
              )
            ) : (
              <div className="text-center">
                <p className="mb-4">Please log in to contact about this property</p>
                <Button asChild>
                  <a href="/auth/login">Log In</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {coordinates && (
        <div className="mt-8">
          <PropertyMap coordinates={coordinates} />
        </div>
      )}
    </div>
  );
}