import * as React from 'react';
import { useEffect, useContext } from 'react';
import { QuizContext } from '../QuizContext';
import StyledErrorScreen from '../Components/Shared/ErrorScreen';
import styled from 'styled-components';
import StyledH2 from '../Components/Shared/H2';
import StyledText from '../Components/Shared/Text';
import { StyledButton } from '../Components/Button';
import StyledH1 from '../Components/Shared/H1';
import { IDashboardValue } from '../Interfaces/DashboardValue';


export interface DownloadDataProps {
  
}
 
const DownloadData: React.SFC<DownloadDataProps> = () => {
  const { setApplicationError, hasApplicationErrored, saveDashboardValues, dashboardValues } = useContext(QuizContext);

  useEffect(() => {
    fetch('https://diagnostic-tool-staging.herokuapp.com/api/completed-quiz')
      .then(res => res.ok ? res.json() : res.json().then(errorResponse => setApplicationError(errorResponse)))
      .then((dashboardValues: IDashboardValue) => {
        saveDashboardValues(dashboardValues);
      })
      .catch((error) => {
        setApplicationError({
          error: true,
          code: error.status,
          message: error.message
        })
      });

  }, [setApplicationError]);

  const getLatestCompletedQuizDate = () => {
    return dashboardValues.totalQuizItems > 0 ? dashboardValues.latestQuizDate : "No completed quizzes";
  }

  const downloadCSV = () => {
    if (dashboardValues) {
      const completedQuizCSV = require(`./../Assets/${dashboardValues.fileName}`);
      window.open(completedQuizCSV);
    }
  }

  return (
    hasApplicationErrored.error ?
      <StyledErrorScreen message="Unable to retrieve data from database"></StyledErrorScreen>
      :
      <StyledDataScreenWrapper>
        <StyledH1 text="Completed Quizzes Dashboard"></StyledH1>
        <StyledSummaryTile>
          <StyledSummaryTileWrapper>
          <StyledH2 text="Quizzes completed"> </StyledH2>
          {
            dashboardValues.totalQuizItems > 0 ?
            <StyledText fontSize="11.7pt" text={`${dashboardValues.totalQuizItems}`}></StyledText> :
            <StyledText fontSize="11.7pt" text="Loading..."></StyledText>
          }
          </StyledSummaryTileWrapper>
        </StyledSummaryTile>


        <StyledSummaryTile>
          <StyledSummaryTileWrapper>
          <StyledH2 text="Last quiz completed on"> </StyledH2>
          {
            dashboardValues.totalQuizItems > 0 ?
            <StyledText fontSize="11.7pt" text={`${getLatestCompletedQuizDate()}`}></StyledText> :
            <StyledText fontSize="11.7pt" text="Loading..."></StyledText>
          }
          </StyledSummaryTileWrapper>
        </StyledSummaryTile>


        <StyledSummaryTile className="downloadTile">
          <StyledSummaryTileWrapper>
          <StyledH2 text="Download quiz data"> </StyledH2>
          {
            <StyledButton onClickHandler={downloadCSV}>{`Download ${dashboardValues.totalQuizItems > 0 ? dashboardValues.totalQuizItems : "--"} entries`}</StyledButton>
          }
          </StyledSummaryTileWrapper>
        </StyledSummaryTile>
      </StyledDataScreenWrapper>
  );
}

const StyledDataScreenWrapper = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 30px auto 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-rows: 1fr 160px 160px 160px;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: 50px 160px;
  }
  h1{
    height: auto;
    color: ${props => props.theme.brandColours.baseDefaultGreen};
    margin: 0;
    text-align: center;
    padding: 0;
    line-height: 1.2em;
    @media screen and (min-width: 768px) {
      grid-column: 1/ span 3;
    }
  }

`;

const StyledSummaryTile = styled.div`
  display: grid;
  border-bottom: solid 1px ${props => props.theme.brandColours.basePink}
  button {
    position: relative;
    &:after {
      position: absolute;
      bottom: -19px;
      content: 'as CSV';
      width: 100%;
      font-size: 8pt;
      z-index: 2;
      left: 0;
    }
  }
`;
  
const StyledSummaryTileWrapper = styled.div`
  margin: auto;
  h2{
    line-height: 1.2em;
    font-size: 12pt;
  }
  text-align: center;
  padding: 0 20px;
`;
 
export default DownloadData;