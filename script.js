/* ═══════════════════════════════════════════
   MATCHA 8/3 – Script
═══════════════════════════════════════════ */

/* ─── 1. FALLING PETAL CANVAS ─── */
(function () {
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#a4c639', '#6b8e23', '#c8e89a', '#ffffff', '#f5d878', '#8cb832', '#d4e8a0'];

    class Petal {
        constructor() {
            this.reset(true);
        }
        reset(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -30;
            this.size = Math.random() * 12 + 5;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.rot = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.04;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.6 + 0.2;
            this.wave = Math.random() * Math.PI * 2;
            this.waveAmp = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.wave += 0.02;
            this.x += Math.sin(this.wave) * this.waveAmp + this.speedX;
            this.y += this.speedY;
            this.rot += this.rotSpeed;
            if (this.y > canvas.height + 30) this.reset(false);
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.fillStyle = this.color;
            // petal shape
            ctx.beginPath();
            ctx.ellipse(0, -this.size / 2, this.size * 0.38, this.size * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const petals = Array.from({ length: 55 }, () => new Petal());

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();


/* ─── 2. FLYING CSS LEAVES ─── */
(function () {
    function spawnLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'fly-leaf';
        const fromRight = Math.random() > 0.5;
        const startY = Math.random() * 60 + 5; // vh
        const dy = (Math.random() - 0.5) * 150;
        const dur = Math.random() * 12 + 10;
        const rot = Math.random() * 360;
        const rot2 = rot + (Math.random() * 360 + 180);
        leaf.style.cssText = `
      top:${startY}vh;
      left:${fromRight ? 'auto' : '-60px'};
      right:${fromRight ? '-60px' : 'auto'};
      --rot:${rot}deg;
      --rot2:${rot2}deg;
      --dx:${fromRight ? '-110vw' : '110vw'};
      --dy:${dy}px;
      animation-duration:${dur}s;
      animation-delay:${Math.random() * 4}s;
      width:${Math.random() * 16 + 18}px;
      height:${Math.random() * 10 + 12}px;
      opacity:0;
      background:linear-gradient(135deg,${['#6b8e23', '#5a7a1f', '#4a6a0f', '#8cb832'][Math.floor(Math.random() * 4)]},#a4c639);
    `;
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), (dur + 4) * 1000);
    }

    // spawn initial batch + repeat
    for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnLeaf(), i * 1800);
    }
    setInterval(() => spawnLeaf(), 3500);
})();


/* ─── 4. SCROLL REVEAL ─── */
(function () {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
})();


/* ─── 5. ENVELOPE OPEN ─── */
(function () {
    const wrap = document.getElementById('envelopeWrap');
    const backdrop = document.getElementById('letterBackdrop');
    let opened = false;
    if (!wrap) return;

    wrap.addEventListener('click', (e) => {
        if (opened) return;
        if (e.target && e.target.id === 'letterBackdrop') return;
        opened = true;
        wrap.classList.add('open');

        setTimeout(() => wrap.classList.add('letter-visible'), 400);
        setTimeout(() => {
            const deco = wrap.querySelector('.flower-deco');
            if (!deco) return;
            const f = buildMiniFlower(32, '#6b8e23');
            deco.appendChild(f);
            setTimeout(() => f.classList.add('bloom'), 50);
        }, 900);
    });

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            wrap.classList.remove('open', 'letter-visible');
            opened = false;
        });
    }

    function buildMiniFlower(size, color) {
        const f = document.createElement('div');
        f.className = 'css-flower';
        f.style.cssText = `position:relative;width:${size}px;height:${size}px;display:inline-block`;
        for (let i = 0; i < 5; i++) {
            const p = document.createElement('div');
            p.className = 'petal';
            const angle = (360 / 5) * i;
            p.style.cssText = `--r:${angle}deg;transform:rotate(${angle}deg);left:calc(50% - ${size * 0.16}px);top:calc(50% - ${size * 0.56}px);
        width:${size * 0.32}px;height:${size * 0.56}px;animation-delay:${i * .08}s`;
            f.appendChild(p);
        }
        const dot = document.createElement('div');
        dot.className = 'center-dot';
        dot.style.cssText = `width:${size * .2}px;height:${size * .2}px`;
        f.appendChild(dot);
        return f;
    }
})();


