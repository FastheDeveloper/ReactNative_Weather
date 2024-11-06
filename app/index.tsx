import { Stack, Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, ImageBackground, StyleSheet } from 'react-native';

import * as Location from 'expo-location';
import ForcastItem from './forcastItem';
import LottieView from 'lottie-react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

const baseUrl = `https://api.openweathermap.org/data/2.5`;
const Weather_API_Key = process.env.EXPO_PUBLIC_API_KEY;
const bgImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg';
// api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&cnt={cnt}&appid={API key}
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

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    '3h': number;
  };
  sys: {
    pod: string; // "d" for day, "n" for night
  };
  dt_txt: string; // Date and time in string format (e.g. "2022-08-30 15:00:00")
}

// Forecast data will be an array of ForecastItem
type Forecast = ForecastItem[];
const weatherIcon = 'cloud';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData>();
  const [forecast, setForcast] = useState<Forecast>();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState('');
  const animation = useRef<LottieView>(null);
  const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForcast();
    }
  }, [location]);

  const fetchWeather = async () => {
    if (!location) {
      return;
    }
    const results = await fetch(
      `${baseUrl}/weather?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&appid=${Weather_API_Key}&units=metric`
    );
    const data = await results.json();
    setWeather(data);
  };

  const fetchForcast = async () => {
    if (!location) {
      return;
    }
    const result = await fetch(
      `${baseUrl}/forecast?lat=${location.coords.latitude}&lon=${location.coords.latitude}&appid=${Weather_API_Key}&units=metric`
    );
    const data = await result.json();
    setForcast(data.list);
  };

  if (!weather) {
    return (
      <>
        <Stack.Screen options={{ title: 'Home' }} />

        <ActivityIndicator size={'large'} />
      </>
    );
  }
  console.log(weather.weather[0].main);

  return (
    <ImageBackground source={{ uri: bgImage }} className="flex-1 items-center bg-white pt-20 ">
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' }} />

      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <View className="flex-1 items-center justify-center">
        <AnimatedLottieView
          // entering={ZoomIn}
          ref={animation}
          source={
            weather.weather[0].main === 'Rain'
              ? require(`../assets/rain.json`)
              : weather.weather[0].main === 'Clouds'
                ? require(`../assets/cloud.json`)
                : require(`../assets/sunny.json`)
          }
          style={{
            width: 200,
            aspectRatio: 1,
          }}
          autoPlay
          loop
        />
        <Text className="font-sans text-3xl text-white">{weather.name}</Text>
        <Text className="font-sans text-8xl text-white">{weather.main.temp}°</Text>
        {/* <Text className="font-sans text-8xl text-white">{weather.weather[0].main}</Text> */}
      </View>

      <FlatList
        data={forecast}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, height: 150, marginBottom: 50 }}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
        renderItem={({ item }) => <ForcastItem forcast={item} />}
      />
    </ImageBackground>
  );
}
