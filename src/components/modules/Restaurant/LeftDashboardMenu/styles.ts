import styled from 'styled-components';

export const StylesContainer = styled.div`
  max-width: 280px;
  width: 100%;

  height: 100%;

  background: var(--second-background);
  border-radius: 0.75rem;

  padding: 1rem 0 1rem 1.5rem;

  .item {
    height: 32px;
    margin: 1rem 0;

    font-size: 1.25rem;
    color: var(--text);

    display: flex;
    align-items: center;

    cursor: pointer;

    transition: color 0.1s;

    &:hover {
      color: var(--hover-text);
    }

    p {
      margin-left: 1rem;
    }
  }

  .item.selected {
    border-right: 4px solid var(--primary);
    color: var(--primary);

    &:hover {
      cursor: initial;
    }
  }
`;
