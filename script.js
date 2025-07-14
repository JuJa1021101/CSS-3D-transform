document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    let currentRotation = 0;
    const rotationStep = 45;
    const totalItems = 8;
    let hoverTimer;
    
    // 动态生成指示器
    for (let i = 0; i < totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.className = `indicator animate-fade-in`;
        indicator.style.animationDelay = `${0.6 + i * 0.1}s`;
        indicator.dataset.index = i;
        indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = indicatorsContainer.children;
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    // 更新指示器状态
    function updateIndicators() {
        const activeIndex = Math.round((-currentRotation % 360) / rotationStep + 360) % totalItems;
        Array.from(indicators).forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // 旋转画廊到指定索引
    function rotateToIndex(index) {
        const targetRotation = index * -rotationStep;
        const diff = targetRotation - currentRotation;
        const steps = diff / rotationStep;
        
        // 防止过度旋转
        if (Math.abs(steps) > totalItems / 2) {
            const direction = steps > 0 ? -1 : 1;
            const adjustedSteps = direction * (totalItems - Math.abs(steps));
            currentRotation += adjustedSteps * rotationStep;
        } else {
            currentRotation = targetRotation;
        }
        
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        updateIndicators();
    }
    
    // 旋转画廊
    function rotateCarousel(step) {
        currentRotation += step;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        updateIndicators();
    }
    
    // 按钮事件监听
    prevBtn.addEventListener('click', () => {
        rotateCarousel(rotationStep);
    });
    
    nextBtn.addEventListener('click', () => {
        rotateCarousel(-rotationStep);
    });
    
    // 指示器点击事件
    Array.from(indicators).forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            rotateToIndex(index);
        });
    });
    
    // 拖拽功能
    let isDragging = false;
    let startX;
    let startRotation = 0;
    
    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('touchstart', startDrag, { passive: true });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: true });
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startRotation = currentRotation;
        carousel.style.transition = 'none';
        
        // 清除悬停定时器
        clearTimeout(hoverTimer);
    }
    
    function drag(e) {
        if (!isDragging) return;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diffX = (clientX - startX) * 0.8;
        currentRotation = startRotation - diffX;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
    }
    
    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // 吸附到最近的图片位置
        const roundedRotation = Math.round(currentRotation / rotationStep) * rotationStep;
        currentRotation = roundedRotation;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        updateIndicators();
    }
    
    // 鼠标悬停图片放大并居中
    carouselItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            // 添加短暂延迟，避免快速移动时频繁旋转
            clearTimeout(hoverTimer);
            hoverTimer = setTimeout(() => {
                if (!isDragging) {
                    const currentIndex = Math.round((-currentRotation % 360) / rotationStep + 360) % totalItems;
                    
                    // 只有当目标图片不是当前居中图片时才旋转
                    if (index !== currentIndex) {
                        rotateToIndex(index);
                    }
                }
            }, 300);
        });
        
        item.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
        });
        
        // 点击图片旋转到对应位置
        item.addEventListener('click', () => {
            rotateToIndex(index);
        });
    });
    
    // 自动播放
    let autoPlayInterval = setInterval(() => {
        rotateCarousel(-rotationStep);
    }, 5000);
    
    // 鼠标悬停时暂停自动播放
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    // 鼠标离开时恢复自动播放
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            rotateCarousel(-rotationStep);
        }, 5000);
    });
    
    // 初始化指示器
    updateIndicators();
    
    // 添加键盘导航支持
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            rotateCarousel(rotationStep);
        } else if (e.key === 'ArrowRight') {
            rotateCarousel(-rotationStep);
        }
    });
    
    // 窗口大小变化时重新计算布局
    window.addEventListener('resize', () => {
        // 这里可以添加响应式调整逻辑
    });
});    