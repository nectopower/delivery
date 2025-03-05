import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaSearch, FaFilter, FaMotorcycle, FaBicycle, FaCar, FaTruck, FaCircle } from 'react-icons/fa';
import api from '../services/api';

const DeliveryPersonsContainer = styled.div`
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
`;

const ActionButtons = styled.div`
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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background-color: ${props => props.bgColor || '#e0f2fe'};
  color: ${props => props.color || '#0284c7'};
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f8fafc;
  border-radius: 4px;
  padding: 8px 16px;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  flex: 1;
  padding: 4px 8px;
  font-size: 14px;
  outline: none;
`;

const SearchIcon = styled.div`
  color: #64748b;
  margin-right: 8px;
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  
  &:last-child {
    text-align: right;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
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

const VehicleIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #3b82f6;
  border: none;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background-color: #f8fafc;
    border-radius: 4px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const PageInfo = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#1e293b'};
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#f8fafc'};
  }
  
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-style: italic;
`;

const DeliveryPersons = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    busy: 0,
    offline: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeliveryPersons, setTotalDeliveryPersons] = useState(0);
  
  useEffect(() => {
    fetchDeliveryPersons();
    fetchStats();
  }, [currentPage, statusFilter, vehicleFilter]);
  
  const fetchStats = async () => {
    try {
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get('/delivery-persons/stats');
      // setStats(response.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        setStats({
          total: 24,
          available: 10,
          busy: 8,
          offline: 6
        });
      }, 300);
    } catch (error) {
      console.error('Erro ao buscar estatísticas de entregadores:', error);
    }
  };
  
  const fetchDeliveryPersons = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get('/delivery-persons', {
      //   params: {
      //     page: currentPage,
      //     status: statusFilter,
      //     vehicleType: vehicleFilter,
      //     search: searchTerm
      //   }
      // });
      // setDeliveryPersons(response.data.data);
      // setTotalPages(response.data.totalPages);
      // setTotalDeliveryPersons(response.data.total);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockDeliveryPersons = [
          {
            id: 'dp-001',
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
            createdAt: '2023-03-10T14:30:00Z'
          },
          {
            id: 'dp-002',
            user: {
              id: 'user-002',
              name: 'Ana Oliveira',
              email: 'ana.oliveira@email.com'
            },
            cpf: '987.654.321-00',
            phone: '(11) 91234-5678',
            vehicleType: 'BICYCLE',
            vehiclePlate: null,
            status: 'BUSY',
            rating: 4.5,
            totalDeliveries: 89,
            isActive: true,
            createdAt: '2023-04-15T10:20:00Z'
          },
          {
            id: 'dp-003',
            user: {
              id: 'user-003',
              name: 'Pedro Santos',
              email: 'pedro.santos@email.com'
            },
            cpf: '456.789.123-00',
            phone: '(11) 97654-3210',
            vehicleType: 'CAR',
            vehiclePlate: 'XYZ5678',
            status: 'OFFLINE',
            rating: 4.2,
            totalDeliveries: 112,
            isActive: true,
            createdAt: '2023-02-20T09:15:00Z'
          },
          {
            id: 'dp-004',
            user: {
              id: 'user-004',
              name: 'Mariana Costa',
              email: 'mariana.costa@email.com'
            },
            cpf: '789.123.456-00',
            phone: '(11) 95678-1234',
            vehicleType: 'MOTORCYCLE',
            vehiclePlate: 'DEF5678',
            status: 'AVAILABLE',
            rating: 4.9,
            totalDeliveries: 203,
            isActive: true,
            createdAt: '2023-01-05T16:45:00Z'
          },
          {
            id: 'dp-005',
            user: {
              id: 'user-005',
              name: 'Lucas Ferreira',
              email: 'lucas.ferreira@email.com'
            },
            cpf: '321.654.987-00',
            phone: '(11) 94321-8765',
            vehicleType: 'VAN',
            vehiclePlate: 'GHI9012',
            status: 'BUSY',
            rating: 4.6,
            totalDeliveries: 78,
            isActive: true,
            createdAt: '2023-05-12T11:30:00Z'
          },
          {
            id: 'dp-006',
            user: {
              id: 'user-006',
              name: 'Juliana Lima',
              email: 'juliana.lima@email.com'
            },
            cpf: '654.987.321-00',
            phone: '(11) 93456-7890',
            vehicleType: 'BICYCLE',
            vehiclePlate: null,
            status: 'OFFLINE',
            rating: 4.3,
            totalDeliveries: 45,
            isActive: true,
            createdAt: '2023-06-01T13:20:00Z'
          }
        ];
        
        // Filtrar por status se necessário
        let filteredDeliveryPersons = mockDeliveryPersons;
        if (statusFilter) {
          filteredDeliveryPersons = filteredDeliveryPersons.filter(dp => dp.status === statusFilter);
        }
        
        // Filtrar por tipo de veículo se necessário
        if (vehicleFilter) {
          filteredDeliveryPersons = filteredDeliveryPersons.filter(dp => dp.vehicleType === vehicleFilter);
        }
        
        // Filtrar por termo de busca se necessário
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredDeliveryPersons = filteredDeliveryPersons.filter(dp => 
            dp.user.name.toLowerCase().includes(term) || 
            dp.user.email.toLowerCase().includes(term) ||
            dp.phone.includes(term) ||
            (dp.vehiclePlate && dp.vehiclePlate.toLowerCase().includes(term))
          );
        }
        
        setDeliveryPersons(filteredDeliveryPersons);
        setTotalPages(1);
        setTotalDeliveryPersons(filteredDeliveryPersons.length);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar entregadores:', error);
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDeliveryPersons();
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleVehicleFilterChange = (e) => {
    setVehicleFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponível';
      case 'BUSY': return 'Ocupado';
      case 'OFFLINE': return 'Offline';
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
  
  return (
    <DeliveryPersonsContainer>
      <Header>
        <Title>Entregadores</Title>
        <ActionButtons>
          <Button as={Link} to="/delivery-persons/new" primary>
            <FaPlus /> Novo Entregador
          </Button>
        </ActionButtons>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <StatIcon bgColor="#e0f2fe" color="#0284c7">
            <FaMotorcycle />
          </StatIcon>
          <StatTitle>Total de Entregadores</StatTitle>
          <StatValue>{stats.total}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="#dcfce7" color="#16a34a">
            <FaCircle size={12} />
          </StatIcon>
          <StatTitle>Disponíveis</StatTitle>
          <StatValue>{stats.available}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="#fef3c7" color="#d97706">
            <FaCircle size={12} />
          </StatIcon>
          <StatTitle>Ocupados</StatTitle>
          <StatValue>{stats.busy}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatIcon bgColor="#f1f5f9" color="#64748b">
            <FaCircle size={12} />
          </StatIcon>
          <StatTitle>Offline</StatTitle>
          <StatValue>{stats.offline}</StatValue>
        </StatCard>
      </StatsContainer>
      
      <FiltersContainer>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Buscar por nome, email, telefone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterSelect 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
          >
            <option value="">Todos os status</option>
            <option value="AVAILABLE">Disponível</option>
            <option value="BUSY">Ocupado</option>
            <option value="OFFLINE">Offline</option>
          </FilterSelect>
          
          <FilterSelect 
            value={vehicleFilter} 
            onChange={handleVehicleFilterChange}
          >
            <option value="">Todos os veículos</option>
            <option value="BICYCLE">Bicicleta</option>
            <option value="MOTORCYCLE">Moto</option>
            <option value="CAR">Carro</option>
            <option value="VAN">Van</option>
          </FilterSelect>
          
          <Button type="submit" primary>
            <FaFilter /> Filtrar
          </Button>
        </form>
      </FiltersContainer>
      
      {loading ? (
        <p>Carregando...</p>
      ) : deliveryPersons.length > 0 ? (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Contato</Th>
                <Th>Veículo</Th>
                <Th>Avaliação</Th>
                <Th>Entregas</Th>
                <Th>Status</Th>
                <Th>Cadastro</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {deliveryPersons.map(deliveryPerson => (
                <tr key={deliveryPerson.id}>
                  <Td>{deliveryPerson.user.name}</Td>
                  <Td>
                    <div>{deliveryPerson.phone}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{deliveryPerson.user.email}</div>
                  </Td>
                  <Td>
                    <VehicleIcon>
                      {getVehicleIcon(deliveryPerson.vehicleType)}
                      <span>{getVehicleTypeLabel(deliveryPerson.vehicleType)}</span>
                      {deliveryPerson.vehiclePlate && (
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>
                          ({deliveryPerson.vehiclePlate})
                        </span>
                      )}
                    </VehicleIcon>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {deliveryPerson.rating.toFixed(1)}
                      <span style={{ fontSize: '16px', color: '#f59e0b', marginLeft: '4px' }}>★</span>
                    </div>
                  </Td>
                  <Td>{deliveryPerson.totalDeliveries}</Td>
                  <Td>
                    <StatusBadge status={deliveryPerson.status}>
                      <StatusDot status={deliveryPerson.status} />
                      {getStatusLabel(deliveryPerson.status)}
                    </StatusBadge>
                  </Td>
                  <Td>{formatDate(deliveryPerson.createdAt)}</Td>
                  <Td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link to={`/delivery-persons/${deliveryPerson.id}`}>
                        <ActionButton>
                          <FaEye /> Ver
                        </ActionButton>
                      </Link>
                      <Link to={`/delivery-persons/${deliveryPerson.id}/edit`}>
                        <ActionButton>
                          <FaEdit /> Editar
                        </ActionButton>
                      </Link>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            <PageInfo>
              Mostrando {deliveryPersons.length} de {totalDeliveryPersons} entregadores
            </PageInfo>
            <PageButtons>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </PageButton>
              
              {[...Array(totalPages).keys()].map(page => (
                <PageButton 
                  key={page + 1}
                  active={currentPage === page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </PageButton>
              ))}
              
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </PageButton>
            </PageButtons>
          </Pagination>
        </>
      ) : (
        <NoResults>
          Nenhum entregador encontrado com os filtros selecionados.
        </NoResults>
      )}
    </DeliveryPersonsContainer>
  );
};

export default DeliveryPersons;
