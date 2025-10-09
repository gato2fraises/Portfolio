class GSAPAnimationManager {
    constructor() {
        this.isGSAPLoaded = false;
        this.animations = new Map();
        this.timelines = new Map();
        this.scrollTriggers = [];
        this.pageTransitionActive = false;
        
        this.loadGSAP();
    }

    async loadGSAP() {
        try {
            // Charger GSAP depuis CDN
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js');
            
            // Enregistrer les plugins
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
            
            this.isGSAPLoaded = true;
            console.log('GSAP chargé avec succès');
            
            // Initialiser les animations
            this.init();
            
        } catch (error) {
            console.error('Erreur chargement GSAP:', error);
            this.setupFallbackAnimations();
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    init() {
        this.setupPageLoadAnimation();
        this.setupScrollAnimations();
        this.setupMicroInteractions();
        this.setupPageTransitions();
        this.setupLoadingAnimations();
        this.setupComplexTimelines();
        
        // Event listeners
        this.setupEventListeners();
        
        console.log('Animations GSAP initialisées');
    }

    setupPageLoadAnimation() {
        // Animation de chargement de page
        const loadingTimeline = gsap.timeline();
        
        // Masquer tous les éléments initialement
        gsap.set('.animate-on-load', { opacity: 0, y: 50 });
        gsap.set('.hero-title', { opacity: 0, scale: 0.8 });
        gsap.set('.nav-item', { opacity: 0, x: -30 });
        
        loadingTimeline
            .to('.page-loader', {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    const loader = document.querySelector('.page-loader');
                    if (loader) loader.style.display = 'none';
                }
            })
            .to('.hero-title', {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.3')
            .to('.nav-item', {
                opacity: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }, '-=0.5')
            .to('.animate-on-load', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power2.out'
            }, '-=0.3');
            
        this.timelines.set('pageLoad', loadingTimeline);
    }

    setupScrollAnimations() {
        // Animation des sections au scroll
        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section, index) => {
            const elements = section.querySelectorAll('.animate-on-scroll');
            
            if (elements.length > 0) {
                gsap.fromTo(elements, 
                    {
                        opacity: 0,
                        y: 60,
                        scale: 0.95
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            end: 'bottom 20%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            }
        });

        // Animation parallaxe
        this.setupParallaxEffects();
        
        // Animation de progression de scroll
        this.setupScrollProgress();
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            
            gsap.to(element, {
                yPercent: -50 * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    setupScrollProgress() {
        // Barre de progression de scroll
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            gsap.to(progressBar, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            });
        }
    }

    setupMicroInteractions() {
        // Boutons avec effet hover avancé
        const buttons = document.querySelectorAll('.btn, .button, button');
        
        buttons.forEach(button => {
            const hoverTimeline = gsap.timeline({ paused: true });
            
            hoverTimeline
                .to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                })
                .to(button.querySelector('.btn-bg') || button, {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    duration: 0.3,
                    ease: 'power2.out'
                }, 0);
            
            button.addEventListener('mouseenter', () => {
                hoverTimeline.play();
            });
            
            button.addEventListener('mouseleave', () => {
                hoverTimeline.reverse();
            });
        });

        // Cards avec effet 3D
        this.setupCardEffects();
        
        // Navigation avec effet de vague
        this.setupNavEffects();
    }

    setupCardEffects() {
        const cards = document.querySelectorAll('.card, .project-card, .skill-card');
        
        cards.forEach(card => {
            // Effet de levitation
            gsap.set(card, { transformPerspective: 1000 });
            
            card.addEventListener('mouseenter', (e) => {
                gsap.to(card, {
                    y: -10,
                    rotationX: 5,
                    rotationY: 5,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    rotationX: 0,
                    rotationY: 0,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            
            // Effet de suivie de souris
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    setupNavEffects() {
        const navItems = document.querySelectorAll('.nav-item, .navbar a');
        
        navItems.forEach(item => {
            const underline = document.createElement('div');
            underline.className = 'nav-underline';
            underline.style.cssText = `
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transform: scaleX(0);
                transform-origin: left;
            `;
            
            if (item.style.position !== 'absolute' && item.style.position !== 'fixed') {
                item.style.position = 'relative';
            }
            item.appendChild(underline);
            
            const underlineTimeline = gsap.timeline({ paused: true });
            underlineTimeline.to(underline, {
                scaleX: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            item.addEventListener('mouseenter', () => {
                underlineTimeline.play();
            });
            
            item.addEventListener('mouseleave', () => {
                underlineTimeline.reverse();
            });
        });
    }

    setupPageTransitions() {
        // Transition entre les pages
        const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href$=".html"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                    e.preventDefault();
                    this.pageTransition(href);
                }
            });
        });
    }

    pageTransition(url) {
        if (this.pageTransitionActive) return;
        this.pageTransitionActive = true;
        
        const transitionElement = document.createElement('div');
        transitionElement.className = 'page-transition';
        transitionElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            transform: translateX(-100%);
        `;
        document.body.appendChild(transitionElement);
        
        const transitionTimeline = gsap.timeline();
        
        transitionTimeline
            .to(transitionElement, {
                translateX: 0,
                duration: 0.6,
                ease: 'power2.inOut'
            })
            .to('.main-content', {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.3')
            .call(() => {
                window.location.href = url;
            });
    }

    setupLoadingAnimations() {
        // Animations de chargement personnalisées
        this.createLoadingSpinner();
        this.createSkeletonLoaders();
    }

    createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'gsap-spinner';
        spinner.innerHTML = `
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
        `;
        
        // Animation du spinner
        gsap.to('.spinner-ring', {
            rotation: 360,
            duration: 2,
            ease: 'none',
            repeat: -1,
            stagger: 0.3
        });
    }

    createSkeletonLoaders() {
        const skeletons = document.querySelectorAll('.skeleton');
        
        skeletons.forEach(skeleton => {
            gsap.to(skeleton, {
                opacity: 0.5,
                duration: 1,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true
            });
        });
    }

    setupComplexTimelines() {
        // Timeline complexe pour la section héro
        this.createHeroTimeline();
        
        // Timeline pour les compétences
        this.createSkillsTimeline();
        
        // Timeline pour les projets
        this.createProjectsTimeline();
    }

    createHeroTimeline() {
        const heroTimeline = gsap.timeline({ paused: true });
        
        heroTimeline
            .from('.hero-background', {
                scale: 1.2,
                duration: 2,
                ease: 'power2.out'
            })
            .from('.hero-title', {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=1.5')
            .from('.hero-subtitle', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.5')
            .from('.hero-buttons', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');
            
        this.timelines.set('hero', heroTimeline);
        
        // Jouer la timeline au scroll
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top 80%',
            onEnter: () => heroTimeline.play()
        });
    }

    createSkillsTimeline() {
        const skills = document.querySelectorAll('.skill-item');
        
        skills.forEach((skill, index) => {
            const progressBar = skill.querySelector('.skill-progress');
            const percentage = progressBar ? progressBar.dataset.percent || 0 : 0;
            
            gsap.fromTo(progressBar,
                { width: '0%' },
                {
                    width: `${percentage}%`,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: skill,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    }

    createProjectsTimeline() {
        const projects = document.querySelectorAll('.project-item');
        
        if (projects.length > 0) {
            const projectsTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '.projects-section',
                    start: 'top 60%',
                    end: 'bottom 40%',
                    toggleActions: 'play none none reverse'
                }
            });
            
            projectsTimeline.from(projects, {
                y: 80,
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            });
            
            this.timelines.set('projects', projectsTimeline);
        }
    }

    setupEventListeners() {
        // Pause/resume animations selon la visibilité
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllAnimations();
            } else {
                this.resumeAllAnimations();
            }
        });
        
        // Optimisation des performances
        this.setupPerformanceOptimization();
    }

    setupPerformanceOptimization() {
        // Réduire les animations sur les appareils faibles
        if (this.isLowPerformanceDevice()) {
            gsap.globalTimeline.timeScale(0.7);
            ScrollTrigger.config({ limitCallbacks: true });
        }
        
        // Pause des animations hors de la viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const animation = this.animations.get(entry.target);
                if (animation) {
                    if (entry.isIntersecting) {
                        animation.play();
                    } else {
                        animation.pause();
                    }
                }
            });
        });
        
        document.querySelectorAll('.animate').forEach(el => {
            observer.observe(el);
        });
    }

    isLowPerformanceDevice() {
        // Détection simple des appareils faibles
        return navigator.hardwareConcurrency <= 4 || 
               navigator.deviceMemory <= 4 ||
               /Android.*4\.|iPhone.*OS\s[5-9]_/.test(navigator.userAgent);
    }

    // Méthodes publiques de contrôle
    pauseAllAnimations() {
        gsap.globalTimeline.pause();
        this.timelines.forEach(timeline => timeline.pause());
    }

    resumeAllAnimations() {
        gsap.globalTimeline.resume();
        this.timelines.forEach(timeline => timeline.resume());
    }

    playTimeline(name) {
        const timeline = this.timelines.get(name);
        if (timeline) {
            timeline.play();
        }
    }

    pauseTimeline(name) {
        const timeline = this.timelines.get(name);
        if (timeline) {
            timeline.pause();
        }
    }

    // Animations personnalisées on-demand
    animateElement(element, options = {}) {
        const defaultOptions = {
            duration: 1,
            ease: 'power2.out',
            opacity: 1,
            y: 0
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        return gsap.to(element, finalOptions);
    }

    createCustomTimeline(elements, options = {}) {
        const timeline = gsap.timeline(options);
        const id = `custom_${Date.now()}`;
        
        this.timelines.set(id, timeline);
        
        return {
            timeline,
            id,
            destroy: () => {
                timeline.kill();
                this.timelines.delete(id);
            }
        };
    }

    // Cleanup et destruction
    destroy() {
        // Arrêter toutes les animations
        this.pauseAllAnimations();
        
        // Nettoyer les ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        // Nettoyer les timelines
        this.timelines.forEach(timeline => timeline.kill());
        this.timelines.clear();
        
        // Nettoyer les animations individuelles
        this.animations.forEach(animation => animation.kill());
        this.animations.clear();
        
        console.log('Animations GSAP nettoyées');
    }

    setupFallbackAnimations() {
        // Animations CSS de base si GSAP ne charge pas
        console.log('Utilisation des animations CSS de fallback');
        
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-load {
                animation: fadeInUp 0.8s ease forwards;
            }
            
            .animate-on-scroll {
                animation: fadeInUp 0.6s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.gsapManager = new GSAPAnimationManager();
    
    // Exposer les méthodes pour le contrôle manuel
    window.playAnimation = (name) => window.gsapManager.playTimeline(name);
    window.pauseAnimation = (name) => window.gsapManager.pauseTimeline(name);
    window.animateElement = (element, options) => window.gsapManager.animateElement(element, options);
    
    console.log('GSAP Animation Manager initialisé');
});