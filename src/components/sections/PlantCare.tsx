import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CareTip = {
  title: string;
  description: string;
  icon: string;
};

export const PlantCare = () => {
  const careTips: CareTip[] = [
    {
      title: "Watering Wisdom",
      description: "Learn the right way to water different types of plants and avoid common watering mistakes.",
      icon: "💧"
    },
    {
      title: "Light Requirements",
      description: "Understand how much light your plants need and how to position them for optimal growth.",
      icon: "☀️"
    },
    {
      title: "Soil & Fertilizing",
      description: "Discover the best soil mixes and fertilizing schedules for healthy plant growth.",
      icon: "🌱"
    },
    {
      title: "Pest Control",
      description: "Natural and effective ways to keep your plants pest-free and healthy.",
      icon: "🐛"
    }
  ];

  return (
    <section id="plant-care" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Plant Care Guide</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Essential tips and tricks to keep your plants thriving and beautiful all year round.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careTips.map((tip, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500 transition-colors h-full">
              <CardHeader>
                <div className="text-4xl mb-4">{tip.icon}</div>
                <CardTitle className="text-2xl">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  {tip.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="/plant-care" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Explore Complete Care Guide
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PlantCare;
