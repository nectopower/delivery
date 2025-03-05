import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUtensils, FaUsers, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../services/api';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.bgColor || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  
  svg {
    color: white;
    font-size: 24px;
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 14px;
  margin-top: 5px;
`;

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 400px;
`;

const ChartTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #1e293b;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    restaurants: 0,
    users: 0,
    orders: 0,
    revenue: 0
  });
  
  const [ordersByDay, setOrdersByDay] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Em um cenário real, você buscaria esses dados da API
        // const response = await api.get('/admin/dashboard');
        // setStats(response.data.stats);
        // setOrdersByDay(response.data.ordersByDay);
        // setRevenueByDay(response.data.revenueByDay);
        
        // Dados simulados para demonstração
        setStats({
          restaurants: 24,
          users: 156,
          orders: 342,
          revenue: 15680.50
        });
        
        setOrdersByDay([
          { name: 'Seg', orders: 45 },
          { name: 'Ter', orders: 52 },
          { name: 'Qua', orders: 48 },
          { name: 'Qui', orders: 61 },
          { name: 'Sex', orders: 78 },
          { name: 'Sáb', orders: 87 },
          { name: 'Dom', orders: 65 }
        ]);
        
        setRevenueByDay([
          { name: 'Seg', revenue: 1250.80 },
          { name: 'Ter', revenue: 1480.50 },
          { name: 'Qua', revenue: 1320.75 },
          { name: 'Qui', revenue: 1890.30 },
          { name: 'Sex', revenue: 2450.90 },
          { name: 'Sáb', revenue: 3120.45 },
          { name: 'Dom', revenue: 2180.60 }
        ]);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      
      <StatsGrid>
        <StatCard>
          <IconContainer bgColor="#3b82f6">
            <FaUtensils />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.restaurants}</StatValue>
            <StatLabel>Restaurantes</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <IconContainer bgColor="#10b981">
            <FaUsers />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.users}</StatValue>
            <StatLabel>Usuários</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <IconContainer bgColor="#f59e0b">
            <FaClipboardList />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.orders}</StatValue>
            <StatLabel>Pedidos</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <IconContainer bgColor="#6366f1">
            <FaMoneyBillWave />
          </IconContainer>
          <StatInfo>
            <StatValue>R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</StatValue>
            <StatLabel>Receita Total</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>
      
      <ChartsRow>
        <ChartContainer>
          <ChartTitle>Pedidos por Dia</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={ordersByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#3b82f6" name="Pedidos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <ChartContainer>
          <ChartTitle>Receita por Dia</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Receita']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" name="Receita" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartsRow>
    </DashboardContainer>
  );
};

export default Dashboard;
