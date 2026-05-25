/* =========================================
   MAGR├âO AUTO CENTER ÔÇö JavaScript Vanilla ES6
   IntersectionObserver | Valida├º├úo | Parallax
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // 1. NAVBAR SCROLL
  // =========================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function updateNavbar() {
    const y = window.scrollY || window.pageYOffset;
    if (y > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // =========================================
  // 2. MOBILE MENU (DRAWER PREMIUM)
  // =========================================
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    navDrawer?.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.classList.add('nav-open');
    navToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    navDrawer?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  navToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  navOverlay?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // =========================================
  // 3. INTERSECTION OBSERVER ÔÇö UTILS
  // =========================================
  const makeObserver = (selector, callback, options = {}) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          if (!options.keepAlive) observer.unobserve(entry.target);
        }
      });
    }, { threshold: options.threshold || 0.2, rootMargin: options.rootMargin || '0px' });

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  };

  // =========================================
  // 4. SERVIÇOS — stagger 120ms
  // =========================================
  const servicoCards = document.querySelectorAll('.servico-card-premium[data-animate]');
  servicoCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 70}ms`;
  });

  makeObserver('.servico-card-premium[data-animate]', (el) => {
    el.classList.add('is-visible');
  }, { threshold: 0.1 });

  // =========================================
  // 4b. GALERIA — stagger 80ms + animação lateral mobile
  // =========================================
  const galItems = document.querySelectorAll('.gal-item[data-animate]');
  galItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
  });

  makeObserver('[data-animate-section]', (el) => {
    el.classList.add('is-visible');
  }, { threshold: 0.15 });

  // =========================================
  // 5. DOR / SOLU├ç├âO ÔÇö stagger 60ms
  // =========================================
  const dsBlocks = document.querySelectorAll('.ds-block');
  dsBlocks.forEach((block, index) => {
    block.style.transitionDelay = `${index * 60}ms`;
  });

  makeObserver('.ds-block', (el) => {
    el.classList.add('is-visible');
  }, { threshold: 0.1 });

  // =========================================
  // 6. COUNTERS SOBRE ÔÇö 1800ms ease-in-out
  // =========================================
  const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  function animateCounter(el, duration = 1800) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeInOutQuad(progress);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  let countersTriggered = false;
  const countersSection = document.getElementById('counters');

  if (countersSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          countersSection.querySelectorAll('.counter-num').forEach((el, i) => {
            setTimeout(() => animateCounter(el), i * 150);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(countersSection);
  }

  // 7. PARALLAX REMOVIDO (Solicitado pelo usuário)
  // O efeito anterior causava movimento na imagem ao rolar a página.


  // =========================================
  // 8. FAQ ÔÇö comportamento acorde├úo exclusivo
  // =========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // =========================================
  // 9. FORMUL├üRIO ÔÇö valida├º├úo real
  // =========================================
  const form = document.getElementById('contatoForm');
  const nome = document.getElementById('nome');
  const telefone = document.getElementById('telefone');
  const servico = document.getElementById('servico');
  const mensagem = document.getElementById('mensagem');
  const formSuccess = document.getElementById('formSuccess');

  const telRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;

  function validateField(input, errorId, testFn) {
    const group = input.closest('.form-group');
    const error = document.getElementById(errorId);
    const valid = testFn(input.value.trim());
    group.classList.toggle('is-invalid', !valid);
    return valid;
  }

  function validateAll() {
    const v1 = validateField(nome, 'erroNome', v => v.length >= 2);
    const v2 = validateField(telefone, 'erroTelefone', v => telRegex.test(v));
    const v3 = validateField(servico, 'erroServico', v => v !== '');
    return v1 && v2 && v3;
  }

  [nome, telefone, servico].forEach(input => {
    input.addEventListener('blur', validateAll);
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group.classList.contains('is-invalid')) validateAll();
    });
  });

  // Mapa de servicos: value do select -> rotulo legivel para a mensagem
  const servicoLabels = {
    'alinhamento': 'Alinhamento 3D',
    'balanceamento': 'Balanceamento',
    'oleo': 'Troca de Óleo',
    'embreagem': 'Embreagem',
    'pneus': 'Pneus',
    'suspensao': 'Suspensão',
    'fluido': 'Fluido do Câmbio',
    'vans-bongos': 'Vans e Bongos',
    'outro': 'Outro'
  };

  // Numero oficial do WhatsApp da loja
  const WHATSAPP_NUMERO = '5521994198051';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const servicoLabel = servicoLabels[servico.value] || servico.value;
    const mensagemUsuario = mensagem.value.trim();

    const partes = [
      'Olá, Magrão Auto Center! Gostaria de solicitar um orçamento.',
      '',
      `Nome: ${nome.value.trim()}`,
      `Telefone: ${telefone.value.trim()}`,
      `Serviço: ${servicoLabel}`
    ];
    if (mensagemUsuario) {
      partes.push(`Detalhes: ${mensagemUsuario}`);
    }

    const texto = encodeURIComponent(partes.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Abrindo WhatsApp...';

    formSuccess.classList.add('is-visible');
    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Solicitar agendamento via WhatsApp';
      form.reset();
      setTimeout(() => formSuccess.classList.remove('is-visible'), 4000);
    }, 800);
  });

  // =========================================
  // 10. SCROLL REVEAL (Geral)
  // =========================================
  makeObserver('[data-animate]', (el) => {
    el.classList.add('is-visible');
  }, { threshold: 0.1 });

  // =========================================
  // 11. VÍDEOS INSTITUCIONAIS PREMIUM
  // =========================================
  // --- Galeria de Vídeos Premium (Accordion) ---
  const accordionCards = document.querySelectorAll('.video-accordion-card');
  
  accordionCards.forEach((card, index) => {
    const video = card.querySelector('.video-preview');
    
    // Define o primeiro como ativo por padrão
    if (index === 0) card.classList.add('active');

    // Play no hover (Desktop)
    card.addEventListener('mouseenter', () => {
      // Remove 'active' de outros e adiciona neste
      accordionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    });
    
    // Pause ao sair
    card.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
      }
    });

    // Abrir Lightbox ao clicar
    card.addEventListener('click', () => {
      const videoUrl = card.getAttribute('data-video-url');
      if (videoUrl) {
        openVideoLightboxPremium(videoUrl);
      }
    });
  });


  function openVideoLightboxPremium(url) {
    const lb = document.getElementById('lightbox');
    const content = lb?.querySelector('.lightbox-content');
    const closeBtn = lb?.querySelector('.lightbox-close');
    const caption = lb?.querySelector('.lightbox-caption');
    const prevBtn = lb?.querySelector('.lightbox-prev');
    const nextBtn = lb?.querySelector('.lightbox-next');

    if (!lb || !content) return;

    // Pausa outros vídeos
    document.querySelectorAll('video').forEach(v => v.pause());

    // Configura Lightbox para Vídeo
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (caption) caption.style.display = 'none';

    content.innerHTML = `
      <video src="${url}" controls autoplay class="lightbox-video-player"></video>
    `;

    lb.classList.add('active');
    /* PageSpeed fix: classList evita forced reflow vs body.style.overflow inline */
    document.body.classList.add('no-scroll');

    const handleClose = () => {
      lb.classList.remove('active');
      content.innerHTML = '';
      document.body.classList.remove('no-scroll');
      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (caption) caption.style.display = '';
      closeBtn?.removeEventListener('click', handleClose);
    };

    closeBtn?.addEventListener('click', handleClose);
    lb.querySelector('.lightbox-overlay')?.addEventListener('click', handleClose);
  }

  // =========================================
  // 12. HERO VIDEO RESTART AT 26S
  // =========================================
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.playbackRate = 0.85;
    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.playbackRate = 0.85;
    });

    // Força o início da reprodução (necessário em alguns navegadores)
    heroVideo.play().catch(() => {
      console.log("Autoplay aguardando interação...");
    });

    // Tentativa extra após 500ms
    setTimeout(() => {
      heroVideo.play().catch(() => {});
    }, 500);

    heroVideo.addEventListener('timeupdate', () => {
      if (heroVideo.currentTime >= 26) {
        heroVideo.currentTime = 0;
        heroVideo.play().catch(() => {});
      }
    });

    // Lógica do botão de som minimalista
    const muteBtn = document.getElementById('videoMuteBtn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        heroVideo.muted = !heroVideo.muted;
        const icon = muteBtn.querySelector('i');
        if (heroVideo.muted) {
          icon.className = 'fa-solid fa-volume-xmark';
          muteBtn.setAttribute('aria-label', 'Ativar som');
        } else {
          icon.className = 'fa-solid fa-volume-high';
          muteBtn.setAttribute('aria-label', 'Desativar som');
        }
      });
    }
  }

  // =========================================
  // 12b. HERO VIDEO MOBILE (fundo fullscreen)
  // =========================================
  const heroVideoMobile = document.getElementById('heroVideoMobile');
  if (heroVideoMobile) {
    heroVideoMobile.playbackRate = 0.85;
    heroVideoMobile.addEventListener('loadedmetadata', () => {
      heroVideoMobile.playbackRate = 0.85;
    });

    heroVideoMobile.play().catch(() => {});

    setTimeout(() => {
      heroVideoMobile.play().catch(() => {});
    }, 500);

    heroVideoMobile.addEventListener('timeupdate', () => {
      if (heroVideoMobile.currentTime >= 27) {
        heroVideoMobile.pause();
        setTimeout(() => {
          heroVideoMobile.currentTime = 0;
          heroVideoMobile.play().catch(() => {});
        }, 1000);
      }
    });
  }

});

