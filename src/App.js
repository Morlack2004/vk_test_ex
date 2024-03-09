import React, { useState, useEffect, useRef } from 'react';
import { View, Panel, Input, Button, FormStatus, PanelHeader } from '@vkontakte/vkui';
import axios from 'axios';

// Компонент для получения факта о коте
function CatFactPage({ fetchCatFact }) {
  return (
    <View id="catFactPage" activePanel="catFactPanel">
      <Panel id="catFactPanel">
        <PanelHeader>Факт о коте</PanelHeader>
        <div style={{ padding: '20px' }}>
          <Button size="l" style={{ backgroundColor: 'blue', color: 'white' }} onClick={fetchCatFact}>Получить факт о коте</Button>
          {/* Вывод факта о коте */}
          {/* Изменение структуры приложения позволяет легко добавлять новую функциональность */}
        </div>
      </Panel>
    </View>
  );
}

// Компонент для ввода имени и получения возраста
function AgePage({ onSubmit }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nameInputRef = useRef(null);

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (name.trim() === '') return;
    onSubmit(name);
  };

  // Валидация имени на соответствие буквенным символам
  const handleNameChange = (e) => {
    const inputValue = e.target.value;
    if (/^[a-zA-Z]*$/.test(inputValue)) {
      setName(inputValue);
    }
  };

  return (
    <View id="agePage" activePanel="agePanel">
      <Panel id="agePanel">
        <PanelHeader>Возраст по имени</PanelHeader>
        <div style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Введите ваше имя"
              style={{ border: '1px solid black', width: '100%', marginBottom: '10px' }}
              ref={nameInputRef}
            />
            <Button size="l" type="submit" disabled={loading} style={{ backgroundColor: 'blue', color: 'white' }}>
              {loading ? 'Загрузка...' : 'Узнать возраст'}
            </Button>
            {error && <FormStatus mode="error">{error}</FormStatus>}
          </form>
        </div>
      </Panel>
    </View>
  );
}

function App() {
  const [catFact, setCatFact] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCatFact = async () => {
    try {
      const response = await axios.get('https://catfact.ninja/fact');
      setCatFact(response.data.fact);
    } catch (error) {
      console.error('Ошибка получения факта о коте:', error);
    }
  };

  const fetchAge = async (name) => {
    try {
      const response = await axios.get('https://api.agify.io?name=${name}');
      setAge(response.data.age);
      setError('');
    } catch (error) {
      console.error('Ошибка получения возраста:', error);
      setError('Ошибка получения возраста. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View activePanel="catFactPage" id="mainView">
      {/* Страница для получения факта о коте */}
      <CatFactPage fetchCatFact={fetchCatFact} />
      {/* Страница для ввода имени и получения возраста */}
      <AgePage onSubmit={fetchAge} />
    </View>
  );
}

export default App;