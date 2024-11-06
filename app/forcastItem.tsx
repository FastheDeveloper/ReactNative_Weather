import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ForecastItem } from '.'
import dayjs from 'dayjs'
import { BlurView } from 'expo-blur';

const ForcastItem = ({forcast}:{forcast:ForecastItem}) => {
  return (
    <BlurView intensity={40}  className='p-3 aspect-[9/16] rounded-xl justify-center items-center overflow-hidden border-white border-2'>
  <Text className='font-sans text-4xl text-white'>{Math.round(forcast.main.temp)}°</Text> 
  <Text className='font-bold text-xs  text-white'> {dayjs(forcast.dt*1000).format(`ddd ha`)}</Text>
  </BlurView>
  )
}

export default ForcastItem

const styles = StyleSheet.create({})