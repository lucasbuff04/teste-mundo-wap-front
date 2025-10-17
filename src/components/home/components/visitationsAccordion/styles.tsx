import styled from "styled-components";

export const AccordionWrapper = styled.section`
    display: grid;
    gap: 1rem;
    &:hover > details {
      opacity: 0.5;
    }

  @keyframes details-show {
    from {
      opacity: 0;
      transform: var(--details-translate, translateY(-0.5em));
    }
  }

  details[open] > *:not(summary) {
    animation: details-show 300ms ease-in-out;
  }

`;

export const AccordionDetails = styled.details<{ percentage: number }>`
      cursor: pointer;
      background-color: light-dark(#f5f5f5, #0000002e);
      border-radius: 0.5rem;
      transition: opacity 0.3s ease-in-out;

      .finalize-date{
        margin: 0 0 0.8rem 0.8rem;
      }

      .details-content-wrapper {
        padding: 0 0.8rem 1rem 0.8rem;

        ul:nth-child(even){
          background-color: light-dark(#e6e6e6, #0000002e);
        }

        ul{

          --_padding: 0.8rem;

          position:relative;
          padding: var(--_padding)  ;
          li{
            margin-bottom: 0.5rem;
            &:last-child{
              margin-bottom: 0;
            }
          }

          .status-div{
            position: absolute;
            top: var(--_padding);
            right:var(--_padding);

            display:grid;
            gap: 0.8rem;
            justify-items: center;
          }
        }

        .actions {
          padding-top: 1rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }
      }

      summary {
      --bg: ${({ percentage }) =>
				percentage < 60
					? "var(--danger)"
					: percentage > 90
						? "var(--success)"
						: "var(--default)"};

				color: lch(from var(--bg) calc((49.44 - l) * infinity) 0 0);
				background: var(--bg);
        padding: 0.8rem 1rem;
        text-transform: capitalize;
        display: flex;
        justify-content: space-between;
      }


      ::marker {
        content: '';
      }

      &:hover {
        opacity: 1 !important;
        outline: 1px solid var(--default);
      }
`;
