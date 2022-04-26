import styled from '@emotion/styled'

export const TabWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  gap: 2em;
  align-items: center;
`

export const TabHeader = styled.div<{ selected: boolean }>`
  font-weight: ${p => (p.selected ? 600 : 300)};
  cursor: pointer;
  color: ${p => (p.selected ? 'var(--accent)' : 'var(--black)')};
  user-select: none;
`

export const MainTabHeader = styled(TabHeader)`
  font-size: 2em;
`
