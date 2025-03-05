import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 32px;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const LogoIcon = styled.div`
  font-size: 48px;
  color: #0284c7;
  margin-bottom: 16px;
`;

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #0284c7;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #64748b;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0 12px;
  
  &:focus-within {
    border-color: #0284c7;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
  }
`;

const InputIcon = styled.div`
  color: #94a3b8;
  margin-right: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 0;
  border: none;
  outline: none;
  font-size: 14px;
  
  &::placeholder {
    color: #cbd5e1;
  }
`;

const SubmitButton = styled.button`
  background-color: #0284c7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0369a1;
  }
  
  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signed } = useAuth();
  const navigate = useNavigate();
  
  // Se já estiver autenticado, redireciona para a página inicial
  if (signed) {
    return <Navigate to="/" />;
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Email ou senha incorretos.');
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoIcon>
            <FaUtensils />
          </LogoIcon>
          <LogoText>FoodDelivery</LogoText>
        </Logo>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </SubmitButton>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
