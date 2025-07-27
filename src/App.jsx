import React, { useState, useEffect } from 'react';
import { Camera, Droplets, Sun, Moon, Wind, Sparkles, Shield, Heart, Leaf, Star, Award, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, ShoppingCart, Store, ArrowLeft, Palette, Plus, Minus, X } from 'lucide-react';
import extractedProducts from './extracted_products.json';

const SkinTypeDetector = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showNameForm, setShowNameForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [orders, setOrders] = useState([]);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [addedToCartMessage, setAddedToCartMessage] = useState('');
  const [showResultSidebar, setShowResultSidebar] = useState(false);
  
  // Admin credentials (in real app, this should be handled securely)
  const ADMIN_PASSWORD = 'admin123';

  // Secret access methods for admin panel
  useEffect(() => {
    // Check for admin access via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'access') {
      showAdminLoginPage();
    }
  }, []);

  // Secret key combination for admin access (type 'admin')
  useEffect(() => {
    let keySequence = [];
    const secretCode = ['a', 'd', 'm', 'i', 'n'];
    
    const handleKeyPress = (e) => {
      keySequence.push(e.key.toLowerCase());
      if (keySequence.length > secretCode.length) {
        keySequence = keySequence.slice(-secretCode.length);
      }
      
      if (keySequence.join('') === secretCode.join('')) {
        showAdminLoginPage();
        keySequence = [];
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const questions = [
    {
      id: 'oil',
      title: 'ترشح چربی پوست',
      question: 'ناحیه پیشانی، بینی و چانه شما چقدر براق می‌شود؟',
      icon: <span className="text-xl">💧</span>,
      options: [
        { value: 1, label: 'هرگز', description: 'پوست همیشه خشک و مات است' },
        { value: 2, label: 'در صبح', description: 'فقط صبح‌ها کمی براق می‌شود' },
        { value: 3, label: 'بعضی اوقات', description: 'گاهی در طول روز براق می‌شود' },
        { value: 4, label: 'اکثر اوقات', description: 'بیشتر روزها براق است' },
        { value: 5, label: 'همیشه', description: 'همیشه چرب و براق است' }
      ]
    },
    {
      id: 'pores',
      title: 'اندازه منافذ پوست',
      question: 'منافذ پوست شما در ناحیه بینی چقدر قابل مشاهده هستند؟',
      icon: <span className="text-xl">✨</span>,
      options: [
        { value: 1, label: 'غیرقابل مشاهده', description: 'منافذ اصلاً دیده نمی‌شوند' },
        { value: 2, label: 'بسیار ریز', description: 'منافذ بسیار کوچک و نامرئی' },
        { value: 3, label: 'متوسط', description: 'منافذ به سختی دیده می‌شوند' },
        { value: 4, label: 'درشت', description: 'منافذ به وضوح دیده می‌شوند' },
        { value: 5, label: 'بسیار درشت', description: 'منافذ بزرگ و واضح هستند' }
      ]
    },
    {
      id: 'dryness',
      title: 'خشکی و کشیدگی پوست',
      question: 'پوست شما چقدر احساس کشیدگی یا خشکی می‌کند؟',
      icon: <span className="text-xl">💨</span>,
      options: [
        { value: 1, label: 'هرگز', description: 'پوست همیشه نرم و مرطوب است' },
        { value: 2, label: 'نادر', description: 'گاهی اوقات کمی کشیده می‌شود' },
        { value: 3, label: 'گاهی', description: 'بعضی اوقات خشک احساس می‌شود' },
        { value: 4, label: 'اغلب', description: 'اغلب خشک و کشیده است' },
        { value: 5, label: 'همیشه', description: 'همیشه خشک و ناراحت کننده است' }
      ]
    },
    {
      id: 'sensitivity',
      title: 'واکنش پوست',
      question: 'پوست شما چقدر به محصولات آرایشی واکنش نشان می‌دهد؟',
      icon: <span className="text-xl">☀️</span>,
      options: [
        { value: 1, label: 'بدون واکنش', description: 'همیشه بدون مشکل است' },
        { value: 2, label: 'واکنش خفیف', description: 'گاهی اوقات کمی قرمز می‌شود' },
        { value: 3, label: 'واکنش متوسط', description: 'بعضی اوقات سوزش یا خارش دارد' },
        { value: 4, label: 'واکنش زیاد', description: 'اغلب قرمز و التهابی می‌شود' },
        { value: 5, label: 'واکنش شدید', description: 'همیشه واکنش آلرژیک دارد' }
      ]
    },
    {
      id: 'acne',
      title: 'جوش و آکنه',
      question: 'چند بار در ماه با جوش یا آکنه مواجه می‌شوید؟',
      icon: <span className="text-xl">🔴</span>,
      options: [
        { value: 1, label: 'هرگز', description: 'هرگز جوش نمی‌زنم' },
        { value: 2, label: '1-2 بار', description: 'در ماه 1-2 عدد جوش' },
        { value: 3, label: '3-5 بار', description: 'در ماه 3-5 عدد جوش' },
        { value: 4, label: '6-10 بار', description: 'در ماه 6-10 عدد جوش' },
        { value: 5, label: 'بیش از 10 بار', description: 'همیشه جوش دارم' }
      ]
    },
    {
      id: 'texture',
      title: 'ملمس و بافت پوست',
      question: 'وقتی با انگشت روی پوست‌تان می‌لغزانید چه احساسی دارید؟',
      icon: <span className="text-xl">👆</span>,
      options: [
        { value: 1, label: 'بسیار نرم', description: 'کاملاً صاف و لطیف' },
        { value: 2, label: 'نرم', description: 'تقریباً صاف' },
        { value: 3, label: 'معمولی', description: 'بافت طبیعی' },
        { value: 4, label: 'کمی زبر', description: 'اندکی منافذ باز' },
        { value: 5, label: 'زبر', description: 'منافذ بزرگ و ناهموار' }
      ]
    },
    {
      id: 'sunReaction',
      title: 'واکنش به نور خورشید',
      question: 'پوست شما چگونه به نور خورشید واکنش نشان می‌دهد؟',
      icon: <span className="text-xl">☀️</span>,
      options: [
        { value: 1, label: 'مقاوم', description: 'به ندرت قرمز می‌شود' },
        { value: 2, label: 'کمی حساس', description: 'گاهی اوقات قرمز می‌شود' },
        { value: 3, label: 'معمولی', description: 'واکنش متوسط دارد' },
        { value: 4, label: 'حساس', description: 'اغلب قرمز می‌شود' },
        { value: 5, label: 'خیلی حساس', description: 'همیشه قرمز و آسیب می‌بیند' }
      ]
    },
    {
      id: 'makeup',
      title: 'نگهداری آرایش',
      question: 'آرایش شما چقدر دوام دارد؟',
      icon: <span className="text-xl">🎨</span>,
      options: [
        { value: 1, label: 'بسیار کم', description: 'آرایش سریع پاک می‌شود' },
        { value: 2, label: 'کم', description: 'آرایش تا 2 ساعت دوام دارد' },
        { value: 3, label: 'متوسط', description: 'آرایش تا 4 ساعت دوام دارد' },
        { value: 4, label: 'زیاد', description: 'آرایش تا 6 ساعت دوام دارد' },
        { value: 5, label: 'بسیار زیاد', description: 'آرایش تا انتهای روز دوام دارد' }
      ]
    },
    {
      id: 'tightness',
      title: 'احساس کشیدگی',
      question: 'پوست شما چه زمانی بیشتر احساس کشیدگی می‌کند؟',
      icon: <span className="text-xl">🤏</span>,
      options: [
        { value: 1, label: 'هرگز', description: 'پوست همیشه نرم است' },
        { value: 2, label: 'بعد از شستشو', description: 'فقط بعد از شستن پوست' },
        { value: 3, label: 'صبح‌ها', description: 'به ویژه صبح‌ها' },
        { value: 4, label: 'در محیط خشک', description: 'در فضاهای کم رطوبت' },
        { value: 5, label: 'همیشه', description: 'همیشه کشیده احساس می‌شود' }
      ]
    },
    {
      id: 'aging',
      title: 'علامت‌های پیری',
      question: 'چه مقدار خطوط ریز یا چروک روی پوست‌تان مشاهده می‌کنید؟',
      icon: <span className="text-xl">🛡️</span>,
      options: [
        { value: 1, label: 'هیچ', description: 'پوست کاملاً صاف و بدون خط' },
        { value: 2, label: 'بسیار کم', description: 'خط خیلی کم و نامرئی' },
        { value: 3, label: 'کم', description: 'چند خط ریز قابل مشاهده' },
        { value: 4, label: 'متوسط', description: 'چند خط واضح' },
        { value: 5, label: 'زیاد', description: 'خطوط متعدد و واضح' }
      ]
    }
  ];

  // Convert extracted products to shop format
  const getProductIcon = (category) => {
    const icons = {
      'پاک‌کننده': '🧴',
      'تونر': '💧',
      'سرم': '✨',
      'مرطوب‌کننده': '🌸'
    };
    return icons[category] || '🛍️';
  };

  const shopProducts = extractedProducts.map(product => ({
    id: product.id,
    name: product.title,
    category: product.category,
    price: product.price || 250000, // Default price if 0
    originalPrice: product.price ? product.price + 50000 : 300000,
    image: getProductIcon(product.category),
    brand: product.brand,
    description: product.description,
    features: ['اورجینال', 'تست شده', 'مناسب پوست ' + product.skin_type],
    rating: 4.5 + Math.random() * 0.4, // Random rating between 4.5-4.9
    reviews: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
    inStock: product.inStock,
    skin_type: product.skin_type,
    purchase_link: product.purchase_link
  }));

  const categories = [
    { id: 'all', name: 'همه محصولات', icon: '🛍️' },
    { id: 'پاک‌کننده', name: 'پاک کننده', icon: '🧴' },
    { id: 'تونر', name: 'تونر', icon: '💧' },
    { id: 'سرم', name: 'سرم', icon: '✨' },
    { id: 'مرطوب‌کننده', name: 'مرطوب کننده', icon: '🌸' }
  ];

  // Coupons Data
  const coupons = {
    'WELCOME10': { discount: 10, type: 'percentage', minAmount: 200000, description: '10% تخفیف برای خرید اول' },
    'SAVE50': { discount: 50000, type: 'fixed', minAmount: 500000, description: '50 هزار تومان تخفیف' },
    'BEAUTY20': { discount: 20, type: 'percentage', minAmount: 300000, description: '20% تخفیف ویژه زیبایی' }
  };

  // Shipping Methods
  const shippingMethods = [
    { id: 'standard', name: 'ارسال عادی', price: 25000, duration: '3-5 روز کاری', icon: '📦' },
    { id: 'express', name: 'ارسال سریع', price: 45000, duration: '1-2 روز کاری', icon: '🚀' },
    { id: 'free', name: 'ارسال رایگان', price: 0, duration: '5-7 روز کاری', icon: '🆓', minAmount: 500000 }
  ];

  // Function to get recommended products for each skin type from extracted data
  const getRecommendedProducts = (skinType) => {
    const skinTypeMap = {
      'normal': 'نرمال',
      'dry': 'خشک', 
      'oily': 'چرب',
      'combination': 'نرمال', // Use normal products for combination skin
      'sensitive': 'نرمال' // Use normal products for sensitive skin
    };
    
    const targetSkinType = skinTypeMap[skinType];
    return extractedProducts
      .filter(product => product.skin_type === targetSkinType)
      .slice(0, 5) // Limit to 5 products
      .map(product => ({
        name: product.title,
        category: product.category,
        brand: product.brand,
        id: product.id,
        price: product.price,
        image: getProductIcon(product.category),
        purchase_link: product.purchase_link
      }));
  };

  const skinTypes = {
    normal: {
      title: 'پوست نرمال',
      description: 'تعادل مناسب بین چربی و رطوبت',
      characteristics: ['منافذ کوچک', 'رنگ یکنواخت', 'کمتر حساس', 'بافت نرم'],
      morningRoutine: [
        'پاک کننده ملایم با pH خنثی',
        'تونر تعادل کننده بدون الکل',
        'سرم آنتی‌اکسیدان (ویتامین C)',
        'مرطوب کننده سبک با SPF',
        'ضد آفتاب با طیف گسترده SPF 30+'
      ],
      eveningRoutine: [
        'پاک کننده دو مرحله‌ای (شستشو + آب مقطر)',
        'تونر بدون الکل',
        'سرم ترمیم کننده (رتینول یا نایاسینامید)',
        'مرطوب کننده بافت سبک'
      ],
      features: [
        { icon: <span className="text-lg">💖</span>, title: 'سلامت بالا', description: 'پوست شما در وضعیت ایده‌آل است' },
        { icon: <span className="text-lg">⭐</span>, title: 'تنوع محصولات', description: 'می‌توانید از انواع محصولات استفاده کنید' },
        { icon: <span className="text-lg">🏆</span>, title: 'مقاومت خوب', description: 'در برابر عوامل محیطی مقاوم است' }
      ],
      products: getRecommendedProducts('normal')
    },
    dry: {
      title: 'پوست خشک',
      description: 'کمبود چربی طبیعی و نیاز به مرطوب کننده',
      characteristics: ['منافذ بسیار ریز', 'احساس کشیدگی', 'پوسته پوسته شدن', 'حساسیت بیشتر'],
      morningRoutine: [
        'پاک کننده بدون صابون و مرطوب کننده',
        'تونر مرطوب کننده بدون الکل',
        'سرم مرطوب کننده (هیالورونیک اسید)',
        'مرطوب کننده غنی با سرامیدها',
        'ضد آفتاب با طیف گسترده SPF 30+'
      ],
      eveningRoutine: [
        'پاک کننده ملایم دو مرحله‌ای',
        'تونر مرطوب کننده',
        'سرم ترمیم کننده (سرامیدها)',
        'مرطوب کننده غنی یا کرم شب'
      ],
      features: [
        { icon: <span className="text-lg">🌿</span>, title: 'نیاز به تغذیه', description: 'پوست شما به تغذیت و مرطوب کنندگی نیاز دارد' },
        { icon: <span className="text-lg">💖</span>, title: 'حساسیت بالا', description: 'نیاز به مراقبت ملایم دارد' },
        { icon: <span className="text-lg">⭐</span>, title: 'نگهداری ویژه', description: 'مرطوب کننده‌های غنی توصیه می‌شود' }
      ],
      products: getRecommendedProducts('dry')
    },
    oily: {
      title: 'پوست چرب',
      description: 'ترشح چربی زیاد و براقی مداوم',
      characteristics: ['منافذ درشت', 'براق بودن', 'جوش و سر سیاه', 'چربی زیاد'],
      morningRoutine: [
        'پاک کننده ضد چربی با سالیسیلیک اسید',
        'تونر تعادل کننده بدون الکل',
        'سرم ضدجوش (سالیسیلیک اسید یا نایاسینامید)',
        'مرطوب کننده ژلی سبک',
        'ضد آفتاب با طیف گسترده SPF 30+'
      ],
      eveningRoutine: [
        'پاک کننده دو مرحله‌ای',
        'اسکراب ملایم 2-3 بار در هفته',
        'تونر ضد چربی',
        'سرم ضدجوش (رتینول یا نایاسینامید)',
        'مرطوب کننده ژلی سبک'
      ],
      features: [
        { icon: <span className="text-lg">✨</span>, title: 'براقی مداوم', description: 'ترشح چربی زیاد نیاز به کنترل دارد' },
        { icon: <span className="text-lg">🛡️</span>, title: 'مقاومت در برابر چین و چروک', description: 'پوست چرب معمولاً کمتر چروک دارد' },
        { icon: <span className="text-lg">💧</span>, title: 'نیاز به تعادل', description: 'تعادل چربی و رطوبت بسیار مهم است' }
      ],
      products: getRecommendedProducts('oily')
    },
    combination: {
      title: 'پوست ترکیبی',
      description: 'ناحیه T چرب، گونه‌ها خشک یا نرمال',
      characteristics: ['ناحیه T چرب (پیشانی، بینی، چانه)', 'گونه‌ها خشک یا نرمال', 'منافذ متنوع', 'نیاز به مراقبت هدفمند'],
      morningRoutine: [
        'پاک کننده متعادل کننده',
        'تونر تعادل کننده',
        'سرم دو منظوره (ضد چروک و مرطوب کننده)',
        'مرطوب کننده دو منظوره (سبک برای ناحیه T، غنی برای گونه‌ها)',
        'ضد آفتاب با طیف گسترده SPF 30+'
      ],
      eveningRoutine: [
        'پاک کننده متعادل کننده',
        'تونر تعادل کننده',
        'سرم ترمیم کننده (رتینول یا نایاسینامید)',
        'مرطوب کننده هدفمند (ضد چربی برای ناحیه T)'
      ],
      features: [
        { icon: <span className="text-lg">💨</span>, title: 'تنوع در نواحی', description: 'هر ناحیه نیاز مخصوص به خود را دارد' },
        { icon: <span className="text-lg">🏆</span>, title: 'نیاز به تخصص', description: 'مراقبت هدفمند برای هر ناحیه ضروری است' },
        { icon: <span className="text-lg">☀️</span>, title: 'قابلیت تطبیق', description: 'قابلیت تطبیق با شرایط مختلف محیطی' }
      ],
      products: getRecommendedProducts('combination')
    },
    sensitive: {
      title: 'پوست حساس',
      description: 'واکنش زیاد به عوامل محیطی و مواد شیمیایی',
      characteristics: ['سرخ شدن آسان', 'واکنش به مواد شیمیایی', 'خراش و قرمزی', 'احساس ناراحتی و سوزش'],
      morningRoutine: [
        'پاک کننده ملایم بدون عطر',
        'تونر آرام کننده بدون الکل',
        'سرم ضد التهاب (نایاسینامید)',
        'مرطوب کننده ملایم با سرامیدها',
        'ضد آفتاب فیزیکی با طیف گسترده SPF 30+'
      ],
      eveningRoutine: [
        'پاک کننده ملایم بدون عطر',
        'تونر آرام کننده',
        'سرم ترمیم مانع (سرامیدها)',
        'مرطوب کننده ملایم'
      ],
      features: [
        { icon: <span className="text-lg">🛡️</span>, title: 'نیاز به محافظت', description: 'نیاز به محصولات بدون عطر و مواد تحریک کننده' },
        { icon: <span className="text-lg">💖</span>, title: 'واکنش سریع', description: 'واکنش سریع به محیط و محصولات' },
        { icon: <span className="text-lg">🌿</span>, title: 'مراقبت ملایم', description: 'نیاز به مراقبت ملایم و بدون مالش' }
      ],
      products: getRecommendedProducts('sensitive')
    }
  };

  const calculateSkinType = (userAnswers) => {
    // Calculate scores for each skin type based on answers
    const oilScore = userAnswers.oil || 0;
    const poresScore = userAnswers.pores || 0;
    const drynessScore = userAnswers.dryness || 0;
    const sensitivityScore = userAnswers.sensitivity || 0;
    const acneScore = userAnswers.acne || 0;
    const textureScore = userAnswers.texture || 0;
    const sunReactionScore = userAnswers.sunReaction || 0;
    const makeupScore = userAnswers.makeup || 0;
    const tightnessScore = userAnswers.tightness || 0;
    const agingScore = userAnswers.aging || 0;
    
    // Sensitive skin detection (highest priority)
    if (sensitivityScore >= 4 || sunReactionScore >= 4) {
      return 'sensitive';
    }
    
    // Dry skin detection
    if (drynessScore >= 4 && oilScore <= 2 && tightnessScore >= 4) {
      return 'dry';
    }
    
    // Oily skin detection
    if (oilScore >= 4 && poresScore >= 4 && acneScore >= 4) {
      return 'oily';
    }
    
    // Combination skin detection
    if ((oilScore >= 3 && drynessScore >= 3) || (oilScore >= 3 && oilScore <= 4)) {
      return 'combination';
    }
    
    // Normal skin (default)
    return 'normal';
  };

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    
    // Auto advance to next question after selecting an answer
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Calculate result when reaching the last question
        const calculatedResult = calculateSkinType({ ...answers, [questionId]: value });
        setResult(calculatedResult);
      }
    }, 50); // Faster response for better mobile UX
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result when reaching the last question
      const calculatedResult = calculateSkinType(answers);
      setResult(calculatedResult);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setShowLanding(true);
    setShowNameForm(false);
    setUserName('');
    setShowShop(false);
    setShowCart(false);
    setShowCheckout(false);
    setShowOrderHistory(false);
    setShowAdminLogin(false);
    setIsAdmin(false);
    setAdminPassword('');
    setSelectedCategory('all');
    setSelectedSkinType('all');
  };

  // Shop Functions
  const showShopPage = () => {
    setShowShop(true);
    setShowLanding(false);
    setResult(null);
  };

  const backToHome = () => {
    setShowShop(false);
    setShowLanding(true);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Show success message
    setAddedToCartMessage(`${product.name || product.title} به سبد خرید اضافه شد`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Cart Functions
  const showCartPage = () => {
    setShowCart(true);
    setShowShop(false);
    setShowLanding(false);
  };

  const backToShop = () => {
    setShowCart(false);
    setShowShop(true);
  };

  // Coupon Functions
  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon && getCartTotal() >= coupon.minAmount) {
      setAppliedCoupon(coupon);
      setCouponCode('');
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getCartTotal();
    if (appliedCoupon.type === 'percentage') {
      return Math.round(subtotal * appliedCoupon.discount / 100);
    }
    return appliedCoupon.discount;
  };

  const getShippingCost = () => {
    const selectedShipping = shippingMethods.find(method => method.id === shippingMethod);
    if (selectedShipping && selectedShipping.minAmount && getCartTotal() >= selectedShipping.minAmount) {
      return 0;
    }
    return selectedShipping ? selectedShipping.price : 0;
  };

  const getFinalTotal = () => {
    return getCartTotal() - getDiscountAmount() + getShippingCost();
  };

  // Admin Functions
  const showAdminLoginPage = () => {
    setShowAdminLogin(true);
    setShowLanding(false);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      showOrderHistoryPage();
    } else {
      alert('رمز عبور اشتباه است!');
      setAdminPassword('');
    }
  };

  const adminLogout = () => {
    setIsAdmin(false);
    setShowOrderHistory(false);
    setShowLanding(true);
  };

  // Order Management Functions
  const showOrderHistoryPage = () => {
    if (isAdmin) {
      setShowOrderHistory(true);
      setShowLanding(false);
      setShowShop(false);
      setShowCart(false);
      setShowCheckout(false);
    } else {
      showAdminLoginPage();
    }
  };

  const backToHomeFromOrders = () => {
    setShowOrderHistory(false);
    setShowLanding(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'در انتظار تایید';
      case 'processing': return 'در حال پردازش';
      case 'shipped': return 'ارسال شده';
      case 'delivered': return 'تحویل داده شده';
      case 'cancelled': return 'لغو شده';
      default: return 'نامشخص';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Checkout Functions
  const showCheckoutPage = () => {
    setShowCheckout(true);
    setShowCart(false);
    setShowShop(false);
    setShowLanding(false);
  };

  const backToCart = () => {
    setShowCheckout(false);
    setShowCart(true);
  };

  const updateCustomerInfo = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    return required.every(field => customerInfo[field].trim() !== '');
  };

  const submitOrder = () => {
    if (validateForm()) {
      const newOrder = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        customer: { ...customerInfo },
        items: [...cart],
        subtotal: getCartTotal(),
        discount: getDiscountAmount(),
        shipping: getShippingCost(),
        total: getFinalTotal(),
        shippingMethod: shippingMethod,
        appliedCoupon: appliedCoupon,
        status: 'pending'
      };
      
      setOrders(prev => [newOrder, ...prev]);
      alert('سفارش شما با موفقیت ثبت شد!');
      
      // Reset everything
      setCart([]);
      setCustomerInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        notes: ''
      });
      setAppliedCoupon(null);
      setCouponCode('');
      setShippingMethod('standard');
      setShowCheckout(false);
      setShowLanding(true);
    } else {
      alert('لطفاً تمام فیلدهای ضروری را پر کنید.');
    }
  };

  // Skin type filter options
  const skinTypeFilters = [
    { id: 'all', name: 'همه انواع پوست', icon: '👤' },
    { id: 'نرمال', name: 'پوست نرمال', icon: '😊' },
    { id: 'خشک', name: 'پوست خشک', icon: '🏜️' },
    { id: 'چرب', name: 'پوست چرب', icon: '💧' }
  ];

  // Filter products based on selected category and skin type
  const filteredProducts = shopProducts.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const skinTypeMatch = selectedSkinType === 'all' || product.skin_type === selectedSkinType;
    return categoryMatch && skinTypeMatch;
  });

  const startQuiz = () => {
    setShowLanding(false);
    setShowNameForm(true);
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setShowNameForm(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Admin Login Page
  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-[#FDE4E0] flex items-center justify-center p-4" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ورود مدیر</h1>
            <p className="text-gray-600 text-sm">برای دسترسی به پنل مدیریت رمز عبور را وارد کنید</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200"
                placeholder="رمز عبور را وارد کنید..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAdminLogin();
                  }
                }}
                autoFocus
              />
            </div>

            <button
              onClick={handleAdminLogin}
              disabled={!adminPassword.trim()}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                adminPassword.trim()
                  ? 'bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {adminPassword.trim() ? '🔓 ورود به پنل مدیریت' : '⚠️ رمز عبور را وارد کنید'}
            </button>

            <div className="text-center">
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setShowLanding(true);
                  setAdminPassword('');
                }}
                className="text-[#F38F8B] hover:text-[#F7A8A5] font-medium transition-all duration-200 text-sm"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>

            <div className="bg-[#FDE4E0] rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-2">💡 راهنما برای تست:</p>
              <p className="text-xs text-gray-500">رمز عبور: <code className="bg-white px-2 py-1 rounded text-[#F38F8B] font-mono">admin123</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order History Page
  if (showOrderHistory) {
    return (
      <div className="min-h-screen bg-[#FDE4E0]" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-[#F9C6C2]/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={backToHomeFromOrders}
                  className="bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white p-2 rounded-xl transition-all duration-200 ml-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-3 rounded-full ml-3">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">تاریخچه سفارشات</h1>
                    <p className="text-gray-600 text-sm">مدیریت و پیگیری سفارشات</p>
                  </div>
               </div>
               
               {/* Admin Logout */}
               <div className="flex items-center">
                 <span className="text-sm text-gray-600 ml-3">مدیر سیستم</span>
                 <button
                   onClick={adminLogout}
                   className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                 >
                   <span className="text-sm ml-1">🚪</span>
                   خروج
                 </button>
               </div>
             </div>
           </div>
         </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {orders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-12 text-center">
              <div className="text-6xl mb-6">📋</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">هیچ سفارشی ثبت نشده</h2>
              <p className="text-gray-600 mb-8">هنوز سفارشی در سیستم ثبت نشده است</p>
              <button
                onClick={showShopPage}
                className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                رفتن به فروشگاه
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl ml-3">🛍️</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">سفارش #{order.id}</h3>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3 py-1 border border-[#F9C6C2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F38F8B]"
                      >
                        <option value="pending">در انتظار تایید</option>
                        <option value="processing">در حال پردازش</option>
                        <option value="shipped">ارسال شده</option>
                        <option value="delivered">تحویل داده شده</option>
                        <option value="cancelled">لغو شده</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="bg-[#FDE4E0] rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <span className="text-lg ml-2">👤</span>
                        اطلاعات مشتری
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">نام:</span> {order.customer.firstName} {order.customer.lastName}</p>
                        <p><span className="font-medium">ایمیل:</span> {order.customer.email}</p>
                        <p><span className="font-medium">تلفن:</span> {order.customer.phone}</p>
                        <p><span className="font-medium">آدرس:</span> {order.customer.address}, {order.customer.city}</p>
                        <p><span className="font-medium">کد پستی:</span> {order.customer.postalCode}</p>
                        {order.customer.notes && (
                          <p><span className="font-medium">توضیحات:</span> {order.customer.notes}</p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#FDE4E0] rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <span className="text-lg ml-2">📦</span>
                        کالاها ({order.items.length} قلم)
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="text-lg ml-2">{item.image}</span>
                              <span>{item.name}</span>
                            </div>
                            <span className="font-medium">{item.quantity}x {formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 bg-[#FDE4E0] rounded-lg p-4">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                      <span className="text-lg ml-2">💰</span>
                      خلاصه مالی
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>جمع کل کالاها:</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>تخفیف:</span>
                            <span>-{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>هزینه ارسال:</span>
                          <span>{order.shipping === 0 ? 'رایگان' : formatPrice(order.shipping)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#F38F8B]">
                            مبلغ نهایی: {formatPrice(order.total)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            روش ارسال: {shippingMethods.find(m => m.id === order.shippingMethod)?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Checkout Page
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-[#FDE4E0]" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-[#F9C6C2]/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <button
                  onClick={backToCart}
                  className="bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white p-2 rounded-xl transition-all duration-200 ml-2 sm:ml-4 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex items-center min-w-0 flex-1">
                  <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-2 sm:p-3 rounded-full ml-2 sm:ml-3 flex-shrink-0">
                    <span className="text-xl sm:text-2xl">🛒</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">تکمیل خرید</h1>
                    <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">اطلاعات خود را وارد کنید</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 mr-2">انتخاب محصولات</span>
                </div>
                <div className="w-8 h-0.5 bg-green-500"></div>
                <div className="flex items-center">
                  <div className="bg-[#F38F8B] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="text-sm text-gray-800 font-medium mr-2">اطلاعات شخصی</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="bg-gray-300 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span className="text-sm text-gray-600 mr-2">تایید نهایی</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Customer Information Form */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span className="text-xl sm:text-2xl ml-2">👤</span>
                  اطلاعات شخصی
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => updateCustomerInfo('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام خانوادگی <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => updateCustomerInfo('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => updateCustomerInfo('email', e.target.value)}
                      className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200"
                      placeholder="example@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شماره تلفن <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200"
                      placeholder="09123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span className="text-xl sm:text-2xl ml-2">📍</span>
                  آدرس تحویل
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        شهر <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.city}
                        onChange={(e) => updateCustomerInfo('city', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="نام شهر"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        کد پستی <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.postalCode}
                        onChange={(e) => updateCustomerInfo('postalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      آدرس کامل <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => updateCustomerInfo('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                      placeholder="آدرس کامل خود را وارد کنید..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      توضیحات اضافی
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => updateCustomerInfo('notes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="توضیحات اضافی برای ارسال (اختیاری)"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <span className="text-xl sm:text-2xl ml-2">🚚</span>
                  روش ارسال
                </h2>
                
                <div className="space-y-2 sm:space-y-3">
                  {shippingMethods.map((method) => {
                    const isDisabled = method.minAmount && getCartTotal() < method.minAmount;
                    return (
                      <label key={method.id} className={`flex items-center p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        shippingMethod === method.id
                          ? 'border-[#F38F8B] bg-[#FDE4E0]'
                          : isDisabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                          : 'border-gray-200 hover:border-[#F9C6C2] hover:bg-[#FDE4E0]/50'
                      }`}>
                        <input
                          type="radio"
                          name="shipping"
                          value={method.id}
                          checked={shippingMethod === method.id}
                          onChange={(e) => setShippingMethod(e.target.value)}
                          disabled={isDisabled}
                          className="ml-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0 flex-1">
                              <span className="text-lg sm:text-xl ml-2 sm:ml-3 flex-shrink-0">{method.icon}</span>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-800 text-sm sm:text-base truncate">{method.name}</div>
                                <div className="text-xs sm:text-sm text-gray-600">{method.duration}</div>
                              </div>
                            </div>
                            <span className="font-bold text-[#F38F8B] text-base sm:text-lg flex-shrink-0">
                              {method.price === 0 ? 'رایگان' : formatPrice(method.price)}
                            </span>
                          </div>
                          {method.minAmount && (
                            <div className="text-xs text-gray-500 mt-2">
                              حداقل خرید: {formatPrice(method.minAmount)}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4 sm:space-y-6">
              {/* Cart Items Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="text-xl sm:text-2xl ml-2">📦</span>
                  سفارش شما
                </h3>
                
                <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-[#FDE4E0] rounded-lg p-2 sm:p-3">
                      <div className="flex items-center min-w-0 flex-1">
                        <span className="text-lg sm:text-2xl ml-2 sm:ml-3 flex-shrink-0">{item.image}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-xs sm:text-sm text-gray-800 truncate">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.brand}</div>
                        </div>
                      </div>
                      <div className="text-left flex-shrink-0">
                        <div className="font-bold text-xs sm:text-sm text-[#F38F8B]">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-xs text-gray-600">تعداد: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="text-xl sm:text-2xl ml-2">💰</span>
                  خلاصه قیمت
                </h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">جمع کل کالاها:</span>
                    <span className="font-medium text-sm sm:text-base">{formatPrice(getCartTotal())}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm sm:text-base">تخفیف ({appliedCoupon.description}):</span>
                      <span className="text-sm sm:text-base">-{formatPrice(getDiscountAmount())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">هزینه ارسال:</span>
                    <span className="font-medium text-sm sm:text-base">
                      {getShippingCost() === 0 ? 'رایگان' : formatPrice(getShippingCost())}
                    </span>
                  </div>
                  
                  <div className="border-t border-[#F9C6C2] pt-2 sm:pt-3">
                    <div className="flex justify-between text-lg sm:text-xl font-bold">
                      <span className="text-gray-800">مبلغ نهایی:</span>
                      <span className="text-[#F38F8B]">{formatPrice(getFinalTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Order */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center mb-2">
                    <input type="checkbox" id="terms" className="ml-2" />
                    <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
                      با <span className="text-[#F38F8B] font-medium">قوانین و مقررات</span> موافقم
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="newsletter" className="ml-2" />
                    <label htmlFor="newsletter" className="text-xs sm:text-sm text-gray-700">
                      عضویت در خبرنامه
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={submitOrder}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    validateForm()
                      ? 'bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!validateForm()}
                >
                  <span className="hidden sm:inline">{validateForm() ? '🎉 ثبت نهایی سفارش' : '⚠️ لطفاً فیلدهای ضروری را پر کنید'}</span>
                  <span className="sm:hidden">{validateForm() ? '🎉 ثبت سفارش' : '⚠️ فیلدها ناقص'}</span>
                </button>
                
                <div className="mt-3 sm:mt-4 text-center">
                  <button
                    onClick={backToCart}
                    className="text-[#F38F8B] hover:text-[#F7A8A5] font-medium transition-all duration-200 text-sm sm:text-base"
                  >
                    بازگشت به سبد خرید
                  </button>
                </div>
                
                <div className="mt-3 sm:mt-4 text-xs text-gray-500 text-center">
                  <p>🔒 اطلاعات شما کاملاً محفوظ است</p>
                  <p className="hidden sm:block">📞 پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                  <p className="sm:hidden">📞 ۰۲۱-۱۲۳۴۵۶۷۸</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart Page
  if (showCart) {
    return (
      <div className="min-h-screen bg-[#FDE4E0]" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-[#F9C6C2]/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <button
                  onClick={backToShop}
                  className="bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white p-2 rounded-xl transition-all duration-200 ml-2 sm:ml-4 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex items-center min-w-0 flex-1">
                  <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-2 sm:p-3 rounded-full ml-2 sm:ml-3 flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">🛒 سبد خرید</h1>
                    <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">{getCartItemsCount()} کالا در سبد شما</p>
                    <p className="text-gray-600 text-xs sm:hidden">{getCartItemsCount()} کالا</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {cart.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-6 sm:p-12 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🛒</div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">سبد خرید شما خالی است</h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">برای شروع خرید به فروشگاه بروید</p>
              <button
                onClick={backToShop}
                className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
              >
                رفتن به فروشگاه
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 ml-2 text-[#F38F8B]" />
                    کالاهای سبد خرید
                  </h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gradient-to-br from-white to-[#FDE4E0] rounded-xl p-4 sm:p-6 border border-[#F9C6C2] shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="text-3xl sm:text-4xl ml-3 sm:ml-4 flex-shrink-0">{item.image}</div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base truncate">{item.name}</h3>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2">{item.brand}</p>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current ml-1" />
                                <span className="text-xs sm:text-sm text-gray-600">{item.rating}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                            <div className="flex items-center justify-between sm:block sm:text-center">
                              <div className="text-base sm:text-lg font-bold text-[#F38F8B]">
                                {formatPrice(item.price)}
                              </div>
                              {item.originalPrice > item.price && (
                                <div className="text-xs sm:text-sm text-gray-500 line-through">
                                  {formatPrice(item.originalPrice)}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-center">
                              <div className="flex items-center bg-[#FDE4E0] rounded-lg p-1 sm:p-2">
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200"
                                >
                                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <span className="mx-3 sm:mx-4 font-bold text-base sm:text-lg min-w-[2rem] text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="bg-[#F38F8B] hover:bg-[#F7A8A5] text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200"
                                >
                                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 transition-all duration-200 sm:mr-2"
                              >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4 sm:space-y-6">
                {/* Coupon Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl ml-2">🎫</span>
                    کد تخفیف
                  </h3>
                  
                  {appliedCoupon ? (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-green-800 text-sm sm:text-base">{appliedCoupon.description}</span>
                        <button
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs sm:text-sm text-green-600">
                        تخفیف: {formatPrice(getDiscountAmount())}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="کد تخفیف را وارد کنید"
                        className="flex-1 px-3 sm:px-4 py-2 border border-[#F9C6C2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F38F8B] focus:border-transparent text-sm sm:text-base"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-[#F38F8B] hover:bg-[#F7A8A5] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                      >
                        اعمال
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-3 sm:mt-4 text-xs text-gray-500">
                    <p>کدهای موجود: WELCOME10, SAVE50, BEAUTY20</p>
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl ml-2">🚚</span>
                    روش ارسال
                  </h3>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {shippingMethods.map((method) => {
                      const isDisabled = method.minAmount && getCartTotal() < method.minAmount;
                      return (
                        <label key={method.id} className={`flex items-center p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          shippingMethod === method.id
                            ? 'border-[#F38F8B] bg-[#FDE4E0]'
                            : isDisabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                            : 'border-gray-200 hover:border-[#F9C6C2] hover:bg-[#FDE4E0]/50'
                        }`}>
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            disabled={isDisabled}
                            className="ml-2 sm:ml-3"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center min-w-0 flex-1">
                                <span className="text-base sm:text-lg ml-1 sm:ml-2 flex-shrink-0">{method.icon}</span>
                                <span className="font-medium text-gray-800 text-sm sm:text-base truncate">{method.name}</span>
                              </div>
                              <span className="font-bold text-[#F38F8B] text-sm sm:text-base flex-shrink-0">
                                {method.price === 0 ? 'رایگان' : formatPrice(method.price)}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-1">{method.duration}</div>
                            {method.minAmount && (
                              <div className="text-xs text-gray-500 mt-1">
                                حداقل خرید: {formatPrice(method.minAmount)}
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                    <span className="text-xl sm:text-2xl ml-2">📋</span>
                    خلاصه سفارش
                  </h3>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">جمع کل کالاها:</span>
                      <span className="font-medium">{formatPrice(getCartTotal())}</span>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 text-sm sm:text-base">
                        <span>تخفیف:</span>
                        <span>-{formatPrice(getDiscountAmount())}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">هزینه ارسال:</span>
                      <span className="font-medium">
                        {getShippingCost() === 0 ? 'رایگان' : formatPrice(getShippingCost())}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#F9C6C2] pt-2 sm:pt-3">
                      <div className="flex justify-between text-base sm:text-lg font-bold">
                        <span className="text-gray-800">مبلغ نهایی:</span>
                        <span className="text-[#F38F8B]">{formatPrice(getFinalTotal())}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={showCheckoutPage}
                    className="w-full mt-4 sm:mt-6 bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    تکمیل خرید
                  </button>
                  
                  <div className="mt-3 sm:mt-4 text-center">
                    <button
                      onClick={backToShop}
                      className="text-[#F38F8B] hover:text-[#F7A8A5] font-medium transition-all duration-200 text-sm sm:text-base"
                    >
                      ادامه خرید
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showShop) {
    return (
      <div className="min-h-screen bg-[#FDE4E0]" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-[#F9C6C2]/50 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <button
                  onClick={backToHome}
                  className="bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white p-2 rounded-xl transition-all duration-200 ml-2 sm:ml-4 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex items-center min-w-0 flex-1">
                  <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-2 sm:p-3 rounded-full ml-2 sm:ml-3 flex-shrink-0">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">🛍️ فروشگاه زیبایی</h1>
                    <p className="text-gray-600 text-xs sm:text-sm hidden sm:block">محصولات اورجینال مراقبت از پوست</p>
                  </div>
                </div>
              </div>
              
              {/* Cart */}
              <div className="flex items-center flex-shrink-0">
                <div className="relative">
                  <button 
                    onClick={showCartPage}
                    className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] text-white p-2 sm:p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center hover:scale-105 transform"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                    <span className="font-medium text-sm sm:text-base hidden sm:inline">سبد خرید</span>
                    <span className="font-medium text-sm sm:hidden">سبد</span>
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
          {/* Categories Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center">دسته‌بندی محصولات</h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center text-sm sm:text-base ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] text-white shadow-lg transform scale-105'
                      : 'bg-[#FDE4E0] hover:bg-[#F9C6C2] text-gray-700 hover:text-gray-800'
                  }`}
                >
                  <span className="text-base sm:text-lg ml-1 sm:ml-2">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skin Type Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center">نوع پوست</h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {skinTypeFilters.map((skinType) => (
                <button
                  key={skinType.id}
                  onClick={() => setSelectedSkinType(skinType.id)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center text-sm sm:text-base ${
                    selectedSkinType === skinType.id
                      ? 'bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] text-white shadow-lg transform scale-105'
                      : 'bg-[#FDE4E0] hover:bg-[#F9C6C2] text-gray-700 hover:text-gray-800'
                  }`}
                >
                  <span className="text-base sm:text-lg ml-1 sm:ml-2">{skinType.icon}</span>
                  <span className="hidden sm:inline">{skinType.name}</span>
                  <span className="sm:hidden">{skinType.name.replace('پوست ', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                {/* Product Image */}
                <div className="bg-gradient-to-br from-[#FDE4E0] to-[#F9C6C2] p-4 sm:p-8 text-center">
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{product.image}</div>
                  {!product.inStock && (
                    <div className="bg-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full inline-block">
                      ناموجود
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-[#FDE4E0] text-[#F38F8B] px-2 sm:px-3 py-1 rounded-full font-medium">
                      {product.brand}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current ml-1" />
                      <span className="text-xs sm:text-sm text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-500 mr-1 hidden sm:inline">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-2 leading-relaxed text-sm sm:text-base">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">{product.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="text-xs bg-[#F9C6C2]/50 text-gray-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-[#F38F8B]">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    {product.originalPrice > product.price && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% تخفیف
                      </div>
                    )}
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full py-2 sm:py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center text-sm sm:text-base ${
                      product.inStock
                        ? 'bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                    <span className="hidden sm:inline">{product.inStock ? 'افزودن به سبد' : 'ناموجود'}</span>
                    <span className="sm:hidden">{product.inStock ? 'افزودن' : 'ناموجود'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="fixed bottom-2 sm:bottom-4 right-2 sm:right-4 left-2 sm:left-4 lg:left-auto lg:w-96 bg-white/95 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-2xl p-3 sm:p-6 z-40">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-bold text-gray-800 flex items-center text-sm sm:text-base">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 text-[#F38F8B]" />
                  <span className="hidden sm:inline">سبد خرید ({getCartItemsCount()} کالا)</span>
                  <span className="sm:hidden">سبد ({getCartItemsCount()})</span>
                </h3>
                <button 
                  onClick={() => setCart([])}
                  className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">پاک کردن همه</span>
                  <span className="sm:hidden">پاک</span>
                </button>
              </div>
              
              <div className="max-h-32 sm:max-h-40 overflow-y-auto mb-3 sm:mb-4 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-[#FDE4E0] rounded-lg p-2 sm:p-3">
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="text-lg sm:text-2xl ml-2 sm:ml-3 flex-shrink-0">{item.image}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs sm:text-sm text-gray-800 truncate">{item.name}</div>
                        <div className="text-xs text-gray-600">{formatPrice(item.price)}</div>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm"
                      >
                        -
                      </button>
                      <span className="mx-1 sm:mx-2 font-bold text-xs sm:text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="bg-[#F38F8B] hover:bg-[#F7A8A5] text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[#F9C6C2] pt-3 sm:pt-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="font-bold text-gray-800 text-sm sm:text-base">مجموع:</span>
                  <span className="font-bold text-base sm:text-lg text-[#F38F8B]">{formatPrice(getCartTotal())}</span>
                </div>
                <button 
                  onClick={showCheckoutPage}
                  className="w-full bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white py-2 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">تکمیل خرید</span>
                  <span className="sm:hidden">خرید</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-600">در این دسته‌بندی محصولی موجود نیست</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showNameForm) {
    return (
      <div className="min-h-screen bg-[#FDE4E0] flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#F9C6C2] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F7A8A5] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F38F8B] rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-8 text-center">
            {/* Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-4 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ✨ خوش آمدید
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 mb-6">
              لطفاً نام خود را وارد کنید تا بتوانیم نتایج را شخصی‌سازی کنیم
            </p>
            
            {/* Name Input */}
            <div className="mb-6">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="نام شما..."
                className="w-full p-4 rounded-xl border-2 border-[#F9C6C2] focus:border-[#F38F8B] focus:outline-none text-center text-lg bg-white/80 backdrop-blur-sm transition-all duration-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleNameSubmit();
                  }
                }}
                autoFocus
              />
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleNameSubmit}
              disabled={!userName.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                userName.trim()
                  ? 'bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              شروع تست
            </button>
            
            {/* Skip Option */}
            <button
              onClick={() => setShowNameForm(false)}
              className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-sm"
            >
              رد کردن و ادامه بدون نام
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showLanding) {
    const slides = [
      {
        title: "✨ تشخیص نوع پوست",
        subtitle: "با پاسخ به ۱۰ سوال ساده، نوع پوست خود را بشناسید",
        description: "بهترین روتین مراقبت را دریافت کنید",
        bgGradient: "from-[#F7A8A5] to-[#F38F8B]",
        icon: <span className="text-6xl">👩</span>,
        features: [
          { icon: "💖", title: "تحلیل دقیق", desc: "بر اساس علم پوست‌شناسی" },
          { icon: "⭐", title: "توصیه‌های شخصی", desc: "روتین مخصوص شما" },
          { icon: "🛒", title: "محصولات پیشنهادی", desc: "بهترین برندها" }
        ]
      },
      {
        title: "🌸 مراقبت حرفه‌ای",
        subtitle: "روتین‌های صبح و شب مخصوص نوع پوست شما",
        description: "با محصولات تست شده و تایید شده",
        bgGradient: "from-[#F38F8B] to-[#F7A8A5]",
        icon: <Star className="w-16 h-16 text-white" />,
        features: [
          { icon: "☀️", title: "روتین صبح", desc: "شروع روز با پوستی سالم" },
          { icon: "🌙", title: "روتین شب", desc: "ترمیم و تغذیه شبانه" },
          { icon: "✨", title: "نتایج سریع", desc: "تغییرات قابل مشاهده" }
        ]
      },
      {
        title: "🛍️ فروشگاه زیبایی",
        subtitle: "محصولات اورجینال با بهترین قیمت",
        description: "ارسال رایگان و ضمانت اصالت کالا",
        bgGradient: "from-[#F7A8A5] to-[#F9C6C2]",
        icon: <ShoppingCart className="w-16 h-16 text-white" />,
        features: [
          { icon: "🚚", title: "ارسال رایگان", desc: "برای خریدهای بالای ۵۰۰ هزار تومان" },
          { icon: "🔒", title: "ضمانت اصالت", desc: "۱۰۰٪ اورجینال و معتبر" },
          { icon: "💎", title: "کیفیت برتر", desc: "بهترین برندهای جهان" }
        ]
      }
    ];

    const currentSlideData = slides[currentSlide];

    return (
      <div className="min-h-screen bg-[#FDE4E0] flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#F9C6C2] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F7A8A5] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F38F8B] rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-5xl relative z-10">
          {/* Main Slider Container */}
          <div className="relative">
            {/* Slide Content */}
            <div className={`bg-gradient-to-br ${currentSlideData.bgGradient} rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center transition-all duration-500 transform`}>
              {/* Icon */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border border-white/30">
                  {currentSlideData.icon}
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {currentSlideData.title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl mb-2 opacity-90">
                {currentSlideData.subtitle}
              </p>
              
              {/* Description */}
              <p className="text-lg mb-10 opacity-80">
                {currentSlideData.description}
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {currentSlideData.features.map((feature, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-150">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.desc}</p>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 justify-center items-center">
                <button
                  onClick={startQuiz}
                  className="bg-white text-[#F38F8B] px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-150 transform hover:scale-105 shadow-lg hover:shadow-xl hover:bg-[#FDE4E0]"
                >
                  شروع تست رایگان
                </button>
                <div className="flex space-x-3 space-x-reverse">
                  <button
                    onClick={showShopPage}
                    className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-2 rounded-xl font-medium text-sm transition-all duration-150 transform hover:scale-105 shadow-md hover:shadow-lg hover:bg-white/30 flex items-center"
                  >
                    <Store className="w-4 h-4 ml-2" />
                    فروشگاه
                  </button>

                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#F38F8B] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-100 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#F38F8B] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-100 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-3 space-x-reverse">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#F38F8B] scale-125 shadow-lg'
                    : 'bg-white/60 hover:bg-white/80 shadow-md'
                }`}
              />
            ))}
          </div>
          
          {/* Bottom Info */}
          <div className="text-center text-gray-600 text-sm mt-6">
            <p>تست تنها ۲ دقیقه زمان می‌برد • رایگان و بدون نیاز به ثبت‌نام</p>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    const skinTypeInfo = skinTypes[result];
    return (
      <div className="min-h-screen bg-[#FDE4E0] relative" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
        {/* Main Content */}
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#F9C6C2]/50 shadow-lg p-8 mb-6 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-[#F7A8A5] to-[#F38F8B] p-4 rounded-full">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">✨ {userName ? `${userName} عزیز، نتیجه تحلیل پوست شما` : 'نتیجه تحلیل پوست شما'}</h1>
              <p className="text-gray-600 text-lg mb-4">بر اساس پاسخ‌های شما تحلیل شده است</p>
              
              <div className="bg-gradient-to-l from-[#F9C6C2] to-[#FDE4E0] rounded-xl p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{userName ? `${userName} عزیز، نوع پوست شما ${skinTypeInfo.title} است` : skinTypeInfo.title}</h2>
                <p className="text-gray-700 text-lg">{skinTypeInfo.description}</p>
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* ویژگی‌های پوست شما */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#F9C6C2]/50 shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-[#FDE4E0] p-3 rounded-full">
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">ویژگی‌های پوست شما</h3>
                  <p className="text-sm text-gray-600">پوست شما در وضعیت ایده‌آل است</p>
                </div>
                
                {/* تنوع محصولات */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#F9C6C2]/50 shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-[#FDE4E0] p-3 rounded-full">
                      <span className="text-2xl">⭐</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">تنوع محصولات</h3>
                  <p className="text-sm text-gray-600">می‌توانید از انواع محصولات استفاده کنید</p>
                </div>
                
                {/* مقاومت خوب */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#F9C6C2]/50 shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-[#FDE4E0] p-3 rounded-full">
                      <span className="text-2xl">🏆</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">مقاومت خوب</h3>
                  <p className="text-sm text-gray-600">در برابر عوامل محیطی مقاوم است</p>
                </div>
              </div>
               
              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-6 mt-6">
                {/* Main Details Button - Larger and Higher */}
                <button
                  onClick={() => setShowResultSidebar(true)}
                  className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white px-10 py-4 text-lg rounded-xl font-bold transition-all duration-150 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Palette className="w-6 h-6 ml-3" />
                  مشاهده جزئیات کامل
                </button>
                
                {/* Secondary Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                  <button
                    onClick={showShopPage}
                    className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white px-6 py-3 rounded-xl font-bold transition-all duration-150 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Store className="w-5 h-5 ml-2" />
                    مشاهده فروشگاه
                  </button>
                  
                  <button
                    onClick={resetQuiz}
                    className="bg-white border-2 border-[#F38F8B] text-[#F38F8B] hover:bg-[#F38F8B] hover:text-white px-6 py-3 rounded-xl font-bold transition-all duration-150 transform hover:scale-105 flex items-center justify-center"
                  >
                    <RefreshCw className="w-5 h-5 ml-2" />
                    تست مجدد
                  </button>
                </div>
              </div>
            </div>
           </div>
         </div>

         {/* Sidebar */}
         {showResultSidebar && (
           <>
             {/* Overlay */}
             <div 
               className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
               onClick={() => setShowResultSidebar(false)}
             ></div>
             
             {/* Sidebar Content */}
             <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 transform transition-transform duration-300 overflow-y-auto">
               {/* Sidebar Header */}
               <div className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] p-6 text-white sticky top-0 z-10">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center">
                     <CheckCircle className="w-6 h-6 ml-3" />
                     <h2 className="text-xl font-bold">جزئیات تحلیل پوست</h2>
                   </div>
                   <button
                     onClick={() => setShowResultSidebar(false)}
                     className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 <p className="text-white/90 mt-2">{skinTypeInfo.title} - {skinTypeInfo.description}</p>
               </div>

               {/* Sidebar Body */}
               <div className="p-6 space-y-6">
                 {/* Features Section */}
                 <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                     <span className="text-2xl ml-2">✨</span>
                     ویژگی‌های پوست شما
                   </h3>
                   <div className="space-y-3">
                     {skinTypeInfo.features.map((feature, index) => (
                       <div key={index} className="bg-gradient-to-br from-[#FDE4E0] to-[#F9C6C2] rounded-xl p-4 border border-[#F9C6C2]">
                         <div className="flex items-center mb-2">
                           <div className="text-xl ml-3">{feature.icon}</div>
                           <h4 className="font-bold text-gray-800">{feature.title}</h4>
                         </div>
                         <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Morning Routine */}
                 <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                     <Sun className="w-6 h-6 text-amber-600 ml-2" />
                     روتین صبح
                   </h3>
                   <div className="space-y-3">
                     {skinTypeInfo.morningRoutine.map((step, index) => (
                       <div key={index} className="flex items-start bg-[#FDE4E0] rounded-lg p-4">
                         <span className="bg-[#F38F8B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ml-4 mt-0.5 flex-shrink-0">
                           {index + 1}
                         </span>
                         <span className="text-gray-700 leading-relaxed">{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Evening Routine */}
                 <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                     <Moon className="w-6 h-6 text-indigo-600 ml-2" />
                     روتین شب
                   </h3>
                   <div className="space-y-3">
                     {skinTypeInfo.eveningRoutine.map((step, index) => (
                       <div key={index} className="flex items-start bg-[#FDE4E0] rounded-lg p-4">
                         <span className="bg-[#F38F8B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold ml-4 mt-0.5 flex-shrink-0">
                           {index + 1}
                         </span>
                         <span className="text-gray-700 leading-relaxed">{step}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Products Section */}
                 <div>
                   <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                     <ShoppingCart className="w-6 h-6 text-green-600 ml-2" />
                     محصولات پیشنهادی
                   </h3>
                   
                   {/* Success Message */}
                   {addedToCartMessage && (
                     <div className="mb-4 bg-green-100 border border-green-300 rounded-xl p-4 flex items-center animate-pulse">
                       <CheckCircle className="w-5 h-5 text-green-600 ml-3" />
                       <span className="text-green-800 font-medium">{addedToCartMessage}</span>
                     </div>
                   )}
                   
                   <div className="space-y-4">
                     {skinTypeInfo.products.map((product, index) => (
                       <div key={index} className="bg-gradient-to-br from-white to-[#FDE4E0] rounded-xl p-4 border border-[#F9C6C2] shadow-sm">
                         <div className="flex items-start justify-between mb-3">
                           <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                               <span className="text-xs bg-[#FDE4E0] text-[#F38F8B] px-2 py-1 rounded-full font-medium">
                                 {product.category}
                               </span>
                               <div className="text-xl">{product.image}</div>
                             </div>
                             <h4 className="font-bold text-gray-800 leading-relaxed mb-1">{product.name}</h4>
                             <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                             <div className="text-lg font-bold text-[#F38F8B] mb-3">
                               {formatPrice(product.price)}
                             </div>
                           </div>
                         </div>
                         <button 
                           onClick={() => addToCart(product)}
                           className="w-full bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white py-2 rounded-xl font-bold transition-all duration-100 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                         >
                           <ShoppingCart className="w-4 h-4 ml-2" />
                           افزودن به سبد
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="space-y-3 pt-4 border-t border-gray-200">
                   <button
                     onClick={showShopPage}
                     className="w-full bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] hover:from-[#F7A8A5] hover:to-[#F38F8B] text-white py-3 rounded-xl font-bold transition-all duration-150 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                   >
                     <Store className="w-5 h-5 ml-2" />
                     مشاهده فروشگاه
                   </button>
                   
                   <button
                     onClick={resetQuiz}
                     className="w-full bg-white border-2 border-[#F38F8B] text-[#F38F8B] hover:bg-[#F38F8B] hover:text-white py-3 rounded-xl font-bold transition-all duration-150 transform hover:scale-105 flex items-center justify-center"
                   >
                     <RefreshCw className="w-5 h-5 ml-2" />
                     تست مجدد
                   </button>
                 </div>
               </div>
             </div>
           </>
         )}
       </div>
     );
   }

   const currentQuestion = questions[currentStep];
   const progress = ((currentStep + 1) / questions.length) * 100;

   return (
     <div className="min-h-screen bg-[#FDE4E0] flex items-center justify-center p-4" style={{ fontFamily: 'Kalameh, -apple-system, BlinkMacSystemFont, sans-serif' }} dir="rtl">
       <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm overflow-hidden">
         <div className="bg-white/90 p-6 border-b border-gray-100">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center">
               <Camera className="w-6 h-6 text-[#F38F8B] ml-2" />
               <h1 className="text-xl font-semibold text-gray-800">تشخیص نوع پوست</h1>
             </div>
             <span className="text-sm text-gray-500">
               {currentStep + 1} از {questions.length}
             </span>
           </div>
           
           <div className="w-full bg-gray-200 rounded-full h-2">
             <div 
               className="bg-gradient-to-l from-[#F38F8B] to-[#F7A8A5] h-2 rounded-full transition-all duration-150"
               style={{ width: `${progress}%` }}
             ></div>
           </div>
         </div>

         <div className="p-8">
           <div className="text-center mb-8">
             <div className="flex items-center justify-center mb-4">
               <div className="bg-[#FDE4E0] p-3 rounded-full text-[#F38F8B]">
                 {currentQuestion.icon}
               </div>
             </div>
             <h2 className="text-lg font-semibold text-gray-800 mb-2">{currentQuestion.title}</h2>
             <p className="text-gray-600">{currentQuestion.question}</p>
           </div>

           <div className="space-y-3 mb-8">
             {currentQuestion.options.map((option) => (
               <button
                 key={option.value}
                 onClick={() => handleAnswer(currentQuestion.id, option.value)}
                 className={`w-full p-4 rounded-xl border-2 transition-all duration-100 text-right ${
                   answers[currentQuestion.id] === option.value
                     ? 'border-[#F38F8B] bg-[#FDE4E0] text-[#F38F8B]'
                     : 'border-gray-200 bg-white/60 hover:border-[#F9C6C2] hover:bg-[#FDE4E0]/25 text-gray-700'
                 }`}
               >
                 <div className="flex items-center justify-between">
                   <div className="flex-1">
                     <div className="font-medium mb-1">{option.label}</div>
                     <div className="text-sm opacity-75">{option.description}</div>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                     answers[currentQuestion.id] === option.value
                       ? 'border-[#F38F8B] bg-[#F38F8B]'
                       : 'border-gray-300'
                   }`}>
                     {answers[currentQuestion.id] === option.value && (
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                     )}
                   </div>
                 </div>
               </button>
             ))}
           </div>

           <div className="flex justify-between">
             <button
               onClick={goToPrevious}
               disabled={currentStep === 0}
               className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors duration-100 ${
                 currentStep === 0
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   : 'bg-[#F9C6C2] hover:bg-[#F7A8A5] text-white'
               }`}
             >
               <ChevronLeft className="w-5 h-5 ml-1" />
               قبلی
             </button>
             
             {answers[currentQuestion.id] && (
               <button
                 onClick={goToNext}
                 className="bg-[#F38F8B] hover:bg-[#F7A8A5] text-white px-6 py-3 rounded-xl font-medium transition-all duration-100 flex items-center"
               >
                 {currentStep === questions.length - 1 ? 'مشاهده نتیجه' : 'بعدی'}
                 <ChevronRight className="w-5 h-5 mr-1" />
               </button>
             )}
           </div>
         </div>
       </div>
     </div>
   );
 };

export default SkinTypeDetector;