import styled from "styled-components";

export const HomeWrapper = styled.main`
  position: relative;

  display: grid;
  gap: 2rem;
  grid-template-rows: auto 1fr auto;

  max-width: var(--max-width);
  width: 100%;

  .title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap:wrap;
    div{
      display: flex;
      align-items: center;
      gap: 1rem;
      width: min(100%, 300px);
      flex-wrap:wrap;

    }
  }

`;

export const SearchWrapper = styled.main`
  display: flex;
  gap: 2rem;
  align-items:top;
  flex-wrap:wrap;
`;
