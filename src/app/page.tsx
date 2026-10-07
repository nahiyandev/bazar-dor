import Hero from '@/components/Hero';


const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero / Banner Section */}
      <Hero />

      {/* পরবর্তী সেকশন যেখানে স্ক্রল হয়ে নামবে */}
      <section id="all-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* এখানে ফিল্টারিং ও প্রোডাক্ট কার্ডগুলো বসবে */}
      </section>
    </div>
  );
};

export default Home;