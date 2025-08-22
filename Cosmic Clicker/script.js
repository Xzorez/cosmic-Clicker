// ====================================
// COSMIC CLICKER - VERSIÓN OPTIMIZADA
// ====================================

// Estado del juego unificado y optimizado
const gameState = {
    // Recursos principales
    points: 0,
    gems: 0,
    dna: 0,
    level: 1,
    totalLevels: 0,
    
    // Sistema de clicks
    clickPower: 1,
    clickPowerLevel: 1,
    criticalLevel: 0,
    multiClickLevel: 0,
    totalClicks: 0,
    totalEarned: 0,
    
    // Generadores automáticos
    autoClickers: 0,
    starMiners: 0,
    galaxyFarms: 0,
    blackHoles: 0,
    
    // Sistema de multiplicadores
    clickMultiplier: 1,
    idleMultiplier: 1,
    globalMultiplier: 1,
    clickMultLevel: 0,
    idleMultLevel: 0,
    globalMultLevel: 0,
    
    // Especializaciones
    efficiencyLevel: 0,
    luckLevel: 0,
    automationLevel: 0,
    
    // Sistema de prestigio e investigación
    research: {},
    prestigeCount: 0,
    
    // Estados temporales y efectos
    adTimer: 0,
    boosterTime: 0,
    portalMultiplier: 1,
    portalTime: 0,
    blessingTime: 0,
    
    // Sistema de combos y visuales
    lastClickTime: 0,
    comboCount: 0,
    recentClicks: [],
    
    // Progreso y logros
    achievements: [],
    premiumPurchases: [],
    weeklyCompleted: false,
    usedCodes: [],
    sessionStart: Date.now(),
    
    // Configuración
    particleEffects: true,
    dnaSpent: 0
};

// ====================================
// CONFIGURACIÓN Y CONSTANTES
// ====================================

const CONFIG = {
    baseCosts: {
        clickPower: 10,
        criticalHit: 100,
        multiClick: 500,
        autoClicker: 50,
        starMiner: 500,
        galaxyFarm: 5000,
        blackHole: 50000,
        clickMultiplier: 1000,
        idleMultiplier: 2000,
        globalMultiplier: 10000,
        efficiency: 5000,
        luck: 7500,
        automation: 25000
    },

    research: {
        quantumClick: { cost: 10, name: "Click Cuántico" },
        timeWarp: { cost: 25, name: "Distorsión Temporal" },
        neuralNetwork: { cost: 50, name: "Red Neural" },
        cosmicResonance: { cost: 100, name: "Resonancia Cósmica" }
    },

    achievements: [
        { id: 'first_click', name: 'Primer Paso', description: 'Haz tu primer click', target: 1, type: 'clicks', reward: 5, icon: '👆' },
        { id: 'hundred_clicks', name: 'Clickeador', description: '100 clicks', target: 100, type: 'clicks', reward: 10, icon: '🖱️' },
        { id: 'thousand_points', name: 'Millonario', description: '1K puntos', target: 1000, type: 'earned', reward: 15, icon: '💰' },
        { id: 'first_auto', name: 'Automatización', description: 'Compra un auto-clicker', target: 1, type: 'auto', reward: 20, icon: '🤖' },
        { id: 'level_10', name: 'Veterano', description: 'Alcanza nivel 10', target: 10, type: 'level', reward: 25, icon: '⭐' },
        { id: 'million_points', name: 'Magnate', description: '1M puntos', target: 1000000, type: 'earned', reward: 50, icon: '💎' },
        { id: 'first_prestige', name: 'Renacimiento', description: 'Haz tu primer prestigio', target: 1, type: 'prestige', reward: 100, icon: '🚀' },
        { id: 'cps_100', name: 'Fábrica', description: '100 CPS', target: 100, type: 'cps', reward: 75, icon: '🏭' },
        { id: 'level_50', name: 'Maestro', description: 'Nivel 50', target: 50, type: 'level', reward: 150, icon: '🎓' },
        { id: 'billion_points', name: 'Emperador', description: '1B puntos', target: 1000000000, type: 'earned', reward: 500, icon: '🌟' },
        { id: 'all_research', name: 'Científico', description: 'Todas las investigaciones', target: 4, type: 'research', reward: 200, icon: '🧬' },
        { id: 'speed_demon', name: 'Demonio Veloz', description: '10K clicks en 1 minuto', target: 10000, type: 'speed', reward: 300, icon: '⚡' }
    ],

    tutorialTips: [
        "💡 Tip: Los clicks críticos dan 5x más puntos!",
        "💡 Tip: El prestigio te da ADN para mejoras permanentes",
        "💡 Tip: Las investigaciones desbloquean habilidades únicas",
        "💡 Tip: Los eventos aleatorios pueden darte grandes bonificaciones",
        "💡 Tip: Combina clicks rápidos para activar combos",
        "💡 Tip: Los multiplicadores se aplican a todo tu progreso",
        "💡 Tip: La eficiencia reduce el costo de todas las mejoras"
    ],

    comboEffects: {
        5: { multiplier: 1.2, message: "¡Combo x5! +20% damage" },
        10: { multiplier: 1.5, message: "¡Combo x10! +50% damage" },
        15: { multiplier: 2, message: "¡Combo x15! +100% damage" },
        25: { multiplier: 3, message: "¡MEGA COMBO! +200% damage" },
        50: { multiplier: 5, message: "¡ULTRA COMBO! +400% damage" }
    }
};

// ====================================
// SISTEMA DE PARTÍCULAS OPTIMIZADO
// ====================================

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '999'
        });
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, type = 'default') {
        if (this.particles.length > 100) return; // Limitar partículas para rendimiento

        const colors = {
            default: ['#ffd700', '#ffed4e'],
            critical: ['#ff3838', '#ff6b6b'],
            quantum: ['#9b59b6', '#bf00ff'],
            gem: ['#4ecdc4', '#00ffff']
        };

        this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            size: Math.random() * 4 + 2,
            color: colors[type][Math.floor(Math.random() * colors[type].length)],
            life: 1,
            decay: Math.random() * 0.02 + 0.02,
            glow: true
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Actualizar posición y vida
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.size *= 0.99;
            
            // Renderizar partícula
            if (particle.glow) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = particle.color;
            }
            
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Eliminar partículas muertas
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ====================================
// SISTEMA DE NOTIFICACIONES OPTIMIZADO
// ====================================

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }
    
    init() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        Object.assign(this.container.style, {
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: '1001',
            pointerEvents: 'none'
        });
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 4000) {
        if (this.notifications.length > 5) {
            this.remove(this.notifications[0]);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            info: '#4ecdc4',
            success: '#2ecc71',
            warning: '#f39c12',
            error: '#e74c3c',
            premium: '#9b59b6'
        };
        
        Object.assign(notification.style, {
            background: `linear-gradient(45deg, ${colors[type]}, ${colors[type]}aa)`,
            color: 'white',
            padding: '12px 16px',
            borderRadius: '20px',
            marginBottom: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            transform: 'translateX(300px)',
            transition: 'all 0.5s ease',
            boxShadow: `0 4px 20px ${colors[type]}66`,
            pointerEvents: 'auto',
            cursor: 'pointer'
        });
        
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Animar entrada
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Click para cerrar
        notification.addEventListener('click', () => this.remove(notification));
        
        // Auto-remover
        setTimeout(() => this.remove(notification), duration);
    }
    
    remove(notification) {
        if (this.container.contains(notification)) {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (this.container.contains(notification)) {
                    this.container.removeChild(notification);
                    this.notifications = this.notifications.filter(n => n !== notification);
                }
            }, 500);
        }
    }
}

// ====================================
// INICIALIZACIÓN DE SISTEMAS
// ====================================

