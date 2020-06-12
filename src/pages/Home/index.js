import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';

import axios from 'axios';

import './styles.css';

export default function Logon() {
  const [name, setName] = useState('');
  const [listData, setListData] = useState([]);
  const [initial, setInitial] = useState([]);

  useEffect(() => {
    const dataInitial = [
      ['Anos', 'Frequência'],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
    ];
    setInitial(dataInitial);
  }, []);

  async function fetchData() {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${name}
          `);

    if (!name) {
      console.log('nada foi digitado');
      return;
    }

    if (response.data == '') {
      alert('Ops! Nenhum dado foi encontrado.');
      return;
    }

    function getData(data) {
      const objAnoFrequencia = {
        ano: data
          .map(item => item.res)[0]
          .map(a => a.periodo)
          .map(b => b.replace(/[\[ ]+/g, ''))
          .map(c => c.split(',')[1] || c.split(',')[0]),
        frequencia: data.map(item => item.res)[0].map(a => a.frequencia),
      };
      return objAnoFrequencia;
    }

    function createChart(data) {
      const dataChart = [];

      const counter = data.ano.length;

      dataChart.push(['Ano', 'Frequencia']);

      for (let i = 0; i < counter; i++) {
        dataChart.push([data.ano[i], data.frequencia[i]]);
      }

      setListData(dataChart);
    }

    createChart(getData(response.data));
  }

  return (
    <div className='container'>
      <header>
        <div className='name'>
          <h1>Your Name</h1>
        </div>
      </header>

      <nav>
        <div className='form'>
          <label htmlFor=''>Busque por seu nome</label>
          <br></br>
          <input
            type='text'
            placeholder='Digite seu nome'
            onChange={e => setName(e.target.value)}
          />
          <button onClick={fetchData}>Buscar</button>
        </div>
      </nav>

      <section>
        <Chart
          width={'100%'}
          height={'100%'}
          chartType='AreaChart'
          loader={<div>Loading Chart</div>}
          data={!name ? initial : listData}
          options={{
            hAxis: {
              title: 'Ano',
            },
            vAxis: {
              title: 'Frequência de nomes',
            },
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      </section>
    </div>
  );
}
