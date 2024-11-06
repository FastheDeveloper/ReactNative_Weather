import { Stack, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

const url = `https://api.openweathermap.org/data/2.5/weather?lat=7.348720&lon=3.879290&appid=45850b8070fe1c83d3f591aee9f1fd35&units=metric`;


interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}


export default function Home() {
  const [weather, setWeather] = useState<WeatherData>();
  const [loading,setLoading]=useState<boolean>(false)
  const fetchWeather = async () => {
    //fetch data
    console.log('fetchhing');
    const results = await fetch(url);
    const data = await results.json();
    setWeather(data);
    console.log(JSON.stringify(data, null, 2));
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if(!weather){
    return (
      <>
      <Stack.Screen options={{ title: 'Home', }} />
      
      <ActivityIndicator size={"large"}/>
      </>
  )
  }

  return (
    <View className='bg-white flex-1 justify-center items-center '>
      <Stack.Screen options={{ title: 'Home',headerShown:false }} />
      <Text className='font-sans text-3xl'>{weather.name}</Text>
      <Text className='font-sans text-8xl text-gray-600'>{weather.main.temp}°</Text>
    </View>
  );
}
