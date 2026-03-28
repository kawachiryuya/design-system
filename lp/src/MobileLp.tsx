import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import TrialCtaSection from './sections/TrialCtaSection';
import UsageFlowSection from './sections/UsageFlowSection';
import CautionSection from './sections/CautionSection';
import CtaBand from './components/CtaBand';
import ApplicationFlowSection from './sections/ApplicationFlowSection';
import FaqSection from './sections/FaqSection';
import LinksSection from './sections/LinksSection';
import FooterSection from './sections/FooterSection';

export default function MobileLp() {
  return (
    <main className="bg-white flex flex-col w-full overflow-clip">
      <HeroSection />
      <AboutSection />
      <TrialCtaSection />
      <UsageFlowSection />
      <CautionSection />
      <CtaBand />
      <ApplicationFlowSection />
      <CtaBand />
      <FaqSection />
      <LinksSection />
      <FooterSection />
    </main>
  );
}
