class BlazeAPIMonitor {
    constructor() {
        this.resultadoAnterior = [];
        this.isRunning = false;
        this.colors = {
            0: '⚪',
            1: '🔴', 2: '🔴', 3: '🔴', 4: '🔴', 
            5: '🔴', 6: '🔴', 7: '🔴', 8: '⚫',
            9: '⚫', 10: '⚫', 11: '⚫', 12: '⚫',
            13: '⚫', 14: '⚫'
        };
    }

    // Configurações da sessão Blaze - MANTENDO HEADERS ORIGINAIS
    getHeaders() {
        const cookies = {
            '_gid': 'GA1.2.781127896.1714749072',
            'AMP_MKTG': 'JTdCJTdE',
            '_did': 'web_712234434B09A034',
            'kwai_uuid': '4f8f5347e9db8f1a30e3a0751d616c40',
            '_gcl_au': '1.1.1274132088.1714749077',
            '_fbp': 'fb.1.1714749077202.1498210684',
            'AMP': 'JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI5NTBlMTNlMy05MDBiLTQwMTQtYWE2Yy0xZDY4MWEzOGVmNzYlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzE0NzQ5MDc0MzA0JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTcxNDc0OTA3NDM5MCUyQyUyMmxhc3RFdmVudElkJTIyJTNBMCU3RA==',
            '_ga_LR2H8FWXB7': 'GS1.1.1714757367.3.1.1714757372.0.0.0',
            '_ga': 'GA1.1.1834781342.1714749072'
        };

        const cookieString = Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        return {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,zh;q=0.5,it;q=0.4,es;q=0.3,ru;q=0.2',
            'cookie': cookieString,
            'device_id': '950e13e3-900b-4014-aa6c-1d681a38ef76',
            'ipcountry': 'BR',
            'priority': 'u=1, i',
            'referer': 'https://blaze.bet.br/pt/games/double',
            'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'session_id': '1714749074304',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'x-client-language': 'pt',
            'x-client-version': 'v2.280.0',
            'x-kl-kis-ajax-request': 'Ajax_Request'
        };
    }

    // Buscar resultados recentes da API Blaze - USANDO URL ORIGINAL
    async getBlazeResults() {
        const url = 'https://blaze.bet.br/api/singleplayer-originals/originals/roulette_games/recent/1';
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                
                // Processar dados conforme padrão Blaze
                if (Array.isArray(data)) {
                    return data.map(item => ({
                        id: item.id,
                        roll: item.roll,
                        color: this.colors[item.roll] || 'UNKNOWN',
                        created_at: item.created_at
                    }));
                }
                
                return [];
            } else {
                console.error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
                return [];
            }
        } catch (error) {
            console.error('❌ Erro na requisição:', error.message);
            return [];
        }
    }

    // Formatar saída dos resultados
    formatResults(results) {
        if (!results || results.length === 0) return;

        console.log('\n🎲 BLAZE DOUBLE - RESULTADOS RECENTES');
        console.log('='.repeat(50));
        
        const latest = results.slice(0, 10); // Últimos 10 resultados
        const rolls = latest.map(r => r.roll);
        const colors = latest.map(r => r.color);
        
        console.log('🎯 Números:', rolls.join(' - '));
        console.log('🎨 Cores:', colors.join(' - '));
        
        // Estatísticas rápidas
const vermelhos = colors.filter(c => c === '🔴').length;
        const pretos = colors.filter(c => c === '⚫').length;
        const brancos = colors.filter(c => c === '⚪').length;
        
        console.log('\n📊 ESTATÍSTICAS (últimos 10):');
        console.log(`🔴 Vermelhos: ${vermelhos}`);
        console.log(`⚫ Pretos: ${pretos}`);
        console.log(`⚪ Brancos: ${brancos}`);
        
        console.log(`\n⏰ Última atualização: ${new Date().toLocaleTimeString('pt-BR')}`);
        console.log('='.repeat(50));
    }

    // Monitoramento contínuo
    async startMonitoring(interval = 3000) {
        if (this.isRunning) {
            console.log('⚠️ Monitoramento já está rodando!');
            return;
        }

        this.isRunning = true;
        console.log('🚀 BLAZE API MONITOR INICIADO');
        console.log('📡 Monitorando resultados da Roleta Double...\n');

        while (this.isRunning) {
            try {
                const results = await this.getBlazeResults();
                
                if (results.length > 0) {
                    const currentHash = JSON.stringify(results.map(r => r.id));
                    const previousHash = JSON.stringify(this.resultadoAnterior.map(r => r.id));
                    
                    if (currentHash !== previousHash) {
                        this.resultadoAnterior = [...results];
                        this.formatResults(results);
                    }
                }
                
                await new Promise(resolve => setTimeout(resolve, interval));
                
            } catch (error) {
                console.error('❌ Erro no monitoramento:', error.message);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    // Parar monitoramento
    stopMonitoring() {
        this.isRunning = false;
        console.log('🛑 Monitoramento interrompido');
    }

    // Função para obter apenas os números (compatibilidade)
    async getNumbers() {
        const results = await this.getBlazeResults();
        return results.map(r => r.roll);
    }
}

// Instância global
const blazeMonitor = new BlazeAPIMonitor();

// Funções de compatibilidade com o código anterior
async function resultados() {
    return await blazeMonitor.getNumbers();
}

function monitorarResultados() {
    return blazeMonitor.startMonitoring();
}

function pararMonitoramento() {
    blazeMonitor.stopMonitoring();
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BlazeAPIMonitor,
        blazeMonitor,
        resultados,
        monitorarResultados,
        pararMonitoramento
    };
}

// Auto-iniciar no Node.js
if (typeof window === 'undefined') {
    console.log('💻 Executando no Node.js...');
    blazeMonitor.startMonitoring();
} else {
    console.log('🌐 Executando no navegador...');
    console.log('📝 Use blazeMonitor.startMonitoring() para iniciar');
    console.log('📝 Use blazeMonitor.stopMonitoring() para parar');
}