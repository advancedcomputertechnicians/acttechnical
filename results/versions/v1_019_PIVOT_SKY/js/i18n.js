const translations = {
    en: {
        nav_services: "SERVICES",
        nav_philosophy: "PHILOSOPHY",
        nav_contact: "CONTACT",
        hero_title: "pioneering <br>technical excellence",
        hero_subtitle: "Engineering next-generation AI platforms, cloud infrastructure, and strategic digital solutions.",
        hero_cta: "Explore Ecosystem",
        section_services: "core technical domains",
        service_1_title: "Web & App Development",
        service_1_desc: "Professional engineering for any technical terrain. We build the complex systems while you focus on your business.",
        service_2_title: "AI Architectural Synthesis",
        service_2_desc: "We architect the custom AI layers so you don't have to.",
        service_3_title: "Forensic Investigation",
        service_3_desc: "Deep-dive digital forensics and data recovery. Protecting your assets with advanced investigative tools.",
        section_philosophy: "our strategic goal",
        philosophy_text: '"We strive to be the definitive all-in-one solution for technical innovation. From hardware architecture to autonomous software, we catalyze digital transformation for businesses that refuse to compromise."',
        sub_workstations: "Workstations",
        sub_workstations_desc: "Specialized performance builds for engineers and creators.",
        sub_consulting: "Consulting",
        sub_consulting_desc: "High-level technical project management and strategic audit.",
        section_contact: "get in <br>touch",
        contact_prompt: "Ready to escalate your technical infrastructure? Contact our specialists for a deep-dive consultation.",
        label_name: "Full Name",
        label_email: "Email Address",
        label_phone: "Phone Number",
        label_brief: "Project Brief",
        btn_transmit: "Transmit Inquiry",
        footer_text: "pioneering technical excellence"
    },
    es: {
        nav_services: "SERVICIOS",
        nav_philosophy: "FILOSOFÍA",
        nav_contact: "CONTACTO",
        hero_title: "pioneros en <br>excelencia técnica",
        hero_subtitle: "Ingeniería de plataformas de IA, infraestructura en la nube y soluciones digitales estratégicas.",
        hero_cta: "Explorar Ecosistema",
        section_services: "dominios técnicos básicos",
        service_1_title: "Desarrollo Web y Apps",
        service_1_desc: "Ingeniería profesional para cualquier terreno técnico. Construimos sistemas complejos.",
        service_2_title: "Síntesis de IA",
        service_2_desc: "Diseñamos las capas de IA personalizadas para que usted no tenga que hacerlo.",
        service_3_title: "Forense Digital",
        service_3_desc: "Investigación digital profunda y recuperación de datos.",
        section_philosophy: "nuestra meta estratégica",
        philosophy_text: '"Nos esforzamos por ser la solución definitiva todo en uno para la innovación técnica."',
        sub_workstations: "Estaciones",
        sub_workstations_desc: "Equipos de alto rendimiento para ingenieros.",
        sub_consulting: "Consultoría",
        sub_consulting_desc: "Gestión técnica de alto nivel.",
        section_contact: "póngase en <br>contacto",
        contact_prompt: "¿Listo para escalar? Contacte a nuestros especialistas.",
        label_name: "Nombre Completo",
        label_email: "Correo Electrónico",
        label_phone: "Número de Teléfono",
        label_brief: "Detalles del Proyecto",
        btn_transmit: "Enviar Consulta",
        footer_text: "pioneros en excelencia técnica"
    },
    zh: {
        nav_services: "技术服务",
        nav_philosophy: "企业理念",
        nav_contact: "联系我们",
        hero_title: "开创<br>技术卓越",
        hero_subtitle: "构建下一代人工智能平台、云基础设施和战略数字解决方案。",
        hero_cta: "探索生态系统",
        section_services: "核心技术领域",
        service_1_title: "Web 与应用开发",
        service_1_desc: "适用于任何技术领域的专业工程。我们构建复杂系统，让您专注于业务。",
        service_2_title: "AI 架构综合",
        service_2_desc: "我们架构自定义 AI 层，让您无需动手。",
        service_3_title: "取证调查",
        service_3_desc: "深度数字取证与数据 recovery。使用先进工具保护您的资产。",
        section_philosophy: "战略目标",
        philosophy_text: '“我们致力于成为技术创新的终端全方位解决方案。从硬件架构到自主软件，我们为企业实现数字化转型。”',
        sub_workstations: "工作站",
        sub_workstations_desc: "专为工程师和创作者设计的高性能构建。",
        sub_consulting: "咨询服务",
        sub_consulting_desc: "高水平技术项目管理与战略审计。",
        section_contact: "取得联系",
        contact_prompt: "准备好提升您的技术基础设施了吗？联系我们的专家进行深入咨询。",
        label_name: "姓名",
        label_email: "电子邮件地址",
        label_phone: "电话号码",
        label_brief: "项目简报",
        btn_transmit: "发送咨询",
        footer_text: "开创技术卓越"
    },
    fr: {
        nav_services: "SERVICES",
        nav_philosophy: "PHILOSOPHIE",
        nav_contact: "CONTACT",
        hero_title: "l'excellence <br>technique pionnière",
        hero_subtitle: "Ingénierie de plateformes d'IA, infrastructure cloud et solutions numériques stratégiques.",
        hero_cta: "Explorer l'Écosystème",
        section_services: "domaines techniques clés",
        service_1_title: "Développement Web & App",
        service_1_desc: "Ingénierie professionnelle pour tout terrain technique. Nous bâtissons les systèmes complexes.",
        service_2_title: "Synthèse d'IA",
        service_2_desc: "Nous concevons les couches d'IA personnalisées pour vous.",
        service_3_title: "Enquête Forensique",
        service_3_desc: "Cyber-investigation et récupération de données de haut niveau.",
        section_philosophy: "notre objectif",
        philosophy_text: '"Nous aspirons à être la solution technique tout-en-un définitive. De l\'architecture réseau au logiciel autonome."',
        sub_workstations: "Stations",
        sub_workstations_desc: "Performance spécialisée pour ingénieurs et créateurs.",
        sub_consulting: "Consultance",
        sub_consulting_desc: "Gestion de projet technique de haut niveau.",
        section_contact: "contactez <br>nous",
        contact_prompt: "Prêt à transformer votre infrastructure ? Contactez nos spécialistes.",
        label_name: "Nom Complet",
        label_email: "Adresse E-mail",
        label_phone: "Numéro de Téléphone",
        label_brief: "Résumé du Projet",
        btn_transmit: "Envoyer l'Enquête",
        footer_text: "excellence technique pionnière"
    }
};

class I18nManager {
    constructor() {
        // v1.016: "The Boss" Logic - localStorage is absolute priority
        const saved = localStorage.getItem('act_lang');
        this.lang = saved && translations[saved] ? saved : this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        const navLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        
        // System defaults - only used if no manual selection exists
        if (navLang.startsWith('zh')) return 'zh';
        if (navLang.startsWith('es')) return 'es';
        if (navLang.startsWith('fr')) return 'fr';
        
        return 'en';
    }

    init() {
        this.updateDOM();
        document.addEventListener('DOMContentLoaded', () => this.updateDOM());
        setTimeout(() => this.updateDOM(), 150);
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.lang = lang;
            localStorage.setItem('act_lang', lang);
            this.updateDOM();
            const menu = document.getElementById('lang-menu');
            if (menu) menu.classList.add('hidden');
        }
    }

    toggleMenu() {
        const menu = document.getElementById('lang-menu');
        if (menu) menu.classList.toggle('hidden');
    }

    updateDOM() {
        const dict = translations[this.lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerHTML = dict[key];
            }
        });
        document.documentElement.lang = this.lang;
    }
}

window.i18n = new I18nManager();
