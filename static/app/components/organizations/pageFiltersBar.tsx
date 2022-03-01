import styled from '@emotion/styled';

const PageFiltersBar = styled('div')`
  display: flex;
  flex-shrink: 0;
  border: solid 1px ${p => p.theme.border};
  border-radius: ${p => p.theme.borderRadius};

  & > * {
    flex: 1 1 auto;
    min-width: 0;
  }

  & > *:not(:first-child)::after {
    content: '';
    position: absolute;
    height: 60%;
    width: 1px;
    background-color: ${p => p.theme.innerBorder};
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  & > *:hover + *:not(:first-child)::after,
  & > *:focus-within + *:not(:first-child)::after {
    display: none;
  }
`;

export default PageFiltersBar;