// =========================================
// 11. WHATSAPP PREMIUM EXPERIENCE
// =========================================
function initWaPremium() {
    const bubble = document.getElementById('wa-message-bubble');
    const typing = document.getElementById('wa-typing');
    const realMessage = document.getElementById('wa-real-message');
    const badge = document.getElementById('wa-notification');
    const closeBtn = document.getElementById('wa-close-btn');
    const mainBtn = document.getElementById('wa-main-btn');

    if (!bubble || !typing || !realMessage || !badge || !closeBtn || !mainBtn) return;

    // 1. Mostrar o botão flutuante e o balão após o usuário passar da seção de serviços
    let waRafPending = false;
    const handleWaScroll = () => {
        if (waRafPending) return;
        waRafPending = true;
        /* PageSpeed fix: rAF batching evita forced reflow do getBoundingClientRect no scroll */
        requestAnimationFrame(() => {
          waRafPending = false;
          _checkWaSection();
        });
    };
    const _checkWaSection = () => {
        const triggerSection = document.getElementById('servicos');
        if (triggerSection) {
            const rect = triggerSection.getBoundingClientRect();
            
            // 1. Mostrar o botão flutuante sutilmente quando o usuário atinge a seção de serviços
            if (rect.top < window.innerHeight && !mainBtn.classList.contains('visible')) {
                mainBtn.classList.add('visible');
            }

            // 2. Iniciar contagem para o balão apenas APÓS o usuário ter visto toda a seção de serviços
            if (rect.bottom < window.innerHeight && !bubble.dataset.timerStarted) {
                bubble.dataset.timerStarted = "true";
                
                setTimeout(() => {
                    if (!bubble.classList.contains('show')) {
                        bubble.classList.add('show');
                        
                        setTimeout(() => {
                            typing.style.display = 'none';
                            realMessage.style.display = 'block';
                            realMessage.style.opacity = '0';
                            realMessage.style.transition = 'opacity 0.5s ease';
                            setTimeout(() => {
                                realMessage.style.opacity = '1';
                            }, 50);
                        }, 2500);
                    }
                }, 3000); // 3 segundos após passar a seção de serviços
                
                window.removeEventListener('scroll', handleWaScroll);
            }
        }
    };
    window.addEventListener('scroll', handleWaScroll, { passive: true });


    // Fechar balão
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        bubble.classList.remove('show');
        // Mostrar notificação após fechar para manter engajamento
        setTimeout(() => {
            badge.classList.add('show');
        }, 2000);
    });

    // Ao clicar no botão principal, remove o balão e a notificação
    mainBtn.addEventListener('click', () => {
        bubble.classList.remove('show');
        badge.classList.remove('show');
    });
}