let particleSystem = new ParticleSystem();
let notificationSystem = new NotificationSystem();

// ====================================
// FUNCIONES AUXILIARES OPTIMIZADAS
// ====================================

const Utils = {
    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num < 1000000000000000) return (num / 1000000000000).toFixed(1) + 'T';
        return (num / 1000000000000000).toFixed(1) + 'Q';
    },

    getCurrentCost(type) {
        const baseCost = CONFIG.baseCosts[type];
        let cost = baseCost;
        
        const costMultipliers = {
            clickPower: () => baseCost * Math.pow(1.15, gameState.clickPowerLevel - 1),
            criticalHit: () => baseCost * Math.pow(1.3, gameState.criticalLevel),
            multiClick: () => baseCost * Math.pow(2, gameState.multiClickLevel),
            autoClicker: () => baseCost * Math.pow(1.07, gameState.autoClickers),
            starMiner: () => baseCost * Math.pow(1.1, gameState.starMiners),
            galaxyFarm: () => baseCost * Math.pow(1.15, gameState.galaxyFarms),
            blackHole: () => baseCost * Math.pow(1.2, gameState.blackHoles),
            clickMultiplier: () => baseCost * Math.pow(3, gameState.clickMultLevel),
            idleMultiplier: () => baseCost * Math.pow(3, gameState.idleMultLevel),
            globalMultiplier: () => baseCost * Math.pow(5, gameState.globalMultLevel),
            efficiency: () => baseCost * Math.pow(2, gameState.efficiencyLevel),
            luck: () => baseCost * Math.pow(2.5, gameState.luckLevel),
            automation: () => baseCost * Math.pow(10, gameState.automationLevel)
        };
        
        if (costMultipliers[type]) {
            cost = costMultipliers[type]();
        }
        
        // Aplicar descuento por eficiencia
        const discount = 1 - (gameState.efficiencyLevel * 0.05);
        cost *= Math.max(discount, 0.05);
        
        return Math.floor(cost);
    },

    createScreenShake(intensity = 5) {
        const container = document.querySelector('.container');
        if (!container) return;
        
        container.style.transform = `translate(${Math.random() * intensity - intensity/2}px, ${Math.random() * intensity - intensity/2}px)`;
        
        setTimeout(() => {
            container.style.transform = 'translate(0, 0)';
        }, 100);
    },

    createFloatingNumber(text, target, color = '#ffd700') {
        const number = document.createElement('div');
        number.className = 'floating-number';
        number.textContent = text;
        
        const rect = target.getBoundingClientRect();
        const randomX = rect.left + Math.random() * 100 - 50;
        const randomY = rect.top + Math.random() * 50;
        
        Object.assign(number.style, {
            color,
            left: randomX + 'px',
            top: randomY + 'px',
            position: 'fixed',
            zIndex: '1001',
            pointerEvents: 'none',
            fontFamily: "'Orbitron', monospace",
            fontWeight: 'bold',
            fontSize: text.includes('CRÍTICO') || text.includes('COMBO') ? '18px' : '14px',
            textShadow: text.includes('CRÍTICO') || text.includes('COMBO') ? `0 0 20px ${color}` : 'none'
        });
        
        if (text.includes('CUÁNTICO')) {
            number.style.animation = 'quantumFlicker 0.5s ease-in-out, floatUp 1.2s ease-out forwards';
        }
        
        document.body.appendChild(number);
        
        setTimeout(() => {
            if (document.body.contains(number)) {
                document.body.removeChild(number);
            }
        }, 1200);
    },

    createPurchaseEffect(element) {
        if (!element) return;
        
        Object.assign(element.style, {
            transform: 'scale(1.05)',
            boxShadow: '0 0 30px rgba(78, 205, 196, 0.8)'
        });
        
        setTimeout(() => {
            Object.assign(element.style, {
                transform: '',
                boxShadow: ''
            });
        }, 300);
    }
};

// ====================================
// FUNCIONES DE CÁLCULO OPTIMIZADAS
// ====================================

const GameCalculations = {
    calculateClickPower() {
        let power = gameState.clickPower * gameState.clickMultiplier * gameState.globalMultiplier;
        power *= this.getCosmicResonanceBonus();
        if (gameState.boosterTime > 0) power *= 10;
        return Math.floor(power);
    },

    getCriticalChance() {
        return Math.min(gameState.criticalLevel * 0.02, 0.5);
    },

    getMultiClicks() {
        return 1 + gameState.multiClickLevel;
    },

    getLuckBonus() {
        return gameState.luckLevel * 0.001;
    },

    getCosmicResonanceBonus() {
        if (!gameState.research.cosmicResonance) return 1;
        return 1 + Math.floor(gameState.totalLevels / 100);
    },

    calculateTotalCPS() {
        let totalCps = 0;
        totalCps += gameState.autoClickers * 1;
        totalCps += gameState.starMiners * 5;
        totalCps += gameState.galaxyFarms * 25;
        totalCps += gameState.blackHoles * 100;
        
        totalCps *= gameState.idleMultiplier * gameState.globalMultiplier;
        totalCps *= this.getCosmicResonanceBonus();
        
        if (gameState.research.timeWarp) totalCps *= 1.5;
        if (gameState.boosterTime > 0) totalCps *= 10;
        if (gameState.portalTime > 0) totalCps *= gameState.portalMultiplier;
        
        return Math.floor(totalCps);
    },

    handleComboSystem() {
        const now = Date.now();
        if (now - gameState.lastClickTime < 500) { // 500ms window
            gameState.comboCount++;
        } else {
            gameState.comboCount = 1;
        }
        gameState.lastClickTime = now;
        
        // Bonus por combo
        if (gameState.comboCount > 5) {
            return Math.min(gameState.comboCount * 0.1, 2); // Max 200% bonus
        }
        return 1;
    }
};

// ====================================
// SISTEMA DE EVENTOS PRINCIPALES
// ====================================

