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

    // console.log(response.data);

    function getData(data) {
      console.log(data.map(item => item.res)[0].map(a => a.periodo));

      // data.map(item =>
      //   item.res.map(function (item) {
      //     const array = [
      //       [item.periodo]
      //         .map(p => p.replace(/[\[ ]+/g, ''))
      //         .map(f => f.split(',')[1] || f.split(',')[0]),
      //     ];
      //   }),
      // );  não ficou tão bom, separou os numeros em arrays

      // console.log(
      //   data.map(item =>
      //     item.res.map(function (item) {
      //       console.log(
      //         `Ano: ${[item.periodo]
      //           .map(p => p.replace(/[\[ ]+/g, ''))
      //           .map(f => f.split(',')[1] || f.split(',')[0])}`,
      //       );
      //     }),
      //   ),
      // );
    }

    getData(response.data);

    if (response.data == '') {
      alert('Ops! Nenhum dado foi encontrado.');
      return;
    }

    if (!name) {
      console.log('nada foi digitado');
      return;
    }

    const data = response.data.map(function (item) {
      const objData = {
        ano: item.res.map(p => p.periodo),
        frequencia: item.res.map(f => f.frequencia),
      };
      return objData;
    });

    extractData(data);
  }

  function extractData(data) {
    const dataChart = [];

    const counter = data.map(item => item.frequencia)[0].length;
    const anos = data
      .map(item => item.ano)[0]
      .map(e => e.replace(/[\[ ]+/g, ''))
      .map(f => f.split(',')[1] || f.split(',')[0]);
    const frequencia = data.map(item => item.frequencia)[0];

    dataChart.push(['Ano', 'Frequencia']);

    for (let i = 0; i < counter; i++) {
      dataChart.push([anos[i], frequencia[i]]);
    }

    setListData(dataChart);
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
            placeholder='Your name'
            onChange={e => setName(e.target.value)}
          />
          <button onClick={fetchData}>Buscar</button>
        </div>
      </nav>

      <section>
        <Chart
          width={'100%'}
          height={'100%'}
          chartType='LineChart'
          loader={<div>Loading Chart</div>}
          data={!name ? initial : listData}
          options={{
            hAxis: {
              title: 'Anos',
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
