import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    width: 160px;
    background: var(--primary);
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.2s;
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    transition: background-color 0.2s;

    color: #312e38;

    &::before {
      content: '';
      border-style: solid;
      border-color: var(--primary) transparent;
      border-width: 6px 6px 0 6px;
      bottom: 20px;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      visibility: visible;
    }
  }

  &:hover,
  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
