import {
  ShoppingCart,
  Sparkles,
  Wand2,
  Clock,
  CheckCircle2,
  ShoppingBag,
  Armchair,
  Coffee,
  Tag,
  Truck,
  Briefcase,
  Factory,
  Warehouse,
  Archive,
  ClipboardList,
  ArrowLeftRight,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Users,
  Star,
  Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface HelpTopic {
  id: string;
  icon: LucideIcon;
  title: string;
  titleAr: string;
  steps: string[];
  stepsAr: string[];
}

export interface HelpSection {
  id: string;
  title: string;
  titleAr: string;
  topics: HelpTopic[];
}

export const HELP_SECTIONS: HelpSection[] = [
  {
    id: "pos",
    title: "Point of Sale (POS) System",
    titleAr: "نظام الكاشير (POS)",
    topics: [
      {
        id: "pos-open-shift",
        icon: ShoppingCart,
        title: "Opening the shift and starting sales",
        titleAr: "فتح الشفت وبدء البيع",
        steps: [
          'From the POS screen, press the "Start Shift" button at the top—you must do this before processing any sales.',
          "After starting your shift, any order you create (dine-in, takeaway) is automatically linked to your shift.",
          'You can select a product, add it to the cart, and customize its recipe (see "Customizing a product in POS" in the menu).',
          "When paying, choose the payment method: Cash, Card, InstaPay, or part-and-part (Hybrid).",
          'At the end of your shift, press "Close Shift"—it will show you a full summary with all the details (see the "Shift Closing" section in the menu).',
        ],
        stepsAr: [
          'من شاشة الكاشير (POS) اضغط زرار "بداية الشيفت" أعلى الشاشة — لازم تعمل كده الأول قبل أي عملية بيع.',
          "بعد فتح الشفت، أي أوردر تعمله (طاولة، تيك أواي) بيتربط تلقائيًا بالشفت بتاعك.",
          'تقدر تختار المنتج، تضيفه للسلة، وتخصص الريسبي بتاعه (شوف "تخصيص منتج في POS" في القائمة).',
          "عند الدفع، اختار طريقة الدفع: كاش، كارت، إنستاباي، أو جزء وجزء (هايبرد).",
          'في نهاية الشفت اضغط "إغلاق الشفت" — هيوريك ملخص كامل بكل التفاصيل (شوف قسم "تقفيل الشفت" في القائمة).',
        ],
      },
      {
        id: "pos-customize",
        icon: Wand2,
        title: "Customizing a product in POS (Remove ingredient / Add extra)",
        titleAr: "تخصيص منتج في POS (شيل مكون / أضف إكسترا)",
        steps: [
          'Press on the product in the POS screen—a "Customize" popup will open if the product has a recipe or extras.',
          'Under "Default Ingredients" you\'ll find all the product\'s ingredients checked (✓)—if you want to remove a specific ingredient (e.g., no cheese), uncheck it.',
          "Inventory is deducted correctly automatically: any ingredient you remove won't be deducted from its stock.",
          'Under "Extras", select any extras you want to add to the product (they\'ll be added to the price and deducted from their ingredients\' stock).',
          'You can write a special note (like "extra hot") and set the quantity, then "Add to Order".',
        ],
        stepsAr: [
          'اضغط على المنتج في شاشة الكاشير — هتفتح بوب أب "تخصيص" لو المنتج له ريسبي أو إضافات.',
          'تحت "المكونات الافتراضية" هتلاقي كل مكونات المنتج متحددة (✓) — لو عاوز تشيل مكون معين (مثلاً بدون جبنة)، ألغِ تحديده.',
          "المخزون بيتخصم صح تلقائيًا: أي مكون تشيله منه، مش هيتخصم من مخزونه.",
          'تحت "إضافات" اختار أي إكسترا عاوز تضيفها للمنتج (هتتضاف على السعر وتتخصم من مخزون مكوناتها).',
          'تقدر تكتب ملاحظة خاصة (زي "حار جدًا") وتحدد الكمية، وبعدين "إضافة للطلب".',
        ],
      },
      {
        id: "pos-payments",
        icon: Sparkles,
        title: "Payment methods (Cash / Card / InstaPay / Hybrid)",
        titleAr: "طرق الدفع (كاش / كارت / إنستاباي / هايبرد)",
        steps: [
          'From the payment screen, choose the method: Cash, Visa/Card, InstaPay, or "Part & Part" if the customer is paying with more than one method.',
          'If you choose "Part & Part", specify the cash amount and the card amount—their total must equal the invoice total.',
          "If the method is Card, InstaPay, or Hybrid, you can enter a reference number for the transaction (optional).",
          "Every payment is recorded by its method in the shift closing at the end of the day—that's why it's important to choose the correct method.",
        ],
        stepsAr: [
          'من شاشة الدفع اختار الطريقة: كاش، فيزا/كارت، إنستاباي، أو "جزء وجزء" لو العميل هيدفع بأكتر من طريقة.',
          'لو اخترت "جزء وجزء" حدد مبلغ الكاش ومبلغ الكارت، ولازم مجموعهم يساوي إجمالي الفاتورة.',
          "لو الطريقة كارت أو إنستاباي أو هايبرد، تقدر تكتب رقم مرجعي للعملية (اختياري).",
          "كل عملية دفع بتتسجل بطريقتها في تقفيل الشفت آخر اليوم — عشان كده مهم تختار الطريقة الصح.",
        ],
      },
    ],
  },
  {
    id: "shift-closing",
    title: "Shift Closing and End-of-Day (EOD) Closing",
    titleAr: "تقفيل الشفت وتقفيلة اليوم",
    topics: [
      {
        id: "shift-close",
        icon: Clock,
        title: "How do I close the shift? (Shift-specific details)",
        titleAr: "إزاي أقفل الشفت؟ (تفصيل كل شفت)",
        steps: [
          'Press "Close Shift" from the POS screen—the system closes your working hours and aggregates all orders that occurred during this period.',
          'A "Shift Summary" screen will appear showing: number of orders, total amount, and breakdown by payment method (Cash / Card / InstaPay / Hybrid).',
          "You'll also find the total discounts applied to orders, and total shipping fees for app/call center orders that occurred during the same shift period.",
          'Under "Order Details" you\'ll find each order individually: its number, type (POS or App/Call Center), payment method, discount if any, shipping fees if any, and total.',
          "App and call center orders that happened while you were working appear in the same summary automatically—you don't need to create them yourself.",
          'After reviewing the summary, press "OK"—the shift is closed and recorded in the shift log (you can review it later from "Shift Reports").',
        ],
        stepsAr: [
          'اضغط "إغلاق الشفت" من شاشة الكاشير — النظام بيقفل ساعات دوامك ويجمّع كل الأوردرات اللي حصلت في الفترة دي.',
          "هتظهرلك شاشة \"ملخص الشفت\" فيها: عدد الأوردرات، الإجمالي الكلي، وتوزيع المبلغ حسب طريقة الدفع (كاش / كارت / إنستاباي / هايبرد).",
          "هتلاقي كمان إجمالي الخصومات اللي اتعملت على الأوردرات، وإجمالي مصاريف الشحن لأوردرات الأبليكيشن/الكول سنتر اللي حصلت في نفس فترة الشفت.",
          'تحت "تفصيل الأوردرات" هتلاقي كل أوردر لوحده: رقمه، نوعه (POS ولا أبليكيشن/كول سنتر)، طريقة الدفع، الخصم لو فيه، رسوم الشحن لو فيها، والإجمالي.',
          "أوردرات الأبليكيشن والكول سنتر اللي حصلت وانت شغال بتظهر في نفس الملخص تلقائيًا، مش لازم تعملها إنت بنفسك.",
          'بعد ما تراجع الملخص اضغط "حسنًا" — الشفت بيتقفل ويتسجل في سجل الشفتات (تقدر تراجعه بعدين من "تقارير الشفت").',
        ],
      },
      {
        id: "eod-close",
        icon: CheckCircle2,
        title: "How do I perform the End-of-Day (EOD) closing?",
        titleAr: "إزاي أعمل تقفيلة اليوم كله (EOD)؟",
        steps: [
          "The End-of-Day closing is separate from closing a single shift—it aggregates all shifts that worked during the day into one final closing.",
          'From the "End of Day" button on the POS screen, you\'ll open the "End-of-Day Closing" screen showing the system-expected totals: Cash, Card, InstaPay, Hybrid, total shipping, and total discounts for the entire day.',
          "Under \"Shift Details\" you'll find each shift that worked today with the cashier's name and their amount by each payment method—so you know exactly how much each cashier collected.",
          'Any app or call center order that wasn\'t during an open shift appears in a separate item called "Without Shift" so the final number matches reality completely.',
          "Count the actual Cash, Card, and InstaPay amounts you have in the drawer/account, and enter them in the fields (Actual Amount).",
          'Press "Close Record"—the system will compare expected vs. actual, calculate the difference (if there\'s a shortage or surplus), close today completely, and automatically open a new record for the next day.',
        ],
        stepsAr: [
          "تقفيلة اليوم منفصلة عن تقفيل شفت واحد — هي بتجمّع كل الشفتات اللي اشتغلت في اليوم مع بعض في تقفيلة واحدة نهائية.",
          'من زرار "End of Day" في شاشة الكاشير هتفتح شاشة "تقفيلة اليوم"، هتلاقي فيها المتوقع نظاميًا: كاش، كارت، إنستاباي، هايبرد، إجمالي الشحن، وإجمالي الخصومات لكل اليوم.',
          'تحت "تفصيل الشفتات" هتلاقي كل شفت اشتغل النهارده باسم صاحبه ومبلغه بكل طريقة دفع لوحدها — عشان تعرف كل كاشير حصّل قد إيه بالظبط.',
          'أي أوردر أبليكيشن أو كول سنتر ما كانش في وقت شفت مفتوح، بيظهر في بند منفصل اسمه "بدون شفت" عشان الرقم النهائي يبقى مطابق للواقع بالكامل.',
          "دوّر على الكاش والكارت والإنستاباي الفعليين اللي عندك في الدرج/الحساب، واكتبهم في الخانات (المبلغ الفعلي).",
          'اضغط "إغلاق السجل" — النظام هيقارن المتوقع بالفعلي ويحسب الفرق (لو فيه عجز أو زيادة)، ويقفل يوم النهاردة بالكامل ويفتح تلقائيًا سجل جديد لليوم اللي بعده.',
        ],
      },
    ],
  },
  {
    id: "daily-ops",
    title: "Daily Operations",
    titleAr: "العمليات اليومية",
    topics: [
      {
        id: "order-management",
        icon: ShoppingBag,
        title: "Order management",
        titleAr: "إدارة الطلبات",
        steps: [
          "From \"Order Management\" you can see all system orders (POS, App, Call Center) with their current status.",
          "You can filter by status (Pending, In Preparation, On the Way, Delivered, Cancelled) or by order type.",
          "Open any order to see its full details: products, extras, discounts, and status change history.",
          "You can manually change the order status if needed (e.g., confirm or cancel).",
        ],
        stepsAr: [
          'من "إدارة الطلبات" تقدر تشوف كل أوردرات النظام (POS، أبليكيشن، كول سنتر) بحالتها الحالية.',
          "تقدر تفلتر حسب الحالة (قيد الانتظار، جاري التحضير، في الطريق، تم التسليم، ملغي) أو حسب نوع الأوردر.",
          "افتح أي أوردر عشان تشوف تفاصيله كاملة: المنتجات، الإضافات، الخصومات، وسجل تغيير الحالة.",
          "تقدر تغيّر حالة الأوردر يدويًا لو محتاج (مثلاً تأكيد أو إلغاء).",
        ],
      },
      {
        id: "table-management",
        icon: Armchair,
        title: "Table management",
        titleAr: "إدارة الطاولات",
        steps: [
          'From "Table Management" you can add/edit the store\'s tables and set their capacity.',
          'On the POS screen, a "Dine-in" order must have a table number selected before sending it to the kitchen.',
          'You can see currently occupied tables from "Active Tables" and track their status.',
        ],
        stepsAr: [
          'من "إدارة الطاولات" تقدر تضيف/تعدّل طاولات المحل وتحدد سعتها.',
          'في شاشة الكاشير، أوردر "Dine-in" لازم تختارله رقم طاولة قبل إرساله للمطبخ.',
          'تقدر تشوف الطاولات المشغولة حاليًا من "Active Tables" وتتابع حالتها.',
        ],
      },
    ],
  },
  {
    id: "items-offers",
    title: "Items and Offers",
    titleAr: "الأصناف والعروض",
    topics: [
      {
        id: "product-catalog",
        icon: Coffee,
        title: "Product Catalog (Name, Price, Category, Recipe)",
        titleAr: "كتالوج المنتجات (الاسم، السعر، الكاتجري، الريسبي)",
        steps: [
          'From "Product Catalog", press "+ Add Product" to create a new product.',
          "Enter the name, description, price, and select its category.",
          'Under the "Recipe" tab, add the ingredients (raw materials) and quantity for each—this is what gets deducted from inventory automatically with every sale.',
          'Under the "Extras" tab, you can add extras specific to this product only, each with its own separate recipe.',
          'You can define "Variants" for the product like sizes, and each variant can have a different recipe.',
          "Set a Low Stock Threshold to get an alert when the quantity drops.",
        ],
        stepsAr: [
          'من "كتالوج المنتجات" اضغط "+ إضافة منتج" عشان تعمل منتج جديد.',
          "اكتب الاسم، الوصف، السعر، واختار الكاتجري بتاعته.",
          'تحت تبويب "الريسبي" ضيف المكونات (المواد الخام) وكمية كل مكون — ده اللي بيتخصم من المخزون تلقائيًا مع كل عملية بيع.',
          'تحت تبويب "الإضافات" (Extras) تقدر تضيف إضافات خاصة بالمنتج ده بس، ولها ريسبي منفصل بتاعها.',
          'تقدر تحدد "أنواع" (Variants) للمنتج زي المقاسات، وكل نوع ممكن يكون له ريسبي مختلف.',
          "حدد حد أدنى للمخزون (Low Stock Threshold) عشان يجيلك تنبيه لما الكمية تقل.",
        ],
      },
      {
        id: "extras-library",
        icon: Library,
        title: "Extras Library",
        titleAr: "مكتبة الإضافات",
        steps: [
          "The Extras Library lets you add an extra once at the category level, and it automatically applies to all products in that category.",
          "Each extra has a name, price, and recipe (if it needs to deduct from inventory).",
          "Any product that belongs to that category will automatically show this extra in the POS screen without adding it manually.",
        ],
        stepsAr: [
          "مكتبة الإضافات (Extras Library) بتخليك تضيف إضافة مرة واحدة على مستوى الكاتجري، وتتطبق على كل منتجات الكاتجري ده تلقائيًا.",
          "كل إضافة ليها اسم وسعر وريسبي (لو محتاجة تخصم من المخزون).",
          "أي منتج يتبع الكاتجري ده هيظهرله الإضافة دي في شاشة الكاشير من غير ما تضيفها له يدويًا.",
        ],
      },
      {
        id: "offers-discounts",
        icon: Tag,
        title: "Offers, Discounts, and Coupons",
        titleAr: "العروض والخصومات + كوبونات الخصم",
        steps: [
          'From "Offers & Discounts", create a new offer: set the discount type (percentage % or fixed amount), minimum order value, and start/end date.',
          'From "Discount Coupons", create a coupon code that customers can use in the app or POS.',
          "You can set a maximum number of times the coupon can be used, and track how many times it's been used so far.",
        ],
        stepsAr: [
          'من "العروض والخصومات" أنشئ عرض جديد: حدد نوع الخصم (نسبة % أو مبلغ ثابت)، الحد الأدنى للطلب، وتاريخ البداية/النهاية.',
          'من "كوبونات الخصم" أنشئ كود كوبون يقدر العميل يستخدمه في الأبليكيشن أو الكاشير.',
          "تقدر تحدد حد أقصى لعدد مرات استخدام الكوبون، ومتابعة كام مرة اتستخدم لحد دلوقتي.",
        ],
      },
    ],
  },
  {
    id: "supply-chain",
    title: "Supply Chain",
    titleAr: "سلسلة الإمداد",
    topics: [
      {
        id: "supplier-management",
        icon: Truck,
        title: "Supplier Management",
        titleAr: "إدارة الموردين",
        steps: [
          'From "Supplier Management", register each supplier\'s data (name, contact, products they supply).',
          "Each raw material in the product catalog can be linked to a specific supplier, making it easier to create purchase orders later.",
        ],
        stepsAr: [
          'من "إدارة الموردين" سجّل بيانات كل مورد (اسم، جهة اتصال، المنتجات اللي بيوردها).',
          "كل مادة خام في كتالوج المنتجات ممكن تربطها بمورد معين، عشان تسهّل عمل طلبات الشراء بعدين.",
        ],
      },
      {
        id: "purchase-orders",
        icon: Briefcase,
        title: "Purchase Orders",
        titleAr: "طلبات الشراء (Purchase Orders)",
        steps: [
          'From "Purchase Orders", create a new purchase order: select the supplier and add the required items and quantities.',
          "After physically receiving the goods, confirm receipt—the quantity is automatically added to the specified warehouse's inventory.",
          "You can track the status of each purchase order (Pending, Partially Received, Fully Received).",
        ],
        stepsAr: [
          'من "طلبات الشراء" أنشئ أمر شراء جديد: اختار المورد، وضيف الأصناف والكميات المطلوبة.',
          "بعد استلام البضاعة فعليًا، أكّد استلام الأمر — الكمية بتتضاف تلقائيًا لمخزون المخزن المحدد.",
          "تقدر تتابع حالة كل أمر شراء (معلّق، مستلم جزئيًا، مستلم بالكامل).",
        ],
      },
      {
        id: "production-lines",
        icon: Factory,
        title: "Production Lines and Work Orders",
        titleAr: "خطوط الإنتاج وأوامر التشغيل (Work Orders)",
        steps: [
          'Production lines are used for "manufactured" products that are transformed from raw materials to finished products (like roasting or baking).',
          'From "Work Orders", create a manufacturing order: select the finished product and production quantity.',
          "The system automatically calculates the required raw materials based on the recipe, deducts them from inventory, and adds the finished product after execution.",
        ],
        stepsAr: [
          'خطوط الإنتاج بتستخدم لمنتجات "مصنّعة" بتتحول من مواد خام لمنتج نهائي (زي التحميص أو الخبيز).',
          'من "أوامر التشغيل" (Work Orders) أنشئ أمر تصنيع: اختار المنتج النهائي وكمية الإنتاج.',
          "النظام بيحسب المواد الخام المطلوبة تلقائيًا حسب الريسبي، وبيخصمها من المخزون، ويضيف المنتج النهائي بعد التنفيذ.",
        ],
      },
    ],
  },
  {
    id: "inventory-warehousing",
    title: "Inventory and Warehousing",
    titleAr: "الجرد والمخازن",
    topics: [
      {
        id: "warehouse-management",
        icon: Warehouse,
        title: "Warehouse Management and Stock Transfers",
        titleAr: "إدارة المخازن والتحويلات بينها",
        steps: [
          'From "Warehouses", add each branch/warehouse you have (store, central warehouse, etc.).',
          "Each product has a separate inventory quantity for each warehouse (Location Stock).",
          'From "Inter-Warehouse Transfers", you can move quantities from one warehouse to another—it\'s automatically deducted from the source and added to the destination.',
        ],
        stepsAr: [
          'من "المستودعات" أضف كل فرع/مخزن عندك (المحل، مخزن مركزي، إلخ).',
          "كل منتج بيبقى له كمية مخزون منفصلة لكل مخزن (Location Stock).",
          'من "التحويلات بين المخازن" تقدر تنقل كمية من مخزن لمخزن — بتتخصم من المصدر وتتضاف للوجهة تلقائيًا.',
        ],
      },
      {
        id: "opening-balance",
        icon: Archive,
        title: "Opening Balance",
        titleAr: "رصيد أول الفترة (Opening Balance)",
        steps: [
          'From "Financial Hub", select the "Opening Balance" tab, press "New Period Balance".',
          "Select the warehouse and the period start date.",
          "Add each item, its actual quantity, and its cost price at the start of this period (this records the starting point for all inventory movements calculated afterwards).",
          'Press "Save"—this balance becomes the reference for inventory counting and costs in reports.',
        ],
        stepsAr: [
          'من "المركز المالي" اختار تبويب "رصيد أول الفترة"، اضغط "رصيد فترة جديد".',
          "اختار المخزن وتاريخ بداية الفترة.",
          "ضيف كل صنف وكميته الفعلية وسعر تكلفته في بداية الفترة دي (ده بيسجل نقطة البداية اللي هتتحسب عليها كل حركات المخزون بعد كده).",
          'اضغط "حفظ" — الرصيد ده بيبقى مرجع لحساب الجرد والتكاليف في التقارير.',
        ],
      },
      {
        id: "physical-count",
        icon: ClipboardList,
        title: "Physical Count",
        titleAr: "الجرد الفعلي (Physical Count)",
        steps: [
          'From "Financial Hub", select the "Physical Count" tab to compare the quantity actually in the warehouse with the quantity recorded in the system.',
          "Start a new count, select the warehouse, and enter the actual quantity for each item after manual counting.",
          "The system shows you the difference (surplus or shortage) between recorded and actual, and you can approve the difference to automatically adjust inventory.",
        ],
        stepsAr: [
          'من "المركز المالي" اختار تبويب "الجرد الفعلي" عشان تقارن الكمية الموجودة فعليًا في المخزن بالكمية المسجلة في النظام.',
          "ابدأ جرد جديد، اختار المخزن، واكتب الكمية الفعلية لكل صنف بعد العدّ اليدوي.",
          "النظام بيوريك الفرق (زيادة أو نقص) بين المسجّل والفعلي، وتقدر تعتمد الفرق عشان يتظبط المخزون تلقائيًا.",
        ],
      },
      {
        id: "settlements-waste",
        icon: ArrowLeftRight,
        title: "Settlements & Waste",
        titleAr: "التسويات والهالك (Settlements & Waste)",
        steps: [
          'From "Settlements & Waste", record any quantity that was damaged or lost (waste, damage, shortage) for a specific product.',
          "Specify the type (Waste, Quantity Adjustment, Disposal Authorization) and the reason and quantity.",
          "This quantity is automatically deducted from inventory and recorded in cost reports so it shows in your accounts.",
        ],
        stepsAr: [
          'من "التسويات والهالك" سجّل أي كمية اتلفت أو ضاعت (هالك، تلف، عجز) بمنتج معين.',
          "حدد النوع (هالك، تسوية كمية، تصريح إتلاف) والسبب والكمية.",
          "الكمية دي بتتخصم من المخزون تلقائيًا وبتتسجل في تقارير التكلفة عشان تبان في حساباتك.",
        ],
      },
      {
        id: "reorder-items",
        icon: AlertTriangle,
        title: "Reorder Items",
        titleAr: "إعادة الطلب (Reorder Items)",
        steps: [
          'From "Reorder Items", the system shows you all items that have reached or are near their Low Stock Threshold.',
          "From the same screen, you can start a purchase order directly for these items without having to search for them manually.",
        ],
        stepsAr: [
          'من "إعادة الطلب" النظام بيوريك كل الأصناف اللي وصلت أو قربت من الحد الأدنى للمخزون (Low Stock Threshold).',
          "من نفس الشاشة تقدر تبدأ أمر شراء مباشرة للأصناف دي بدون ما تدور عليها يدويًا.",
        ],
      },
    ],
  },
  {
    id: "accounts-reports",
    title: "Accounts & Reports",
    titleAr: "الحسابات والتقارير",
    topics: [
      {
        id: "financial-overview",
        icon: DollarSign,
        title: "Financial Position (Overview)",
        titleAr: "المركز المالي (نظرة عامة)",
        steps: [
          '"Financial Hub" is the place that has everything related to accounting and inventory: Opening Balance, Physical Count, Settlements, Reorder, Cost Analysis, and Item Card.',
          "Use it as the daily starting point for the accountant to review all inventory movements and costs.",
        ],
        stepsAr: [
          '"المركز المالي" هو المكان اللي فيه كل حاجة تخص الحسابات والجرد: رصيد أول الفترة، الجرد الفعلي، التسويات، إعادة الطلب، تحليل التكلفة، وكارتة الصنف.',
          "استخدمه كنقطة البداية اليومية للمحاسب عشان يراجع كل حركة مخزون وتكلفة.",
        ],
      },
      {
        id: "pricing-management",
        icon: Tag,
        title: "Pricing Management",
        titleAr: "إدارة الأسعار",
        steps: [
          'From "Pricing Management", you can edit product prices in bulk or per specific customer category (Pricelist).',
          "You can create special pricelists (Pricelist) for wholesale customers, for example, with different prices from the regular price.",
        ],
        stepsAr: [
          'من "إدارة الأسعار" تقدر تعدّل أسعار المنتجات بشكل جماعي أو حسب فئة عملاء معينة (Pricelist).',
          "تقدر تنشئ قوائم أسعار خاصة (Pricelist) لعملاء الجملة مثلاً، بأسعار مختلفة عن السعر العادي.",
        ],
      },
      {
        id: "reports-analytics",
        icon: BarChart3,
        title: "Reports and Analytics",
        titleAr: "التقارير والتحليلات",
        steps: [
          'From "Reports & Analytics", you can see sales performance, best-selling products, and branch performance during any period you specify.',
          'From "Shift Reports", you can review details of any previous shift or old End-of-Day closing: who worked, how much, and the discounts that occurred.',
          '"Cost Analysis" and "Consumption Report" show you the actual cost of each product and how much was used of each raw material during a specific period.',
          '"Item Card" shows you the detailed history of a single item\'s movement: every entry and exit from inventory.',
        ],
        stepsAr: [
          'من "التقارير والتحليلات" تقدر تشوف أداء المبيعات، أكتر المنتجات مبيعًا، وأداء الفروع خلال أي فترة تحددها.',
          'من "تقارير الشفت" تقدر تراجع تفاصيل أي شفت سابق أو تقفيلة يوم قديمة: مين اشتغل، بكام، والخصومات اللي حصلت.',
          '"تحليل التكلفة" و"المستهلك" (Consumption Report) بيوريوك تكلفة كل منتج فعليًا وكام اتصرف من كل مادة خام خلال فترة معينة.',
          '"كارتة الصنف" (Item Card) بتوريك تاريخ حركة صنف واحد بالتفصيل: كل دخول وخروج له من المخزون.',
        ],
      },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    titleAr: "العملاء",
    topics: [
      {
        id: "customer-base",
        icon: Users,
        title: "Customer Base",
        titleAr: "قاعدة العملاء",
        steps: [
          'From "Customer Base", you can see all app customers, their data, and their order history.',
          "You can search for a specific customer by name or phone number.",
        ],
        stepsAr: [
          'من "قاعدة العملاء" تقدر تشوف كل عملاء الأبليكيشن وبياناتهم وسجل أوردراتهم.',
          "تقدر تبحث عن عميل معين بالاسم أو رقم التليفون.",
        ],
      },
      {
        id: "customer-ratings",
        icon: Star,
        title: "Customer Ratings",
        titleAr: "تقييمات العملاء",
        steps: [
          'From "Customer Ratings", you can see all ratings for completed orders (stars + comments).',
          "You can filter by number of stars or search by a specific customer's name.",
        ],
        stepsAr: [
          'من "تقييمات العملاء" تقدر تشوف كل تقييمات الأوردرات المكتملة (النجوم + التعليقات).',
          "تقدر تفلتر حسب عدد النجوم أو تدور باسم عميل معين.",
        ],
      },
    ],
  },
];
