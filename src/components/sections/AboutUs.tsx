import { Button } from "@/components/ui/button";

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

export const AboutUs = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Alex Johnson",
      role: "Founder & Head Gardener",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Taylor Smith",
      role: "Plant Care Expert",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Jordan Lee",
      role: "Customer Experience",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">About PlantBot</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Bringing nature's beauty into your home, one plant at a time.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2020, PlantBot started as a small urban nursery with a passion for making indoor gardening accessible to everyone.
              What began as a local plant shop has blossomed into an online destination for plant lovers across the country.
            </p>
            <p className="text-gray-300">
              We believe that everyone deserves a little more green in their life, and we're here to help you find the perfect plants for your space.
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-300">
              To provide high-quality plants, expert advice, and exceptional service to help our customers create beautiful, thriving indoor gardens.
              We're committed to sustainability and ethical sourcing in everything we do.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-bold mb-8">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face';
                    }}
                  />
                </div>
                <h4 className="text-xl font-bold">{member.name}</h4>
                <p className="text-green-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