document.addEventListener('DOMContentLoaded', initWaPremium);

/* =========================================
   DICA */
function initDicas() {
  const dataEl = document.getElementById('dicasData');
  const stage  = document.getElementById('dicasStage');
  const panel  = document.getElementById('dicasPanel');
  if (!dataEl || !stage) return;

  const items = JSON.parse(dataEl.textContent);
  let current = 0;
  let cards   = [];
  let isMuted = true;

  const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
  const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  const VOLUME_ON_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
  const VOLUME_OFF_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.41.32-.86.58-1.35.75v2.06c1.03-.22 1.97-.66 2.78-1.28L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
  const EXPAND_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;

  /* Cria os cards no DOM */
  items.forEach((item, i) => {
    const art = document.createElement('article');
    art.className = 'dica-card';
    art.innerHTML = `
      <div class="dica-video-wrap">
        <video class="dica-video" muted playsinline preload="auto"></video>
      </div>
      <div class="dica-overlay"></div>
      <div class="dica-controls">
        <button class="dica-control-btn sound-toggle" title="Alternar Som">${VOLUME_OFF_SVG}</button>
        <button class="dica-control-btn expand-video" title="Expandir Vídeo">${EXPAND_SVG}</button>
      </div>
      <button class="dica-play-btn" aria-label="Reproduzir">
        <div class="dica-play-icon">${PLAY_SVG}</div>
      </button>
      <span class="dica-badge">${item.badge}</span>
    `;
    
    const video = art.querySelector('.dica-video');
    video.addEventListener('ended', () => {
      if (i === current) { // Só avança se for o vídeo ativo
        if (current < items.length - 1) {
          goTo(current + 1);
        } else {
          goTo(0);
        }
      }
    });

    stage.appendChild(art);
    cards.push(art);
  });


  /* Atualiza posições */
  function updatePositions() {
    cards.forEach((card, i) => {
      const pos = i - current;
      card.setAttribute('data-pos', pos);
    });
  }

  /* Carrega vídeo de um card */
  function loadCard(idx) {
    const video = cards[idx]?.querySelector('.dica-video');
    if (!video || video.src) return;
    video.src = items[idx].video;
    video.load();
  }

  /* Ir para índice */
  function goTo(idx) {
    if (idx < 0 || idx >= items.length) return;

    /* Para vídeo atual */
    const prevVideo = cards[current]?.querySelector('.dica-video');
    prevVideo?.pause();
    cards[current]?.classList.remove('playing');

    current = idx;
    updatePositions();
    
    /* Carrega vídeo ativo e adjacentes */
    loadCard(current);
    loadCard(current - 1);
    loadCard(current + 1);

    /* Autoplay do novo ativo */
    const nextVideo = cards[current]?.querySelector('.dica-video');
    if (nextVideo) {
      nextVideo.muted = isMuted;
      nextVideo.play().catch(() => {});
      cards[current].classList.add('playing');
      updateControlIcons(cards[current]);
    }

    /* Atualiza painel (Sempre visível) */
    updatePanel();
    showPanel();
  }

  function updateControlIcons(card) {
    const soundBtn = card.querySelector('.sound-toggle');
    if (soundBtn) soundBtn.innerHTML = isMuted ? VOLUME_OFF_SVG : VOLUME_ON_SVG;
  }

  /* Painel fixo */
  function updatePanel() {
    const item = items[current];
    const pTitle = document.getElementById('dicasPanelTitle');
    const pDesc  = document.getElementById('dicasPanelDesc');
    const pCta   = document.getElementById('dicasPanelCta');
    const pCtaL  = document.getElementById('dicasPanelCtaLabel');

    if (pTitle) pTitle.textContent = item.title;
    if (pDesc)  pDesc.textContent  = item.desc;
    if (pCtaL)  pCtaL.textContent  = item.cta;
    if (pCta)   pCta.href          = item.url;
  }

  function showPanel() { panel?.classList.add('visible'); }

  /* Interações */
  cards.forEach((card, i) => {
    const video = card.querySelector('.dica-video');
    
    card.addEventListener('click', (e) => {
      const pos = parseInt(card.getAttribute('data-pos'));
      
      // Se clicar no botão de som
      if (e.target.closest('.sound-toggle')) {
        isMuted = !isMuted;
        cards.forEach(c => {
          const v = c.querySelector('.dica-video');
          if (v) v.muted = isMuted;
          updateControlIcons(c);
        });
        return;
      }

      // Se clicar no botão de expandir
      if (e.target.closest('.expand-video')) {
        openVideoLightbox(items[i].video);
        return;
      }

      if (pos !== 0) {
        goTo(i);
        return;
      }

      /* Card central → play/pause */
      if (!video) return;
      if (video.paused) {
        video.play();
        card.classList.add('playing');
        card.querySelector('.dica-play-btn').innerHTML = PLAY_SVG; // Ocultar ou mudar
      } else {
        video.pause();
        card.classList.remove('playing');
        card.querySelector('.dica-play-btn').innerHTML = PLAY_SVG;
      }
    });
  });

  /* Lightbox de Vídeo */
  function openVideoLightbox(url) {
    const lb = document.getElementById('lightbox');
    const content = lb?.querySelector('.lightbox-content');
    const closeBtn = lb?.querySelector('.lightbox-close');
    const prevBtn = lb?.querySelector('.lightbox-prev');
    const nextBtn = lb?.querySelector('.lightbox-next');
    const caption = lb?.querySelector('.lightbox-caption');

    if (!lb || !content) return;

    /* Pausa o vídeo ativo no carrossel ao abrir pop-up */
    const activeVideo = cards[current]?.querySelector('.dica-video');
    if (activeVideo) {
      activeVideo.pause();
      cards[current].classList.remove('playing');
    }

    // Esconde elementos da galeria
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (caption) caption.style.display = 'none';

    content.innerHTML = `
      <video src="${url}" controls autoplay class="lightbox-video-player"></video>
    `;
    lb.classList.add('active');
    
    const handleClose = () => {
      lb.classList.remove('active');
      content.innerHTML = '';
      if (prevBtn) prevBtn.style.display = '';
      if (nextBtn) nextBtn.style.display = '';
      if (caption) caption.style.display = '';
      closeBtn?.removeEventListener('click', handleClose);
    };

    closeBtn?.addEventListener('click', handleClose);
    lb.querySelector('.lightbox-overlay')?.addEventListener('click', handleClose);
  }

  /* Swipe touch no stage */
  let touchX = 0;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* Init */
  updatePositions();
  updatePanel();
  showPanel();
  loadCard(0);
  loadCard(1);

  /* Autoplay via IntersectionObserver */
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeVideo = cards[current]?.querySelector('.dica-video');
        if (activeVideo && activeVideo.paused) {
          activeVideo.play().catch(() => {});
          cards[current].classList.add('playing');
        }
        sectionObs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  sectionObs.observe(stage);
}

  document.addEventListener('DOMContentLoaded', initDicas);
  document.addEventListener('DOMContentLoaded', initGalleryLightbox);

  /* =========================================
     GALERIA — LIGHTBOX
     ========================================= */
  function initGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const overlay = lightbox.querySelector('.lightbox-overlay');

    const items = Array.from(document.querySelectorAll('.gal-item'));
    let currentIndex = 0;

    if (!items.length) return;

    function openLightbox(index) {
      currentIndex = index;
      const item = items[currentIndex];
      const img = item.querySelector('img');
      const title = item.querySelector('.gal-title').textContent;

      // Re-seleciona ou restaura os elementos caso tenham sido removidos pelo vídeo
      let lightboxImg = lightbox.querySelector('.lightbox-img');
      let lightboxCaption = lightbox.querySelector('.lightbox-caption');

      if (!lightboxImg || !lightboxCaption) {
        const content = lightbox.querySelector('.lightbox-content');
        content.innerHTML = `
          <img src="" alt="" class="lightbox-img">
          <div class="lightbox-caption"></div>
        `;
        lightboxImg = lightbox.querySelector('.lightbox-img');
        lightboxCaption = lightbox.querySelector('.lightbox-caption');
      }

      /* Pausa vídeos da seção Dicas ao abrir galeria */
      const dicasVideos = document.querySelectorAll('.dica-video');
      dicasVideos.forEach(v => {
        v.pause();
        v.closest('.dica-card')?.classList.remove('playing');
      });

      lightboxImg.style.opacity = '0';
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = title;

      const counter = lightbox.querySelector('.lightbox-counter');
      if (counter) counter.textContent = `${currentIndex + 1} / ${items.length}`;

      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
      };

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        const img = lightbox.querySelector('.lightbox-img');
        if (img) img.src = '';
      }, 400);
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % items.length;
      openLightbox(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      openLightbox(currentIndex);
    }

    // Events
    items.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }
