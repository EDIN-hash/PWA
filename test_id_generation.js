// Тест для функции генерации ID
import NeonClient from './src/neon-client.js';

// Мок-данные для тестирования
const mockItems = {
    'Telewizory': [
        { name: 'TV55001' },
        { name: 'TV55002' },
        { name: 'TV65001' },
        { name: 'TV75001' }
    ],
    'Lodowki': [
        { name: 'L001' },
        { name: 'L002' },
        { name: 'L004' } // пропущен L003
    ],
    'Ekspresy': [
        { name: 'E001' },
        { name: 'E002' }
    ]
};

// Тестовая функция для проверки генерации ID
async function testIdGeneration() {
    console.log('Testing ID generation...');
    
    // Тест для телевизоров
    console.log('\nTesting Televizory:');
    const tvId = await NeonClient.getNextAvailableId('Telewizory');
    console.log(`Generated TV ID: ${tvId}`);
    
    // Тест для холодильников
    console.log('\nTesting Lodowki:');
    const fridgeId = await NeonClient.getNextAvailableId('Lodowki');
    console.log(`Generated Fridge ID: ${fridgeId}`);
    
    // Тест для экспрессо-машин
    console.log('\nTesting Ekspresy:');
    const espressoId = await NeonClient.getNextAvailableId('Ekspresy');
    console.log(`Generated Espresso ID: ${espressoId}`);
    
    console.log('\nID generation test completed!');
}

// Запуск теста
try {
    testIdGeneration().catch(console.error);
} catch (error) {
    console.error('Test setup error:', error);
}

export default testIdGeneration;