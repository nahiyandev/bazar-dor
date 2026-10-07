import Hero from '@/components/Hero';
import ProductSections from '@/components/ProductSections';


const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* ব্যানার / হিরো সেকশন */}
      <Hero />

      {/* মূল প্রোডাক্ট সেকশনসমূহ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProductSections />
      </main>
    </div>
  );
};

export default Home;