function setupClickButton() {
    const clickButton = document.getElementById('clickButton');
    if (!clickButton) return;

    clickButton.addEventListener('click', function(e) {
        const rect = e.target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Sistema de combo
        const comboMultiplier = GameCalculations.handleComboSystem();
        
        let earnedPoints = Math.floor(GameCalculations.calculateClickPower() * comboMultiplier);
        let isCritical = false;
        let isQuantum = false;
        
        // Aplicar crítico
        if (Math.random() < GameCalculations.getCriticalChance()) {
            earnedPoints *= 5;
            isCritical = true;
            particleSystem.createParticle(centerX, centerY, 'critical');
            e.target.classList.add('critical-hit');
            setTimeout(() => e.target.classList.remove('critical-hit'), 800);
        }
        
        // Click cuántico (investigación)
        if (gameState.research.quantumClick && Math.random() < 0.1) {
            earnedPoints *= 2;
            isQuantum = true;
            particleSystem.createParticle(centerX, centerY, 'quantum');
            e.target.classList.add('quantum-effect');
            setTimeout(() => e.target.classList.remove('quantum-effect'), 500);
        }
        
        // Efectos visuales según el tipo de click
        if (isCritical && isQuantum) {
            Utils.createFloatingNumber(`CRÍTICO CUÁNTICO! +${Utils.formatNumber(earnedPoints)}`, e.target, '#ff3838');
            Utils.createScreenShake(8);
        } else if (isCritical) {
            Utils.createFloatingNumber(`CRÍTICO! +${Utils.formatNumber(earnedPoints)}`, e.target, '#ff3838');
            Utils.createScreenShake(5);
        } else if (isQuantum) {
            Utils.createFloatingNumber(`CUÁNTICO! +${Utils.formatNumber(earnedPoints)}`, e.target, '#9b59b6');
        } else {
            Utils.createFloatingNumber(`+${Utils.formatNumber(earnedPoints)}`, e.target);
        }
        
        // Combo visual
        if (gameState.comboCount > 3) {
            Utils.createFloatingNumber(`${gameState.comboCount}x COMBO!`, e.target, '#feca57');
        }
        
        // Multi-click con efectos escalonados
        const multiClicks = GameCalculations.getMultiClicks();
        for (let i = 1; i < multiClicks; i++) {
            setTimeout(() => {
                let extraPoints = Math.floor(GameCalculations.calculateClickPower() * comboMultiplier);
                if (Math.random() < GameCalculations.getCriticalChance()) extraPoints *= 5;
                earnedPoints += extraPoints;
                
                const angle = (i / multiClicks) * Math.PI * 2;
                const offsetX = Math.cos(angle) * 30;
                const offsetY = Math.sin(angle) * 30;
                particleSystem.createParticle(centerX + offsetX, centerY + offsetY);
                
                Utils.createFloatingNumber(`+${Utils.formatNumber(extraPoints)}`, e.target);
                e.target.classList.add('multi-click-effect');
                setTimeout(() => e.target.classList.remove('multi-click-effect'), 300);
            }, i * 100);
        }
        
        gameState.points += earnedPoints;
        gameState.totalClicks++;
        gameState.totalEarned += earnedPoints;
        
        // Drop de gemas con efecto visual
        if (Math.random() < (0.001 + GameCalculations.getLuckBonus())) {
            const gemDrop = Math.floor(Math.random() * 3) + 1;
            gameState.gems += gemDrop;
            particleSystem.createParticle(centerX, centerY, 'gem');
            Utils.createFloatingNumber(`+${gemDrop}💎`, e.target, '#4ecdc4');
        }
        
        // Efecto de ondas en el botón
        e.target.classList.add('ripple-effect');
        setTimeout(() => e.target.classList.remove('ripple-effect'), 600);
        
        // Trackear clicks recientes para estadísticas
        const now = Date.now();
        gameState.recentClicks.push(now);
        gameState.recentClicks = gameState.recentClicks.filter(time => now - time < 1000);
        
        checkLevelUp();
        checkAchievements();
        updateDisplay();
        saveGame();
    });
}

// ====================================
// SISTEMA DE MEJORAS OPTIMIZADO
// ====================================

function buyUpgrade(type) {
    const cost = Utils.getCurrentCost(type);
    
    if (gameState.points < cost) return;
    
    gameState.points -= cost;
    
    const upgradeActions = {
        clickPower: () => {
            gameState.clickPower++;
            gameState.clickPowerLevel++;
        },
        criticalHit: () => gameState.criticalLevel++,
        multiClick: () => gameState.multiClickLevel++,
        autoClicker: () => gameState.autoClickers++,
        starMiner: () => gameState.starMiners++,
        galaxyFarm: () => gameState.galaxyFarms++,
        blackHole: () => gameState.blackHoles++,
        clickMultiplier: () => {
            gameState.clickMultiplier *= 1.5;
            gameState.clickMultLevel++;
        },
        idleMultiplier: () => {
            gameState.idleMultiplier *= 1.5;
            gameState.idleMultLevel++;
        },
        globalMultiplier: () => {
            gameState.globalMultiplier *= 2;
            gameState.globalMultLevel++;
        },
        efficiency: () => gameState.efficiencyLevel++,
        luck: () => gameState.luckLevel++,
        automation: () => gameState.automationLevel++
    };
    
    if (upgradeActions[type]) {
        upgradeActions[type]();
    }
    
    const upgradeElement = document.getElementById(type);
    if (upgradeElement) {
        upgradeElement.classList.add('newly-unlocked');
        setTimeout(() => upgradeElement.classList.remove('newly-unlocked'), 3000);
    }
    
    Utils.createPurchaseEffect(upgradeElement);
    checkAchievements();
    updateDisplay();
    saveGame();
}

function buyResearch(type) {
    const cost = CONFIG.research[type].cost;
    
    if (gameState.dna < cost || gameState.research[type]) return;
    
    gameState.dna -= cost;
    gameState.dnaSpent = (gameState.dnaSpent || 0) + cost;
    gameState.research[type] = true;
    
    const researchElement = document.getElementById(type);
    if (researchElement) {
        researchElement.classList.add('premium-glow');
        setTimeout(() => researchElement.classList.remove('premium-glow'), 5000);
    }
    
    notificationSystem.show(`¡Investigación: ${CONFIG.research[type].name}!`, 'success');
    
    // Efectos especiales según la investigación
    if (type === 'timeWarp') {
        document.body.classList.add('temporal-warp');
        setTimeout(() => document.body.classList.remove('temporal-warp'), 800);
    }
    
    checkAchievements();
    updateDisplay();
    saveGame();
}

// ====================================
// SISTEMA DE PRESTIGIO
// ====================================

function prestige() {
    if (gameState.level < 25) {
        alert('Necesitas alcanzar el nivel 25 para prestigiar');
        return;
    }
    
    const dnaGain = Math.floor(gameState.totalLevels / 10) + gameState.level + gameState.prestigeCount * 5;
    
    if (!confirm(`¿Confirmar prestigio?\nGanarás ${dnaGain} ADN pero perderás todo el progreso actual.`)) return;
    
    // Efectos visuales dramáticos
    document.body.style.animation = 'prestigeTransition 2s ease-in-out';
    
    setTimeout(() => {
        gameState.dna += dnaGain;
        gameState.prestigeCount++;
        gameState.totalLevels += gameState.level;
        
        resetProgress();
        
        notificationSystem.show(`¡Prestigio! +${dnaGain} ADN`, 'premium');
        
        // Crear explosión de partículas
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                particleSystem.createParticle(
                    window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                    'quantum'
                );
            }, i * 20);
        }
        
        checkAchievements();
        updateDisplay();
        saveGame();
        
        document.body.style.animation = '';
    }, 1000);
}

function resetProgress() {
    const preserve = {
        dna: gameState.dna,
        research: gameState.research,
        totalLevels: gameState.totalLevels,
        prestigeCount: gameState.prestigeCount,
        totalClicks: gameState.totalClicks,
        totalEarned: gameState.totalEarned,
        achievements: gameState.achievements,
        premiumPurchases: gameState.premiumPurchases,
        dnaSpent: gameState.dnaSpent,
        usedCodes: gameState.usedCodes,
        sessionStart: gameState.sessionStart
    };
    
    Object.assign(gameState, {
        points: 0,
        gems: 0,
        level: 1,
        clickPower: 1,
        clickPowerLevel: 1,
        criticalLevel: 0,
        multiClickLevel: 0,
        autoClickers: 0,
        starMiners: 0,
        galaxyFarms: 0,
        blackHoles: 0,
        clickMultiplier: 1,
        idleMultiplier: 1,
        globalMultiplier: 1,
        clickMultLevel: 0,
        idleMultLevel: 0,
        globalMultLevel: 0,
        efficiencyLevel: 0,
        luckLevel: 0,
        automationLevel: 0,
        adTimer: 0,
        boosterTime: 0,
        portalMultiplier: 1,
        portalTime: 0,
        blessingTime: 0,
        lastClickTime: 0,
        comboCount: 0,
        recentClicks: [],
        ...preserve
    });
}

// ====================================
// SISTEMA DE LOGROS Y PROGRESIÓN
// ====================================

