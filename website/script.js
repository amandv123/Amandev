
const root=document.documentElement;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:reduceMotion?'auto':'smooth'});}
}));

const progress=document.querySelector('.scroll-progress');
const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-window.innerHeight;
  root.style.setProperty('--scroll', max>0 ? ((window.scrollY/max)*100)+'%' : '100%');
};
window.addEventListener('scroll',updateProgress,{passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();

const sectionLinks=[...document.querySelectorAll('[data-section]')];
const sections=sectionLinks.map(a=>document.getElementById(a.dataset.section)).filter(Boolean);
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      sectionLinks.forEach(a=>a.classList.toggle('active',a.dataset.section===entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>observer.observe(s));

if(!reduceMotion){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
    });
  },{threshold:.12});
  document.querySelectorAll('.section,.stats,.final-cta').forEach(el=>el.classList.add('reveal-on-scroll'));
  document.querySelectorAll('.reveal-on-scroll').forEach(el=>revealObserver.observe(el));

  document.querySelectorAll('.project,.now-grid a').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
    });
  });
}
