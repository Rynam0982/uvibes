"use client";

import { useEffect, useState, useRef } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ks-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("ks-theme", next ? "dark" : "light");
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label="Changer le thème"
      title={dark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb">{dark ? "☀️" : "🌙"}</span>
      </span>
    </button>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar__inner">
          <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <div className="navbar__logo-icon"><span>💡</span></div>
            <span>KnowledgeShare</span>
          </a>

          <ul className="navbar__nav">
            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollTo("features"); }}>Fonctionnalités</a></li>
            <li><a href="#mockups" onClick={(e) => { e.preventDefault(); scrollTo("mockups"); }}>Application</a></li>
            <li><a href="#stats" onClick={(e) => { e.preventDefault(); scrollTo("stats"); }}>Chiffres clés</a></li>
            <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollTo("testimonials"); }}>Témoignages</a></li>
          </ul>

          <div className="navbar__cta">
            <button className="btn btn-outline" style={{ padding: "10px 22px", fontSize: "0.88rem" }} onClick={() => scrollTo("contact")}>
              Nous contacter
            </button>
            <button className="btn btn-primary" style={{ padding: "10px 22px", fontSize: "0.88rem" }} onClick={() => scrollTo("contact")}>
              Demander une démo
            </button>
          </div>

          <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen}>
            <span style={{ transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }}></span>
            <span style={{ opacity: mobileOpen ? 0 : 1 }}></span>
            <span style={{ transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }}></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? " mobile-menu--open" : ""}`}>
        <a href="#features" onClick={() => scrollTo("features")}>Fonctionnalités</a>
        <a href="#mockups" onClick={() => scrollTo("mockups")}>Mockups</a>
        <a href="#stats" onClick={() => scrollTo("stats")}>Chiffres</a>
        <a href="#testimonials" onClick={() => scrollTo("testimonials")}>Avis</a>
        <button className="btn btn-outline" onClick={() => setMobileOpen(false)}>Nous contacter</button>
        <button className="btn btn-primary" onClick={() => setMobileOpen(false)}>Demander une démo</button>
      </div>
    </>
  );
}

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const num = parseFloat(target);
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(e * num);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatItem({ icon, value, suffix, label, accent, delay }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(value, 2000, started);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const display = () => {
    if (value >= 1000) return `${Math.round(count / 1000)}k`;
    if (Number.isInteger(value)) return Math.round(count).toString();
    return count.toFixed(1);
  };

  return (
    <div className="stat-item" ref={ref} style={{ animationDelay: `${delay}s` }}>
      <span className="stat-item__icon">{icon}</span>
      <div className={`stat-item__value${accent ? " stat-item__value--accent" : ""}`}>
        {display()}{suffix}
      </div>
      <div className="stat-item__label">{label}</div>
    </div>
  );
}

function useAnimations() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-anim]"));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.dataset.delay || 0);
            setTimeout(() => el.classList.add("anim-in"), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    
    
    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          els.forEach((el) => obs.observe(el));
        });
      });
    }, 700);

    return () => obs.disconnect();
  }, []);
}

const MOCKUPS = [
  {
    src: "/mockup-1.png",
    color: "#fd6e00",
    title: "Vers l'objectif",
    sub: "Atteignez vos objectifs collectifs grâce au partage et à la valorisation des savoirs.",
  },
  {
    src: "/mockup-2.png",
    color: "#10B981",
    title: "Planification quotidienne",
    sub: "Organisez vos apprentissages et planifiez votre journée avec des outils intégrés.",
  },
  {
    src: "/mockup-3.png",
    color: "#d90a5c",
    title: "Échanges & Partage",
    sub: "Favorisez les interactions humaines et la transmission naturelle des savoirs.",
  },
  {
    src: "/mockup-4.png",
    color: "#ff8c33",
    title: "Surmonter les obstacles",
    sub: "Identifiez les comportements qui bloquent la productivité et guidez vos équipes.",
  },
];

function MockupSlider() {
  const DURATION = 3800;
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        setActive((p) => (p + 1) % MOCKUPS.length);
        setProgress(0);
        startRef.current = Date.now();
      }
    }, 30);
    return () => clearInterval(tick);
  }, []);

  const goTo = (i) => { setActive(i); setProgress(0); startRef.current = Date.now(); };

  const slot = (i) => {
    const len = MOCKUPS.length;
    const diff = ((i - active) % len + len) % len;
    if (diff === 0) return "slot-center";
    if (diff === 1) return "slot-right";
    if (diff === len - 1) return "slot-left";
    return "slot-hidden";
  };

  return (
    <section className="section-ms" id="mockups">
      <div className="ms__blob ms__blob--1" />
      <div className="ms__blob ms__blob--2" />

      <div className="container">
        <div className="section-header" data-anim="up">
          <span className="section-tag">L&apos;application</span>
          <h2 className="section-title">
            Une expérience{" "}
            <span className="gradient-text">pensée pour vous</span>
          </h2>
          <p className="section-subtitle">
            Découvrez les écrans de notre plateforme — simple, intuitive
            et conçue pour le quotidien de vos équipes.
          </p>
        </div>

        <div className="ms__track-wrap">
          <div className="ms__track">
            {MOCKUPS.map((m, i) => (
              <div
                key={i}
                className={`ms__card ${slot(i)}`}
                onClick={() => goTo(i)}
                style={{ "--card-glow": m.color }}
              >
                <img src={m.src} alt={m.title} className="ms__card-img" draggable={false} />
                {slot(i) === "slot-center" && (
                  <div className="ms__card-caption" key={active}>
                    <span className="ms__caption-title">{m.title}</span>
                    <span className="ms__caption-sub">{m.sub}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ms__controls">
          <div className="ms__dots">
            {MOCKUPS.map((m, i) => (
              <button
                key={i}
                className={`ms__dot${i === active ? " ms__dot--active" : ""}`}
                style={{ "--dot-c": m.color }}
                onClick={() => goTo(i)}
                aria-label={m.title}
              />
            ))}
          </div>
          <div className="ms__prog-track">
            <div className="ms__prog-fill" style={{ width: `${progress}%`, background: MOCKUPS[active].color }} />
          </div>
        </div>

        <div className="ms__label-row">
          {MOCKUPS.map((m, i) => (
            <button
              key={i}
              className={`ms__label${i === active ? " ms__label--active" : ""}`}
              style={{ "--lc": m.color }}
              onClick={() => goTo(i)}
            >
              <span className="ms__label-dot" />
              {m.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useAnimations();

  return (
    <>
      <Navbar />

      
      <section className="hero">
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
        <div className="hero__blob hero__blob--3" />
        <div className="hero__grid" />

        <div className="container">
          <div className="hero__inner">
            <div className="hero__content">
              <div className="hero__badge" data-anim="up">
                <span className="hero__badge-dot" />
                Nouveau · Plateforme B2B SaaS
              </div>

              <h1 className="hero__title" data-anim="up" data-delay="80">
                Transformez{" "}
                <em>l&apos;expérience collaborateur</em>
                {" "}grâce au partage de connaissances
              </h1>

              <p className="hero__subtitle" data-anim="up" data-delay="160">
                Une plateforme simple pour permettre à vos équipes d&apos;échanger conseils,
                bonnes pratiques et retours d&apos;expérience au quotidien.
              </p>

              <div className="hero__actions" data-anim="up" data-delay="240">
                <button className="btn btn-primary btn-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Demander une démo
                </button>
                <button className="btn btn-outline">Nous contacter</button>
              </div>

              <div className="hero__trust" data-anim="up" data-delay="320">
                <div className="hero__trust-avatars">
                  <div className="hero__trust-avatar">DR</div>
                  <div className="hero__trust-avatar">ML</div>
                  <div className="hero__trust-avatar">AS</div>
                  <div className="hero__trust-avatar">+</div>
                </div>
                <div className="hero__trust-text">
                  Rejoignez <strong>50 000+</strong> utilisateurs qui nous font confiance
                </div>
              </div>
            </div>

            <div className="hero__visual" data-anim="right" data-delay="100">
              <div className="hero__float-card hero__float-card--1">
                <div className="float-card__icon float-card__icon--green"><span>📈</span></div>
                <div>
                  <div className="float-card__label">Gain de productivité</div>
                  <div className="float-card__value">+35%</div>
                </div>
              </div>

              <div className="hero__image-wrap">
                <div className="hero__image-inner">
                  <img src="/5231.jpg" alt="Équipes collaborant sur la plateforme" />
                  <div className="hero__image-overlay" />
                </div>
              </div>

              <div className="hero__float-card hero__float-card--2">
                <div className="float-card__icon float-card__icon--orange"><span>⭐</span></div>
                <div>
                  <div className="float-card__label">Satisfaction utilisateur</div>
                  <div className="float-card__value">4.8 / 5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-wave" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" style={{ fill: "var(--wave-1, #fdf6f0)" }} />
          </svg>
        </div>
      </section>

      
      <section className="section-problem" id="problem">
        <div className="container">
          <div className="section-header" data-anim="up">
            <span className="section-tag">Le problème</span>
            <h2 className="section-title">
              Aujourd&apos;hui, les connaissances restent{" "}
              <span className="gradient-text">bloquées</span>
            </h2>
            <p className="section-subtitle">
              Vos équipes débordent de savoirs précieux mais ils restent inaccessibles,
              éparpillés dans des outils disparates.
            </p>
          </div>

          <div className="problem__grid">
            {[
              {
                icon: "📧",
                title: "Dans les emails",
                desc: "Des centaines d'échanges critiques perdus dans des boîtes mail. Introuvables, non partageables, oubliés après quelques semaines."
              },
              {
                icon: "🗓️",
                title: "Dans les réunions",
                desc: "Les meilleures idées naissent en réunion... et disparaissent avec elle. Aucune trace, aucune transmission, aucune capitalisation."
              },
              {
                icon: "🧠",
                title: "Dans la tête des collaborateurs",
                desc: "Experts, anciens, managers : leurs connaissances repartent avec eux. Chaque départ est une perte irremplaçable pour l'organisation."
              },
            ].map((card, i) => (
              <div className="problem__card" key={i} data-anim="up" data-delay={i * 110}>
                <div className="problem__icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="problem__result" data-anim="scale" data-delay="100">
            <span className="problem__result-icon">⚡</span>
            <div>
              <h3>Résultat : perte de temps, frustration et manque d&apos;efficacité</h3>
              <p>
                Selon nos études, les collaborateurs passent en moyenne{" "}
                <strong>2,5 heures par jour</strong> à chercher des informations déjà
                disponibles quelque part dans l&apos;organisation. C&apos;est du temps précieux
                et de l&apos;énergie gaspillée à chaque instant.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="section-solution" id="solution">
        <div className="container">
          <div className="solution__grid">
            <div className="solution__image-stack" data-anim="left">
              <img src="/3512711.jpg" alt="Lorem ipsum dolor" className="solution__img-main" />
              <img src="/5231.jpg" alt="Dolor sit amet" className="solution__img-secondary" />
              <div className="solution__badge-float">💡</div>
            </div>

            <div className="solution__content" data-anim="right" data-delay="80">
              <span className="section-tag">La solution</span>
              <h2 className="section-title" style={{ textAlign: "left" }}>
                Notre plateforme libère{" "}
                <span className="gradient-text">l&apos;intelligence collective</span>
              </h2>
              <p style={{ color: "var(--gray-500)", lineHeight: 1.7, fontSize: "0.98rem" }}>
                KnowledgeShare centralise les savoirs de vos équipes et les rend accessibles
                à toute l&apos;organisation, au bon moment et pour la bonne personne.
              </p>

              <div className="solution__items">
                {[
                  {
                    icon: "💬",
                    title: "Poser des questions simplement",
                    desc: "En quelques secondes, obtenez l'aide de collègues experts grâce à un système de questions intuitif."
                  },
                  {
                    icon: "🎯",
                    title: "Partager des conseils utiles",
                    desc: "Publiez vos retours d'expérience et bonnes pratiques pour en faire bénéficier toute votre organisation."
                  },
                  {
                    icon: "🏆",
                    title: "Valoriser les experts internes",
                    desc: "Identifiez et mettez en lumière les talents cachés de votre entreprise grâce aux profils d'expertise."
                  },
                ].map((item, i) => (
                  <div className="solution__item" key={i} data-anim="up" data-delay={i * 90}>
                    <div className="solution__item-icon">{item.icon}</div>
                    <div className="solution__item-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="section-features" id="features">
        <div className="container">
          <div className="section-header" data-anim="up">
            <span className="section-tag">Fonctionnalités</span>
            <h2 className="section-title">
              Tout ce dont vos équipes ont{" "}
              <span className="gradient-text">besoin</span>
            </h2>
            <p className="section-subtitle">
              Des outils pensés pour la réalité du terrain, simples à utiliser
              et puissants dans leurs résultats.
            </p>
          </div>

          <div className="features__grid">
            {[
              {
                num: "01",
                img: "/12309.jpg",
                title: "Fil de conseils",
                desc: "Publiez et consultez des conseils en temps réel. Un flux vivant, enrichi par toute l'organisation, accessible partout et à tout moment.",
              },
              {
                num: "02",
                img: "/3765686.jpg",
                title: "Recherche intelligente",
                desc: "Trouvez rapidement les réponses déjà partagées grâce à notre moteur de recherche sémantique. Plus jamais de question posée deux fois.",
              },
              {
                num: "03",
                img: "/3512711.jpg",
                title: "Profils experts",
                desc: "Identifiez facilement les personnes ressources dans votre organisation. Chaque collaborateur a un profil qui valorise ses domaines d'expertise.",
              },
              {
                num: "04",
                img: "/5231.jpg",
                title: "Notifications ciblées",
                desc: "Recevez uniquement les contenus pertinents pour votre rôle et vos centres d'intérêt. Fini le bruit, vive la pertinence.",
              },
            ].map((feat, i) => (
              <div
                className="feature-card"
                key={i}
                data-anim={i % 2 === 0 ? "fly-left" : "fly-right"}
                data-delay={Math.floor(i / 2) * 120}
              >
                <div className="feature-card__image-wrap">
                  <img src={feat.img} alt={feat.title} className="feature-card__image" />
                </div>
                <div className="feature-card__content">
                  <div className="feature-card__number">{feat.num}</div>
                  <h3 className="feature-card__title">{feat.title}</h3>
                  <p className="feature-card__desc">{feat.desc}</p>
                  <div className="feature-card__arrow">
                    En savoir plus
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7H13M7 1L13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <MockupSlider />

      
      <section className="section-stats" id="stats">
        <div className="stats__blob stats__blob--1" />
        <div className="stats__blob stats__blob--2" />

        <div className="container stats__inner">
          <div className="section-header" data-anim="up" style={{ color: "white" }}>
            <span className="section-tag section-tag--white">Chiffres clés</span>
            <h2 className="section-title" style={{ color: "white" }}>
              Des résultats qui parlent{" "}
              <span className="gradient-text-warm">d&apos;eux-mêmes</span>
            </h2>
          </div>

          <div className="stats__grid">
            <StatItem icon="👥" value={50000} suffix="+" label="Utilisateurs actifs" delay={0.1} />
            <StatItem icon="🏢" value={120} suffix="" label="Entreprises clientes" delay={0.2} />
            <StatItem icon="⏱️" value={35} suffix="%" label="Gain de temps moyen" accent delay={0.3} />
            <StatItem icon="⭐" value={4.8} suffix="/5" label="Satisfaction utilisateur" accent delay={0.4} />
          </div>
        </div>

        <div className="divider-wave" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,20 C480,60 960,0 1440,30 L1440,60 L0,60 Z" style={{ fill: "var(--wave-2, #fdf6f0)" }} />
          </svg>
        </div>
      </section>

      
      <section className="section-partners">
        <div className="container">
          <p className="partners__label" data-anim="up">Ils nous font confiance</p>
          <div className="partners__logos" data-anim="up" data-delay="100">
            <div className="partners__track">
              {[
                { icon: "🏦", name: "BNP Paribas" },
                { icon: "✈️", name: "Air France" },
                { icon: "🛒", name: "Carrefour" },
                { icon: "💊", name: "Sanofi" },
                { icon: "🚂", name: "SNCF" },
                { icon: "🔋", name: "TotalEnergies" },
                { icon: "📡", name: "Orange" },
                { icon: "🏗️", name: "Vinci" },
                { icon: "💡", name: "EDF" },
                { icon: "🌍", name: "Michelin" },
                { icon: "🛡️", name: "Axa" },
                { icon: "🚀", name: "Doctolib" },
                { icon: "🏦", name: "BNP Paribas" },
                { icon: "✈️", name: "Air France" },
                { icon: "🛒", name: "Carrefour" },
                { icon: "💊", name: "Sanofi" },
                { icon: "🚂", name: "SNCF" },
                { icon: "🔋", name: "TotalEnergies" },
                { icon: "📡", name: "Orange" },
                { icon: "🏗️", name: "Vinci" },
                { icon: "💡", name: "EDF" },
                { icon: "🌍", name: "Michelin" },
                { icon: "🛡️", name: "Axa" },
                { icon: "🚀", name: "Doctolib" },
              ].map((p, i) => (
                <div className="partner-logo" key={i}>
                  <span className="partner-logo__icon">{p.icon}</span>
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      <section className="section-testimonials" id="testimonials">
        <div className="container">
          <div className="section-header" data-anim="up">
            <span className="section-tag">Témoignages</span>
            <h2 className="section-title">
              Ils parlent de{" "}
              <span className="gradient-text">nous</span>
            </h2>
            <p className="section-subtitle">
              Des leaders RH, managers et équipes terrain qui ont transformé
              leur façon de travailler avec KnowledgeShare.
            </p>
          </div>

          <div className="testimonials__grid">
            <div className="testimonial-card testimonial-card--big" data-anim="fly-left">
              <div className="testimonial__image-side">
                <img src="/3512711.jpg" alt="Témoignage client KnowledgeShare" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="testimonial__content-side">
                <div className="testimonial__stars">⭐⭐⭐⭐⭐</div>
                <p className="testimonial__quote">
                  &ldquo;Avant, on perdait énormément d&apos;informations. Chaque départ d&apos;un
                  collaborateur emportait des mois de savoir accumulé. Aujourd&apos;hui, tout est
                  centralisé et accessible — c&apos;est une transformation profonde de notre culture
                  d&apos;entreprise.&rdquo;
                </p>
                <div className="testimonial__author">
                  <div className="testimonial__avatar-placeholder" style={{ background: "linear-gradient(135deg,#fd6e00,#d90a5c)" }}>MH</div>
                  <div>
                    <div className="testimonial__author-name">Marie Hubert</div>
                    <div className="testimonial__author-role">DRH, Grande entreprise cliente</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-card testimonial-card--featured" data-anim="fly-right" data-delay="80">
              <div className="testimonial__stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial__quote">
                &ldquo;Une solution qui transforme la collaboration en entreprise. Nos équipes
                communiquent mieux, apprennent plus vite et se sentent valorisées.&rdquo;
              </p>
              <div className="testimonial__author">
                <div className="testimonial__avatar-placeholder" style={{ background: "rgba(255,255,255,0.2)" }}>JD</div>
                <div>
                  <div className="testimonial__author-name">Jean Dupont</div>
                  <div className="testimonial__author-role">CEO, Scale-up tech</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-anim="fly-left" data-delay="160">
              <div className="testimonial__stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial__quote">
                &ldquo;Un outil simple mais redoutablement efficace. L&apos;adoption a été immédiate
                — même nos collaborateurs les moins technophiles l&apos;utilisent au quotidien.&rdquo;
              </p>
              <div className="testimonial__author">
                <div className="testimonial__avatar-placeholder" style={{ background: "linear-gradient(135deg,#059669,#10B981)" }}>SB</div>
                <div>
                  <div className="testimonial__author-name">Sophie Bernard</div>
                  <div className="testimonial__author-role">Directrice RH, PME innovante</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card" data-anim="fly-right" data-delay="240">
              <div className="testimonial__stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial__quote">
                &ldquo;Le futur du knowledge sharing. On a essayé d&apos;autres solutions, aucune
                n&apos;avait cette fluidité et cette pertinence dans les recommandations.&rdquo;
              </p>
              <div className="testimonial__author">
                <div className="testimonial__avatar-placeholder" style={{ background: "linear-gradient(135deg,#F97316,#FBBF24)" }}>AM</div>
                <div>
                  <div className="testimonial__author-name">Alexandre Martin</div>
                  <div className="testimonial__author-role">CTO, Groupe industriel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="section-cta" id="contact">
        <div className="container">
          <div className="cta__inner" data-anim="scale">
            <div className="cta__blob cta__blob--1" />
            <div className="cta__blob cta__blob--2" />

            <div className="cta__content">
              <span className="section-tag section-tag--white">Prêt à commencer ?</span>
              <h2 className="cta__title">
                Prêt à transformer{" "}
                <span className="gradient-text-warm">votre entreprise</span>
                {" "}?
              </h2>
              <p className="cta__subtitle">
                Rejoignez 120 entreprises qui ont déjà fait confiance à KnowledgeShare
                pour libérer le potentiel de leurs équipes.
              </p>
              <div className="cta__actions">
                <button className="btn btn-accent btn-lg">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Demander une démo
                </button>
                <button className="btn btn-outline btn-lg">Nous contacter</button>
              </div>
              <div className="cta__features">
                {["Démo personnalisée gratuite", "Mise en place en 48h", "Support dédié inclus", "Sans engagement"].map((f, i) => (
                  <div className="cta__feature" key={i}>
                    <div className="cta__feature-check">✓</div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-icon">💡</div>
                KnowledgeShare
              </div>
              <p className="footer__desc">
                La plateforme de partage de connaissances pensée pour les entreprises
                modernes et leurs équipes ambitieuses.
              </p>
              <div className="footer__social">
                <a href="#" className="footer__social-link">in</a>
                <a href="#" className="footer__social-link">𝕏</a>
                <a href="#" className="footer__social-link">gh</a>
                <a href="#" className="footer__social-link">yt</a>
              </div>
            </div>

            {[
              { title: "Produit", links: ["Fonctionnalités", "Tarifs", "Sécurité", "Roadmap", "Intégrations"] },
              { title: "Ressources", links: ["Blog", "Documentation", "Études de cas", "Webinaires", "API"] },
              { title: "Entreprise", links: ["À propos", "Carrières", "Partenaires", "Presse", "Contact"] },
            ].map((col, i) => (
              <div className="footer__col" key={i}>
                <h4>{col.title}</h4>
                <ul className="footer__links">
                  {col.links.map((l, j) => <li key={j}><a href="#">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer__bottom">
            <p className="footer__copy">© 2026 KnowledgeShare. Tous droits réservés.</p>
            <div className="footer__bottom-links">
              <a href="#">Confidentialité</a>
              <a href="#">CGU</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      
      <ThemeToggle />
    </>
  );
}
