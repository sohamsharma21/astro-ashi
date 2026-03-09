import { useState } from 'react';
import DOMPurify from 'dompurify';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StarBackground from '@/components/StarBackground';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { ArrowLeft, Clock, Calendar, User, Share2, Bookmark } from 'lucide-react';

interface Article {
  id: string;
  title_en: string;
  title_hi: string;
  excerpt_en: string;
  excerpt_hi: string;
  content_en: string;
  content_hi: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

const categoryColors: Record<string, string> = {
  planets: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  moon: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  history: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  spirituality: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  kundli: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  wellness: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  festivals: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const categoryLabels: Record<string, { en: string; hi: string }> = {
  planets: { en: 'Planets', hi: 'ग्रह' },
  moon: { en: 'Moon', hi: 'चंद्रमा' },
  history: { en: 'History', hi: 'इतिहास' },
  spirituality: { en: 'Spirituality', hi: 'आध्यात्मिकता' },
  kundli: { en: 'Kundli', hi: 'कुंडली' },
  wellness: { en: 'Wellness', hi: 'स्वास्थ्य' },
  festivals: { en: 'Festivals', hi: 'त्योहार' },
};

const CosmicJournal = () => {
  const { language } = useAuth();
  const { recordReading } = useReadingHistory();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const articles: Article[] = [
    {
      id: '1',
      title_en: 'Saturn Transit 2025: What It Means for Your Sign',
      title_hi: 'शनि गोचर 2025: आपकी राशि के लिए क्या मायने रखता है',
      excerpt_en: 'Saturn moves into Pisces in 2025 — discover how this major transit will reshape your life over the next 2.5 years.',
      excerpt_hi: '2025 में शनि मीन राशि में प्रवेश कर रहा है — जानें यह महत्वपूर्ण गोचर अगले 2.5 वर्षों में आपके जीवन को कैसे बदलेगा।',
      content_en: `
        <h2>The Great Saturn Shift of 2025</h2>
        <p>Saturn, the planet of karma, discipline, and life lessons, is making a significant move in 2025. After spending nearly 2.5 years in Aquarius, Saturn will transit into Pisces, bringing profound changes for every zodiac sign.</p>
        
        <h3>What Saturn in Pisces Means</h3>
        <p>Saturn in Pisces (Meen Rashi) is a unique combination. The strict, disciplined energy of Saturn meets the dreamy, spiritual waters of Pisces. This transit encourages:</p>
        <ul>
          <li><strong>Spiritual discipline:</strong> A call to establish regular meditation and prayer practices</li>
          <li><strong>Emotional maturity:</strong> Learning to process feelings with wisdom rather than avoidance</li>
          <li><strong>Compassionate boundaries:</strong> Helping others while protecting your own energy</li>
          <li><strong>Creative structure:</strong> Turning artistic dreams into tangible achievements</li>
        </ul>
        
        <h3>Impact on Each Sign</h3>
        <p><strong>Aries:</strong> Focus on solitude, spiritual growth, and releasing past karmas. A powerful time for inner work.</p>
        <p><strong>Taurus:</strong> Friendships and social networks undergo restructuring. Quality over quantity in relationships.</p>
        <p><strong>Gemini:</strong> Career responsibilities increase. Hard work now leads to long-term professional success.</p>
        <p><strong>Cancer:</strong> Higher education, travel, and philosophical growth are highlighted. Expand your horizons.</p>
        <p><strong>Leo:</strong> Deep transformations in shared resources, intimacy, and psychological patterns.</p>
        <p><strong>Virgo:</strong> Partnerships and marriage come under Saturn's scrutiny. Commitment is tested and strengthened.</p>
        <p><strong>Libra:</strong> Health and daily routines need attention. Build sustainable wellness habits.</p>
        <p><strong>Scorpio:</strong> Creativity, children, and romance require more responsibility. Joyful discipline.</p>
        <p><strong>Sagittarius:</strong> Home, family, and property matters demand focus. Establish roots.</p>
        <p><strong>Capricorn:</strong> Communication and siblings are highlighted. Learn and teach with patience.</p>
        <p><strong>Aquarius:</strong> Finances and self-worth undergo restructuring. Build lasting material security.</p>
        <p><strong>Pisces:</strong> Saturn enters your sign — a defining 2.5 years of personal transformation and growth.</p>
        
        <h3>How to Navigate This Transit</h3>
        <p>Saturn rewards patience, hard work, and integrity. During this transit:</p>
        <ul>
          <li>Embrace delayed gratification — Saturn's rewards come slowly but last forever</li>
          <li>Take responsibility for your actions and their consequences</li>
          <li>Build structures that support your spiritual growth</li>
          <li>Practice self-compassion while maintaining discipline</li>
        </ul>
      `,
      content_hi: `
        <h2>2025 का महान शनि परिवर्तन</h2>
        <p>कर्म, अनुशासन और जीवन के सबक के ग्रह शनि 2025 में एक महत्वपूर्ण कदम उठा रहे हैं। कुंभ राशि में लगभग 2.5 वर्ष बिताने के बाद, शनि मीन राशि में गोचर करेंगे, जो हर राशि के लिए गहन परिवर्तन लाएंगे।</p>
        
        <h3>मीन राशि में शनि का अर्थ</h3>
        <p>मीन राशि में शनि एक अनोखा संयोजन है। शनि की सख्त, अनुशासित ऊर्जा मीन के स्वप्निल, आध्यात्मिक जल से मिलती है। यह गोचर प्रोत्साहित करता है:</p>
        <ul>
          <li><strong>आध्यात्मिक अनुशासन:</strong> नियमित ध्यान और प्रार्थना अभ्यास स्थापित करने का आह्वान</li>
          <li><strong>भावनात्मक परिपक्वता:</strong> बचाव के बजाय ज्ञान के साथ भावनाओं को संसाधित करना सीखना</li>
          <li><strong>करुणामय सीमाएं:</strong> अपनी ऊर्जा की रक्षा करते हुए दूसरों की मदद करना</li>
          <li><strong>रचनात्मक संरचना:</strong> कलात्मक सपनों को ठोस उपलब्धियों में बदलना</li>
        </ul>
        
        <h3>प्रत्येक राशि पर प्रभाव</h3>
        <p><strong>मेष:</strong> एकांत, आध्यात्मिक विकास और पिछले कर्मों को मुक्त करने पर ध्यान दें।</p>
        <p><strong>वृषभ:</strong> मित्रता और सामाजिक नेटवर्क में पुनर्गठन।</p>
        <p><strong>मिथुन:</strong> करियर जिम्मेदारियां बढ़ती हैं।</p>
        <p><strong>कर्क:</strong> उच्च शिक्षा, यात्रा और दार्शनिक विकास।</p>
        <p><strong>सिंह:</strong> साझा संसाधनों और मनोवैज्ञानिक पैटर्न में गहरे परिवर्तन।</p>
        <p><strong>कन्या:</strong> साझेदारी और विवाह की परीक्षा।</p>
        <p><strong>तुला:</strong> स्वास्थ्य और दैनिक दिनचर्या पर ध्यान।</p>
        <p><strong>वृश्चिक:</strong> रचनात्मकता और रोमांस में अधिक जिम्मेदारी।</p>
        <p><strong>धनु:</strong> घर और परिवार के मामलों पर ध्यान।</p>
        <p><strong>मकर:</strong> संचार और भाई-बहन।</p>
        <p><strong>कुंभ:</strong> वित्त और आत्म-मूल्य का पुनर्गठन।</p>
        <p><strong>मीन:</strong> शनि आपकी राशि में प्रवेश करता है — व्यक्तिगत परिवर्तन के 2.5 वर्ष।</p>
      `,
      image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5',
      category: 'planets',
      date: '2025-03-01',
      author: 'AstroAshi Team',
      readTime: '8 min'
    },
    {
      id: '2',
      title_en: 'Understanding Your Kundli: A Complete Guide for Beginners',
      title_hi: 'अपनी कुंडली को समझना: शुरुआती लोगों के लिए संपूर्ण गाइड',
      excerpt_en: 'Learn how to read your birth chart, understand planetary positions, and decode the houses in Vedic astrology.',
      excerpt_hi: 'अपनी जन्म कुंडली पढ़ना सीखें, ग्रहों की स्थिति समझें, और वैदिक ज्योतिष में भावों को डिकोड करें।',
      content_en: `
        <h2>What is a Kundli?</h2>
        <p>A Kundli (also called Janam Kundali, birth chart, or horoscope) is a celestial snapshot of the sky at the exact moment of your birth. It maps the positions of the Sun, Moon, planets, and zodiac signs as seen from your birthplace.</p>
        
        <h3>The 12 Houses (Bhavas)</h3>
        <p>Your Kundli is divided into 12 houses, each governing different life areas:</p>
        <ul>
          <li><strong>1st House (Lagna):</strong> Self, personality, physical appearance, life direction</li>
          <li><strong>2nd House:</strong> Wealth, family, speech, food habits, early education</li>
          <li><strong>3rd House:</strong> Siblings, courage, communication, short travels</li>
          <li><strong>4th House:</strong> Mother, home, property, emotional security, vehicles</li>
          <li><strong>5th House:</strong> Children, creativity, romance, education, past life merit</li>
          <li><strong>6th House:</strong> Health challenges, enemies, debts, service, daily work</li>
          <li><strong>7th House:</strong> Marriage, partnerships, business relationships</li>
          <li><strong>8th House:</strong> Transformation, longevity, inheritance, occult, sudden events</li>
          <li><strong>9th House:</strong> Fortune, father, higher education, spirituality, long journeys</li>
          <li><strong>10th House:</strong> Career, public reputation, authority, achievements</li>
          <li><strong>11th House:</strong> Gains, income, friendships, aspirations, elder siblings</li>
          <li><strong>12th House:</strong> Losses, expenses, foreign lands, liberation, sleep</li>
        </ul>
        
        <h3>The 9 Planets (Navagrahas)</h3>
        <p>Vedic astrology uses 9 celestial bodies:</p>
        <ul>
          <li><strong>Sun (Surya):</strong> Soul, father, authority, government, vitality</li>
          <li><strong>Moon (Chandra):</strong> Mind, mother, emotions, public image</li>
          <li><strong>Mars (Mangal):</strong> Energy, courage, siblings, property, accidents</li>
          <li><strong>Mercury (Budh):</strong> Intelligence, communication, business, friends</li>
          <li><strong>Jupiter (Guru):</strong> Wisdom, children, fortune, spirituality, expansion</li>
          <li><strong>Venus (Shukra):</strong> Love, marriage, arts, luxury, comfort</li>
          <li><strong>Saturn (Shani):</strong> Karma, discipline, delays, longevity, hard work</li>
          <li><strong>Rahu:</strong> Obsession, foreign elements, sudden gains, illusion</li>
          <li><strong>Ketu:</strong> Liberation, spirituality, past lives, detachment</li>
        </ul>
        
        <h3>Key Components to Understand</h3>
        <p><strong>Ascendant (Lagna):</strong> The rising sign at birth — your life's starting point and how others perceive you.</p>
        <p><strong>Moon Sign (Rashi):</strong> Your emotional nature and mental tendencies.</p>
        <p><strong>Nakshatra:</strong> The lunar mansion where your Moon is placed — reveals deeper personality traits.</p>
        <p><strong>Dasha System:</strong> Planetary periods that activate different life themes at different ages.</p>
        
        <p>Understanding your Kundli is a journey. Start with your Lagna, Moon sign, and current Mahadasha to gain immediate insights into your life path.</p>
      `,
      content_hi: `
        <h2>कुंडली क्या है?</h2>
        <p>कुंडली (जिसे जन्म कुंडली, जन्मपत्री भी कहते हैं) आपके जन्म के सटीक क्षण में आकाश का एक खगोलीय स्नैपशॉट है। यह सूर्य, चंद्रमा, ग्रहों और राशियों की स्थिति को मैप करती है।</p>
        
        <h3>12 भाव</h3>
        <p>आपकी कुंडली 12 भावों में विभाजित है, प्रत्येक जीवन के विभिन्न क्षेत्रों को नियंत्रित करता है:</p>
        <ul>
          <li><strong>प्रथम भाव (लग्न):</strong> स्वयं, व्यक्तित्व, शारीरिक रूप</li>
          <li><strong>द्वितीय भाव:</strong> धन, परिवार, वाणी</li>
          <li><strong>तृतीय भाव:</strong> भाई-बहन, साहस, संचार</li>
          <li><strong>चतुर्थ भाव:</strong> माता, घर, संपत्ति</li>
          <li><strong>पंचम भाव:</strong> संतान, रचनात्मकता, रोमांस</li>
          <li><strong>षष्ठ भाव:</strong> स्वास्थ्य, शत्रु, ऋण</li>
          <li><strong>सप्तम भाव:</strong> विवाह, साझेदारी</li>
          <li><strong>अष्टम भाव:</strong> परिवर्तन, आयु, विरासत</li>
          <li><strong>नवम भाव:</strong> भाग्य, पिता, उच्च शिक्षा</li>
          <li><strong>दशम भाव:</strong> करियर, प्रतिष्ठा</li>
          <li><strong>एकादश भाव:</strong> लाभ, आय, मित्रता</li>
          <li><strong>द्वादश भाव:</strong> हानि, व्यय, मोक्ष</li>
        </ul>
        
        <h3>नवग्रह</h3>
        <p>वैदिक ज्योतिष 9 ग्रहों का उपयोग करता है:</p>
        <ul>
          <li><strong>सूर्य:</strong> आत्मा, पिता, अधिकार</li>
          <li><strong>चंद्रमा:</strong> मन, माता, भावनाएं</li>
          <li><strong>मंगल:</strong> ऊर्जा, साहस, भाई</li>
          <li><strong>बुध:</strong> बुद्धि, संचार, व्यापार</li>
          <li><strong>गुरु:</strong> ज्ञान, संतान, भाग्य</li>
          <li><strong>शुक्र:</strong> प्रेम, विवाह, कला</li>
          <li><strong>शनि:</strong> कर्म, अनुशासन, विलंब</li>
          <li><strong>राहु:</strong> जुनून, विदेशी तत्व</li>
          <li><strong>केतु:</strong> मोक्ष, आध्यात्मिकता</li>
        </ul>
      `,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      category: 'kundli',
      date: '2025-02-20',
      author: 'Dr. Vedic Scholar',
      readTime: '12 min'
    },
    {
      id: '3',
      title_en: 'Holi 2025: Spiritual Significance and Rituals',
      title_hi: 'होली 2025: आध्यात्मिक महत्व और अनुष्ठान',
      excerpt_en: 'Beyond the colors lies deep spiritual meaning. Discover the sacred traditions and auspicious timings for Holi 2025.',
      excerpt_hi: 'रंगों के परे गहरा आध्यात्मिक अर्थ है। होली 2025 के पवित्र परंपराओं और शुभ मुहूर्त जानें।',
      content_en: `
        <h2>The Festival of Colors and Triumph of Good</h2>
        <p>Holi, one of India's most vibrant festivals, celebrates the victory of good over evil, the arrival of spring, and the eternal love between Radha and Krishna. In 2025, Holika Dahan falls on March 13 and the main Holi celebration is on March 14.</p>
        
        <h3>Spiritual Significance</h3>
        <p><strong>Prahlad and Holika:</strong> The festival commemorates the devotee Prahlad's unwavering faith in Lord Vishnu. His evil aunt Holika tried to burn him, but divine grace saved Prahlad while Holika perished — symbolizing that devotion always triumphs over malice.</p>
        <p><strong>Radha-Krishna:</strong> Holi celebrates the playful divine love between Radha and Krishna. The colors represent the joy, romance, and spiritual bliss of their eternal bond.</p>
        <p><strong>Spring Renewal:</strong> As winter ends and spring begins, Holi marks nature's renewal — a time to let go of past negativity and embrace new beginnings.</p>
        
        <h3>Auspicious Timings for 2025</h3>
        <ul>
          <li><strong>Holika Dahan:</strong> March 13, 2025 — Evening after sunset (check local Panchang for exact muhurat)</li>
          <li><strong>Rangwali Holi:</strong> March 14, 2025 — Play colors from morning until afternoon</li>
          <li><strong>Purnima Tithi:</strong> Full Moon in Phalguna month enhances spiritual energy</li>
        </ul>
        
        <h3>Traditional Rituals</h3>
        <ul>
          <li><strong>Holika Dahan Puja:</strong> Perform puja at the bonfire, offer coconut, grains, and sweets</li>
          <li><strong>Parikrama:</strong> Circumambulate the Holika fire for blessings and protection</li>
          <li><strong>Apply Sacred Ash:</strong> Apply ash from Holika Dahan for spiritual purification</li>
          <li><strong>Forgive and Reconcile:</strong> Let go of grudges; Holi is a time to mend relationships</li>
          <li><strong>Thandai and Gujiya:</strong> Prepare traditional foods and share with family</li>
        </ul>
        
        <h3>Holi Mantras</h3>
        <p>Chant these mantras during Holika Dahan:</p>
        <p><em>"Om Holika Mahadevi, Sarva Papam Nashaya Nashaya"</em></p>
        <p><em>"Om Namo Bhagavate Vasudevaya"</em> (for Lord Vishnu's blessings)</p>
        
        <p>May this Holi bring colors of joy, love, and spiritual awakening to your life!</p>
      `,
      content_hi: `
        <h2>रंगों का त्योहार और अच्छाई की जीत</h2>
        <p>होली, भारत के सबसे जीवंत त्योहारों में से एक, बुराई पर अच्छाई की जीत, वसंत के आगमन, और राधा-कृष्ण के शाश्वत प्रेम का जश्न मनाती है। 2025 में होलिका दहन 13 मार्च और मुख्य होली 14 मार्च को है।</p>
        
        <h3>आध्यात्मिक महत्व</h3>
        <p><strong>प्रह्लाद और होलिका:</strong> यह त्योहार भक्त प्रह्लाद की भगवान विष्णु में अटूट आस्था का स्मरण करता है।</p>
        <p><strong>राधा-कृष्ण:</strong> होली राधा और कृष्ण के दिव्य प्रेम का उत्सव है।</p>
        <p><strong>वसंत नवीनीकरण:</strong> सर्दी समाप्त होते ही होली नई शुरुआत का संकेत देती है।</p>
        
        <h3>2025 के शुभ मुहूर्त</h3>
        <ul>
          <li><strong>होलिका दहन:</strong> 13 मार्च 2025 — शाम सूर्यास्त के बाद</li>
          <li><strong>रंगवाली होली:</strong> 14 मार्च 2025 — सुबह से दोपहर तक</li>
        </ul>
        
        <h3>पारंपरिक अनुष्ठान</h3>
        <ul>
          <li><strong>होलिका दहन पूजा:</strong> अग्नि में नारियल, अनाज और मिठाई अर्पित करें</li>
          <li><strong>परिक्रमा:</strong> आशीर्वाद के लिए होलिका अग्नि की परिक्रमा करें</li>
          <li><strong>क्षमा और सुलह:</strong> मनमुटाव छोड़ें; होली संबंधों को सुधारने का समय है</li>
        </ul>
      `,
      image: 'https://images.unsplash.com/photo-1576071633246-e0e2e1aa2cf9',
      category: 'festivals',
      date: '2025-03-05',
      author: 'Pandit Rajesh Sharma',
      readTime: '6 min'
    },
    {
      id: '4',
      title_en: 'The Power of Daily Meditation: A Scientific & Spiritual View',
      title_hi: 'दैनिक ध्यान की शक्ति: वैज्ञानिक और आध्यात्मिक दृष्टिकोण',
      excerpt_en: 'Modern science confirms what ancient sages knew — meditation transforms brain, body, and soul. Learn how to start.',
      excerpt_hi: 'आधुनिक विज्ञान पुष्टि करता है जो प्राचीन ऋषि जानते थे — ध्यान मस्तिष्क, शरीर और आत्मा को बदलता है।',
      content_en: `
        <h2>Where Science Meets Spirituality</h2>
        <p>For thousands of years, yogis and spiritual masters have extolled meditation's transformative power. Today, neuroscience and psychology confirm these ancient claims with remarkable precision.</p>
        
        <h3>What Science Says</h3>
        <ul>
          <li><strong>Brain Structure:</strong> Regular meditation increases gray matter in areas related to self-awareness, compassion, and introspection</li>
          <li><strong>Stress Reduction:</strong> Meditation decreases cortisol levels by up to 25%, reducing chronic stress</li>
          <li><strong>Emotional Regulation:</strong> The amygdala (fear center) becomes less reactive with consistent practice</li>
          <li><strong>Focus & Attention:</strong> Just 8 weeks of meditation improves attention span and working memory</li>
          <li><strong>Immune Function:</strong> Meditators show enhanced immune response and faster healing</li>
        </ul>
        
        <h3>What Ancient Texts Say</h3>
        <p>The Patanjali Yoga Sutras describe meditation (Dhyana) as the seventh limb of Ashtanga Yoga. It leads to:</p>
        <ul>
          <li><strong>Chitta Vritti Nirodha:</strong> Stillness of mental fluctuations</li>
          <li><strong>Pratyahara:</strong> Withdrawal from sensory distractions</li>
          <li><strong>Dharana:</strong> Single-pointed concentration</li>
          <li><strong>Samadhi:</strong> Union with the divine consciousness</li>
        </ul>
        
        <h3>How to Start Your Practice</h3>
        <ol>
          <li><strong>Choose a time:</strong> Early morning (Brahma Muhurta 4-6 AM) is ideal, but any consistent time works</li>
          <li><strong>Find a quiet space:</strong> Create a sacred corner in your home</li>
          <li><strong>Start small:</strong> Begin with 5 minutes and gradually increase to 20-30 minutes</li>
          <li><strong>Focus on breath:</strong> Watch your natural breath without controlling it</li>
          <li><strong>Use a mantra:</strong> "Om," "So-Hum," or your personal mantra helps focus the mind</li>
          <li><strong>Be patient:</strong> The mind will wander — gently return to your focus point</li>
        </ol>
        
        <p>Even 10 minutes of daily meditation can transform your life. The key is consistency, not duration.</p>
      `,
      content_hi: `
        <h2>जहाँ विज्ञान आध्यात्मिकता से मिलता है</h2>
        <p>हजारों वर्षों से, योगियों और आध्यात्मिक गुरुओं ने ध्यान की परिवर्तनकारी शक्ति की प्रशंसा की है। आज, तंत्रिका विज्ञान इन प्राचीन दावों की पुष्टि करता है।</p>
        
        <h3>विज्ञान क्या कहता है</h3>
        <ul>
          <li><strong>मस्तिष्क संरचना:</strong> नियमित ध्यान आत्म-जागरूकता से संबंधित क्षेत्रों में ग्रे मैटर बढ़ाता है</li>
          <li><strong>तनाव कमी:</strong> ध्यान कोर्टिसोल स्तर को 25% तक कम करता है</li>
          <li><strong>भावनात्मक नियंत्रण:</strong> अमिगडाला कम प्रतिक्रियाशील हो जाता है</li>
          <li><strong>ध्यान और एकाग्रता:</strong> 8 सप्ताह का ध्यान ध्यान अवधि में सुधार करता है</li>
        </ul>
        
        <h3>प्राचीन ग्रंथ क्या कहते हैं</h3>
        <p>पतंजलि योग सूत्र ध्यान को अष्टांग योग के सातवें अंग के रूप में वर्णित करते हैं:</p>
        <ul>
          <li><strong>चित्त वृत्ति निरोध:</strong> मानसिक उतार-चढ़ाव की स्थिरता</li>
          <li><strong>प्रत्याहार:</strong> इंद्रिय विकर्षणों से वापसी</li>
          <li><strong>धारणा:</strong> एक-बिंदु एकाग्रता</li>
          <li><strong>समाधि:</strong> दिव्य चेतना के साथ मिलन</li>
        </ul>
        
        <h3>अपना अभ्यास कैसे शुरू करें</h3>
        <ol>
          <li>समय चुनें: सुबह जल्दी (ब्रह्म मुहूर्त) आदर्श है</li>
          <li>शांत स्थान खोजें</li>
          <li>छोटे से शुरू करें: 5 मिनट से शुरू करें</li>
          <li>सांस पर ध्यान दें</li>
          <li>मंत्र का उपयोग करें: "ॐ" या "सो-हम"</li>
        </ol>
      `,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      category: 'wellness',
      date: '2025-02-15',
      author: 'Yoga Guru Ananda',
      readTime: '10 min'
    },
    {
      id: '5',
      title_en: 'Moon Sign vs Sun Sign: Which Matters More?',
      title_hi: 'चंद्र राशि vs सूर्य राशि: कौन अधिक महत्वपूर्ण है?',
      excerpt_en: 'Western astrology focuses on Sun signs, but Vedic astrology prioritizes the Moon. Understand why both matter.',
      excerpt_hi: 'पश्चिमी ज्योतिष सूर्य राशि पर ध्यान देता है, लेकिन वैदिक ज्योतिष चंद्र राशि को प्राथमिकता देता है।',
      content_en: `
        <h2>The Great Debate in Astrology</h2>
        <p>If you've ever wondered why your Western horoscope doesn't quite fit, or why Vedic astrology gives different predictions, the answer often lies in the difference between Sun sign and Moon sign emphasis.</p>
        
        <h3>What is Your Sun Sign?</h3>
        <p>Your Sun sign is determined by which zodiac constellation the Sun was in at your birth. This is what Western astrology primarily uses. The Sun represents:</p>
        <ul>
          <li>Your core identity and ego</li>
          <li>Your life purpose and direction</li>
          <li>How you express yourself outwardly</li>
          <li>Your father and authority figures</li>
          <li>Your vitality and physical constitution</li>
        </ul>
        
        <h3>What is Your Moon Sign (Rashi)?</h3>
        <p>Your Moon sign is determined by which zodiac the Moon occupied at your birth. Vedic astrology considers this primary because:</p>
        <ul>
          <li>The Moon represents the mind (manas) — the seat of thoughts and emotions</li>
          <li>It changes signs every 2.5 days, making it more personal than the Sun</li>
          <li>It governs your emotional responses, instincts, and subconscious patterns</li>
          <li>It represents your mother and nurturing energy</li>
          <li>Dasha systems (planetary periods) are calculated from the Moon</li>
        </ul>
        
        <h3>Why Vedic Astrology Prioritizes Moon</h3>
        <p>In Vedic philosophy, the mind (governed by Moon) is the experiencer of life. While the Sun shows who you are, the Moon shows how you feel and process experiences. Since human suffering and happiness occur in the mind, understanding the Moon sign offers more practical guidance for daily life.</p>
        
        <h3>Using Both Signs</h3>
        <p>The wisest approach combines both:</p>
        <ul>
          <li><strong>Sun Sign:</strong> For understanding life purpose, career direction, and external identity</li>
          <li><strong>Moon Sign:</strong> For emotional guidance, relationships, and day-to-day predictions</li>
          <li><strong>Ascendant (Lagna):</strong> For physical appearance, health, and how others perceive you</li>
        </ul>
        
        <p>At AstroAshi, we prioritize your Moon sign for horoscopes but consider all factors in your Kundli for complete guidance.</p>
      `,
      content_hi: `
        <h2>ज्योतिष में बड़ी बहस</h2>
        <p>अगर आपने कभी सोचा है कि आपकी पश्चिमी राशिफल क्यों पूरी तरह से फिट नहीं होती, तो इसका उत्तर सूर्य राशि और चंद्र राशि के अंतर में है।</p>
        
        <h3>सूर्य राशि क्या है?</h3>
        <p>आपकी सूर्य राशि निर्धारित होती है कि जन्म के समय सूर्य किस राशि में था। सूर्य प्रतिनिधित्व करता है:</p>
        <ul>
          <li>आपकी मूल पहचान और अहंकार</li>
          <li>आपका जीवन उद्देश्य</li>
          <li>आप बाहरी रूप से कैसे व्यक्त करते हैं</li>
          <li>पिता और अधिकार</li>
        </ul>
        
        <h3>चंद्र राशि (राशि) क्या है?</h3>
        <p>आपकी चंद्र राशि निर्धारित होती है कि जन्म के समय चंद्रमा किस राशि में था। वैदिक ज्योतिष इसे प्राथमिक मानता है क्योंकि:</p>
        <ul>
          <li>चंद्रमा मन (मनस) का प्रतिनिधित्व करता है</li>
          <li>यह हर 2.5 दिन में राशि बदलता है</li>
          <li>यह भावनात्मक प्रतिक्रियाओं को नियंत्रित करता है</li>
          <li>दशा प्रणाली चंद्रमा से गणना की जाती है</li>
        </ul>
        
        <h3>दोनों राशियों का उपयोग</h3>
        <ul>
          <li><strong>सूर्य राशि:</strong> जीवन उद्देश्य और करियर के लिए</li>
          <li><strong>चंद्र राशि:</strong> भावनात्मक मार्गदर्शन और दैनिक भविष्यवाणियों के लिए</li>
          <li><strong>लग्न:</strong> शारीरिक रूप और स्वास्थ्य के लिए</li>
        </ul>
      `,
      image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d',
      category: 'moon',
      date: '2025-02-10',
      author: 'AstroAshi Team',
      readTime: '7 min'
    },
    {
      id: '6',
      title_en: 'Ancient Astrology Practices Around the World',
      title_hi: 'दुनिया भर में प्राचीन ज्योतिष प्रथाएं',
      excerpt_en: 'From Babylon to India to China — explore how different cultures developed their unique systems of celestial wisdom.',
      excerpt_hi: 'बेबीलोन से भारत से चीन तक — जानें कैसे विभिन्न संस्कृतियों ने आकाशीय ज्ञान की अपनी अनूठी प्रणालियां विकसित कीं।',
      content_en: `
        <h2>A Global History of Stargazing</h2>
        <p>Long before telescopes and computers, ancient civilizations across the globe looked to the stars for guidance. Each culture developed sophisticated systems that continue to influence modern astrological practice.</p>
        
        <h3>Mesopotamian Astrology (3000 BCE)</h3>
        <p>Babylonian priest-astronomers laid the foundation for Western astrology. They created the 12-sign zodiac, developed the concept of planetary influences, and recorded celestial omens on clay tablets. Their focus was "mundane astrology" — predicting events affecting kingdoms rather than individuals.</p>
        
        <h3>Vedic Astrology — India (1500 BCE)</h3>
        <p>Jyotish, the "science of light," emerged from the Vedas. Key differences from Western astrology include:</p>
        <ul>
          <li>Use of the sidereal zodiac (star-based) vs tropical zodiac (season-based)</li>
          <li>27 Nakshatras (lunar mansions) for detailed personality analysis</li>
          <li>Dasha systems for timing predictions across life</li>
          <li>Emphasis on Moon sign over Sun sign</li>
        </ul>
        
        <h3>Chinese Astrology (2600 BCE)</h3>
        <p>The Chinese system developed independently, using:</p>
        <ul>
          <li>12 animal signs in a 12-year cycle</li>
          <li>5 elements (Wood, Fire, Earth, Metal, Water)</li>
          <li>Yin-Yang balance as a core principle</li>
          <li>Integration with I Ching divination</li>
        </ul>
        
        <h3>Egyptian Astrology (2800 BCE)</h3>
        <p>Egyptian astrology tied closely to the Nile floods and agricultural cycles. They used decans (36 star groups) and associated gods with celestial bodies. The rising of Sirius marked their new year.</p>
        
        <h3>Mayan Astrology (2000 BCE)</h3>
        <p>The Maya created remarkably precise astronomical observations without telescopes. Their Tzolk'in calendar (260 days) and Haab' calendar (365 days) together created the "Calendar Round" for divination and ceremony timing.</p>
        
        <h3>What Unites All Systems</h3>
        <p>Despite different methodologies, all ancient astrological systems share core beliefs: that celestial patterns reflect earthly events, that timing matters, and that understanding cosmic rhythms helps humans live in harmony with the universe.</p>
      `,
      content_hi: `
        <h2>तारों को देखने का वैश्विक इतिहास</h2>
        <p>दूरबीन और कंप्यूटर से बहुत पहले, दुनिया भर की प्राचीन सभ्यताएं मार्गदर्शन के लिए तारों की ओर देखती थीं।</p>
        
        <h3>मेसोपोटामियन ज्योतिष (3000 ईसा पूर्व)</h3>
        <p>बेबीलोनियाई पुजारी-खगोलविदों ने पश्चिमी ज्योतिष की नींव रखी। उन्होंने 12-राशि राशिचक्र बनाया।</p>
        
        <h3>वैदिक ज्योतिष — भारत (1500 ईसा पूर्व)</h3>
        <p>ज्योतिष, "प्रकाश का विज्ञान," वेदों से उभरा:</p>
        <ul>
          <li>सायन राशिचक्र का उपयोग</li>
          <li>27 नक्षत्र</li>
          <li>दशा प्रणाली</li>
          <li>चंद्र राशि पर जोर</li>
        </ul>
        
        <h3>चीनी ज्योतिष (2600 ईसा पूर्व)</h3>
        <ul>
          <li>12-वर्ष चक्र में 12 पशु राशियां</li>
          <li>5 तत्व (लकड़ी, आग, पृथ्वी, धातु, जल)</li>
          <li>यिन-यांग संतुलन</li>
        </ul>
        
        <h3>सभी प्रणालियों में क्या समान है</h3>
        <p>विभिन्न कार्यप्रणालियों के बावजूद, सभी प्राचीन ज्योतिषीय प्रणालियां मूल विश्वास साझा करती हैं: कि आकाशीय पैटर्न पृथ्वी की घटनाओं को दर्शाते हैं।</p>
      `,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      category: 'history',
      date: '2025-01-25',
      author: 'Historical Scholar',
      readTime: '9 min'
    }
  ];

  const filteredArticles = selectedCategory 
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  const categories = [...new Set(articles.map(a => a.category))];

  const readArticle = async (article: Article) => {
    setSelectedArticle(article);
    await recordReading('article', article.id);
    toast.success(
      language === 'en'
        ? 'Article added to your reading history!'
        : 'लेख आपके पठन इतिहास में जोड़ा गया!'
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const shareArticle = async (article: Article) => {
    const title = language === 'en' ? article.title_en : article.title_hi;
    if (navigator.share) {
      await navigator.share({ title, text: title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'en' ? 'Link copied!' : 'लिंक कॉपी हो गया!');
    }
  };

  return (
    <div className="cosmic-bg min-h-screen">
      <StarBackground starCount={100} />
      <Navigation />
      
      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-24 lg:pb-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 text-gradient-gold ${language === 'hi' ? 'font-hindi' : 'font-heading'}`}>
            {language === 'en' ? 'Cosmic Journal' : 'कॉस्मिक जर्नल'}
          </h1>
          <p className={`text-muted-foreground max-w-2xl mx-auto ${language === 'hi' ? 'font-hindi' : ''}`}>
            {language === 'en' 
              ? 'Explore astrology, spirituality, and cosmic wisdom with our latest articles.'
              : 'हमारे नवीनतम लेखों के साथ ज्योतिष, आध्यात्मिकता और ब्रह्मांडीय ज्ञान का अन्वेषण करें।'}
          </p>
        </div>

        {selectedArticle ? (
          // Article Detail View
          <article className="max-w-3xl mx-auto">
            <Button 
              onClick={() => setSelectedArticle(null)}
              variant="ghost"
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to Articles' : 'लेखों पर वापस'}
            </Button>
            
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={selectedArticle.image} 
                  alt={language === 'en' ? selectedArticle.title_en : selectedArticle.title_hi} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge className={`${categoryColors[selectedArticle.category] || ''} border`}>
                    {categoryLabels[selectedArticle.category]?.[language] || selectedArticle.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selectedArticle.date)}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedArticle.readTime}
                  </span>
                </div>
                
                <CardTitle className="text-2xl md:text-3xl text-foreground leading-tight">
                  {language === 'en' ? selectedArticle.title_en : selectedArticle.title_hi}
                </CardTitle>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <User className="w-4 h-4" />
                  <span>{selectedArticle.author}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div 
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:text-foreground prose-headings:font-bold
                    prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                    prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-li:text-muted-foreground
                    prose-strong:text-foreground
                    prose-ul:my-3 prose-ol:my-3"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(language === 'en' ? selectedArticle.content_en : selectedArticle.content_hi)
                  }}
                />
                
                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-border/50">
                  <Button variant="outline" onClick={() => shareArticle(selectedArticle)}>
                    <Share2 className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Share' : 'शेयर करें'}
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Save' : 'सहेजें'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </article>
        ) : (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="rounded-full"
              >
                {language === 'en' ? 'All' : 'सभी'}
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full"
                >
                  {categoryLabels[cat]?.[language] || cat}
                </Button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  className="bg-card/60 backdrop-blur-sm border-border/50 overflow-hidden cursor-pointer 
                    hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 group"
                  onClick={() => readArticle(article)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={article.image}
                      alt={language === 'en' ? article.title_en : article.title_hi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${categoryColors[article.category] || ''} border text-[10px]`}>
                        {categoryLabels[article.category]?.[language] || article.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {language === 'en' ? article.title_en : article.title_hi}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-2 text-sm">
                      {language === 'en' ? article.excerpt_en : article.excerpt_hi}
                    </CardDescription>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(article.date)}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        {language === 'en' ? 'Read more →' : 'और पढ़ें →'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CosmicJournal;
