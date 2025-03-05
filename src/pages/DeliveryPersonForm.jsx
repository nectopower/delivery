import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSave, FaArrowLeft, FaMotorcycle, FaBicycle, FaCar, FaTruck, FaIdCard, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import api from '../services/api';

const FormContainer = styled.div`
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #1e293b;
  font-size: 18px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e293b;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 4px;
`;

const VehicleOptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const VehicleOption = styled.div`
  border: 1px solid ${props => props.selected ? '#3b82f6' : '#e2e8f0'};
  background-color: ${props => props.selected ? 'rgba(59, 130, 246, 0.1)' : 'white'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
  }
`;

const VehicleIcon = styled.div`
  font-size: 24px;
  color: ${props => props.selected ? '#3b82f6' : '#64748b'};
`;

const VehicleLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.selected ? '#3b82f6' : '#1e293b'};
`;

const DeliveryPersonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    vehicleType: 'MOTORCYCLE',
    vehiclePlate: '',
    status: 'AVAILABLE',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  
  useEffect(() => {
    if (isEditMode) {
      fetchDeliveryPersonData();
    }
  }, [id]);
  
  const fetchDeliveryPersonData = async () => {
    try {
      setInitialLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const response = await api.get(`/delivery-persons/${id}`);
      // const data = response.data;
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockData = {
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
          isActive: true
        };
        
        setFormData({
          name: mockData.user.name,
          email: mockData.user.email,
          password: '',
          cpf: mockData.cpf,
          phone: mockData.phone,
          vehicleType: mockData.vehicleType,
          vehiclePlate: mockData.vehiclePlate || '',
          status: mockData.status,
          isActive: mockData.isActive
        });
        
        setInitialLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar dados do entregador:', error);
      setInitialLoading(false);
      navigate('/delivery-persons');
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleVehicleTypeSelect = (type) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: type
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido (formato: 123.456.789-00)';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (['CAR', 'MOTORCYCLE', 'VAN'].includes(formData.vehicleType) && !formData.vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'Placa do veículo é obrigatória para este tipo de veículo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditMode) {
        // Em um cenário real, você enviaria esses dados para a API
        // await api.put(`/delivery-persons/${id}`, {
        //   name: formData.name,
        //   phone: formData.phone,
        //   vehicleType: formData.vehicleType,
        //   vehiclePlate: formData.vehiclePlate,
        //   status: formData.status,
        //   isActive: formData.isActive
        // });
        
        // Simulação de atualização
        console.log('Dados atualizados:', formData);
        setTimeout(() => {
          setLoading(false);
          navigate('/delivery-persons');
        }, 1000);
      } else {
        // Em um cenário real, você enviaria esses dados para a API
        // await api.post('/delivery-persons', {
        //   email: formData.email,
        //   password: formData.password,
        //   name: formData.name,
        //   cpf: formData.cpf,
        //   phone: formData.phone,
        //   vehicleType: formData.vehicleType,
        //   vehiclePlate: formData.vehiclePlate
        // });
        
        // Simulação de criação
        console.log('Dados criados:', formData);
        setTimeout(() => {
          setLoading(false);
          navigate('/delivery-persons');
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao salvar entregador:', error);
      setLoading(false);
      
      // Tratar erros de validação da API
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };
  
  if (initialLoading) {
    return <p>Carregando...</p>;
  }
  
  return (
    <FormContainer>
      <Header>
        <Title>{isEditMode ? 'Editar Entregador' : 'Novo Entregador'}</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/delivery-persons')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Button primary onClick={handleSubmit} disabled={loading}>
            <FaSave /> {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </ButtonsContainer>
      </Header>
      
      <form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Informações Pessoais</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label htmlFor="name">
                <FaUser style={{ marginRight: '8px' }} />
                Nome Completo
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome completo do entregador"
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">
                <FaEnvelope style={{ marginRight: '8px' }} />
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                disabled={isEditMode}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            {!isEditMode && (
              <FormGroup>
                <Label htmlFor="password">Senha</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha para acesso"
                />
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </FormGroup>
            )}
            
            <FormGroup>
              <Label htmlFor="cpf">
                <FaIdCard style={{ marginRight: '8px' }} />
                CPF
              </Label>
              <Input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="123.456.789-00"
                disabled={isEditMode}
              />
              {errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">
                <FaPhone style={{ marginRight: '8px' }} />
                Telefone
              </Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
            
            {isEditMode && (
              <FormGroup>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="AVAILABLE">Disponível</option>
                  <option value="BUSY">Ocupado</option>
                  <option value="OFFLINE">Offline</option>
                </Select>
              </FormGroup>
            )}
            
            {isEditMode && (
              <FormGroup>
                <Label>Status da Conta</Label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="isActive">Conta ativa</label>
                </div>
              </FormGroup>
            )}
          </FormGrid>
        </FormSection>
        
        <FormSection style={{ marginTop: '20px' }}>
          <SectionTitle>Informações do Veículo</SectionTitle>
          
          <FormGroup>
            <Label>Tipo de Veículo</Label>
            <VehicleOptionsContainer>
              <VehicleOption 
                selected={formData.vehicleType === 'BICYCLE'}
                onClick={() => handleVehicleTypeSelect('BICYCLE')}
              >
                <VehicleIcon selected={formData.vehicleType === 'BICYCLE'}>
                  <FaBicycle />
                </VehicleIcon>
                <VehicleLabel selected={formData.vehicleType === 'BICYCLE'}>
                  Bicicleta
                </VehicleLabel>
              </VehicleOption>
              
              <VehicleOption 
                selected={formData.vehicleType === 'MOTORCYCLE'}
                onClick={() => handleVehicleTypeSelect('MOTORCYCLE')}
              >
                <VehicleIcon selected={formData.vehicleType === 'MOTORCYCLE'}>
                  <FaMotorcycle />
                </VehicleIcon>
                <VehicleLabel selected={formData.vehicleType === 'MOTORCYCLE'}>
                  Moto
                </VehicleLabel>
              </VehicleOption>
              
              <VehicleOption 
                selected={formData.vehicleType === 'CAR'}
                onClick={() => handleVehicleTypeSelect('CAR')}
              >
                <VehicleIcon selected={formData.vehicleType === 'CAR'}>
                  <FaCar />
                </VehicleIcon>
                <VehicleLabel selected={formData.vehicleType === 'CAR'}>
                  Carro
                </VehicleLabel>
              </VehicleOption>
              
              <VehicleOption 
                selected={formData.vehicleType === 'VAN'}
                onClick={() => handleVehicleTypeSelect('VAN')}
              >
                <VehicleIcon selected={formData.vehicleType === 'VAN'}>
                  <FaTruck />
                </VehicleIcon>
                <VehicleLabel selected={formData.vehicleType === 'VAN'}>
                  Van
                </VehicleLabel>
              </VehicleOption>
            </VehicleOptionsContainer>
          </FormGroup>
          
          {['MOTORCYCLE', 'CAR', 'VAN'].includes(formData.vehicleType) && (
            <FormGroup>
              <Label htmlFor="vehiclePlate">Placa do Veículo</Label>
              <Input
                type="text"
                id="vehiclePlate"
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                placeholder="ABC1234"
              />
              {errors.vehiclePlate && <ErrorMessage>{errors.vehiclePlate}</ErrorMessage>}
            </FormGroup>
          )}
        </FormSection>
      </form>
    </FormContainer>
  );
};

export default DeliveryPersonForm;
