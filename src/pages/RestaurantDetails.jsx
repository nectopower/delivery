import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaPhone, FaMapMarkerAlt, FaUtensils, FaCalendarAlt } from 'react-icons/fa';
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
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: ${props => {
    if (props.primary) return '#3b82f6';
    if (props.danger) return '#ef4444';
    return 'white';
  }};
  color: ${props => {
    if (props.primary || props.danger) return 'white';
    return '#1e293b';
  }};
  border: ${props => (props.primary || props.danger) ? 'none' : '1px solid #e2e8f0'};
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => {
      if (props.primary) return '#2563eb';
      if (props.danger) return '#dc2626';
      return '#f8fafc';
    }};
  }
`;

const RestaurantHeader = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RestaurantImage = styled.div`
  flex: 0 0 300px;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x300?text=Restaurante'});
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    height: 200px;
    flex: none;
  }
`;

const RestaurantInfo = styled.div`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RestaurantName = styled.h2`
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RestaurantStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.active ? '#10b981' : '#ef4444'};
  color: white;
`;

const RestaurantDescription = styled.p`
  margin: 0;
  color: #64748b;
  line-height: 1.6;
`;

const RestaurantMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f59e0b;
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const MenuItem = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MenuItemName = styled.h4`
  margin: 0;
  color: #1e293b;
`;

const MenuItemPrice = styled.div`
  font-weight: 500;
  color: #10b981;
`;

const MenuItemDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
`;

const NoItems = styled.p`
  color: #64748b;
  font-style: italic;
`;

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);
  
  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      // Em um cenário real, você buscaria esses dados da API
      // const restaurantResponse = await api.get(`/admin/restaurants/${id}`);
      // const menuResponse = await api.get(`/admin/restaurants/${id}/dishes`);
      // setRestaurant(restaurantResponse.data);
      // setMenu(menuResponse.data);
      
      // Dados simulados para demonstração
      setTimeout(() => {
        const mockRestaurant = {
          id: parseInt(id),
          name: 'Restaurante Bom Sabor',
          description: 'Especializado em comida caseira com ingredientes frescos e de qualidade. Nossa missão é proporcionar uma experiência gastronômica que remeta ao aconchego de casa, com pratos tradicionais e um toque especial do nosso chef.',
          address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
          phone: '(11) 98765-4321',
          rating: 4.7,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
          createdAt: '2023-01-10'
        };
        
        const mockMenu = [
          {
            id: 1,
            name: 'Feijoada Completa',
            description: 'Tradicional feijoada com todas as carnes, acompanha arroz, couve, farofa e laranja.',
            price: 45.90,
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1564671546498-aa134e5e9f5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVpam9hZGF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 2,
            name: 'Picanha na Brasa',
            description: 'Suculenta picanha grelhada na brasa, acompanha arroz, feijão, farofa e vinagrete.',
            price: 59.90,
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGljYW5oYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 3,
            name: 'Filé de Frango Grelhado',
            description: 'Filé de frango grelhado com ervas finas, acompanha purê de batatas e legumes salteados.',
            price: 39.90,
            isAvailable: true,
            imageUrl: 'https://images.unsplash.com/photo-1598515214146-dab39da1243d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z3JpbGxlZCUyMGNoaWNrZW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 4,
            name: 'Salmão ao Molho de Maracujá',
            description: 'Filé de salmão grelhado com molho de maracujá, acompanha arroz com brócolis e batata sauté.',
            price: 65.90,
            isAvailable: false,
            imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
          },
        ];
        
        setRestaurant(mockRestaurant);
        setMenu(mockMenu);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Erro ao buscar detalhes do restaurante:', error);
      setLoading(false);
      navigate('/restaurants');
    }
  };
  
  const handleDeleteRestaurant = async () => {
    if (window.confirm('Tem certeza que deseja excluir este restaurante? Esta ação não pode ser desfeita.')) {
      try {
        // Em um cenário real, você enviaria a requisição para a API
        // await api.delete(`/admin/restaurants/${id}`);
        
        // Simulação
        setTimeout(() => {
          alert('Restaurante excluído com sucesso!');
          navigate('/restaurants');
        }, 500);
      } catch (error) {
        console.error('Erro ao excluir restaurante:', error);
        alert('Erro ao excluir restaurante. Tente novamente.');
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  if (loading) {
    return <p>Carregando...</p>;
  }
  
  if (!restaurant) {
    return <p>Restaurante não encontrado.</p>;
  }
  
  return (
    <DetailsContainer>
      <Header>
        <Title>Detalhes do Restaurante</Title>
        <ButtonsContainer>
          <Button onClick={() => navigate('/restaurants')}>
            <FaArrowLeft /> Voltar
          </Button>
          <Link to={`/restaurants/edit/${id}`}>
            <Button primary>
              <FaEdit /> Editar
            </Button>
          </Link>
          <Button danger onClick={handleDeleteRestaurant}>
            <FaTrash /> Excluir
          </Button>
        </ButtonsContainer>
      </Header>
      
      <RestaurantHeader>
        <RestaurantImage src={restaurant.imageUrl} />
        <RestaurantInfo>
          <RestaurantName>
            {restaurant.name}
            <RestaurantStatus active={restaurant.isActive}>
              {restaurant.isActive ? 'Ativo' : 'Inativo'}
            </RestaurantStatus>
          </RestaurantName>
          
          <RestaurantDescription>{restaurant.description}</RestaurantDescription>
          
          <RestaurantMeta>
            <MetaItem>
              <FaMapMarkerAlt />
              {restaurant.address}
            </MetaItem>
            <MetaItem>
              <FaPhone />
              {restaurant.phone}
            </MetaItem>
            <MetaItem>
              <FaCalendarAlt />
              Cadastrado em {formatDate(restaurant.createdAt)}
            </MetaItem>
            <Rating>
              <FaStar />
              {restaurant.rating.toFixed(1)}
            </Rating>
          </RestaurantMeta>
        </RestaurantInfo>
      </RestaurantHeader>
      
      <Section>
        <SectionTitle>
          <FaUtensils /> Cardápio
        </SectionTitle>
        
        {menu.length > 0 ? (
          <MenuGrid>
            {menu.map(item => (
              <MenuItem key={item.id}>
                <MenuItemName>{item.name}</MenuItemName>
                <MenuItemDescription>{item.description}</MenuItemDescription>
                <MenuItemPrice>{formatCurrency(item.price)}</MenuItemPrice>
                {!item.isAvailable && (
                  <RestaurantStatus active={false}>
                    Indisponível
                  </RestaurantStatus>
                )}
              </MenuItem>
            ))}
          </MenuGrid>
        ) : (
          <NoItems>Nenhum item no cardápio.</NoItems>
        )}
      </Section>
    </DetailsContainer>
  );
};

export default RestaurantDetails;
