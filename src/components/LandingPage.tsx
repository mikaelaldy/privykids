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
      title: 'Pembelajaran Interaktif',
      description: 'Bukan sekadar membaca, anak akan terlibat langsung dalam setiap misi untuk memahami konsep-konsep penting.',
      color: 'blue'
    },
    {
      icon: Gamepad2,
      title: 'Game Edukatif Seru',
      description: 'Latih skill keamanan melalui game menantang seperti "The Password Game" dan "Share or Shield".',
      color: 'purple'
    },
    {
      icon: MessageCircle,
      title: 'Teman AI Pribadi',
      description: 'Bingung? Tanya "Privy"! Asisten AI kami siap membantu menjelaskan topik sulit dengan cara yang mudah dimengerti.',
      color: 'green'
    },
    {
      icon: Trophy,
      title: 'Raih Level & Lencana',
      description: 'Setiap kemajuan akan diapresiasi! Sistem poin dan lencana dirancang untuk menjaga semangat belajar anak tetap menyala.',
      color: 'yellow'
    }
  ];

  const testimonials = [
    {
      quote: "Anakku suka banget main game password! Sekarang dia excited belajar keamanan online.",
      author: "Sarah M., Orang Tua",
      rating: 5
    },
    {
      quote: "Chatbot Teman Privasi keren banget - dia jawab semua pertanyaanku dengan cara yang gampang dimengerti!",
      author: "Alex, Umur 10 tahun",
      rating: 5
    },
    {
      quote: "Akhirnya ada aplikasi yang ngajarin digital citizenship dengan cara yang beneran disukai anak-anak. Recommended banget!",
      author: "Pak Johnson, Guru SD",
      rating: 5
    }
  ];

  const importancePoints = [
    {
      icon: Shield,
      title: 'Ancaman Siber Nyata',
      description: 'Kejahatan online seperti penipuan dan pencurian data kini dapat menargetkan siapa saja, termasuk anak-anak yang belum paham risiko.',
      color: 'red'
    },
    {
      icon: Globe,
      title: 'Jejak Digital Itu Abadi',
      description: 'Setiap informasi yang dibagikan akan membentuk jejak digital anak di masa depan. Penting untuk memahami konsekuensinya sejak dini.',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Fondasi Kebiasaan Sehat',
      description: 'Membangun pemahaman tentang privasi sejak kecil akan membentuk kebiasaan digital yang sehat dan bertanggung jawab seumur hidup.',
      color: 'green'
    }
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
              Ubah Anakmu Jadi
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Pahlawan Privasi Digital! 🚀
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Bekali anak dengan pengetahuan keamanan siber melalui petualangan game dan kuis yang seru. 
              Belajar privasi data kini jadi menyenangkan!
            </p>

            {/* Single CTA Button */}
            <div className="flex justify-center items-center mb-12">
              <button
                onClick={onStartAdventure}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <Rocket className="h-7 w-7" />
                Mulai Petualangan!
              </button>
            </div>

            {/* Activities Section */}
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Jelajahi Aktivitas Seru Kami:</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Game Interaktif</h4>
                      <p className="text-gray-600">Latih insting keamanan anak.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Kuis Cerdas</h4>
                      <p className="text-gray-600">Uji dan tingkatkan pengetahuan.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Tanya AI Privy</h4>
                      <p className="text-gray-600">Dapatkan jawaban instan dan ramah.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Importance Section (Replacing Stats) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Kenapa Literasi Privasi Digital Penting?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Di dunia yang serba terhubung, membekali anak dengan pengetahuan adalah tameng terbaik mereka.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {importancePoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border-l-4 border-blue-500"
                >
                  <div className={`bg-${point.color}-100 p-4 rounded-full mb-6 mx-auto w-fit`}>
                    <Icon className={`h-8 w-8 text-${point.color}-600`} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{point.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Kenapa Anak-anak Akan Suka Privykids ❤️
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami merancang setiap fitur agar proses belajar terasa seperti bermain.
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
              Perjalanan Privasi Anakmu 🗺️
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dari Kadet Privasi jadi Pahlawan Privasi hanya dalam beberapa langkah seru!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Mulai sebagai Kadet Privasi</h4>
                <p className="text-gray-600">
                  Mulai petualanganmu dengan konsep privasi dasar lewat kuis interaktif yang seru dan kenalan sama Teman Privasi AI!
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Taklukkan Game Keamanan</h4>
                <p className="text-gray-600">
                  Main Benteng Password, Share or Shield, dan mini-game lain yang ngajarin skill keamanan digital dunia nyata.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">Lulus sebagai Pahlawan Privasi</h4>
                <p className="text-gray-600">
                  Raih lencana, naik level, dan lulus jadi Pahlawan Privasi tersertifikasi yang siap menjelajahi dunia digital dengan aman!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section (Replacing Testimonials) */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Visi Kami untuk Anak Indonesia 🇮🇩
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Menciptakan Generasi Emas Digital yang Cerdas, Kritis, dan Aman.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <p className="text-xl text-gray-700 leading-relaxed">
                Kami membangun Privykids bukan hanya sebagai aplikasi, tetapi sebagai sebuah gerakan. 
                Visi kami adalah memberdayakan setiap anak di Indonesia dengan pemahaman mendalam tentang 
                hak privasi dan cara melindungi diri di dunia maya. Melalui permainan yang menyenangkan, 
                kami percaya fondasi untuk masa depan digital yang lebih aman dapat kita bangun bersama, 
                sejak hari ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-bold text-gray-800 mb-8">
              Dibangun dengan Prinsip Keamanan & Kepercayaan 🛡️
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4 mx-auto w-fit">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Privasi Terjaga</h4>
                <p className="text-gray-600">Kami berkomitmen untuk tidak mengumpulkan data pribadi yang tidak diperlukan. Progres belajar dirancang untuk tetap aman.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4 mx-auto w-fit">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Konten Sesuai Usia</h4>
                <p className="text-gray-600">Semua materi dan permainan dirancang oleh tim kami khusus untuk anak-anak, dengan bahasa yang positif dan mudah dipahami.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4 mx-auto w-fit">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Dirancang untuk Orang Tua</h4>
                <p className="text-gray-600">Kami menyediakan platform yang aman bagi orang tua untuk memperkenalkan konsep privasi digital kepada anak-anak mereka.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Siap Memulai Petualangan Digital yang Aman? 🚀
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Bergabunglah dalam misi kami untuk menciptakan generasi digital yang lebih bijak. 
            Coba prototipe Privykids sekarang!
          </p>
          
          <div className="flex justify-center items-center">
            <button
              onClick={onStartAdventure}
              className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-3"
            >
              <Sparkles className="h-7 w-7" />
              Mulai Sekarang, Gratis!
            </button>
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
                Memberdayakan generasi penerus warga digital
              </p>
              <p className="text-sm text-gray-500">
                © 2024 Privykids. Dibuat dengan ❤️ untuk masa depan digital yang lebih aman.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;