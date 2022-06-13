import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import styled from 'styled-components';
import Timezones from './Timezones';
import './App.css';

  const Clocks = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  `;

  const StyledForm = styled.form`
    display: flex;
    flex-direction: row;
    width: 80%;
    margin: auto;
    padding: 20px;
    border: 2px solid #A0A0A0;
    border-radius: 5px;
    justify-content: space-between;
  `;
  
  const ErrorDiv = styled.span`
    margin-left: 10px;
    color: red;
  `;

  const MyTime = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-top: 50px;
    align-items: center;
  `;

  const CityLabel = styled.div`
    font-weight: 400;
    font-size: 18px;
    margin-bottom: 20px;
  `;
  const HourLabel = styled.div`
    font-weight: 700;
    font-size: 50px;
  `;

const App = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [clocks, setClocks] = useState([]);
  const [data, setData] = useState([]);

  const [myCurrentDate, setMyCurrentDate] = useState();
  const [myTime, setMyTime] = useState();
  const [timezone, setTimezone] = useState();
  
  useEffect(() => {
    const cities = [
    {
      id: 1, 
      tz: 'Asia/Singapore',
      city: 'Singapore'
    },
    {
      id: 2,
      tz: 'Asia/Tokyo',
      city: 'Tokyo'
    },
    {
      id: 3,
      tz: 'Asia/Seoul',
      city: 'Seoul'
    },
    {
      id: 4,
      tz: 'Australia/Melbourne',
      city: 'Melbourne'
    },
    {
      id: 5,
      tz: 'Australia/Sydney',
      city: 'Sidney'
    },
    {
      id: 6,
      tz: 'Europe/London',
      city: 'London'
    },
    {
      id: 7,
      tz: 'Europe/Paris',
      city: 'Paris'
    },
    {
      id: 8,
      tz: 'Europe/Berlin',
      city: 'Berlin'
    },
    {
      id: 9,
      tz: 'America/New_York',
      city: 'New York'
    },
    {
      id: 10,
      tz: 'America/Los_Angeles',
      city: 'Los Angeles'
    },

  ];
  
    setData(cities);
  }, []);

  useEffect(() => {
    fetch("https://worldtimeapi.org/api/timezone/Asia/Manila")
      .then((response) => response.json()
        .then((actualData) => {
          const theDate = new Date(actualData?.datetime);
          setTimezone(actualData?.abbreviation);
          setMyCurrentDate(theDate);
          setMyTime(actualData?.raw_offset);
        }));
  }, []);

  // get my tz
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://worldtimeapi.org/api/timezone/Asia/Manila")
        .then((response) => response.json()
          .then((actualData) => {
            const theDate = new Date(actualData?.datetime);
            setMyTime(actualData?.raw_offset);
            setMyCurrentDate(theDate);
            setTimezone(actualData?.abbreviation);
          }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  

  const deleteClock = (id) => {
    const newClocks = clocks.filter(tz => tz.id !== id);
    setClocks(newClocks);
  }
  const createClock = (obj) => {
    const newClock = clocks?.filter(tz => tz.id == obj.cityDropdown);

    if (newClock.length === 0) {
      const newEntry = data?.filter(tz => tz.id === parseInt(obj.cityDropdown));
      setClocks(oldArray => [
        ...oldArray,
        {
          id: newEntry[0].id, tz: newEntry[0].tz, city: newEntry[0].city, label: obj.label
        }]);  
    };
  };

  return (
    <div style={{ padding: '40px', margin: 'auto' }}>
      <div>
        <StyledForm onSubmit={handleSubmit(createClock)}>
          <div>
            Description: <input style={{ width: '250px'}} placeholder="Type in description" defaultValue="" {...register("label", { required: true })} />
            {errors.label && <ErrorDiv>This field is required</ErrorDiv>}
          </div>
          <div>
            Cities: <select style={{ width: '250px'}} placeholder="Select city" {...register("cityDropdown", { required: true })}>
              <option key="" value=""></option>
              {data.map(city => {
                return <option key={city.id} value={city.id}>{city.city}</option>
              })}
            </select>
            {errors.cityDropdown && <ErrorDiv>This field is required</ErrorDiv>}
            </div>
          <input type="submit" disabled={clocks.length === 4} />
        </StyledForm>
      </div>
      <MyTime>
        <CityLabel>Manila</CityLabel>
        <HourLabel>
          {myCurrentDate && myCurrentDate?.getMinutes().length === 1 ?
              `${myCurrentDate?.getHours()}:0${myCurrentDate?.getMinutes()}`
            :
              `${myCurrentDate?.getHours()}:${myCurrentDate?.getMinutes()}`
            }
        </HourLabel>
      </MyTime>

      <Clocks>
      {clocks.map(item => {
        return <Timezones
          key={item.city}
          id={item.id}
          cityName={item.city}
          label={item.label}
          tz={item.tz}
          myTime={myTime}
          onDeleteClock={deleteClock}
          />
      })}
      </Clocks>
      
    </div>
  );
}

export default App;