function checkLevelUp() {
    const requiredPoints = Math.pow(gameState.level, 2) * 1000;
    if (gameState.totalEarned >= requiredPoints) {
        gameState.level++;
        gameState.gems += gameState.level;
        
        // Efectos visuales de level up
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                particleSystem.createParticle(
                    window.innerWidth / 2 + (Math.random() - 0.5) * 300,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 300,
                    'gem'
                );
            }, i * 25);
        }
        
        notificationSystem.show(`¡Nivel ${gameState.level}! +${gameState.level} 💎`, 'success');
        
        // Efecto especial para niveles múltiplos de 10
        if (gameState.level % 10 === 0) {
            document.body.classList.add('level-milestone');
            setTimeout(() => document.body.classList.remove('level-milestone'), 2000);
        }
        
        checkMilestones();
    }
}

function checkAchievements() {
    CONFIG.achievements.forEach(achievement => {
        if (gameState.achievements.includes(achievement.id)) return;
        
        let current = 0;
        switch(achievement.type) {
            case 'clicks': current = gameState.totalClicks; break;
            case 'earned': current = gameState.totalEarned; break;
            case 'level': current = gameState.level; break;
            case 'auto': 
                current = gameState.autoClickers + gameState.starMiners + 
                         gameState.galaxyFarms + gameState.blackHoles; 
                break;
            case 'prestige': current = gameState.prestigeCount; break;
            case 'cps': current = GameCalculations.calculateTotalCPS(); break;
            case 'research': current = Object.keys(gameState.research).length; break;
        }
        
        if (current >= achievement.target) {
            gameState.achievements.push(achievement.id);
            gameState.gems += achievement.reward;
            
            // Efectos especiales para logros importantes
            const isImportant = achievement.reward >= 100;
            if (isImportant) {
                for (let i = 0; i < 30; i++) {
                    setTimeout(() => {
                        particleSystem.createParticle(
                            window.innerWidth - 100 + (Math.random() - 0.5) * 100,
                            50 + (Math.random() - 0.5) * 100,
                            'gem'
                        );
                    }, i * 30);
                }
            }
            
            notificationSystem.show(`${achievement.icon} ¡${achievement.name}! +${achievement.reward}💎`, 'success');
            generateAchievements();
        }
    });
}

function checkMilestones() {
    const milestones = [
        { level: 10, reward: 'gems', amount: 50, name: 'Primer Hito' },
        { level: 25, reward: 'dna', amount: 5, name: 'Despertar Genético' },
        { level: 50, reward: 'multiplier', amount: 2, name: 'Poder Cósmico' },
        { level: 100, reward: 'dna', amount: 25, name: 'Evolución' },
        { level: 200, reward: 'gems', amount: 500, name: 'Maestría Total' }
    ];
    
    milestones.forEach(milestone => {
        const achievementId = `milestone_${milestone.level}`;
        if (gameState.level >= milestone.level && !gameState.achievements.includes(achievementId)) {
            gameState.achievements.push(achievementId);
            
            switch(milestone.reward) {
                case 'gems': gameState.gems += milestone.amount; break;
                case 'dna': gameState.dna += milestone.amount; break;
                case 'multiplier': gameState.globalMultiplier *= milestone.amount; break;
            }
            
            notificationSystem.show(`¡${milestone.name}! Nivel ${milestone.level} alcanzado`, 'premium');
        }
    });
}

function checkDynamicAchievements() {
    const currentTime = Date.now();
    const sessionTime = currentTime - (gameState.sessionStart || currentTime);
    
    // Logros por tiempo de sesión
    if (sessionTime > 3600000 && !gameState.achievements.includes('marathon_player')) {
        gameState.achievements.push('marathon_player');
        gameState.gems += 200;
        notificationSystem.show('🏃 ¡Jugador Maratonista! +200💎', 'success');
    }
    
    // Logros por clicks por segundo
    const cps = gameState.recentClicks.length;
    if (cps > 20 && !gameState.achievements.includes('speed_clicker')) {
        gameState.achievements.push('speed_clicker');
        gameState.gems += 150;
        notificationSystem.show('⚡ ¡Clickeador Veloz! +150💎', 'success');
    }
    
    // Logros por eficiencia
    const efficiency = gameState.totalEarned / Math.max(gameState.totalClicks, 1);
    if (efficiency > 1000 && !gameState.achievements.includes('efficient_master')) {
        gameState.achievements.push('efficient_master');
        gameState.gems += 300;
        notificationSystem.show('🎯 ¡Maestro de la Eficiencia! +300💎', 'success');
    }
}

function generateAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    CONFIG.achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'upgrade-item fade-in-up';
        
        const unlocked = gameState.achievements.includes(achievement.id);
        if (unlocked) div.classList.add('maxed');
        
        div.innerHTML = `
            <div>
                <strong>${achievement.icon} ${achievement.name} ${unlocked ? '✅' : '🔒'}</strong><br>
                <small>${achievement.description}</small>
            </div>
            <div style="color: ${unlocked ? '#4ecdc4' : '#ffd700'}; font-weight: bold; font-size: 11px;">
                ${unlocked ? `+${achievement.reward}💎` : `${achievement.reward}💎`}
            </div>
        `;
        
        // Efecto hover para logros no desbloqueados
        if (!unlocked) {
            div.addEventListener('mouseenter', () => {
                div.style.transform = 'translateX(5px) scale(1.02)';
                div.style.boxShadow = '0 5px 25px rgba(255, 215, 0, 0.3)';
            });
            div.addEventListener('mouseleave', () => {
                div.style.transform = '';
                div.style.boxShadow = '';
            });
        }
        
        container.appendChild(div);
    });
}

// ====================================
// SISTEMA DE ACTUALIZACIÓN DE UI
// ====================================

function updateDisplay() {
    const elements = {
        points: document.getElementById('points'),
        gems: document.getElementById('gems'),
        dna: document.getElementById('dna'),
        level: document.getElementById('level'),
        totalCps: document.getElementById('totalCps'),
        clickPowerDisplay: document.getElementById('clickPowerDisplay')
    };
    
    // Verificar que los elementos existen antes de actualizarlos
    if (elements.points) {
        const oldPoints = parseInt(elements.points.textContent.replace(/[^\d]/g, '')) || 0;
        const newPoints = gameState.points;
        
        if (newPoints > oldPoints * 1.1) {
            elements.points.classList.add('big-number');
            setTimeout(() => elements.points.classList.remove('big-number'), 1000);
        }
        
        elements.points.textContent = Utils.formatNumber(gameState.points);
    }
    
    if (elements.gems) elements.gems.textContent = gameState.gems;
    if (elements.dna) elements.dna.textContent = gameState.dna;
    if (elements.level) elements.level.textContent = gameState.level;
    if (elements.totalCps) elements.totalCps.textContent = Utils.formatNumber(GameCalculations.calculateTotalCPS());
    if (elements.clickPowerDisplay) elements.clickPowerDisplay.textContent = `+${Utils.formatNumber(GameCalculations.calculateClickPower())}`;
    
    // Actualizar barra de progreso de nivel
    const levelProgress = document.getElementById('levelProgress');
    if (levelProgress) {
        const requiredForNextLevel = Math.pow(gameState.level, 2) * 1000;
        const progress = Math.min((gameState.totalEarned / requiredForNextLevel) * 100, 100);
        levelProgress.style.width = progress + '%';
    }
    
    updateUpgradeButtons();
    updateResearchButtons();
    updateActiveEffects();
    updatePrestigeButton();
}

