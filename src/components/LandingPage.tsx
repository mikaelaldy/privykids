import React, { useState, useEffect, useRef } from 'react';
import { Shield, Star, Trophy, MessageCircle, Play, ChevronRight, Award, Lock, Eye, EyeOff, ArrowRight, Users, Target, Gamepad2, Brain, CheckCircle, Sparkles, Rocket, Heart, Globe, BookOpen, HelpCircle, Phone, Mail, Clock } from 'lucide-react';
import LandingNavbar from './LandingNavbar';

interface LandingPageProps {
  onStartAdventure: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAdventure }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Refs for scrolling to sections
  const fiturRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const parentRef = useRef<HTMLElement>(null);

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

  const faqItems = [
    {
      question: 'Apa itu Privykids?',
      answer: 'Privykids adalah platform edukasi digital yang dirancang khusus untuk mengajarkan anak-anak usia 8-12 tahun tentang keamanan internet dan privasi digital melalui game interaktif, kuis, dan chatbot AI yang ramah.'
    },
    {
      question: 'Apakah Privykids aman untuk anak-anak?',
      answer: 'Ya! Privykids dirancang dengan prinsip privacy-by-design. Kami tidak mengumpulkan data pribadi anak, semua konten sesuai usia, dan platform ini mendorong keterlibatan orang tua dalam proses pembelajaran.'
    },
    {
      question: 'Bagaimana cara memulai?',
      answer: 'Cukup klik tombol "Mulai Petualangan" dan anak dapat langsung memulai perjalanan belajar mereka. Tidak perlu registrasi atau memberikan informasi pribadi.'
    },
    {
      question: 'Usia berapa yang cocok untuk Privykids?',
      answer: 'Privykids dirancang untuk anak usia 8-12 tahun, dengan konten yang disesuaikan untuk tingkat pemahaman dan minat mereka.'
    },
    {
      question: 'Apakah ada biaya untuk menggunakan Privykids?',
      answer: 'Saat ini Privykids tersedia gratis sebagai bagian dari misi kami untuk meningkatkan literasi digital anak-anak Indonesia.'
    },
    {
      question: 'Bagaimana orang tua bisa terlibat?',
      answer: 'Orang tua dapat mendampingi anak saat belajar, mendiskusikan materi yang dipelajari, dan menggunakan momentum ini untuk membangun komunikasi terbuka tentang keamanan digital.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigateToSection = (sectionId: string) => {
    switch (sectionId) {
      case 'fitur':
        fiturRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'faq':
        faqRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'untuk-orang-tua':
        parentRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-nunito">
      {/* Navigation */}
      <LandingNavbar 
        onStartAdventure={onStartAdventure} 
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
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
      <section ref={fiturRef} className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
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

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Pertanyaan yang Sering Ditanyakan 🤔
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Punya pertanyaan? Kami punya jawabannya!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <HelpCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">{item.question}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section ref={parentRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Panduan untuk Orang Tua 👨‍👩‍👧‍👦
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips dan panduan untuk memaksimalkan pembelajaran anak dengan Privykids.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Tips */}
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-6">💡 Tips Mendampingi Anak</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">Dampingi Saat Belajar</h5>
                      <p className="text-gray-600">Luangkan waktu 15-30 menit untuk belajar bersama anak. Ini bukan hanya meningkatkan pemahaman, tapi juga memperkuat bonding.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">Diskusikan Materi</h5>
                      <p className="text-gray-600">Tanyakan apa yang dipelajari anak hari ini. Diskusi terbuka membantu anak memahami konsep lebih dalam.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">Buat Rutina Belajar</h5>
                      <p className="text-gray-600">Jadwalkan sesi Privykids secara rutin, misalnya 3x seminggu. Konsistensi adalah kunci pembelajaran yang efektif.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 mb-2">Rayakan Pencapaian</h5>
                      <p className="text-gray-600">Berikan apresiasi saat anak menyelesaikan misi atau mendapat lencana. Motivasi positif meningkatkan semangat belajar.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Safety Guidelines */}
              <div>
                <h4 className="text-2xl font-bold text-gray-800 mb-6">🛡️ Panduan Keamanan</h4>
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <h5 className="font-bold text-blue-800 mb-4">Privykids Aman untuk Anak</h5>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Tidak memerlukan registrasi atau data pribadi</li>
                    <li>• Konten telah disesuaikan untuk usia 8-12 tahun</li>
                    <li>• Tidak ada iklan atau konten eksternal</li>
                    <li>• Mendorong keterlibatan orang tua</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h6 className="font-bold text-gray-800 mb-2">💬 Topik untuk Didiskusikan</h6>
                    <p className="text-gray-600 text-sm">Password yang kuat, informasi yang boleh dibagikan online, cara mengenali penipuan internet, pentingnya ijin orang tua sebelum download aplikasi.</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h6 className="font-bold text-gray-800 mb-2">📱 Praktik di Kehidupan Nyata</h6>
                    <p className="text-gray-600 text-sm">Terapkan pembelajaran Privykids saat anak menggunakan gadget sehari-hari. Buat password untuk akun bersama, cek pengaturan privasi bersama.</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h6 className="font-bold text-gray-800 mb-2">🎯 Indikator Keberhasilan</h6>
                    <p className="text-gray-600 text-sm">Anak mulai bertanya sebelum membagikan informasi, dapat membuat password yang kuat, memahami perbedaan informasi pribadi vs publik.</p>
                  </div>
                </div>
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