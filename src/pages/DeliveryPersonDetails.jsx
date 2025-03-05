import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaEdit, FaMotorcycle, FaBicycle, FaCar, FaTruck, FaIdCard, FaPhone, FaEnvelope, FaUser, FaStar, FaClipboardList, FaMoneyBill, FaCircle, FaMapMarkerAlt } from 'react-icons/fa';
import api from '../services/api';

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3b82f6' : 'white'};
  color: ${props => props.primary ? 'white' : '#1e293b'};
  border: ${props => props.primary ? 'none' : '1px solid #e2e8f0'};
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2563eb' : '#f8fafc'};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 48px;
  color: #94a3b8;
`;

const ProfileName = styled.h2`
  margin: 0 0 8px 0;
  color: #1e293b;
  text-align: center;
`;

const ProfileStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#dcfce7';
      case 'BUSY': return '#fef3c7';
      case 'OFFLINE': return '#f1f5f9';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#16a34a';
      case 'BUSY': return '#d97706';
      case 'OFFLINE': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.status) {
      case 'AVAILABLE': return '#16a34a';
      case 'BUSY': return '#d97706';
      case 'OFFLINE': return '#64748b';
      default: return '#64748b';
    }
  }};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const InfoValue = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748b;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'DELIVERED': return '#dcfce7';
      case 'DELIVERING': return '#e0f2fe';
      case 'PENDING': return '#fef3c7';
      case 'CANCELLED': return '#fee2e2';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'DELIVERED': return '#16a34a';
      case 'DELIVERING': return '#0284c7';
      case 'PENDING': return '#d97706';
      case 'CANCELLED': return '#dc2626';
      default: return '#64748b';
    }
  }};
`;

const NoDeliveries = styled.div`
  text-align: center;
  padding: 24px;
  color: #64748b;
  font-style: italic;
`;

const DeliveryPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    rating: 0,
    completedDeliveries: 0,
    canceledDeliveries: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDeliveryPersonData();
    fetchDeliveryStats();
  }, [id]);
  
  const fetchDeliveryPersonData = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/delivery-persons/${id}`);
      // setDeliveryPerson(response.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockDeliveryPerson = {
          id: id,
          user: {
            id: 'user-001',
            name: 'Carlos Silva',
            email: 'carlos.silva@email.com'
          },
          cpf: '123.456.789-00',
          phone: '(11) 98765-4321',
          vehicleType: 'MOTORCYCLE',
          vehiclePlate: 'ABC1234',
          status: 'AVAILABLE',
          rating: 4.8,
          totalDeliveries: 156,
          isActive: true,
          currentLatitude: -23.5505,
          currentLongitude: -46.6333,
          createdAt: '2023-03-10T14:30:00Z',
          deliveries: [
            {
              id: 'del-001',
              order: {
                id: 'ord-001',
                status: 'DELIVERED',
                total: 89.90,
                address: 'Rua das Flores, 123 - Jardim Paulista, São Paulo - SP',
                createdAt: '2023-05-15T14:30:00Z',
                customer: {
                  user: {
                    name: 'João Silva'
                  }
                },
                restaurant: {
                  user: {
                    name: 'Restaurante Bom Sabor'
                  },
                  address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
                }
              },
              status: 'DELIVERED',
              fee: 12.50,
              distance: 3.2,
              estimatedTime: 25,
              startTime: '2023-05-15T14:45:00Z',
              endTime: '2023-05-15T15:10:00Z',
              customerRating: 5,
              customerFeedback: 'Entrega rápida e atendimento excelente!'
            },
            {
              id: 'del-002',
              order: {
                id: 'ord-002',
                status: 'DELIVERED',
                total: 45.50,
                address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
                createdAt: '2023-05-14T19:20:00Z',
                customer: {
                  user: {
                    name: 'Maria Oliveira'
                  }
                },
                restaurant: {
                  user: {
                    name: 'Sabor Caseiro'
                  },
                  address: 'Rua Oscar Freire, 200 - Jardins, São Paulo - SP'
                }
              },
              status: 'DELIVERED',
              fee: 10.00,
              distance: 2.5,
              estimatedTime: 20,
              startTime: '2023-05-14T19:30:00Z',
              endTime: '2023-05-14T19:50:00Z',
              customerRating: 4,
              customerFeedback: null
            },
            {
              id: 'del-003',
              order: {
                id: 'ord-003',
                status: 'CANCELLED',
                total: 65.80,
                address: 'Av. Rebouças, 1200 - Pinheiros, São Paulo - SP',
                createdAt: '2023-05-13T12:15:00Z',
                customer: {
                  user: {
                    name: 'Pedro Santos'
                  }
                },
                restaurant: {
                  user: {
                    name: 'Cantina Italiana'
                  },
                  address: 'Rua dos Pinheiros, 300 - Pinheiros, São Paulo - SP'
                }
              },
              status: 'CANCELLED',
              fee: 15.00,
              distance: 4.1,
              estimatedTime: 30,
              startTime: '2023-05-13T12:25:00Z',
              endTime: null,
              customerRating: null,
              customerFeedback: null
            }
          ]
        };
        
        setDeliveryPerson(mockDeliveryPerson);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar dados do entregador:', error);
      setLoading(false);
      navigate('/delivery-persons');
    }
  };
  
  const fetchDeliveryStats = async () => {
    try {
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/delivery-persons/${id}/stats`);
      // setStats(response.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        setStats({
          totalDeliveries: 156,
          rating: 4.8,
          completedDeliveries: 148,
          canceledDeliveries: 8,
          totalEarnings: 1875.50
        });
      }, 300);
    } catch (error) {
      console.error('Erro ao buscar estatísticas do entregador:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponível';
      case 'BUSY': return 'Ocupado';
      case 'OFFLINE': return 'Offline';
      case 'DELIVERED': return 'Entregue';
      case 'DELIVERING': return 'Em entrega';
      case 'PENDING': return 'Pendente';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };
  
  const getVehicleTypeLabel = (type) => {
    switch (type) {
      case 'BICYCLE': return 'Bicicleta';
      case 'MOTORCYCLE': return 'Moto';
      case 'CAR': return 'Carro';
      case 'VAN': return 'Van';
      default: return type;
    }
  };
  
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'BICYCLE':
        return <FaBicycle />;
      case 'MOTORCYCLE':
        return <FaMotorcycle />;
      case 'CAR':
        return <FaCar />;
      case 'VAN':
        return <FaTruck />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return <p>Carregando...</p>;
  }
  
  if (!deliveryPerson) {
    return <p>Entregador não encontrado.</p>;
  }
  
  return (
    <DetailsContainer>
      <Header>
        <Title>Detalhes do Entregador</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/delivery-persons')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Button primary as={Link} to={`/delivery-persons/${id}/edit`}>
            <FaEdit /> Editar
          </Button>
        </ButtonsContainer>
      </Header>
      
      <ContentGrid>
        <div>
          <Section>
            <ProfileHeader>
              <ProfileImage>
                {deliveryPerson.user.name.charAt(0)}
              </ProfileImage>
              <ProfileName>{deliveryPerson.user.name}</ProfileName>
              <ProfileStatus status={deliveryPerson.status}>
                <StatusDot status={deliveryPerson.status} />
                {getStatusLabel(deliveryPerson.status)}
              </ProfileStatus>
            </ProfileHeader>
            
            <InfoList>
              <InfoItem>
                <InfoIcon>
                  <FaEnvelope />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{deliveryPerson.user.email}</InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <FaPhone />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Telefone</InfoLabel>
                  <InfoValue>{deliveryPerson.phone}</InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  <FaIdCard />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>CPF</InfoLabel>
                  <InfoValue>{deliveryPerson.cpf}</InfoValue>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon>
                  {getVehicleIcon(deliveryPerson.vehicleType)}
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Veículo</InfoLabel>
                  <InfoValue>
                    {getVehicleTypeLabel(deliveryPerson.vehicleType)}
                    {deliveryPerson.vehiclePlate && ` (${deliveryPerson.vehiclePlate})`}
                  </InfoValue>
                </InfoContent>
              </InfoItem>
              
              {(deliveryPerson.currentLatitude && deliveryPerson.currentLongitude) && (
                <InfoItem>
                  <InfoIcon>
                    <FaMapMarkerAlt />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Localização Atual</InfoLabel>
                    <InfoValue>
                      {deliveryPerson.currentLatitude.toFixed(6)}, {deliveryPerson.currentLongitude.toFixed(6)}
                    </InfoValue>
                  </InfoContent>
                </InfoItem>
              )}
              
              <InfoItem>
                <InfoIcon>
                  <FaUser />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Cadastrado em</InfoLabel>
                  <InfoValue>{formatDate(deliveryPerson.createdAt)}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoList>
          </Section>
          
          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>
              <FaChartBar /> Estatísticas
            </SectionTitle>
            
            <StatsGrid>
              <StatCard>
                <StatValue>{stats.totalDeliveries}</StatValue>
                <StatLabel>Total de Entregas</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>
                  {stats.rating.toFixed(1)}
                  <span style={{ fontSize: '16px', color: '#f59e0b', marginLeft: '4px' }}>★</span>
                </StatValue>
                <StatLabel>Avaliação Média</StatLabel>
              </StatCard>
              
              <StatCard>
                <StatValue>{formatCurrency(stats.totalEarnings)}</StatValue>
                <StatLabel>Ganhos Totais</StatLabel>
              </StatCard>
            </StatsGrid>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <StatCard>
                  <StatValue>{stats.completedDeliveries}</StatValue>
                  <StatLabel>Entregas Concluídas</StatLabel>
                </StatCard>
              </div>
              
              <div style={{ flex: 1 }}>
                <StatCard>
                  <StatValue>{stats.canceledDeliveries}</StatValue>
                  <StatLabel>Entregas Canceladas</StatLabel>
                </StatCard>
              </div>
            </div>
          </Section>
        </div>
        
        <Section>
          <SectionTitle>
            <FaClipboardList /> Histórico de Entregas
          </SectionTitle>
          
          {deliveryPerson.deliveries && deliveryPerson.deliveries.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>Pedido</Th>
                  <Th>Cliente</Th>
                  <Th>Restaurante</Th>
                  <Th>Data</Th>
                  <Th>Valor</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {deliveryPerson.deliveries.map(delivery => (
                  <tr key={delivery.id}>
                    <Td>
                      <Link to={`/orders/${delivery.order.id}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        {delivery.order.id}
                      </Link>
                    </Td>
                    <Td>{delivery.order.customer.user.name}</Td>
                    <Td>{delivery.order.restaurant.user.name}</Td>
                    <Td>{formatDate(delivery.order.createdAt)}</Td>
                    <Td>{formatCurrency(delivery.fee)}</Td>
                    <Td>
                      <StatusBadge status={delivery.status}>
                        {getStatusLabel(delivery.status)}
                      </StatusBadge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <NoDeliveries>
              Este entregador ainda não realizou nenhuma entrega.
            </NoDeliveries>
          )}
        </Section>
      </ContentGrid>
    </DetailsContainer>
  );
};

export default DeliveryPersonDetails;