function updateUpgradeButtons() {
    const upgrades = [
        'clickPower', 'criticalHit', 'multiClick', 'autoClicker', 'starMiner', 
        'galaxyFarm', 'blackHole', 'clickMultiplier', 'idleMultiplier', 
        'globalMultiplier', 'efficiency', 'luck', 'automation'
    ];
    
    upgrades.forEach(upgrade => {
        const button = document.querySelector(`#${upgrade} .upgrade-button`);
        const item = document.getElementById(upgrade);
        if (!button || !item) return;
        
        const canAfford = gameState.points >= Utils.getCurrentCost(upgrade);
        
        button.disabled = !canAfford;
        if (canAfford) {
            item.classList.add('affordable');
        } else {
            item.classList.remove('affordable');
        }
        
        // Actualizar texto del costo
        const costSpan = button.querySelector('span');
        if (costSpan) {
            costSpan.textContent = Utils.formatNumber(Utils.getCurrentCost(upgrade));
        }
    });
}

function updateResearchButtons() {
    Object.keys(CONFIG.research).forEach(research => {
        const button = document.querySelector(`#${research} .upgrade-button`);
        const item = document.getElementById(research);
        if (!button || !item) return;
        
        const isResearched = gameState.research[research];
        const canAfford = gameState.dna >= CONFIG.research[research].cost;
        
        if (isResearched) {
            button.textContent = 'COMPLETADO';
            button.disabled = true;
            item.classList.add('maxed');
        } else {
            button.disabled = !canAfford;
            if (canAfford) {
                item.classList.add('available');
            } else {
                item.classList.remove('available');
            }
        }
    });
}

function updateActiveEffects() {
    const effectsContainer = document.getElementById('activeEffects');
    if (!effectsContainer) return;
    
    const effects = [];
    
    if (gameState.boosterTime > 0) {
        effects.push(`⚡ x10 Velocidad (${Math.floor(gameState.boosterTime / 60)}m)`);
    }
    
    if (gameState.research.quantumClick) effects.push('🌀 Click Cuántico');
    if (gameState.research.timeWarp) effects.push('⏰ Distorsión Temporal');
    if (gameState.research.neuralNetwork) effects.push('🧠 Red Neural');
    
    if (gameState.research.cosmicResonance) {
        const bonus = Math.floor(gameState.totalLevels / 100) * 100;
        if (bonus > 0) effects.push(`🌌 Resonancia +${bonus}%`);
    }
    
    if (gameState.comboCount > 3) {
        effects.push(`🔥 Combo x${gameState.comboCount}`);
    }
    
    if (gameState.portalTime > 0) {
        effects.push(`🌀 Portal x${gameState.portalMultiplier.toFixed(1)} (${Math.floor(gameState.portalTime / 60)}m)`);
    }
    
    if (gameState.blessingTime > 0) {
        effects.push(`✨ Bendición Cósmica (${Math.floor(gameState.blessingTime / 60)}m)`);
    }
    
    if (effects.length > 0) {
        effectsContainer.innerHTML = '<div>Efectos Activos:</div>' + 
            effects.map(effect => `<div class="effect-item">${effect}</div>`).join('');
    } else {
        effectsContainer.innerHTML = '<div>Sin efectos activos</div>';
    }
}

function updatePrestigeButton() {
    const prestigeDNA = Math.floor(gameState.totalLevels / 10) + gameState.level + gameState.prestigeCount * 5;
    const prestigeDNAElement = document.getElementById('prestigeDNA');
    const totalLevelsElement = document.getElementById('totalLevels');
    const prestigeBtn = document.getElementById('prestigeBtn');
    
    if (prestigeDNAElement) prestigeDNAElement.textContent = prestigeDNA;
    if (totalLevelsElement) totalLevelsElement.textContent = gameState.totalLevels + gameState.level;
    
    if (prestigeBtn) {
        prestigeBtn.disabled = gameState.level < 25;
        
        if (gameState.level >= 25) {
            prestigeBtn.classList.add('prestige-ready');
            prestigeBtn.textContent = `PRESTIGIO (+${prestigeDNA} ADN)`;
        } else {
            prestigeBtn.classList.remove('prestige-ready');
            prestigeBtn.textContent = `PRESTIGIO (Requiere Nivel 25)`;
        }
    }
}

// ====================================
// SISTEMA DE EVENTOS ESPECIALES
// ====================================

const SpecialEvents = {
    events: [
        {
            name: 'Lluvia de Estrellas',
            chance: 0.0008,
            effect: () => {
                const bonus = Math.floor(gameState.points * (0.05 + Math.random() * 0.15));
                gameState.points += bonus;
                
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        particleSystem.createParticle(
                            Math.random() * window.innerWidth,
                            -10,
                            'default'
                        );
                    }, i * 100);
                }
                
                return `+${Utils.formatNumber(bonus)} puntos de las estrellas`;
            }
        },
        {
            name: 'Cristal Cósmico',
            chance: 0.0005,
            effect: () => {
                const gems = Math.floor(Math.random() * 25) + 15;
                gameState.gems += gems;
                
                for (let i = 0; i < gems; i++) {
                    setTimeout(() => {
                        particleSystem.createParticle(
                            window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                            window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                            'gem'
                        );
                    }, i * 40);
                }
                
                return `¡${gems} cristales cósmicos encontrados!`;
            }
        },
        {
            name: 'Anomalía Temporal',
            chance: 0.0003,
            effect: () => {
                const timeBonus = Math.floor(Math.random() * 900) + 600; // 10-25 min
                gameState.boosterTime += timeBonus;
                
                document.body.classList.add('temporal-warp');
                setTimeout(() => document.body.classList.remove('temporal-warp'), 1500);
                
                return `Tiempo acelerado por ${Math.floor(timeBonus/60)} minutos`;
            }
        },
        {
            name: 'Portal Interdimensional',
            chance: 0.0002,
            effect: () => {
                const multiplier = 2 + Math.random() * 3; // 2x - 5x
                const duration = 300 + Math.random() * 600; // 5-15 min
                
                gameState.portalMultiplier = multiplier;
                gameState.portalTime = duration;
                
                return `¡Portal x${multiplier.toFixed(1)} por ${Math.floor(duration/60)}min!`;
            }
        },
        {
            name: 'Descubrimiento Genético',
            chance: 0.0004,
            effect: () => {
                const dna = Math.floor(Math.random() * 8) + 3;
                gameState.dna += dna;
                
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        particleSystem.createParticle(
                            window.innerWidth / 2 + (Math.random() - 0.5) * 150,
                            window.innerHeight / 2 + (Math.random() - 0.5) * 150,
                            'quantum'
                        );
                    }, i * 60);
                }
                
                return `¡${dna} secuencias de ADN descubiertas!`;
            }
        },
        {
            name: 'Bendición Cósmica',
            chance: 0.0001,
            effect: () => {
                gameState.globalMultiplier *= 1.5;
                gameState.blessingTime = 1800; // 30 min
                
                document.body.classList.add('premium-transition');
                setTimeout(() => document.body.classList.remove('premium-transition'), 3000);
                
                return '¡Bendición cósmica! +50% multiplicador global';
            }
        }
    ],

    check() {
        if (gameState.level >= 5) {
            this.events.forEach(event => {
                if (Math.random() < event.chance) {
                    const result = event.effect();
                    notificationSystem.show(`✨ ${event.name}! ${result}`, 'premium', 7000);
                    updateDisplay();
                    saveGame();
                }
            });
        }
    }
};

// ====================================
// SISTEMA DE DESAFÍOS SEMANALES
// ====================================

