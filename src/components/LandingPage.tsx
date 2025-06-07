import React, { useState, useEffect } from 'react';
import { Shield, Star, Trophy, MessageCircle, Play, ChevronRight, Award, Lock, Eye, EyeOff, ArrowRight, Users, Target, Gamepad2, Brain, CheckCircle, Sparkles, Rocket, Heart, Globe, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onStartAdventure: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAdventure }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'Interactive Learning',
      description: 'Fun quizzes and missions that make privacy education feel like an adventure!',
      color: 'blue'
    },
    {
      icon: Gamepad2,
      title: 'Engaging Games',
      description: 'Mini-games like Password Fortress and Share or Shield teach through play.',
      color: 'purple'
    },
    {
      icon: MessageCircle,
      title: 'AI Privacy Pal',
      description: 'A friendly chatbot companion that answers questions and provides daily tips.',
      color: 'green'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges, level up, and track progress as you become a Privacy Guardian!',
      color: 'yellow'
    }
  ];

  const testimonials = [
    {
      quote: "My daughter loves playing the password games! She's actually excited to learn about online safety now.",
      author: "Sarah M., Parent",
      rating: 5
    },
    {
      quote: "The Privacy Pal chatbot is amazing - it answers all my questions in a way I can understand!",
      author: "Alex, Age 10",
      rating: 5
    },
    {
      quote: "Finally, an app that teaches digital citizenship in a way kids actually enjoy. Highly recommend!",
      author: "Mr. Johnson, Elementary Teacher",
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Young Privacy Guardians' },
    { number: '50+', label: 'Interactive Lessons' },
    { number: '98%', label: 'Parent Satisfaction' },
    { number: '15+', label: 'Achievement Badges' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-nunito">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl shadow-xl">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Privykids
              </h1>
            </div>

            {/* Hero Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Turn Your Child Into a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Digital Privacy Hero! 🚀
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of kids on an epic adventure through the Digital Universe! 
              Learn online safety, master password security, and become a Privacy Guardian 
              through fun games, quizzes, and your personal AI companion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onStartAdventure}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <Rocket className="h-6 w-6" />
                Start Your Adventure!
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-3">
                <Play className="h-6 w-6" />
                Watch Demo
              </button>
            </div>

            {/* Hero Image/Animation Placeholder */}
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 p-4 rounded-full mb-3 mx-auto w-fit">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-700">Learn</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 p-4 rounded-full mb-3 mx-auto w-fit">
                      <Gamepad2 className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="font-semibold text-gray-700">Play</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-4 rounded-full mb-3 mx-auto w-fit">
                      <Trophy className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="font-semibold text-gray-700">Achieve</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-100 p-4 rounded-full mb-3 mx-auto w-fit">
                      <Shield className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="font-semibold text-gray-700">Protect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Why Kids Love Privykids 💖
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've transformed boring privacy lessons into an exciting adventure 
              that kids actually want to experience!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                >
                  <div className={`bg-${feature.color}-100 p-4 rounded-full mb-6 mx-auto w-fit`}>
                    <Icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Your Child's Privacy Journey 🗺️
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From Privacy Cadet to Digital Guardian in just a few fun steps!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Start as a Privacy Cadet</h4>
                <p className="text-gray-600">
                  Begin your adventure with basic privacy concepts through fun, interactive quizzes and meet your AI Privacy Pal!
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Master Safety Games</h4>
                <p className="text-gray-600">
                  Play Password Fortress, Share or Shield, and other mini-games that teach real-world digital safety skills.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Become a Privacy Guardian</h4>
                <p className="text-gray-600">
                  Earn badges, level up, and graduate as a certified Privacy Guardian ready to navigate the digital world safely!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              What Families Are Saying 🌟
            </h3>
            <p className="text-xl text-gray-600">
              Join thousands of happy families on the privacy adventure!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <cite className="text-gray-600 font-semibold">
                — {testimonials[currentTestimonial].author}
              </cite>
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-bold text-gray-800 mb-8">
              Built with Safety & Trust in Mind 🛡️
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4 mx-auto w-fit">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Privacy First</h4>
                <p className="text-gray-600">No personal data collection. Everything stays on your device.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4 mx-auto w-fit">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Age-Appropriate</h4>
                <p className="text-gray-600">Designed by educators specifically for children ages 8-12.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4 mx-auto w-fit">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Parent Approved</h4>
                <p className="text-gray-600">Trusted by educators and recommended by child safety experts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start the Adventure? 🚀
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the Privacy Academy today and help your child become a confident, 
            safe digital citizen through the power of play!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onStartAdventure}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
            >
              <Sparkles className="h-6 w-6" />
              Begin Your Journey Now!
            </button>
            <p className="text-blue-100 text-sm">
              Free to start • No downloads required • Safe & secure
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Privykids</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">
                Empowering the next generation of digital citizens
              </p>
              <p className="text-sm text-gray-500">
                © 2024 Privykids. Made with ❤️ for safer digital futures.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;