/* ─── 6. CARD FLOWERS (gallery) ─── */
(function () {
    document.querySelectorAll('.card-bloom').forEach(cb => {
        const numPetals = 6;
        const color = cb.dataset.pcolor || 'white';
        for (let i = 0; i < numPetals; i++) {
            const p = document.createElement('div');
            p.className = 'cb-petal';
            const angle = (360 / numPetals) * i;
            p.style.cssText = `--r:${angle}deg;transform:rotate(${angle}deg) translateY(-14px);
        background:${color};animation-delay:${i * 0.15}s`;
            cb.appendChild(p);
        }
        const dot = document.createElement('div');
        dot.className = 'cb-center';
        cb.appendChild(dot);
    });
})();


/* ─── 7. CONFETTI ─── */
(function () {
    const canvas = document.getElementById('confCanvas');
    const ctx = canvas.getContext('2d');
    let parts = [];
    let running = false;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    function createPart(x, y) {
        const c = ['#6b8e23', '#a4c639', '#d4e8a0', '#f5d878', '#fffacd', '#fff', '#8cb832', '#c8e89a'];
        return {
            x, y,
            vx: (Math.random() - .5) * 14,
            vy: -(Math.random() * 14 + 5),
            g: 0.45,
            rot: Math.random() * 360,
            rv: (Math.random() - .5) * 10,
            w: Math.random() * 12 + 4,
            h: Math.random() * 6 + 2,
            color: c[Math.floor(Math.random() * c.length)],
            life: 1,
            decay: Math.random() * .008 + .004
        };
    }

    function launch() {
        canvas.style.display = 'block';
        running = true;
        const cx = canvas.width / 2, cy = canvas.height * 0.65;
        for (let i = 0; i < 220; i++) {
            setTimeout(() => {
                parts.push(createPart(cx + (Math.random() - .5) * 60, cy + (Math.random() - .5) * 20));
            }, i * 10);
        }
        requestAnimationFrame(animate);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        parts = parts.filter(p => p.life > 0);
        parts.forEach(p => {
            p.vy += p.g; p.x += p.vx; p.y += p.vy;
            p.rot += p.rv; p.life -= p.decay;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (parts.length > 0) requestAnimationFrame(animate);
        else { canvas.style.display = 'none'; running = false; }
    }

    const btn = document.getElementById('acceptBtn');
    const msg = document.getElementById('acceptMsg');
    if (btn) {
        btn.addEventListener('click', () => {
            if (!running) launch();
            if (msg) { msg.style.display = 'block'; }
            btn.textContent = 'Đã nhận kèo! Hẹn sớm nhé 🍵';
            btn.disabled = true;
        });
    }
})();


/* ─── QR CODE & DOWNLOAD ─── */
(function () {
    const qrContainer = document.getElementById('qrCode');
    const downloadBtn = document.getElementById('downloadBtn');
    const ticketCapture = document.getElementById('ticketCapture');
    const voucherSection = document.getElementById('voucher');

    // URL khi quét QR: mở trang này kèm #voucher → hiện vé và tự động tải
    const ticketUrl = window.location.href.split('#')[0] + '#voucher';

    // Generate QR Code (mã QR chứa link → quét xong mở link → hiện vé + tự tải)
    if (qrContainer && typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
            text: ticketUrl,
            width: 120,
            height: 120,
            colorDark: '#2a380f',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    }

    // Hàm tải vé về máy (dùng cho nút bấm và tự động khi mở từ QR)
    async function downloadTicket() {
        if (!ticketCapture || typeof html2canvas === 'undefined') return false;
        try {
            const originalStyles = {
                transform: ticketCapture.style.transform,
                overflow: ticketCapture.style.overflow
            };
            ticketCapture.style.transform = 'none';
            ticketCapture.style.overflow = 'visible';

            const canvas = await html2canvas(ticketCapture, {
                scale: 2,
                backgroundColor: '#fffdf0',
                logging: false,
                useCORS: true
            });

            ticketCapture.style.transform = originalStyles.transform;
            ticketCapture.style.overflow = originalStyles.overflow;

            const link = document.createElement('a');
            link.download = 'Ve-Matcha-8-3-2026.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            return true;
        } catch (err) {
            console.error('Download error:', err);
            return false;
        }
    }

    // Nút "Lưu vé về máy"
    if (downloadBtn && ticketCapture) {
        downloadBtn.addEventListener('click', async () => {
            downloadBtn.innerHTML = '<span class="download-icon">⏳</span> Đang tải...';
            downloadBtn.disabled = true;
            const ok = await downloadTicket();
            if (ok) {
                downloadBtn.innerHTML = '<span class="download-icon">✓</span> Đã lưu!';
            } else {
                downloadBtn.innerHTML = '<span class="download-icon">⚠</span> Lỗi tải';
            }
            setTimeout(() => {
                downloadBtn.innerHTML = '<span class="download-icon">📥</span> Lưu vé về máy';
                downloadBtn.disabled = false;
            }, 2000);
        });
    }

    // Mở trang từ QR (#voucher) → cuộn tới vé, hiện vé, sau đó tự động tải về
    function handleVoucherFromQR() {
        if (window.location.hash !== '#voucher') return;
        if (!voucherSection) return;

        voucherSection.classList.add('visible');
        voucherSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(async () => {
            const ok = await downloadTicket();
            if (ok && downloadBtn) {
                downloadBtn.innerHTML = '<span class="download-icon">✓</span> Đã tải vé về máy!';
                downloadBtn.disabled = true;
                setTimeout(() => {
                    downloadBtn.innerHTML = '<span class="download-icon">📥</span> Lưu vé về máy';
                    downloadBtn.disabled = false;
                }, 3000);
            }
        }, 1800);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleVoucherFromQR);
    } else {
        handleVoucherFromQR();
    }
})();


/* ─── PHOTO FRAME REVEAL ─── */
(function () {
    const frames = document.querySelectorAll('.reveal-photo');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in-view');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    frames.forEach(f => obs.observe(f));
})();


/* ─── GIRL SECTION FLOWERS ─── */
(function () {
    function makeFlower(size, colors) {
        const wrap = document.createElement('div');
        wrap.className = 'css-flower';
        wrap.style.cssText = `position:relative;width:${size}px;height:${size}px;display:inline-block;flex-shrink:0`;
        for (let i = 0; i < 5; i++) {
            const p = document.createElement('div');
            p.className = 'petal';
            const angle = (360 / 5) * i;
            const c = colors[i % colors.length];
            p.style.cssText = `--r:${angle}deg;transform:rotate(${angle}deg);
        left:calc(50% - ${size * 0.16}px);top:calc(50% - ${size * 0.55}px);
        width:${size * 0.32}px;height:${size * 0.55}px;
        background:${c};animation-delay:${i * 0.1}s;opacity:0`;
            wrap.appendChild(p);
        }
        const dot = document.createElement('div');
        dot.className = 'center-dot';
        dot.style.cssText = `width:${size * 0.2}px;height:${size * 0.2}px;background:#f5d878`;
        wrap.appendChild(dot);
        return wrap;
    }

    const configs = [
        {
            id: 'gFlowerNNN', flowers: [
                { size: 38, colors: ['#c8e89a', '#a4c639', '#8cb832', '#d4e8a0', '#6b8e23'] },
                { size: 28, colors: ['#fff', '#fffdf0', '#e8f5d0'] },
            ]
        },
        {
            id: 'gFlowerHN', flowers: [
                { size: 38, colors: ['#f8c8d8', '#fce8f0', '#e8c0d0', '#ffd4e8', '#f0a8c0'] },
                { size: 28, colors: ['#c8e89a', '#a4c639', '#8cb832'] },
            ]
        },
        {
            id: 'gFlowerQH', flowers: [
                { size: 38, colors: ['#a4c639', '#c8e89a', '#6b8e23', '#8cb832', '#d4e8a0'] },
                { size: 28, colors: ['#f5d878', '#ffe8a0', '#ffd060'] },
            ]
        },
    ];

    configs.forEach(cfg => {
        const container = document.getElementById(cfg.id);
        if (!container) return;

        // observe when girl section enters view, then bloom
        const obs = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;
            obs.disconnect();
            cfg.flowers.forEach((fc, fi) => {
                const f = makeFlower(fc.size, fc.colors);
                container.appendChild(f);
                setTimeout(() => f.classList.add('bloom'), fi * 350 + 200);
            });
        }, { threshold: 0.3 });
        obs.observe(container);
    });
})();