const WeeklyChallenge = {
    getCurrentChallenge() {
        const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
        const challenges = [
            { 
                name: "Speedster", 
                desc: "Consigue 10K clicks esta semana", 
                target: 10000, 
                type: "clicks",
                reward: { gems: 500, dna: 20 }
            },
            { 
                name: "Collector", 
                desc: "Acumula 500 gemas", 
                target: 500, 
                type: "gems",
                reward: { points: 1000000, multiplier: 2 }
            },
            { 
                name: "Researcher", 
                desc: "Gasta 100 ADN en investigación", 
                target: 100, 
                type: "dna_spent",
                reward: { dna: 50, gems: 200 }
            }
        ];
        return challenges[week % challenges.length];
    },
    
    checkProgress() {
        const challenge = this.getCurrentChallenge();
        const progress = this.getProgress(challenge);
        
        if (progress >= challenge.target && !gameState.weeklyCompleted) {
            gameState.weeklyCompleted = true;
            this.completeChallenge(challenge);
        }
        
        return { challenge, progress };
    },
    
    getProgress(challenge) {
        switch(challenge.type) {
            case 'clicks': return gameState.totalClicks;
            case 'gems': return gameState.gems;
            case 'dna_spent': return gameState.dnaSpent || 0;
            default: return 0;
        }
    },
    
    completeChallenge(challenge) {
        Object.keys(challenge.reward).forEach(key => {
            switch(key) {
                case 'gems': gameState.gems += challenge.reward[key]; break;
                case 'dna': gameState.dna += challenge.reward[key]; break;
                case 'points': gameState.points += challenge.reward[key]; break;
                case 'multiplier': gameState.globalMultiplier *= challenge.reward[key]; break;
            }
        });
        
        notificationSystem.show(`🏆 ¡Desafío Semanal Completado! ${challenge.name}`, 'premium', 8000);
    }
};

// ====================================
// SISTEMA DE CÓDIGOS SECRETOS
// ====================================

const SecretCodes = {
    codes: {
        'COSMIC': () => {
            gameState.dna += 100;
            gameState.gems += 1000;
            notificationSystem.show('🌌 ¡Código COSMIC! +100 ADN +1000💎', 'premium');
        },
        'CLICKER': () => {
            gameState.globalMultiplier *= 3;
            notificationSystem.show('🖱️ ¡Código CLICKER! Multiplicador x3', 'premium');
        },
        'INFINITY': () => {
            gameState.points += 10000000;
            notificationSystem.show('♾️ ¡Código INFINITY! +10M puntos', 'premium');
        }
    },

    secretInput: '',

    handleKeyInput(key) {
        if (key.match(/[A-Z]/)) {
            this.secretInput += key;
            if (this.secretInput.length > 10) {
                this.secretInput = this.secretInput.slice(-10);
            }
            
            Object.keys(this.codes).forEach(code => {
                if (this.secretInput.includes(code) && !gameState.usedCodes?.includes(code)) {
                    gameState.usedCodes = gameState.usedCodes || [];
                    gameState.usedCodes.push(code);
                    this.codes[code]();
                    this.secretInput = '';
                    updateDisplay();
                    saveGame();
                }
            });
        }
    }
};

// ====================================
// FUNCIONES DE COMPRAS Y TIENDA
// ====================================

function buyPremium(pack) {
    const premiumEffect = () => {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                particleSystem.createParticle(
                    window.innerWidth / 2 + (Math.random() - 0.5) * 250,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 250,
                    'gem'
                );
            }, i * 40);
        }
    };
    
    document.body.classList.add('premium-transition');
    setTimeout(() => document.body.classList.remove('premium-transition'), 2000);
    
    const purchases = {
        starter: () => {
            gameState.points += 10000;
            gameState.gems += 15;
            gameState.globalMultiplier *= 3;
            gameState.dna += 5;
            notificationSystem.show('🎁 ¡Paquete Inicial Adquirido!', 'premium');
        },
        supreme: () => {
            gameState.points += 1000000;
            gameState.gems += 200;
            gameState.globalMultiplier *= 10;
            gameState.dna += 50;
            gameState.automationLevel = Math.max(gameState.automationLevel, 1);
            notificationSystem.show('💎 ¡Pack Supremo Desbloqueado!', 'premium');
        },
        research: () => {
            gameState.dna += 100;
            Object.keys(CONFIG.research).forEach(research => {
                gameState.research[research] = true;
            });
            gameState.globalMultiplier *= 5;
            notificationSystem.show('🧬 ¡Kit de Investigación Completo!', 'premium');
        },
        booster: () => {
            gameState.boosterTime = 7200; // 2 horas
            gameState.luckLevel += 3;
            notificationSystem.show('⚡ ¡Acelerador Temporal Activado!', 'premium');
            document.body.classList.add('booster-active');
        },
        noAds: () => {
            gameState.premiumPurchases.push('noAds');
            gameState.adTimer = 0;
            gameState.gems += 50;
            notificationSystem.show('📱 ¡Premium Sin Anuncios!', 'premium');
        }
    };
    
    if (purchases[pack]) {
        purchases[pack]();
        
        if (!gameState.premiumPurchases.includes(pack)) {
            gameState.premiumPurchases.push(pack);
        }
        
        premiumEffect();
        Utils.createScreenShake(10);
        updateDisplay();
        saveGame();
        
        setTimeout(() => {
            alert(`✨ ¡Compra completada!\n\nPaquete: ${pack.toUpperCase()}\nBeneficios aplicados exitosamente.\n\n¡Gracias por apoyar Cosmic Clicker!`);
        }, 500);
    }
}

function watchAd() {
    if (gameState.adTimer > 0) return;
    
    const watchBtn = document.getElementById('watchAd');
    if (!watchBtn) return;
    
    watchBtn.disabled = true;
    watchBtn.textContent = 'Cargando anuncio...';
    watchBtn.classList.add('loading-pulse');
    
    setTimeout(() => {
        const rewards = [
            { type: 'points', amount: Math.floor(gameState.points * 0.1), text: 'puntos', color: '#ffd700' },
            { type: 'gems', amount: Math.floor(Math.random() * 10) + 5, text: 'gemas', color: '#4ecdc4' },
            { type: 'dna', amount: Math.floor(Math.random() * 3) + 1, text: 'ADN', color: '#9b59b6' },
            { type: 'booster', amount: 300, text: 'segundos de x2', color: '#e74c3c' }
        ];
        
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                particleSystem.createParticle(
                    window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                    reward.type === 'gems' ? 'gem' : 'default'
                );
            }, i * 50);
        }
        
        switch(reward.type) {
            case 'points': gameState.points += reward.amount; break;
            case 'gems': gameState.gems += reward.amount; break;
            case 'dna': gameState.dna += reward.amount; break;
            case 'booster': gameState.boosterTime += reward.amount; break;
        }
        
        notificationSystem.show(`¡Anuncio completado! +${reward.amount} ${reward.text}`, 'success');
        gameState.adTimer = 180;
        
        watchBtn.classList.remove('loading-pulse');
        updateDisplay();
        saveGame();
    }, 2000);
}

// ====================================
// FUNCIONES DE NAVEGACIÓN
// ====================================

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName + '-tab');
    const targetButton = event?.target || document.querySelector(`[onclick*="${tabName}"]`);
    
    if (targetTab) {
        targetTab.classList.add('active', 'tab-enter');
        setTimeout(() => targetTab.classList.remove('tab-enter'), 500);
    }
    
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// ====================================
// SISTEMA DE GUARDADO Y CARGA
// ====================================

function saveGame() {
    try {
        localStorage.setItem('cosmicClickerSave', JSON.stringify(gameState));
    } catch (e) {
        console.warn('No se pudo guardar el juego:', e);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('cosmicClickerSave');
        if (saved) {
            const savedState = JSON.parse(saved);
            Object.assign(gameState, savedState);
            
            // Inicializar propiedades que podrían no existir en guardados antiguos
            gameState.recentClicks = gameState.recentClicks || [];
            gameState.usedCodes = gameState.usedCodes || [];
            gameState.sessionStart = gameState.sessionStart || Date.now();
            gameState.dnaSpent = gameState.dnaSpent || 0;
        }
    } catch (e) {
        console.warn('No se pudo cargar el juego:', e);
    }
    
    updateDisplay();
    generateAchievements();
    
    // Animación de carga
    document.body.classList.add('loading-pulse');
    setTimeout(() => {
        document.body.classList.remove('loading-pulse');
    }, 1000);
}

