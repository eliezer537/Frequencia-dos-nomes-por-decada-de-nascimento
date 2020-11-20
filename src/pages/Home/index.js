import React, { useState, useEffect } from 'react';
import Chart from 'react-google-charts';

import axios from 'axios';

import './styles.css';

export default function Home() {
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

	function handleData(data) {
		const getFirstItem = data => {
			const list = data.map(item => item.res);
			const [firstItem] = list;
			return firstItem;
		};

		const objAnoFrequencia = {
			ano: getFirstItem(data)
				.map(a => a.periodo)
				.map(b => b.replace(/[[ ]+/g, ''))
			.map(c => c.split(',')[1] || c.split(',')[0]),
			frequencia: getFirstItem(data).map(a => a.frequencia),
		};

		console.log(objAnoFrequencia.ano);
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

	async function fetchData(event) {
		event.preventDefault();
		const [inputElement] = event.currentTarget.getElementsByTagName('input');

		if (!name) {
			alert('Insira um nome!');
			return;
		}

		const response = await axios.get(`https://servicodados.ibge.gov.br/api/v2/censos/nomes/${name}`);

		if (response.data.length < 1) {
			alert('Ops! Nenhum dado foi encontrado.');
			return;
		}

		createChart(handleData(response.data));
		inputElement.value = '';
		inputElement.focus();
	}

	const handleGetInputText = event => {
		const inputValue = event.target.value;

		if (!inputValue) {
			setName('');
			setListData(initial);
			return;
		}
		setName(inputValue);
	};

	return (
		<div className='container'>
			<header>
				<h1>Buscador de nomes</h1>
			</header>

			<nav>
				<form className='form' onSubmit={fetchData}>
					<label htmlFor=''>Busque por algum nome</label>
					<input type='text' placeholder='Insira um nome' autoFocus onChange={handleGetInputText} required />
					<button type='submit'>Buscar</button>
				</form>
			</nav>

			<section>
				<Chart
					width={'100%'}
					height={'100%'}
					chartType='AreaChart'
					loader={<div>Carregando gráfico...</div>}
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