/* ─── 8. TYPEWRITER ─── */
(function () {
    const el = document.getElementById('twText');
    if (!el) return;
    const quotes = [
        "Ngày 8/3 là ngày để nhắc nhở thế giới rằng, sức mạnh và sự dịu dàng có thể tồn tại trong cùng một trái tim — như em vậy. Chúc em luôn rực rỡ, luôn tỏa sáng, và đừng bao giờ quên rằng em là duy nhất.",
        "Em có nụ cười làm sáng cả không gian u tối, có tiếng cười khiến mùa xuân phải ghen tị. Có những người như em khiến cuộc sống trở nên có ý nghĩa hơn mỗi ngày. Chúc em ngày 8/3 tràn đầy yêu thương và hạnh phúc.",
        "Như những cánh hoa cherry rơi trong gió xuân, từng khoảnh khắc bên em đều đẹp đến nao lòng. Chúc người con gái của anh luôn được yêu thương, luôn được che chở, và luôn biết rằng có một trái tim đang đập vì em.",
        "Một tách Matcha Latte có thể phai lạnh, nhưng tình cảm anh dành cho em sẽ mãi đậm đà như hương trà xanh. Chúc em ngày 8/3 thật xanh, thật lành, và thật đong đầy hạnh phúc như ly Latte em yêu thích.",
        "Em là phiên bản đẹp nhất của tạo hóa — không cần thay đổi, không cần hoàn hảo, chỉ cần là chính em. Hãy tiếp tục tỏa sáng theo cách của riêng mình. Chúc em luôn mạnh mẽ, luôn kiên cường, và luôn được yêu thương.",
    ];
    let qi = 0, ci = 0, deleting = false;

    function tick() {
        const q = quotes[qi];
        if (!deleting) {
            ci++;
            el.innerHTML = q.slice(0, ci) + '<span class="tw-cursor"></span>';
            if (ci === q.length) { deleting = true; setTimeout(tick, 2800); return; }
            setTimeout(tick, 55);
        } else {
            ci--;
            el.innerHTML = q.slice(0, ci) + '<span class="tw-cursor"></span>';
            if (ci === 0) { deleting = false; qi = (qi + 1) % quotes.length; setTimeout(tick, 500); return; }
            setTimeout(tick, 28);
        }
    }

    // Start when visible
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { obs.disconnect(); setTimeout(tick, 400); }
    }, { threshold: 0.3 });
    obs.observe(el);
})();