// ====================================
// TIMERS Y LOOPS PRINCIPALES
// ====================================

// Loop principal de generación automática
function startMainLoop() {
    setInterval(() => {
        let totalCps = GameCalculations.calculateTotalCPS();
        
        if (totalCps > 0) {
            gameState.points += totalCps;
            gameState.totalEarned += totalCps;
            
            // Efectos visuales para CPS alto
            if (totalCps > 1000 && Math.random() < 0.1) {
                const container = document.querySelector('.container');
                if (container) {
                    const rect = container.getBoundingClientRect();
                    particleSystem.createParticle(
                        rect.left + Math.random() * rect.width,
                        rect.top + Math.random() * rect.height
                    );
                }
            }
            
            // Red neural (genera ADN)
            if (gameState.research.neuralNetwork && totalCps > 100) {
                if (Math.random() < 0.01) {
                    gameState.dna += Math.floor(totalCps / 1000);
                }
            }
        }
        
        // Efectos visuales del booster
        if (gameState.boosterTime > 0) {
            gameState.boosterTime--;
            if (Math.random() < 0.3) {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                particleSystem.createParticle(
                    centerX + (Math.random() - 0.5) * 100, 
                    centerY + (Math.random() - 0.5) * 100
                );
            }
        }
        
        // Decrementar efectos temporales
        if (gameState.portalTime > 0) {
            gameState.portalTime--;
            if (gameState.portalTime === 0) {
                gameState.portalMultiplier = 1;
                notificationSystem.show('Portal interdimensional cerrado', 'info');
            }
        }
        
        if (gameState.blessingTime > 0) {
            gameState.blessingTime--;
            if (gameState.blessingTime === 0) {
                notificationSystem.show('Bendición cósmica finalizada', 'info');
            }
        }
        
        updateDisplay();
    }, 1000);
}

// Timer de anuncios
function startAdTimer() {
    setInterval(() => {
        if (gameState.adTimer > 0) {
            gameState.adTimer--;
            const adTimerElement = document.getElementById('adTimer');
            const watchBtn = document.getElementById('watchAd');
            
            if (adTimerElement) adTimerElement.textContent = gameState.adTimer;
            
            if (watchBtn) {
                watchBtn.disabled = gameState.adTimer > 0;
                watchBtn.textContent = gameState.adTimer > 0 ? 
                    `Esperar (${gameState.adTimer}s)` : 'Ver Anuncio (Disponible)';
                
                if (gameState.adTimer === 0) {
                    watchBtn.classList.add('interactive-element');
                }
            }
        }
    }, 1000);
}

// Auto-compra mejorada
function startAutoUpgradeLoop() {
    setInterval(() => {
        if (gameState.automationLevel > 0 && gameState.points > 100000) {
            const autoUpgrades = ['clickPower', 'autoClicker', 'starMiner'];
            autoUpgrades.forEach(upgrade => {
                const cost = Utils.getCurrentCost(upgrade);
                if (gameState.points >= cost * 2) {
                    buyUpgrade(upgrade);
                    
                    // Efecto visual para auto-compra
                    const upgradeElement = document.getElementById(upgrade);
                    if (upgradeElement) {
                        upgradeElement.style.background = 'rgba(78, 205, 196, 0.3)';
                        setTimeout(() => {
                            upgradeElement.style.background = '';
                        }, 1000);
                    }
                }
            });
        }
    }, 5000);
}

// Loop de eventos especiales
function startSpecialEventsLoop() {
    setInterval(() => {
        SpecialEvents.check();
    }, 1000);
}

// Loop de partículas ambientales
function startAmbientParticlesLoop() {
    setInterval(() => {
        if (gameState.level > 10 && Math.random() < 0.05) {
            particleSystem.createParticle(
                Math.random() * window.innerWidth,
                window.innerHeight + 10,
                'default'
            );
        }
    }, 2000);
}

// Verificar logros dinámicos
function startDynamicAchievementsLoop() {
    setInterval(() => {
        checkDynamicAchievements();
        
        // Limpiar clicks antiguos
        const now = Date.now();
        gameState.recentClicks = gameState.recentClicks.filter(time => now - time < 1000);
    }, 30000);
}

// Mostrar consejos periódicamente
function startTutorialTipsLoop() {
    let tipIndex = 0;
    setInterval(() => {
        if (gameState.level > 5 && Math.random() < 0.3) {
            notificationSystem.show(CONFIG.tutorialTips[tipIndex], 'info', 6000);
            tipIndex = (tipIndex + 1) % CONFIG.tutorialTips.length;
        }
    }, 60000);
}

// ====================================
// INICIALIZACIÓN Y EVENTOS
// ====================================

