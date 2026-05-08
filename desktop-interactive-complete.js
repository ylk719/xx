/**
 * 好好柯的桌面 - 完整版交互脚本
 * 功能：多页面切换、点击反馈、悬浮动画、粒子装饰
 * 风格：少女温柔风格、渐变光影、轻微粒子飘落
 */

class DesktopInteractive {
  constructor() {
    this.phoneScreen = document.querySelector('.phone-screen');
    this.currentPage = 'page-home';
    this.init();
  }

  /**
   * 初始化所有交互功能
   */
  init() {
    this.setupPageNavigation();
    this.setupNavButtons();
    this.setupSwipeGestures();
    this.setupIconInteractions();
    this.setupHoverEffects();
    this.startParticleAnimation();
    this.initCountdownAnimation();
    this.setupProfileCardAnimation();
  }

  /**
   * 设置左右翻页按钮
   */
  setupNavButtons() {
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.navigatePrevPage();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.navigateNextPage();
      });
    }
  }

  /**
   * 上一页
   */
  navigatePrevPage() {
    const pages = ['page-home', 'page-moments', 'page-calendar'];
    const currentIndex = pages.indexOf(this.currentPage);
    if (currentIndex > 0) {
      this.navigateToPage(pages[currentIndex - 1]);
    }
  }

  /**
   * 下一页
   */
  navigateNextPage() {
    const pages = ['page-home', 'page-moments', 'page-calendar'];
    const currentIndex = pages.indexOf(this.currentPage);
    if (currentIndex < pages.length - 1) {
      this.navigateToPage(pages[currentIndex + 1]);
    }
  }

  /**
   * 设置滑动手势
   */
  setupSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    let isSwiping = false;

    this.phoneScreen.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    this.phoneScreen.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      const currentPage = document.querySelector('.page.active');
      if (currentPage) {
        const offsetX = e.touches[0].clientX - touchStartX;
        currentPage.style.transform = `translateX(${offsetX}px)`;
        currentPage.classList.add('swiping');
      }
    }, { passive: true });

    this.phoneScreen.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const currentPage = document.querySelector('.page.active');
      if (currentPage) {
        currentPage.classList.remove('swiping');
        currentPage.style.transform = '';
      }
      
      this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
    }, { passive: true });

    // 鼠标滑动支持（用于桌面测试）
    let mouseDown = false;
    let mouseStartX = 0;
    let mouseStartY = 0;

    this.phoneScreen.addEventListener('mousedown', (e) => {
      mouseDown = true;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
    });

    this.phoneScreen.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      const currentPage = document.querySelector('.page.active');
      if (currentPage) {
        const offsetX = e.clientX - mouseStartX;
        currentPage.style.transform = `translateX(${offsetX}px)`;
        currentPage.classList.add('swiping');
      }
    });

    this.phoneScreen.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      const offsetX = e.clientX - mouseStartX;
      const offsetY = e.clientY - mouseStartY;
      
      const currentPage = document.querySelector('.page.active');
      if (currentPage) {
        currentPage.classList.remove('swiping');
        currentPage.style.transform = '';
      }

      this.handleSwipe(mouseStartX, e.clientX, mouseStartY, e.clientY);
    });

    this.phoneScreen.addEventListener('mouseleave', () => {
      mouseDown = false;
      const currentPage = document.querySelector('.page.active');
      if (currentPage) {
        currentPage.classList.remove('swiping');
        currentPage.style.transform = '';
      }
    });
  }

  /**
   * 处理滑动事件
   */
  handleSwipe(startX, endX, startY, endY) {
    const diffX = startX - endX;
    const diffY = startY - endY;

    // 如果垂直滑动距离大于水平滑动距离，忽略
    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    // 滑动距离小于50px，忽略
    if (Math.abs(diffX) < 50) {
      return;
    }

    const pages = ['page-home', 'page-moments', 'page-calendar'];
    const currentIndex = pages.indexOf(this.currentPage);

    // 向左滑动（下一页）
    if (diffX > 0 && currentIndex < pages.length - 1) {
      this.navigateToPage(pages[currentIndex + 1]);
    }
    // 向右滑动（上一页）
    else if (diffX < 0 && currentIndex > 0) {
      this.navigateToPage(pages[currentIndex - 1]);
    }
  }

  /**
   * 设置页面导航
   */
  setupPageNavigation() {
    // 应用图标导航
    const appIcons = document.querySelectorAll('.app-icon[data-page]');
    appIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        const targetPage = icon.getAttribute('data-page');
        this.navigateToPage(targetPage);
      });
    });

    // Dock栏导航
    const dockIcons = document.querySelectorAll('.dock-icon[data-page]');
    dockIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        const targetPage = icon.getAttribute('data-page');
        this.navigateToPage(targetPage);
      });
    });

    // 返回按钮
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.navigateToPage('page-home');
      });
    });
  }

  /**
   * 页面导航逻辑
   * @param {string} targetPage - 目标页面
   */
  navigateToPage(targetPage) {
    if (targetPage === this.currentPage) return;

    const currentPageEl = document.querySelector(`.page.${this.currentPage}`);
    const targetPageEl = document.querySelector(`.page.${targetPage}`);

    if (!currentPageEl || !targetPageEl) return;

    // 判断方向
    const isForward = this.getPageIndex(targetPage) > this.getPageIndex(this.currentPage);

    // 移除当前页面
    currentPageEl.classList.remove('active');
    if (isForward) {
      currentPageEl.classList.add('prev');
    }

    // 添加目标页面
    targetPageEl.classList.add('active');
    targetPageEl.classList.remove('prev');

    this.currentPage = targetPage;
  }

  /**
   * 获取页面索引
   * @param {string} pageName - 页面名称
   */
  getPageIndex(pageName) {
    const pages = ['page-home', 'page-moments', 'page-calendar'];
    return pages.indexOf(pageName);
  }

  /**
   * 设置图标点击反馈
   */
  setupIconInteractions() {
    const icons = document.querySelectorAll('.app-icon, .dock-icon, .app-icon-small, .calendar-day');
    
    icons.forEach((icon) => {
      // 鼠标按下效果
      icon.addEventListener('mousedown', () => {
        this.createClickRipple(icon);
        icon.style.transform = 'scale(0.92)';
      });

      // 鼠标抬起恢复
      icon.addEventListener('mouseup', () => {
        icon.style.transform = '';
      });

      // 鼠标离开恢复
      icon.addEventListener('mouseleave', () => {
        icon.style.transform = '';
      });

      // 触摸设备支持
      icon.addEventListener('touchstart', () => {
        this.createClickRipple(icon);
        icon.style.transform = 'scale(0.92)';
      });

      icon.addEventListener('touchend', () => {
        icon.style.transform = '';
      });
    });
  }

  /**
   * 创建点击涟漪效果
   * @param {Element} element - 目标元素
   */
  createClickRipple(element) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
      border-radius: inherit;
      pointer-events: none;
      animation: rippleEffect 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * 设置悬浮动画效果
   */
  setupHoverEffects() {
    // 个人信息卡片悬浮
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
      profileCard.addEventListener('mouseenter', () => {
        profileCard.style.transform = 'translateY(-8px)';
        profileCard.style.boxShadow = '0 15px 35px rgba(100, 200, 255, 0.15)';
      });

      profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = '';
        profileCard.style.boxShadow = '';
      });
    }

    // 爱情纪念卡片悬浮
    const loveWidget = document.querySelector('.love-widget');
    if (loveWidget) {
      loveWidget.addEventListener('mouseenter', () => {
        loveWidget.style.transform = 'translateY(-5px)';
        loveWidget.style.boxShadow = '0 8px 25px rgba(255, 107, 157, 0.12)';
      });

      loveWidget.addEventListener('mouseleave', () => {
        loveWidget.style.transform = '';
        loveWidget.style.boxShadow = '';
      });
    }

    // 动态卡片悬浮
    const momentCards = document.querySelectorAll('.moment-card');
    momentCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /**
   * 启动粒子动画系统
   */
  startParticleAnimation() {
    // 创建粒子容器
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    `;
    this.phoneScreen.appendChild(particleContainer);

    // 定期生成粒子
    setInterval(() => {
      this.createParticle(particleContainer);
    }, 1200);

    // 初始生成几个粒子
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createParticle(particleContainer);
      }, i * 400);
    }
  }

  /**
   * 创建单个粒子
   * @param {Element} container - 粒子容器
   */
  createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 4 + 5;
    const delay = Math.random() * 0.5;
    const startX = Math.random() * 100;
    const opacity = Math.random() * 0.4 + 0.2;
    const offsetX = Math.random() * 40 - 20;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(255, 200, 224, ${opacity}), rgba(255, 200, 224, 0));
      border-radius: 50%;
      left: ${startX}%;
      top: -10px;
      box-shadow: 0 0 ${size * 2}px rgba(255, 200, 224, ${opacity * 0.6});
      animation: particleFloat ${duration}s linear ${delay}s forwards;
      --tx: ${offsetX}px;
    `;

    container.appendChild(particle);

    // 清理已完成的粒子
    setTimeout(() => {
      particle.remove();
    }, (duration + delay) * 1000);
  }

  /**
   * 初始化倒计时动画
   */
  initCountdownAnimation() {
    const daysElement = document.querySelector('.days');
    if (daysElement) {
      daysElement.style.animation = 'gentlePulse 3s ease-in-out infinite';
      this.updateCountdown();
    }
  }

  /**
   * 更新倒计时天数
   */
  updateCountdown() {
    const startDate = new Date('2026-05-02');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysElement = document.querySelector('.days');
    if (daysElement) {
      const spanEl = daysElement.querySelector('span');
      daysElement.textContent = diffDays;
      if (spanEl) {
        daysElement.appendChild(spanEl);
      }
    }
  }

  /**
   * 更新时间显示
   */
  updateTime() {
    const timeElement = document.querySelector('.time');
    if (timeElement) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      timeElement.textContent = `${hours}:${minutes}`;
    }
  }

  /**
   * 设置个人信息卡片的初始动画
   */
  setupProfileCardAnimation() {
    const profileCard = document.querySelector('.profile-card');
    const avatar = document.querySelector('.avatar');
    
    if (profileCard) {
      profileCard.style.animation = 'fadeInUp 0.8s ease-out';
    }

    if (avatar) {
      avatar.style.animation = 'scaleIn 0.8s ease-out 0.2s both';
    }

    // 为各个文本元素添加错落的淡入效果
    const textElements = document.querySelectorAll('.nickname, .id, .bio, .location');
    textElements.forEach((el, index) => {
      el.style.animation = `fadeInUp 0.6s ease-out ${0.3 + index * 0.1}s both`;
    });
  }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', () => {
  new DesktopInteractive();
});

/**
 * 添加CSS动画定义
 */
const style = document.createElement('style');
style.textContent = `
  /* 涟漪效果动画 */
  @keyframes rippleEffect {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  /* 粒子飘落动画 */
  @keyframes particleFloat {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(812px) translateX(var(--tx, 0px));
      opacity: 0;
    }
  }

  /* 温柔脉动效果 */
  @keyframes gentlePulse {
    0%, 100% {
      transform: scale(1);
      text-shadow: 0 0 0 rgba(255, 107, 157, 0);
    }
    50% {
      transform: scale(1.05);
      text-shadow: 0 0 15px rgba(255, 107, 157, 0.3);
    }
  }

  /* 淡入上升动画 */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 缩放进入动画 */
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* 页面切换动画 */
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutLeft {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  /* 平滑过渡 */
  .app-icon,
  .dock-icon,
  .profile-card,
  .love-widget,
  .moment-card,
  .calendar-day,
  .app-icon-small {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* 移动设备优化 */
  @media (max-width: 768px) {
    .app-icon,
    .dock-icon,
    .app-icon-small {
      transition: all 0.2s ease-out;
    }
  }
`;
document.head.appendChild(style);
