import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

  const ClockDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 2px solid #A0A0A0;
    border-radius: 5px;
    width: 180px;
    margin-top: 50px;
    text-align: center;
    justify-content: space-between;
    height: 200px;
  `;

  const CityLabel = styled.div`
    font-weight: 400;
    font-size: 18px;
  `;
  const HourLabel = styled.div`
    font-weight: 700;
    font-size: 40px;
  `;
  const TzLabel = styled.div`
    font-weight: 400;
    font-size: 12px;
  `;
  const DescLabel = styled.div`
    font-weight: 400;
    font-size: 12px;
  `;
  const DifferenceLabel = styled.div`
    font-weight: 400;
    font-size: 12px;
    margin-bottom: 10px;
  `;

const Timezone = ({ id, tz, cityName, label, myTime, onDeleteClock }) => {
  const [diffLabel, setDiffLabel] = useState('');
  const [currentDate, setCurrentDate] = useState();
  const [time, setTime] = useState();
  const [clockHour, setClockHour] = useState();
  const [timezone, setTimezone] = useState('');
  const [isLoading, setIsLoading] = useState(false);  

  useEffect(() => {
    fetch(`https://worldtimeapi.org/api/timezone/${tz}`)
      .then((response) => response.json()
        .then((actualData) => {
          setIsLoading(true);
          const theDate = new Date(actualData?.datetime);
          setTimezone(actualData?.abbreviation);
          setTime(actualData?.raw_offset);
          setCurrentDate(theDate);
          setIsLoading(false);
        }));
  }, []);

  // get tz data
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`https://worldtimeapi.org/api/timezone/${tz}`)
        .then((response) => response.json()
          .then((actualData) => {
            setTime(actualData?.raw_offset);
            const theDate = new Date(actualData?.datetime);
            setCurrentDate(theDate);
          }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);  
  
  useEffect(() => {

    if (currentDate) {
      
      if (time === myTime) {
        setDiffLabel('Same hours as Manila');
        setClockHour(currentDate?.getHours());
      } else {

        if (time > myTime) {
          const diff = ((time - myTime) / 60 / 60);
          
            setDiffLabel(`${diff} hours ahead of Manila`);
            setClockHour(currentDate?.getHours() + diff);
        }
        if (time < myTime) {
          const diff = ((myTime - time) / 60 / 60);
          setDiffLabel(`${diff} hours behind Manila`);
          if ((currentDate?.getHours() - diff) < 0) { 
            setClockHour((currentDate?.getHours() - diff) + 24);
          } else {
            setClockHour(currentDate?.getHours() - diff);
          }
          
        }
      }
    }
  }, [time, myTime]);
  
  return (
    <ClockDiv>
      {clockHour &&
        <>
            <div>
              <CityLabel>{cityName}</CityLabel>
              <DescLabel>{label}</DescLabel>
            </div>
            <div>
              <HourLabel>
              {currentDate && currentDate?.getMinutes().length === 1 ?
                `${clockHour}:0${currentDate?.getMinutes()}`
              :
                `${clockHour}:${currentDate?.getMinutes()}`
              }
              </HourLabel>
            </div>
            <div>
              <TzLabel>
                {timezone}
              </TzLabel>
              <DifferenceLabel>
                {diffLabel}
              </DifferenceLabel>
          <button
            className="Button Button-Delete"
            onClick={() => onDeleteClock(id)}
          >
            Delete
          </button>
        </div>

        </>
        }
      </ClockDiv>
    )
}

export default Timezone;
