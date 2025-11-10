/* script.js - Navegación, teclado, swipe táctil, presenter mode básico y exportar a PDF */

(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const printBtn = document.getElementById('printBtn');
  const togglePresenter = document.getElementById('togglePresenter');
  const presentation = document.getElementById('presentation');
  
  // --- (Mejora Gemini) ---
  const progressBar = document.getElementById('progressBar');

  let current = 0;
  let presenterMode = false;

  function showSlide(n){
    slides[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    updateAria();
    
    // --- (Mejora Gemini) Actualizar barra de progreso ---
    const percentage = ((current + 1) / slides.length) * 100;
    progressBar.style.width = percentage + '%';
  }

  function updateAria(){
    slides.forEach((s,i)=>{
      s.setAttribute('aria-hidden', i===current ? 'false' : 'true');
    });
    // Actualizar número en header si existe
    const numberEls = document.querySelectorAll('.slide-number');
    numberEls.forEach(el => {
      const parent = el.closest('.slide');
      if (!parent) return;
      const idx = Array.from(slides).indexOf(parent);
      el.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    });
  }

  function next(){ showSlide(current+1); }
  function prev(){ showSlide(current-1); }

  // Eventos botones
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'Home') { e.preventDefault(); showSlide(0); }
    if (e.key === 'End') { e.preventDefault(); showSlide(slides.length - 1); }
  });

  // Swipe táctil (básico)
  let touchStartX = null;
  document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
  document.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (dx > 50) prev();
    if (dx < -50) next();
    touchStartX = null;
  });

  // Evitar scroll accidental en touchpads y ruedas (pero respetando scroll en inputs)
  document.addEventListener('wheel', (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (['input','textarea','select'].includes(tag)) return; // permitir scroll en formularios
    e.preventDefault();
  }, {passive:false});

  // Presenter mode (simple): muestra index en la consola y alterna estilo "presenter"
  togglePresenter.addEventListener('click', () => {
    presenterMode = !presenterMode;
    togglePresenter.setAttribute('aria-pressed', String(presenterMode));
    document.body.classList.toggle('presenter-mode', presenterMode);
    if (presenterMode) console.info('Presenter mode ON — slide:', current+1);
  });

  // Exportar a PDF / imprimir
  printBtn.addEventListener('click', () => {
    // Antes de imprimir, quitar animaciones para mejor resultado
    document.documentElement.classList.add('print-ready');
    setTimeout(() => window.print(), 200);
  });

  // Inicializar ARIA y estado
  updateAria();
  
  // --- (Mejora Gemini) Inicializar barra de progreso ---
  progressBar.style.width = (1 / slides.length) * 100 + '%';

  // Exponer funciones para debugging / integraciones
  window.minePredict = { next, prev, showSlide };

})();