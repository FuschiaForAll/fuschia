import styled from '@emotion/styled'

export const Button = styled.button`
  background: var(--accent);
  color: var(--white);
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  display: block;
  border: none;
  border-radius: 8px;
  padding: 0.75em;
  &:disabled {
    background: gray;
  }
  &:hover:enabled {
    cursor: pointer;
    opacity: 0.6;
  }
`
