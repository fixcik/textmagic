import styled, { keyframes, css } from 'styled-components';

// Анимации
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Стили компонентов
export const ModalOverlay = styled.div<{ isClosing: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2147483647;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  cursor: pointer;
  backdrop-filter: blur(3px);
  transition: all 0.3s ease;
  
  ${props => props.isClosing && css`
    opacity: 0;
    transition: opacity 0.3s ease;
  `}
`;

export const ModalContent = styled.div<{ isClosing: boolean }>`
  background-color: white;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  max-width: 600px;
  width: 80%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  position: relative;
  cursor: default;
  overflow: hidden;
  animation: ${modalFadeIn} 0.3s ease;
  
  ${props => props.isClosing && css`
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  `}
`;

export const ModalHeader = styled.div`
  background: linear-gradient(45deg, #8a4baf, #9061F9);
  color: white;
  padding: 16px 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalHeaderTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
`;

export const ModalHeaderIcon = styled.span`
  margin-right: 10px;
  font-size: 18px;
`;

export const ModalCloseIcon = styled.span`
  cursor: pointer;
  font-size: 20px;
  opacity: 0.8;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
`;

export const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
`;

export const LoadingSpinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid rgba(144, 97, 249, 0.2);
  border-radius: 50%;
  border-top-color: #9061F9;
  animation: ${spin} 1s linear infinite;
  margin: auto;
`;

export const LoadingText = styled.p`
  margin-top: 20px;
  color: #555;
  font-weight: 500;
`;

export const ResultTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 180px;
  padding: 14px;
  font-size: 15px;
  margin-bottom: 20px;
  border: 2px solid #d0d0d0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  pointer-events: auto;
  cursor: text;
  z-index: 2147483646;
  transition: border-color 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) inset;
  background-color: #f7f7f7;
  color: #333;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #9061F9;
    box-shadow: 0 0 0 2px rgba(144, 97, 249, 0.2);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  pointer-events: auto;
  z-index: 2147483646;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
  pointer-events: auto;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const CloseButton = styled(Button)`
  background-color: #5c6570;
  
  &:hover {
    background-color: #4a5258;
  }
`;

export const CopyButton = styled(Button)`
  background-color: #ef5350;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

export const InsertButton = styled(Button)`
  background-color: #4a9cef;
  
  &:hover {
    background-color: #3b7bbf;
  }
`;

export const ButtonIcon = styled.span`
  display: inline-block;
  margin-right: 10px;
  font-size: 18px;
`; 