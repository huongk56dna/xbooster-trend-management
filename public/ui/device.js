// Device hints select the compact experience; viewport width also handles resized windows.
(function () {
  const ua = navigator.userAgent || '';
  const tablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const mobile = navigator.userAgentData?.mobile === true || /iPhone|iPod|Android.*Mobile|Windows Phone|IEMobile|Opera Mini/i.test(ua);
  document.documentElement.dataset.device = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop';
  const width = matchMedia('(max-width: 900px)');
  const sync = () => {
    const compact = mobile || width.matches;
    document.documentElement.classList.toggle('compact-ui', compact);
    window.dispatchEvent(new Event('xb-device-change'));
  };
  width.addEventListener('change', sync);
  sync();
})();