function initializeCSS() {
    const css = `
    @keyframes prestigeTransition {
        0% { filter: brightness(1) contrast(1); }
        25% { filter: brightness(2) contrast(2) hue-rotate(90deg); }
        50% { filter: brightness(0.5) contrast(3) hue-rotate(180deg) blur(2px); }
        75% { filter: brightness(3) contrast(1) hue-rotate(270deg); }
        100% { filter: brightness(1) contrast(1) hue-rotate(360deg); }
    }

    .level-milestone {
        animation: levelMilestone 2s ease-in-out;
    }

    @keyframes levelMilestone {
        0%, 100% { 
            filter: brightness(1); 
            transform: scale(1);
        }
        25% { 
            filter: brightness(1.5) hue-rotate(90deg); 
            transform: scale(1.02);
        }
        50% { 
            filter: brightness(2) hue-rotate(180deg); 
            transform: scale(1.05);
        }
        75% { 
            filter: brightness(1.5) hue-rotate(270deg); 
            transform: scale(1.02);
        }
    }

    @keyframes achievementBounce {
        0% { transform: translateX(0) scale(1); }
        15% { transform: translateX(-10px) scale(1.1); }
        30% { transform: translateX(5px) scale(0.95); }
        45% { transform: translateX(-5px) scale(1.05); }
        60% { transform: translateX(2px) scale(0.98); }
        75% { transform: translateX(-1px) scale(1.02); }
        100% { transform: translateX(0) scale(1); }
    }

    .premium-transition {
        animation: premiumPulse 2s ease-in-out;
    }

    @keyframes premiumPulse {
        0%, 100% { 
            filter: brightness(1); 
            transform: scale(1);
        }
        25% { 
            filter: brightness(1.5) hue-rotate(45deg); 
            transform: scale(1.01);
        }
        50% { 
            filter: brightness(2) hue-rotate(90deg) saturate(1.5); 
            transform: scale(1.02);
        }
        75% { 
            filter: brightness(1.5) hue-rotate(135deg); 
            transform: scale(1.01);
        }
    }

    .booster-active {
        animation: boosterGlow 3s ease-in-out infinite;
    }

    @keyframes boosterGlow {
        0%, 100% { box-shadow: none; }
        50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.8); }
    }

    .critical-hit {
        animation: criticalShake 0.8s ease-in-out;
        filter: hue-rotate(0deg) saturate(2) brightness(1.5);
    }

    @keyframes criticalShake {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-2deg) scale(1.05); }
        50% { transform: rotate(2deg) scale(1.1); }
        75% { transform: rotate(-1deg) scale(1.05); }
    }

    .quantum-effect {
        animation: quantumFlicker 0.5s ease-in-out;
    }

    @keyframes quantumFlicker {
        0%, 100% { 
            filter: brightness(1); 
            transform: scale(1);
        }
        25% { 
            filter: brightness(0.5) hue-rotate(180deg); 
            transform: scale(0.95);
        }
        50% { 
            filter: brightness(2) hue-rotate(360deg); 
            transform: scale(1.1);
        }
        75% { 
            filter: brightness(0.8) hue-rotate(540deg); 
            transform: scale(1.05);
        }
    }

    .multi-click-effect {
        animation: multiClickPulse 0.3s ease-out;
    }

    @keyframes multiClickPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
    }

    .ripple-effect {
        position: relative;
        overflow: hidden;
    }

    .ripple-effect::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s ease-out;
    }

    @keyframes ripple {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }

    .newly-unlocked {
        animation: newlyUnlocked 3s ease-in-out;
        border: 2px solid #ffd700 !important;
    }

    @keyframes newlyUnlocked {
        0%, 100% { 
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); 
        }
        50% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 1); 
        }
    }

    .premium-glow {
        animation: premiumGlow 5s ease-in-out;
        border: 2px solid #9b59b6 !important;
    }

    @keyframes premiumGlow {
        0%, 100% { 
            box-shadow: 0 0 10px rgba(155, 89, 182, 0.5); 
        }
        50% { 
            box-shadow: 0 0 30px rgba(155, 89, 182, 1); 
        }
    }

    .temporal-warp {
        animation: temporalWarp 0.8s ease-in-out;
    }

    @keyframes temporalWarp {
        0%, 100% { 
            filter: brightness(1) blur(0px); 
            transform: scale(1);
        }
        25% { 
            filter: brightness(2) blur(1px) hue-rotate(90deg); 
            transform: scale(1.02);
        }
        50% { 
            filter: brightness(0.5) blur(2px) hue-rotate(180deg); 
            transform: scale(0.98);
        }
        75% { 
            filter: brightness(3) blur(1px) hue-rotate(270deg); 
            transform: scale(1.01);
        }
    }

    .loading-pulse {
        animation: loadingPulse 1s ease-in-out;
    }

    @keyframes loadingPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }

    .big-number {
        animation: bigNumberGrow 1s ease-out;
    }

    @keyframes bigNumberGrow {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); color: #ffd700; }
        100% { transform: scale(1); }
    }

    .achievement-sparkle {
        position: relative;
    }

    .achievement-sparkle::before {
        content: '✨';
        position: absolute;
        left: -25px;
        top: 50%;
        transform: translateY(-50%);
        animation: sparkle 4s ease-in-out;
    }

    @keyframes sparkle {
        0%, 100% { opacity: 0; transform: translateY(-50%) rotate(0deg); }
        50% { opacity: 1; transform: translateY(-50%) rotate(180deg); }
    }

    .interactive-element {
        animation: interactivePulse 2s ease-in-out infinite;
    }

    @keyframes interactivePulse {
        0%, 100% { 
            box-shadow: 0 0 5px rgba(78, 205, 196, 0.5); 
        }
        50% { 
            box-shadow: 0 0 15px rgba(78, 205, 196, 1); 
            transform: scale(1.02);
        }
    }

    .prestige-ready {
        animation: prestigeReady 3s ease-in-out infinite;
        background: linear-gradient(45deg, #e74c3c, #f39c12, #e74c3c) !important;
        background-size: 200% 200% !important;
    }

    @keyframes prestigeReady {
        0%, 100% { 
            background-position: 0% 50%; 
            transform: scale(1);
        }
        50% { 
            background-position: 100% 50%; 
            transform: scale(1.05);
        }
    }

    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .tab-enter {
        animation: tabEnter 0.5s ease-out;
    }

    @keyframes tabEnter {
        0% {
            opacity: 0;
            transform: translateX(20px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px);
        }
    }

    .floating-number {
        animation: floatUp 1.2s ease-out forwards;
    }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

function initializeEventListeners() {
    // Setup click button
    setupClickButton();
    
    // Códigos secretos
    document.addEventListener('keydown', function(e) {
        SecretCodes.handleKeyInput(e.key);
    });
    
    // Hacer funciones globales para el HTML
    window.buyUpgrade = buyUpgrade;
    window.buyResearch = buyResearch;
    window.prestige = prestige;
    window.buyPremium = buyPremium;
    window.watchAd = watchAd;
    window.switchTab = switchTab;
}

function initializeGame() {
    console.log('🌟 Inicializando Cosmic Clicker - Versión Optimizada...');
    
    // Inicializar CSS
    initializeCSS();
    
    // Cargar juego guardado
    loadGame();
    
    // Configurar event listeners
    initializeEventListeners();
    
    // Mostrar desafío semanal
    setTimeout(() => {
        const {challenge, progress} = WeeklyChallenge.checkProgress();
        if (!gameState.weeklyCompleted) {
            notificationSystem.show(`📅 Desafío: ${challenge.name} (${progress}/${challenge.target})`, 'info', 6000);
        }
    }, 5000);
    
    // Iniciar todos los loops
    startMainLoop();
    startAdTimer();
    startAutoUpgradeLoop();
    startSpecialEventsLoop();
    startAmbientParticlesLoop();
    startDynamicAchievementsLoop();
    startTutorialTipsLoop();
    
    console.log('🎮 Características incluidas:');
    console.log('  • Sistema de partículas optimizado');
    console.log('  • Efectos visuales mejorados');
    console.log('  • Notificaciones dinámicas');
    console.log('  • Eventos especiales aleatorios');
    console.log('  • Sistema de combos');
    console.log('  • Desafíos semanales');
    console.log('  • Códigos secretos');
    console.log('  • Logros dinámicos');
    console.log('  • Rendimiento optimizado');
    console.log('💡 Tip: Hay muchos secretos por descubrir...');
}

// ====================================
// AUTO-INICIALIZACIÓN
// ====================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

// Guardar automáticamente cada 30 segundos
setInterval(saveGame, 30000);

// Guardar antes de cerrar la página
window.addEventListener('beforeunload', saveGame);

// ==============================================
// PWA - SERVICE WORKER REGISTRATION
// ==============================================

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('🚀 PWA: Service Worker registrado exitosamente');
        console.log('📱 Tu juego ya funciona offline!');
        
        // Manejar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Mostrar notificación de actualización
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('❌ PWA: Error al registrar Service Worker:', error);
      });
  });
}

// Función para mostrar notificación de actualización
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: 'Exo 2', sans-serif;
      font-size: 14px;
      animation: slideDown 0.5s ease;
    ">
      🚀 ¡Nueva versión disponible!
      <button onclick="updateApp()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 15px;
        border-radius: 15px;
        margin-left: 10px;
        cursor: pointer;
      ">Actualizar</button>
    </div>
  `;
  document.body.appendChild(notification);
}

// Función para actualizar la app
function updateApp() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.createElement('button');

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🎯 PWA: Prompt de instalación disponible');
  e.preventDefault();
  deferredPrompt = e;
  showInstallButton();
});

function showInstallButton() {
  // Crear botón de instalación
  installButton.innerHTML = '📱 Instalar App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-family: 'Exo 2', sans-serif;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    z-index: 9999;
    transition: all 0.3s ease;
  `;
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`🎯 PWA: Usuario ${outcome} la instalación`);
      deferredPrompt = null;
      installButton.style.display = 'none';
    }
  });
  
  document.body.appendChild(installButton);
}

// Detectar si ya está instalado
window.addEventListener('appinstalled', (evt) => {
  console.log('🎉 PWA: App instalada exitosamente!');
  if (installButton.parentNode) {
    installButton.parentNode.removeChild(installButton);
  }
});

// Agregar animación CSS para la notificación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;
document.head.appendChild(style);

console.log('🌟 Cosmic Clicker PWA cargado correctamente!');