/* ─── 9. TIMELINE REVEAL ─── */
(function () {
    const items = document.querySelectorAll('.tl-item');
    const obs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('vis'), i * 180);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    items.forEach(it => obs.observe(it));
})();


/* ─── 10. STAR CANVAS ─── */
(function () {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        buildStars();
    }

    let stars = [], shootingStars = [];

    function buildStars() {
        stars = [];
        const n = Math.floor((canvas.width * canvas.height) / 5000);
        for (let i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.2,
                o: Math.random() * 0.7 + 0.15,
                speed: Math.random() * 0.012 + 0.004,
                phase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.7 ? '#c8e89a' : '#ffffff',
            });
        }
    }

    function spawnShootingStar() {
        shootingStars.push({
            x: Math.random() * canvas.width * 0.7,
            y: Math.random() * canvas.height * 0.4,
            len: Math.random() * 90 + 60,
            speed: Math.random() * 6 + 4,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            life: 1,
            decay: 0.025,
        });
    }

    setInterval(spawnShootingStar, 2200);

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw stars with twinkle
        stars.forEach(s => {
            const tw = s.o * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = tw;
            ctx.fill();
        });

        // draw shooting stars
        shootingStars = shootingStars.filter(ss => ss.life > 0);
        shootingStars.forEach(ss => {
            const dx = Math.cos(ss.angle) * ss.len;
            const dy = Math.sin(ss.angle) * ss.len;
            const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x + dx, ss.y + dy);
            grad.addColorStop(0, `rgba(255,255,255,${ss.life})`);
            grad.addColorStop(0.3, `rgba(200,232,154,${ss.life * 0.6})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x + dx, ss.y + dy);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.globalAlpha = ss.life;
            ctx.stroke();
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.life -= ss.decay;
        });

        ctx.globalAlpha = 1;
        t++;
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
})();
